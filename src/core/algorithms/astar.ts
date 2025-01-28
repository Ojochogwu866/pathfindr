import { PathfindingError, PathfindingOptions, PathResult } from '../../types';
import { Graph } from '../graph';

export class AStar {
	/**
	 * Find shortest path using A* algorithm
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
		const { maxIterations = 1000, heuristic = this.defaultHeuristic } = options;

		// Priority queue for open nodes
		const openSet = new Map<string, number>();
		const closedSet = new Set<string>();

		//Tracking data structures
		const gScore = new Map<string, number>();
		const fScore = new Map<string, number>();
		const previous = new Map<string, string>();

		// initialize start node
		gScore.set(start, 0), fScore.set(start, heuristic(start, end));
		openSet.set(start, fScore.get(start)!);

		let iterations = 0;
		while (openSet.size > 0) {
			if (iterations > maxIterations) {
				throw new PathfindingError(`Max iterations exceeded`);
			}

			// Finding node with leaset f-score
			const current = Array.from(openSet.entries()).reduce(
				(lowest, [node, score]) => (score < lowest[1] ? [node, score] : lowest),
				['', Infinity]
			)[0];

			// Path found
			if (current === end) {
				return this.reconstructPath(previous, gScore, start, end);
			}

			// Move current node from open to closed set
			openSet.delete(current);
			closedSet.add(current);

			//Explore neighbours
			const edges = graph.getEdges(current);
			edges.forEach((edge) => {
				// Skip if neigbour has been explored
				if (closedSet.has(edge.target)) return;

				const tentativeGScore = (gScore.get(current) || 0) + edge.weight;

				// Find a better path by discovering a new node
				if (!openSet.has(edge.target)) {
					openSet.set(edge.target, Infinity);
				}

				if (tentativeGScore < (gScore.get(edge.target) || Infinity)) {
					// update tracking
					previous.set(edge.target, current);
					gScore.set(edge.target, tentativeGScore);
					fScore.set(
						edge.target,
						tentativeGScore + heuristic(edge.target, end)
					);

					//update open set
					openSet.set(edge.target, fScore.get(edge.target)!);
				}
			});

			iterations++;
		}
		throw new PathfindingError(`No path found between ${start} and ${end}`);
	}

	/**
	 * Default heuristic (Euclidean distance - placeholder)
	 * @param 2 first node
	 * @param b second node
	 */
	private static defaultHeuristic(a: string, b: string): number {
		return Math.abs(a.charCodeAt(0) - b.charCodeAt(0));
	}

	/**
	 * Reconstruct path from previous node tracking
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
