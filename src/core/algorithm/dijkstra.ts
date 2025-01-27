import { Graph } from "../graph";
import { PathResult, PathfindingOptions, PathfindingError } from "../../types";

export class Dijkstra {
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

		const graphData = graph.getGraph();
		for (const node in graphData){
			distances[node] = node === start ? 0 : Infinity;
			previous[node] = null;
			unvisited.add(node);
		}

		let iterations = 0;
		while (unvisited.size > 0){
			if (iterations > maxIterations ){
				throw new PathfindingError('Max iterations exceeded');
			}

			const current = Array.from(unvisited).reduce((minNode, node) => 
				distances[node] < distances[minNode] ? node : minNode
			);

			if (current === end ){
				return this.reconstructPath(previous, distances, start, end);
			}
			if (distances[current] === Infinity) break;

			const edges = graph.getEdges(current);
			edges.forEach(edge => {
				const totalDistance = distances[current] + edge.weight;

				if (totalDistance < distances[edge.target]){
					distances[edge.target] = totalDistance;
					previous[edge.target] = current;
				}
			});

			unvisited.delete(current);
			iterations++
		}

		throw new PathfindingError(`No path found between ${start} and ${end}`);
	}

	private static reconstructPath(
		previous: Record<string, string | null>, 
		distances: Record<string, number>, 
		start: string, 
		end: string
	): PathResult {
    const path: string[] = [];
    let current: string | null = end;

    while (current) {
		path.unshift(current);
		current = previous[current];
		
		if (path.length > 1000) {
			throw new PathfindingError('Path reconstruction failed');
		}
		}

    return {
		path,
		totalCost: distances[end]
		};
	}
}