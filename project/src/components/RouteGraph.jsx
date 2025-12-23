import React, { useEffect, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { routeData } from '../utils/dijkstra.jsx';

function RouteGraph({ route }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showFullGraph, setShowFullGraph] = useState(false);

  const totalAirports = new Set([
    ...routeData.map(r => r.from),
    ...routeData.map(r => r.to)
  ]).size;

  const averageSafety = Math.round(
    routeData.reduce((acc, r) => acc + r.safetyRating, 0) / routeData.length
  );

  useEffect(() => {
    if (!route && !showFullGraph) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const allNodes = Array.from(
      new Set(
        (showFullGraph ? routeData : route?.edges || [])
          .flatMap(edge => [edge.from, edge.to])
      )
    ).sort().map((id, index) => {
      // Calculate grid position
      const GRID_SIZE = 120; // Space between nodes
      const GRID_COLS = 10; // Number of columns in the grid
      const col = index % GRID_COLS;
      const row = Math.floor(index / GRID_COLS);
      
      return {
        id,
        data: { label: id },
        position: {
          x: col * GRID_SIZE + 50,
          y: row * GRID_SIZE + 50
        },
        style: {
        background: '#4f46e5',
        color: 'white',
        border: '2px solid #4f46e5',
        borderRadius: '50%',
        width: 40,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        }
      };
    });

    // Create edges with appropriate styling
    const allEdges = (showFullGraph ? routeData : route?.edges || []).map(edge => {
      const isHighlighted = route?.edges?.some(
        e => (e.from === edge.from && e.to === edge.to) || 
             (e.from === edge.to && e.to === edge.from)
      );
      
      // Determine if this is a right-going or left-going edge
      const sourceNode = nodes.find(n => n.id === edge.from);
      const targetNode = nodes.find(n => n.id === edge.to);
      const isRightGoing = sourceNode && targetNode && sourceNode.position.x < targetNode.position.x;
      
      // Calculate larger offsets for better separation
      const OFFSET = 40;
      const CURVE_HEIGHT = 80;
      
      // Calculate control points for the bezier curve
      const sourceHandle = isRightGoing ? 
        { x: OFFSET, y: OFFSET } : // bottom-right offset
        { x: -OFFSET, y: -OFFSET }; // top-left offset
      
      const targetHandle = isRightGoing ?
        { x: -OFFSET, y: OFFSET } : // bottom-left offset
        { x: OFFSET, y: -OFFSET }; // top-right offset
      
      // Calculate bezier curve control points
      const distance = Math.abs(sourceNode?.position.x - targetNode?.position.x) || 200;
      const midX = distance / 2;
      const controlPoints = isRightGoing ?
        [[midX, CURVE_HEIGHT], [midX, CURVE_HEIGHT]] :
        [[midX, -CURVE_HEIGHT], [midX, -CURVE_HEIGHT]]
      
      return {
        id: `${edge.from}-${edge.to}`,
        source: edge.from,
        target: edge.to,
        animated: isHighlighted,
        style: {
          stroke: isHighlighted ? '#10b981' : '#9ca3af',
          strokeWidth: isHighlighted ? 2 : 1,
          opacity: isHighlighted ? 1 : 0.5,
        },
        label: `${edge.distance}mi | ${edge.safetyRating}%`,
        labelStyle: {
          fill: isHighlighted ? '#10b981' : '#6b7280',
          fontWeight: isHighlighted ? 'bold' : 'normal',
        },
        type: 'default',
        sourceHandle: sourceHandle,
        targetHandle: targetHandle,
        data: { controlPoints },
        style: {
          ...edge.style,
          strokeWidth: isHighlighted ? 2 : 1,
          stroke: isHighlighted ? '#10b981' : '#9ca3af',
          opacity: isHighlighted ? 1 : 0.5,
          curvature: 0.5
        },
      };
    });

    setNodes(allNodes);
    setEdges(allEdges);
  }, [route, showFullGraph, totalAirports]);

  return (
    <div className="relative flex flex-col items-center" style={{ height: '600px', width: '100%' }}>
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setShowFullGraph(!showFullGraph)}
          className="bg-white px-3 py-2 rounded-lg shadow-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {showFullGraph ? 'Show Selected Route' : 'Show All Routes'}
        </button>
      </div>
      <div style={{ height: '100%', width: '100%', maxWidth: '1600px', margin: '0 auto', overflow: 'hidden' }}>
        <ReactFlow
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
          minZoom={0.2}
          maxZoom={1.5}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          connectionLineStyle={{ stroke: '#ddd' }}
          defaultEdgeOptions={{
            type: 'default',
            style: { strokeWidth: 2 },
            markerEnd: { type: 'arrowclosed' },
            curvature: 0.5
          }}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4" style={{ maxWidth: '1200px', width: '100%' }}>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
              <span className="text-sm text-gray-600">Airport Node</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-gray-300 mr-2"></div>
              <span className="text-sm text-gray-600">Available Route</span>
            </div>
            {route && (
              <div className="flex items-center">
                <div className={`w-4 h-0.5 ${route.safetyRating >= 90 ? 'bg-green-500' : 'bg-indigo-500'} mr-2`}></div>
                <span className="text-sm text-gray-600">
                  {route.safetyRating >= 90 ? 'Safest Route' : 'Selected Route'}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Statistics</h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Total Airports: {totalAirports}</p>
            <p className="text-sm text-gray-600">Total Routes: {routeData.length}</p>
            <p className="text-sm text-gray-600">Average Safety: {averageSafety}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteGraph;