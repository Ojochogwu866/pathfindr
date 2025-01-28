import { AStar } from '../../src/core/algorithms/astar';
import { Graph } from '../../src/core/graph';

describe('A* Pathfinding', () => {
	let graph: Graph;

	beforeEach(() => {
		graph = new Graph();
		graph.addEdge('A', 'B', 4);
		graph.addEdge('A', 'C', 2);
		graph.addEdge('B', 'D', 3);
		graph.addEdge('C', 'D', 1);
	});

	it('should find shortest path', () => {
		const result = AStar.findShortestPath(graph, 'A', 'D');
		expect(result.path).toEqual(['A', 'C', 'D']);
		expect(result.totalCost).toBe(3);
	});
});
