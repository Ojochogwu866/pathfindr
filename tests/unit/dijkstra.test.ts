import { Dijkstra } from '../../src/core/algorithms/dijkstra';
import { Graph } from '../../src/core/graph';
import { PathfindingError } from '../../src/types';

describe('Dijkstra Algorithm', () => {
	let graph: Graph;

	beforeEach(() => {
		graph = new Graph();
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
		}).toThrow('No path exists between X and Y');

		expect(() => {
			Dijkstra.findShortestPath(isolatedGraph, 'X', 'Y');
		}).toThrow(new PathfindingError('No path exists between X and Y'));
	});

	test('handles max iterations limit', () => {
		const complexGraph = new Graph();
		for (let i = 0; i < 10; i++) {
			complexGraph.addEdge(`Node${i}`, `Node${i + 1}`, 1);
		}
		expect(() => {
			Dijkstra.findShortestPath(complexGraph, 'Node0', 'Node9', {
				maxIterations: 5,
			});
		}).toThrow('Max iterations exceeded');
	});

	test('handles circular paths', () => {
		graph.addEdge('E', 'A', 1);
		const result = Dijkstra.findShortestPath(graph, 'A', 'E');
		expect(result.path).toEqual(['A', 'C', 'D', 'E']);
		expect(result.totalCost).toBe(5);
	});

	test('handles invalid node ids', () => {
		expect(() => {
			Dijkstra.findShortestPath(graph, 'A', 'NonExistentNode');
		}).toThrow(PathfindingError);
	});

	test('handles self-loops', () => {
		graph.addEdge('A', 'A', 1);
		const result = Dijkstra.findShortestPath(graph, 'A', 'E');
		expect(result.path).toEqual(['A', 'C', 'D', 'E']);
		expect(result.totalCost).toBe(5);
	});
});
