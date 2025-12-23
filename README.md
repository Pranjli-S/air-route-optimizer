# Air-Route-Optimizer 
**A Full-Stack Aviation Routing System using Dijkstra's Algorithm**

##  Overview
Air-Route-Optimizer is a sophisticated web application designed to find the most efficient flight paths between major airports. By combining real-time data from the Aviation Stack API with a custom implementation of Dijkstra’s Algorithm, the system calculates optimal routes based on distance and connectivity.

##  Tech Stack
* **Backend:** Python (Flask), Pandas (Data Processing), Requests (API Integration)
* **Frontend:** React, Vite, Tailwind CSS
* **Graph Logic:** Dijkstra's Algorithm, ReactFlow / Cytoscape
* **Data Source:** Aviation Stack API & Global Airport Dataset (CSV)

##  Key Engineering Challenge: Route Optimization
The core of this project is a custom **Dijkstra's Algorithm** implementation located in `src/utils/dijkstra.jsx`. It treats airports as nodes and flight paths as weighted edges, allowing the system to compute the shortest path across complex aviation networks.