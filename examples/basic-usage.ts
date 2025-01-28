import { AStar, Dijkstra, Graph } from 'pathfindr';

// Create a new graph
const graph = new Graph();

// Add some edges (creating a simple city map)
graph.addEdge('Home', 'Store', 5);
graph.addEdge('Home', 'Park', 3);
graph.addEdge('Store', 'Office', 4);
graph.addEdge('Park', 'Office', 6);
graph.addEdge('Store', 'School', 2);

// Find path using Dijkstra's algorithm
const dijkstraPath = Dijkstra.findShortestPath(graph, 'Home', 'Office');
console.log('Dijkstra Path:', dijkstraPath.path);
console.log('Total Distance:', dijkstraPath.totalCost);

// Find path using A* algorithm
const astarPath = AStar.findShortestPath(graph, 'Home', 'Office');
console.log('A* Path:', astarPath.path);
console.log('Total Distance:', astarPath.totalCost);
