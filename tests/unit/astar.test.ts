import { AStar } from '../../src/core/algorithms/astar';
import { Graph } from '../../src/core/graph';
import { PathfindingError } from '../../src/types';

describe('A* Pathfinding', () => {
	let graph: Graph;

	beforeEach(() => {
		graph = new Graph();
		graph.addEdge('A', 'B', 4);
		graph.addEdge('A', 'C', 2);
		graph.addEdge('B', 'D', 3);
		graph.addEdge('C', 'D', 1);
	});

	test('finds shortest path with default heuristic', () => {
		const result = AStar.findShortestPath(graph, 'A', 'D');
		expect(result.path).toEqual(['A', 'C', 'D']);
		expect(result.totalCost).toBe(3);
	});

	test('finds shortest path with custom heuristic', () => {
		const customHeuristic = (a: string, b: string) => 0;
		const result = AStar.findShortestPath(graph, 'A', 'D', {
			heuristic: customHeuristic,
		});
		expect(result.path).toEqual(['A', 'C', 'D']);
		expect(result.totalCost).toBe(3);
	});

	test('handles no path exists', () => {
		const isolatedGraph = new Graph();
		isolatedGraph.addNode('X');
		isolatedGraph.addNode('Y');
		expect(() => {
			AStar.findShortestPath(isolatedGraph, 'X', 'Y');
		}).toThrow(PathfindingError);
	});

	test('handles max iterations limit', () => {
		const complexGraph = new Graph();
		for (let i = 0; i < 10; i++) {
			complexGraph.addEdge(`Node${i}`, `Node${i + 1}`, 1);
		}
		expect(() => {
			AStar.findShortestPath(complexGraph, 'Node0', 'Node9', {
				maxIterations: 5,
			});
		}).toThrow(PathfindingError);
	});

	test('handles circular paths', () => {
		graph.addEdge('D', 'A', 1);
		const result = AStar.findShortestPath(graph, 'A', 'D');
		expect(result.path).toEqual(['A', 'C', 'D']);
		expect(result.totalCost).toBe(3);
	});
});
