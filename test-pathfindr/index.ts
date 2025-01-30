import { AStar, Graph, PathfindingOptions } from 'pathfindr';

// Custom heuristic function for A*
const manhattanDistance = (a: string, b: string): number => {
	// Convert node names to coordinates (assuming format "x,y")
	const [x1, y1] = a.split(',').map(Number);
	const [x2, y2] = b.split(',').map(Number);
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

// Create a grid-based graph
const createGridGraph = (size: number): Graph => {
	const graph = new Graph();

	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			const current = `${x},${y}`;

			// Add edges to adjacent cells
			if (x > 0) graph.addEdge(current, `${x - 1},${y}`, 1);
			if (y > 0) graph.addEdge(current, `${x},${y - 1}`, 1);
			if (x < size - 1) graph.addEdge(current, `${x + 1},${y}`, 1);
			if (y < size - 1) graph.addEdge(current, `${x},${y + 1}`, 1);
		}
	}

	return graph;
};

// Create a 10x10 grid
const gridGraph = createGridGraph(10);

// Configure A* options
const options: PathfindingOptions = {
	heuristic: manhattanDistance,
	maxIterations: 200,
};

// Find path from top-left to bottom-right
const path = AStar.findShortestPath(gridGraph, '0,0', '9,9', options);

console.log('Path:', path.path);
console.log('Steps:', path.path.length - 1);
