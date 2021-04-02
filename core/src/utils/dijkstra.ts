import { MapNode, CoordPair, CoordPairUtils } from "..";
import { store } from "../game";
import { tieAllNodes } from "../map/mapProcessing";
import PriorityQueue from "./PriorityQueue";


type WeightedNode = {
    node: MapNode;
    weight: number
}

const createdWeightedNode: (node: MapNode, weight: number) => WeightedNode = (node, weight) => {
    return { node, weight }
}

export const dijkstras: (startCell: CoordPair, endCell: CoordPair, junctions: (MapNode | null)[][]) => {totalDist: number, path: CoordPair[]} = (startCell, endCell, junctions) => {
    console.log('running dijkstras', startCell, endCell);
    if (CoordPairUtils.equalPairs(startCell, endCell)) {
        return {totalDist: 0, path: [endCell]}
    }
    const startNode = new MapNode(startCell.x, startCell.y);
    tieAllNodes(startNode, junctions, store.getState().mapState.mapCells[startCell.y][startCell.x]);
    const queue = new PriorityQueue<WeightedNode>((a, b) => a.weight < b.weight);
    queue.push(createdWeightedNode(startNode, 0));
    const visitedTable: { totalDist: number, parentNode: WeightedNode | null }[][] = store.getState().mapState.mapCells.map(row => row.map(() => { return { totalDist: Number.POSITIVE_INFINITY, parentNode: null }} ));
    visitedTable[startCell.y][startCell.x].totalDist = 0;

    const checkForEndNode = (currentNode: MapNode, neighbor: MapNode) => {
        if (currentNode.x === neighbor.x && endCell.x === currentNode.x) {
            return (endCell.y > currentNode.y && endCell.y < neighbor.y) || (endCell.y < currentNode.y && endCell.y > neighbor.y)
        }

        if (currentNode.y === neighbor.y && endCell.y === currentNode.y) {
            return (endCell.x > currentNode.x && endCell.x < neighbor.x) || (endCell.x < currentNode.x && endCell.x > neighbor.x)
        }
    }

    while (queue.size() > 0) {
        const currentNode = queue.pop();
        const neighbors = currentNode.node.neighbors.filter(n => n !== null) as MapNode[];
        const weightedNeighbors = neighbors.map(n => {
            const location: CoordPair = { x: n.x, y: n.y };
            const dist = currentNode.weight + CoordPairUtils.distDirect(location, { x: currentNode.node.x, y: currentNode.node.y });
            return createdWeightedNode(n, dist)
        }).filter(n => (visitedTable[n.node.y][n.node.x].totalDist > n.weight));

        weightedNeighbors.forEach(n => {
            visitedTable[n.node.y][n.node.x].totalDist = n.weight;
            visitedTable[n.node.y][n.node.x].parentNode = currentNode;
        });

        if (neighbors.some(n => checkForEndNode(currentNode.node, n))) {
            const dist = CoordPairUtils.distDirect(endCell, { x: currentNode.node.x, y: currentNode.node.y });
            if (visitedTable[endCell.y][endCell.x].totalDist > currentNode.weight + dist) {
                visitedTable[endCell.y][endCell.x].totalDist = currentNode.weight + dist;
                visitedTable[endCell.y][endCell.x].parentNode = currentNode;
            }
        }

        queue.push(...weightedNeighbors);
    }

    // we reverse the list at the end
    let output = [endCell];
    while (!CoordPairUtils.equalPairs(output[output.length - 1], startCell)) {
        const currentCell = output[output.length - 1];
        const parent = visitedTable[currentCell.y][currentCell.x].parentNode?.node;
        if (!parent) {
            return {totalDist : -1, path: []};
        }
        output = [...output, { x: parent!.x, y: parent!.y }];
    }
    const totalDist = visitedTable[endCell.y][endCell.x].totalDist;
    return {totalDist, path: output.reverse()};
}
