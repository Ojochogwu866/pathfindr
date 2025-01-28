import { PathfindingError, PathfindingOptions, PathResult } from '../../types';
import { Graph } from '../graph';

export class Dijkstra {
	/**
	 * Find shortest path using Dijkstra's algorithm
	 * @param graph Graph instance
	 * @param start Starting node
	 * @param end Destination node
	 * @param options Pathfinding configuration
	 */
	static findShortestPath(
		graph: Graph,
		start: string,
		end: string,
		options: PathfindingOptions = {}
	): PathResult {
		const { maxIterations = 1000 } = options;

		// Track distances from start node
		const distances: Record<string, number> = {};
		const previous: Record<string, string | null> = {};
		const unvisited = new Set<string>();

		// Initialize distances
		const graphData = graph.getGraph();
		for (const node in graphData) {
			distances[node] = node === start ? 0 : Infinity;
			previous[node] = null;
			unvisited.add(node);
		}

		let iterations = 0;
		while (unvisited.size > 0) {
			// Find unvisited node with minimum distance
			if (iterations > maxIterations) {
				throw new PathfindingError('Max iterations exceeded');
			}

			const current = Array.from(unvisited).reduce((minNode, node) =>
				distances[node] < distances[minNode] ? node : minNode
			);

			// Path found
			if (current === end) {
				return this.reconstructPath(previous, distances, start, end);
			}

			// Stop if no path exists
			if (distances[current] === Infinity) break;

			// Explore neighboring nodes
			const edges = graph.getEdges(current);
			edges.forEach((edge) => {
				const totalDistance = distances[current] + edge.weight;

				// Update if a shorter path is found
				if (totalDistance < distances[edge.target]) {
					distances[edge.target] = totalDistance;
					previous[edge.target] = current;
				}
			});

			// Mark current node as visited
			unvisited.delete(current);
			iterations++;
		}

		throw new PathfindingError(`No path found between ${start} and ${end}`);
	}

	// Reconstruct the path from start to end
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
