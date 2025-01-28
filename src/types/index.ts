/**
 * Represents a weighted edge between two nodes
 */
export interface Edge {
	target: string;
	weight: number;
}

/**
 * Represents a graph as a collection of nodes and their connections
 */
export interface Graph {
	[nodeId: string]: Edge[];
}

/**
 * Represents the result of a pathfinding algorithm
 */
export interface PathResult {
	path: string[];
	totalCost: number;
	visited?: string[];
}

/**
 * Configuration options for pathfinding algorithms
 */
export interface PathfindingOptions {
	maxIterations?: number;
	heuristic?: (a: string, b: string) => number;
}

/**
 * Custom error for pathfinding-related issues
 */
export class PathfindingError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'PathfindingError';
	}
}
