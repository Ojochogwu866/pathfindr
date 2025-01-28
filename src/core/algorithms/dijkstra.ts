import { PathfindingError, PathfindingOptions, PathResult } from '../../types';
import { Graph } from '../graph';

/**
 * Implementation of Dijkstra's shortest path algorithm
 */
export class Dijkstra {
	/**
	 * Finds the shortest path between two nodes in a weighted graph using Dijkstra's algorithm
	 *
	 * @param graph - The graph instance to search through
	 * @param start - ID of the starting node
	 * @param end - ID of the destination node
	 * @param options - Optional configuration settings
	 * @param options.maxIterations - Maximum number of iterations before failing (default: 1000)
	 * @returns PathResult containing the path and total cost
	 * @throws PathfindingError if no path exists or max iterations exceeded
	 *
	 * @example
	 * const graph = new Graph();
	 * graph.addEdge('A', 'B', 4);
	 * graph.addEdge('B', 'C', 3);
	 *
	 * const result = Dijkstra.findShortestPath(graph, 'A', 'C');
	 * // result = { path: ['A', 'B', 'C'], totalCost: 7 }
	 */
	static findShortestPath(
		graph: Graph,
		start: string,
		end: string,
		options: PathfindingOptions = {}
	): PathResult {
		const { maxIterations = 1000 } = options;
		const distances: Record<string, number> = {};
		const previous: Record<string, string | null> = {};
		const unvisited = new Set<string>();

		// Initialize distances
		const graphData = graph.getGraph();
		if (!graphData[start] || !graphData[end]) {
			throw new PathfindingError(`No path exists between ${start} and ${end}`);
		}

		for (const node in graphData) {
			distances[node] = node === start ? 0 : Infinity;
			previous[node] = null;
			unvisited.add(node);
		}

		let iterations = 0;
		while (unvisited.size > 0) {
			if (iterations > maxIterations) {
				throw new PathfindingError('Max iterations exceeded');
			}

			// Find unvisited node with minimum distance
			const current = Array.from(unvisited).reduce((minNode, node) =>
				distances[node] < distances[minNode] ? node : minNode
			);

			// Stop if no path exists (all remaining nodes are unreachable)
			if (distances[current] === Infinity) {
				throw new PathfindingError(
					`No path exists between ${start} and ${end}`
				);
			}

			if (current === end) {
				return this.reconstructPath(previous, distances, start, end);
			}

			unvisited.delete(current);
			const edges = graph.getEdges(current);
			edges.forEach((edge) => {
				const totalDistance = distances[current] + edge.weight;
				if (totalDistance < distances[edge.target]) {
					distances[edge.target] = totalDistance;
					previous[edge.target] = current;
				}
			});

			iterations++;
		}

		throw new PathfindingError(`No path exists between ${start} and ${end}`);
	}

	/**
	 * Reconstructs the path from start to end node using the previous node tracking
	 *
	 * @param previous - Record of previous nodes in shortest path
	 * @param distances - Record of shortest distances to each node
	 * @param start - Starting node ID
	 * @param end - Ending node ID
	 * @returns PathResult containing the reconstructed path and total cost
	 * @throws PathfindingError if path reconstruction fails
	 */
	private static reconstructPath(
		previous: Record<string, string | null>,
		distances: Record<string, number>,
		start: string,
		end: string
	): PathResult {
		const path: string[] = [];
		let current: string | null = end;

		// Trace back from end to start
		while (current) {
			path.unshift(current);
			current = previous[current];
			if (path.length > 1000) {
				throw new PathfindingError('Path reconstruction failed');
			}
		}

		return {
			path,
			totalCost: distances[end],
		};
	}
}
