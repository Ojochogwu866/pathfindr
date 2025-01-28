import { Edge, Graph as Graphtype, PathfindingError } from '../types';

export class Graph {
	private _graph: Graphtype = {};

	addNode(nodeId: string): void {
		if (this._graph[nodeId]) {
			throw new PathfindingError(`Node ${nodeId} already exists`);
		}
		this._graph[nodeId] = [];
	}

	addEdge(source: string, target: string, weight: number): void {
		if (!this._graph[source]) {
			this.addNode(source);
		}
		if (!this._graph[target]) {
			this.addNode(target);
		}

		if (weight < 0) {
			throw new PathfindingError('Negative edge weights are not supported');
		}

		this._graph[source].push({ target, weight });
	}

	getEdges(nodeId: string): Edge[] {
		return this._graph[nodeId] || [];
	}

	hasPath(start: string, end: string): boolean {
		const visited = new Set<string>();
		const queue = [start];

		while (queue.length > 0) {
			const current = queue.shift()!;

			if (current === end) return true;

			if (!visited.has(current)) {
				visited.add(current);

				const edges = this.getEdges(current);
				queue.push(...edges.map((edge) => edge.target));
			}
		}
		return false;
	}

	getGraph(): Graphtype {
		return JSON.parse(JSON.stringify(this._graph));
	}
}
