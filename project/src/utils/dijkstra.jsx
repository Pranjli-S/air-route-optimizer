// Function to generate random number between min and max
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Generate routes between airports
export const routeData = [];

// Function to initialize routes with actual airport data
export function initializeRoutes(airports) {
  routeData.length = 0; // Clear existing routes
  
  airports.forEach((fromAirport, i) => {
    // Connect to 3-5 nearest airports
    const otherAirports = airports
      .filter((a, idx) => idx !== i)
      .map(toAirport => ({
        airport: toAirport,
        distance: calculateDistance(
          fromAirport.latitude,
          fromAirport.longitude,
          toAirport.latitude,
          toAirport.longitude
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, random(3, 5));

    otherAirports.forEach(({ airport: toAirport, distance }) => {
      routeData.push({
        from: fromAirport.code,
        to: toAirport.code,
        distance: Math.round(distance),
        safetyRating: random(96, 99),
        flightTime: (distance / 800).toFixed(1), // Rough estimate: 800 km/h average speed
        failureRate: 0.001 + (random(0, 10) / 10000)
      });
    });
  });
}

// Utility function to calculate failure probability  ye vala formula hai
export function calculateFailureProbability(failureRate, time) {
  const e = Math.E; // Euler's number ~2.718
  return 1 - Math.pow(e, -failureRate * time);
}

export function findOptimalRoute(start, end, criteria = 'distance') {
  const graph = {};

  routeData.forEach((route) => {
    if (!graph[route.from]) graph[route.from] = {};
    if (!graph[route.to]) graph[route.to] = {};

    // Add bidirectional routes
    graph[route.from][route.to] = {
      distance: route.distance,
      safety: route.safetyRating,
      flightTime: route.flightTime,
      failureRate: route.failureRate
    };
    graph[route.to][route.from] = {
      distance: route.distance,
      safety: route.safetyRating,
      flightTime: route.flightTime,
      failureRate: route.failureRate
    };
  });

  // Initialize data structures for Dijkstra's algorithm
  const distances = {};
  const previous = {};
  const safety = {};
  const flightTimes = {};
  const failureRates = {};
  const nodes = new Set();

  // Initialize all nodes
  for (let node in graph) {
    distances[node] = Infinity;
    safety[node] = 0;
    flightTimes[node] = Infinity;
    failureRates[node] = 1;
    previous[node] = null;
    nodes.add(node);
  }
  distances[start] = 0;
  flightTimes[start] = 0;
  failureRates[start] = 0;
  safety[start] = 100;

  while (nodes.size > 0) {
    let minNode = null;
    for (let node of nodes) {
      if (minNode === null || distances[node] < distances[minNode]) {
        minNode = node;
      }
    }

    if (minNode === end) break;

    nodes.delete(minNode);

    for (let neighbor in graph[minNode]) {
      const alt = distances[minNode] + graph[minNode][neighbor].distance;
      const newFlightTime = flightTimes[minNode] + graph[minNode][neighbor].flightTime;
      
      // Only update if we found a shorter path
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        flightTimes[neighbor] = newFlightTime;
        
        // Calculate weighted safety rating based on segment distances
        const prevDistance = distances[minNode];
        const segmentDistance = graph[minNode][neighbor].distance;
        safety[neighbor] = (
          (safety[minNode] * prevDistance + graph[minNode][neighbor].safety * segmentDistance) /
          (prevDistance + segmentDistance)
        );
        
        // Calculate failure risk using exponential decay model
        const segmentRisk = graph[minNode][neighbor].failureRate * graph[minNode][neighbor].flightTime / 10;
        failureRates[neighbor] = failureRates[minNode] + segmentRisk;
        
        previous[neighbor] = minNode;
      }
    }
  }

  // Build the path and edges
  const path = [];
  const edges = [];
  let current = end;

  while (current !== null) {
    path.unshift(current);
    const prev = previous[current];
    if (prev !== null) {
      edges.unshift({
        from: prev,
        to: current,
        distance: graph[prev][current].distance,
        safetyRating: graph[prev][current].safety,
        flightTime: graph[prev][current].flightTime,
        failureRate: graph[prev][current].failureRate
      });
    }
    current = prev;
  }

  return {
    distance: Math.round(distances[end]),
    path,
    edges,
    safetyRating: safety[end],
    totalFlightTime: flightTimes[end],
    failureRisk: (failureRates[end] * 100).toFixed(2)
  };
}