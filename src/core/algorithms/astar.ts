import { PathfindingError, PathfindingOptions, PathResult } from '../../types';
import { Graph } from '../graph';

/**
 * Implementation of the A* (A-star) pathfinding algorithm which finds the shortest path
 * between nodes using both actual path cost and estimated cost to goal
 */
export class AStar {
	/**
	 * Finds the shortest path between two nodes using the A* algorithm with an optional heuristic function
	 *
	 * @param graph - The graph to search through
	 * @param start - ID of the starting node
	 * @param end - ID of the destination node
	 * @param options - Configuration options
	 * @param options.maxIterations - Maximum number of search iterations (default: 1000)
	 * @param options.heuristic - Custom heuristic function (default: character code difference)
	 * @returns PathResult containing the found path and its total cost
	 * @throws PathfindingError if no path exists or max iterations exceeded
	 *
	 * @example
	 * const graph = new Graph();
	 * graph.addEdge('A', 'B', 4);
	 * graph.addEdge('B', 'C', 3);
	 *
	 * // Using default heuristic
	 * const result = AStar.findShortestPath(graph, 'A', 'C');
	 *
	 * // Using custom heuristic
	 * const customHeuristic = (a: string, b: string) => 0;
	 * const result = AStar.findShortestPath(graph, 'A', 'C', {
	 *   heuristic: customHeuristic
	 * });
	 */
	static findShortestPath(
		graph: Graph,
		start: string,
		end: string,
		options: PathfindingOptions = {}
	): PathResult {
		const { maxIterations = 1000, heuristic = this.defaultHeuristic } = options;

		// Priority queue for nodes to be evaluated
		const openSet = new Map<string, number>();
		// Set of already evaluated nodes
		const closedSet = new Set<string>();

		// Tracking structures for path reconstruction
		const gScore = new Map<string, number>(); // Cost from start to node
		const fScore = new Map<string, number>(); // Estimated total cost through node
		const previous = new Map<string, string>();

		// Initialize start node
		gScore.set(start, 0);
		fScore.set(start, heuristic(start, end));
		openSet.set(start, fScore.get(start)!);

		let iterations = 0;
		while (openSet.size > 0) {
			if (iterations > maxIterations) {
				throw new PathfindingError(`Max iterations exceeded`);
			}

			// Find node with lowest f-score (most promising path)
			const current = Array.from(openSet.entries()).reduce(
				(lowest, [node, score]) => (score < lowest[1] ? [node, score] : lowest),
				['', Infinity]
			)[0];

			// Path found to destination
			if (current === end) {
				return this.reconstructPath(previous, gScore, start, end);
			}

			// Move current node to evaluated set
			openSet.delete(current);
			closedSet.add(current);

			// Explore neighboring nodes
			const edges = graph.getEdges(current);
			edges.forEach((edge) => {
				// Skip already evaluated neighbors
				if (closedSet.has(edge.target)) return;

				const tentativeGScore = (gScore.get(current) || 0) + edge.weight;

				// Add newly discovered nodes to open set
				if (!openSet.has(edge.target)) {
					openSet.set(edge.target, Infinity);
				}

				// Update path if better one found
				if (tentativeGScore < (gScore.get(edge.target) || Infinity)) {
					previous.set(edge.target, current);
					gScore.set(edge.target, tentativeGScore);
					fScore.set(
						edge.target,
						tentativeGScore + heuristic(edge.target, end)
					);
					openSet.set(edge.target, fScore.get(edge.target)!);
				}
			});

			iterations++;
		}

		throw new PathfindingError(`No path found between ${start} and ${end}`);
	}

	/**
	 * Default heuristic function using character code difference
	 * Note: This is a simple placeholder and may not be admissible for all graphs
	 *
	 * @param a - First node ID
	 * @param b - Second node ID
	 * @returns Estimated cost between nodes based on character codes
	 */
	private static defaultHeuristic(a: string, b: string): number {
		return Math.abs(a.charCodeAt(0) - b.charCodeAt(0));
	}

	/**
	 * Reconstructs the path from start to end node using the previous node tracking
	 *
	 * @param previous - Map of each node to its predecessor in the shortest path
	 * @param gScore - Map of actual costs from start to each node
	 * @param start - Starting node ID
	 * @param end - Ending node ID
	 * @returns PathResult containing the reconstructed path and total cost
	 * @throws PathfindingError if path reconstruction exceeds 1000 steps
	 */
	private static reconstructPath(
		previous: Map<string, string | null>,
		gScore: Map<string, number>,
		start: string,
		end: string
	): PathResult {
		const path: string[] = [];
		let current: string | null = end;

		while (current) {
			path.unshift(current);
			current = previous.get(current) || null;
			if (path.length > 1000) {
				throw new PathfindingError('Path reconstruction failed');
			}
		}

		return {
			path,
			totalCost: gScore.get(end) || 0,
		};
	}
}
