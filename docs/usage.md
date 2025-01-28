## Usage
```typescript
import { Graph, Dijkstra, AStar } from 'pathfindr';

const graph = new Graph();
graph.addEdge('A', 'B', 4);

// Dijkstra's Algorithm
const dijkstraPath = Dijkstra.findShortestPath(graph, 'A', 'B');

// A* Algorithm
const astarPath = AStar.findShortestPath(graph, 'A', 'B');
```

## Features
- Dijkstra's Algorithm
- A* Pathfinding
- Flexible Graph Creation
- TypeScript Support

## License
MIT
```