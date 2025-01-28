import { Graph } from '../../src/core/graph';
import { PathfindingError } from '../../src/types';

describe('Graph', () => {
	let graph: Graph;

	beforeEach(() => {
		graph = new Graph();
	});

	test('adds nodes successfully', () => {
		graph.addNode('A');
		expect(graph.getEdges('A')).toHaveLength(0);
	});

	test('prevents duplicate nodes', () => {
		graph.addNode('A');
		expect(() => graph.addNode('A')).toThrow(PathfindingError);
	});

	test('adds edges successfully', () => {
		graph.addNode('A');
		graph.addNode('B');
		graph.addEdge('A', 'B', 5);
		const edges = graph.getEdges('A');
		expect(edges).toHaveLength(1);
		expect(edges[0]).toEqual({ target: 'B', weight: 5 });
	});

	test('automatically creates nodes when adding edges', () => {
		graph.addEdge('A', 'B', 5);
		expect(graph.getGraph()).toHaveProperty('A');
		expect(graph.getGraph()).toHaveProperty('B');
		const edges = graph.getEdges('A');
		expect(edges).toHaveLength(1);
		expect(edges[0]).toEqual({ target: 'B', weight: 5 });
	});

	test('rejects negative edge weights', () => {
		expect(() => graph.addEdge('A', 'B', -1)).toThrow(PathfindingError);
	});

	test('checks path existence correctly', () => {
		graph.addEdge('A', 'B', 1);
		graph.addEdge('B', 'C', 1);
		expect(graph.hasPath('A', 'C')).toBe(true);
		expect(graph.hasPath('A', 'D')).toBe(false);
	});

	test('handles self-loops', () => {
		graph.addEdge('A', 'A', 1);
		expect(graph.getEdges('A')).toHaveLength(1);
		expect(graph.hasPath('A', 'A')).toBe(true);
	});

	test('handles disconnected components', () => {
		graph.addEdge('A', 'B', 1);
		graph.addEdge('C', 'D', 1);
		expect(graph.hasPath('A', 'D')).toBe(false);
		expect(graph.hasPath('C', 'B')).toBe(false);
	});
});
