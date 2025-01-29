# Pathfindr

A high-performance TypeScript pathfinding library implementing multiple algorithms including Dijkstra and A\* (A-star).

## Features

- Multiple pathfinding algorithms:
  - Dijkstra's Algorithm
  - A\* (A-star) Algorithm
- Flexible graph representation
- Type-safe with full TypeScript support
- Comprehensive test coverage
- Performance benchmarking tools
- Detailed documentation

## Installation

```bash
npm install pathfindr
```

## Quick Start

```typescript
import { Graph, AStar, Dijkstra } from 'pathfindr';

// Create a graph
const graph = new Graph();

// Add some edges
graph.addEdge('A', 'B', 4);
graph.addEdge('A', 'C', 2);
graph.addEdge('B', 'D', 3);
graph.addEdge('C', 'D', 1);

// Find shortest path using Dijkstra's algorithm
const path = Dijkstra.findShortestPath(graph, 'A', 'D');
console.log(path.path); // ['A', 'C', 'D']
console.log(path.totalCost); // 3
```

## Documentation

For detailed documentation, see:

- [Algorithm Details](./docs/algorithms.md)
- [Usage Guide](./docs/usage.md)
- [Contributing](./docs/contributing.md)

## Advanced Usage

The library supports custom configurations for pathfinding:

```typescript
const options = {
	maxIterations: 1000,
	heuristic: (a: string, b: string) => {
		// Custom heuristic function for A*
		return 0;
	},
};

const path = AStar.findShortestPath(graph, 'start', 'end', options);
```

## Performance

Benchmarks comparing different algorithms are available in the `benchmarks` directory. Run them using:

```bash
npm run benchmark
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/contributing.md) for details.

## License

MIT

## Support

- Open an issue for bugs/feature requests
- Star the repo if you find it useful!
