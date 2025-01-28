import { Dijkstra } from '../../src/core/algorithms/dijkstra';
import { Graph } from '../../src/core/graph';
import { PathfindingError } from '../../src/types';

describe('Dijkstra Algorithm', () => {
	let graph: Graph;

	beforeEach(() => {
		graph = new Graph();
		// Create a simple test graph
		graph.addEdge('A', 'B', 4);
		graph.addEdge('A', 'C', 2);
		graph.addEdge('B', 'D', 3);
		graph.addEdge('C', 'D', 1);
		graph.addEdge('C', 'E', 5);
		graph.addEdge('D', 'E', 2);
	});

	test('finds shortest path between two nodes', () => {
		const result = Dijkstra.findShortestPath(graph, 'A', 'E');
		expect(result.path).toEqual(['A', 'C', 'D', 'E']);
		expect(result.totalCost).toBe(5);
	});

	test('throws error when no path exists', () => {
		const isolatedGraph = new Graph();
		isolatedGraph.addNode('X');
		isolatedGraph.addNode('Y');

		expect(() => {
			Dijkstra.findShortestPath(isolatedGraph, 'X', 'Y');
		}).toThrow(PathfindingError);
	});

	test('handles max iterations limit', () => {
		expect(() => {
			Dijkstra.findShortestPath(graph, 'A', 'E', { maxIterations: 1 });
		}).toThrow('Max iterations exceeded');
	});
});
