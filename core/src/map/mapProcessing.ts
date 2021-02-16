import { Direction, DirectionUtils } from "../types/direction";
import MapNode from "./mapNode";

export const preProcessMap = (cells: Direction[][]) => {
    console.log('processing map');
    const [height, width] = [cells.length, cells[0].length];
    const nodesSoFar: (MapNode | null)[][] = [];
    for (let y = 0; y < height; y++) {
        nodesSoFar.push([]);
        for (let x = 0; x < width; x++) {
            const cell = cells[y][x];
            if (!DirectionUtils.isAJunction(cell)) {
                nodesSoFar[y].push(null)
                continue;
            }
            nodesSoFar[y].push(new MapNode(x, y));
            if (DirectionUtils.isLeft(cell)) {
                nodesSoFar[y][x]!.TieNeighbor(findLeftNode(x, y, nodesSoFar), Direction.LEFT);
            }
            if (DirectionUtils.isUp(cell)) {
                nodesSoFar[y][x]!.TieNeighbor(findUpNode(x, y, nodesSoFar), Direction.UP);
            }
        }
    }
    return nodesSoFar;
};

const findLeftNode = (x: number, y: number, nodeMap: (MapNode | null)[][]) => {
    for (let i = x - 1; i >= 0; i--) {
        if (nodeMap[y][i] !== null) return nodeMap[y][i];
    }
    return null;
}

const findUpNode = (x: number, y: number, nodeMap: (MapNode | null)[][]) => {
    for (let i = y - 1; i >= 0; i--) {
        if (nodeMap[i][x] !== null) return nodeMap[i][x];
    }
    return null;
}

const findDownNode = (x: number, y: number, nodeMap: (MapNode | null)[][]) => {
    for (let i = y + 1; i < nodeMap.length; i++) {
        if (nodeMap[i][x] !== null) return nodeMap[i][x];
    }
    return null;
}

const findRightNode = (x: number, y: number, nodeMap: (MapNode | null)[][]) => {
    for (let i = x + 1; i < nodeMap[0].length; i++) {
        if (nodeMap[y][i] !== null) return nodeMap[y][i];
    }
    return null;
}

export const tieAllNodes = (node: MapNode, nodeMap: (MapNode | null)[][], cell: Direction) => {
    if (DirectionUtils.isLeft(cell)) {
        node.TieNeighbor(findLeftNode(node.x, node.y, nodeMap), Direction.LEFT);
    }
    if (DirectionUtils.isUp(cell)) {
        node.TieNeighbor(findUpNode(node.x, node.y, nodeMap), Direction.UP);
    }
    if (DirectionUtils.isDown(cell)) {
        node.TieNeighbor(findDownNode(node.x, node.y, nodeMap), Direction.DOWN);
    }
    if (DirectionUtils.isRight(cell)) {
        node.TieNeighbor(findRightNode(node.x, node.y, nodeMap), Direction.RIGHT);
    }
    nodeMap[node.y].splice(node.x, 1, node);
}
