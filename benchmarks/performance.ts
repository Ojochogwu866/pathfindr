import { performance } from 'perf_hooks';
import { AStar } from '../src/core/algorithms/astar';
import { Dijkstra } from '../src/core/algorithms/dijkstra';
import { Graph } from '../src/core/graph';

function generateLargeGraph(size: number): Graph {
	const graph = new Graph();

	// Create a grid of nodes with random weights
	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			const current = `${x},${y}`;

			// Add edges with random weights
			if (x > 0) graph.addEdge(current, `${x - 1},${y}`, Math.random() * 10);
			if (y > 0) graph.addEdge(current, `${x},${y - 1}`, Math.random() * 10);
			if (x < size - 1)
				graph.addEdge(current, `${x + 1},${y}`, Math.random() * 10);
			if (y < size - 1)
				graph.addEdge(current, `${x},${y + 1}`, Math.random() * 10);
		}
	}

	return graph;
}

function runBenchmark(graph: Graph, iterations: number = 100) {
	const results = {
		dijkstra: [] as number[],
		astar: [] as number[],
	};

	for (let i = 0; i < iterations; i++) {
		// Generate random start and end points
		const start = `${Math.floor(Math.random() * 20)},${Math.floor(Math.random() * 20)}`;
		const end = `${Math.floor(Math.random() * 20)},${Math.floor(Math.random() * 20)}`;

		// Benchmark Dijkstra
		const dijkstraStart = performance.now();
		Dijkstra.findShortestPath(graph, start, end);
		results.dijkstra.push(performance.now() - dijkstraStart);

		// Benchmark A*
		const astarStart = performance.now();
		AStar.findShortestPath(graph, start, end);
		results.astar.push(performance.now() - astarStart);
	}

	return results;
}

function calculateStats(times: number[]) {
	const avg = times.reduce((a, b) => a + b) / times.length;
	const min = Math.min(...times);
	const max = Math.max(...times);
	return { avg, min, max };
}

function benchmarkPathfinding() {
	console.log('Generating test graph...');
	const graph = generateLargeGraph(20); // 20x20 grid = 400 nodes

	console.log('Running benchmarks...');
	const results = runBenchmark(graph);

	const dijkstraStats = calculateStats(results.dijkstra);
	const astarStats = calculateStats(results.astar);

	console.log('\nDijkstra Performance:');
	console.log(`  Average: ${dijkstraStats.avg.toFixed(2)}ms`);
	console.log(`  Min: ${dijkstraStats.min.toFixed(2)}ms`);
	console.log(`  Max: ${dijkstraStats.max.toFixed(2)}ms`);

	console.log('\nA* Performance:');
	console.log(`  Average: ${astarStats.avg.toFixed(2)}ms`);
	console.log(`  Min: ${astarStats.min.toFixed(2)}ms`);
	console.log(`  Max: ${astarStats.max.toFixed(2)}ms`);
}

benchmarkPathfinding();
