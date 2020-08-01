import Stack from "./Stack"
import { CoordPair, Directions, CoordPairUtils, DirectionsUtils, PlayerStatusMap, MapResponse } from "shared"

export const generateMapUsingRandomDFS: () => MapResponse = () => {
    const dimensions: CoordPair = { x: 7, y: 7 }
    const stack: Stack<CoordPair> = new Stack<CoordPair>();
    const start: CoordPair = CoordPairUtils.randomPair(dimensions);
    const { mapDirections, visited } = emptyMap(dimensions);
    const withinDimensions = (cell: CoordPair) => cell.x >= 0 && cell.y >= 0 && cell.x < dimensions.x && cell.y < dimensions.y;
    let deepestNode: { depth: number; cell: CoordPair; } = { depth: 0, cell: start }
    const push = (cell: CoordPair) => {
        stack.push(cell);
        visited[cell.y][cell.x] = true;
        if (deepestNode.depth < stack.size()) {
            deepestNode = { depth: stack.size(), cell };
        }
    }
    push(start);
    while (!stack.isEmpty()) {
        const currentCell = stack.peek();
        const firstDir = DirectionsUtils.randomSingleDirection();
        let dir = firstDir;
        let nextCell = { ...currentCell };
        let i = 0;
        while (i < 4 && (!withinDimensions(nextCell) || visited[nextCell.y][nextCell.x])) {
            dir = DirectionsUtils.rotateClockwise(dir);
            nextCell = getAdjacentCell(currentCell, dir);
            i++;
        }
        if (i === 4 || !withinDimensions(nextCell) || visited[nextCell.y][nextCell.x]) { // we've exhausted all options
            stack.pop();
            continue;
        }
        destroyWall(currentCell, dir, mapDirections);
        push(nextCell);
    }
    return mapDirections;
}

const emptyMap = (dimensions: CoordPair) => {
    function* fillEmptyMap<T>(emptyValue: T) {
        function* emptyRow(length: number) {
            for (let j = 0; j < length; j++) {
                yield emptyValue;
            }
        }
        for (let i = 0; i < dimensions.y; i++) {
            yield Array.from(emptyRow(dimensions.x));
        }
    }
    return { mapDirections: Array.from(fillEmptyMap<Directions>(Directions.NONE)), visited: Array.from(fillEmptyMap<boolean>(false)) }
}

const getAdjacentCell = (current: CoordPair, dir: Directions) => {
    switch (dir) {
        case Directions.UP:
            return { ...current, y: current.y - 1 };
        case Directions.DOWN:
            return { ...current, y: current.y + 1 };
        case Directions.LEFT:
            return { ...current, x: current.x - 1 };
        case Directions.RIGHT:
            return { ...current, x: current.x + 1 };
        default:
            return current;
    }
}

const destroyWall = (cellA: CoordPair, dir: Directions, mapDirections: Directions[][]) => {
    const cellB = getAdjacentCell(cellA, dir);
    mapDirections[cellA.y][cellA.x] = dir | mapDirections[cellA.y][cellA.x];
    mapDirections[cellB.y][cellB.x] = DirectionsUtils.getOpposite(dir) | mapDirections[cellB.y][cellB.x];
}

const maxDistPair = (mapDirections: Directions[][], deepestCell: CoordPair, playerIds: string[]) => {
    let cellA = { ...deepestCell };
    let cellB = findFarthest(cellA, mapDirections);
    while (true) {
        const cellANext = findFarthest(cellB, mapDirections);
        const cellBNext = findFarthest(cellANext, mapDirections);
        if (CoordPairUtils.equalPairs(cellA, cellANext) && CoordPairUtils.equalPairs(cellB, cellBNext)) {
            break;
        }
        cellA = { ...cellANext };
        cellB = { ...cellBNext };
    }
    return {
        [playerIds[0]]: { location: cellA, direction: Directions.NONE },
        [playerIds[1]]: { location: cellB, direction: Directions.NONE }
    }
}

const findFarthest = (start: CoordPair, mapDirections: Directions[][]) => {
    const stack = new Stack<CoordPair>();
    const dimensions = { y: mapDirections.length, x: mapDirections[0].length };
    const canMove = (cell: CoordPair, dir: Directions) => (dir === (mapDirections[cell.y][cell.x] & dir));
    const visited = emptyMap(dimensions).visited;
    let deepestNode: { depth: number; cell: CoordPair; } = { depth: 0, cell: start }
    const push = (cell: CoordPair) => {
        stack.push(cell);
        visited[cell.y][cell.x] = true;
        if (deepestNode.depth < stack.size()) {
            deepestNode = { depth: stack.size(), cell };
        }
    }
    push(start);
    while (!stack.isEmpty()) {
        const currentCell = stack.peek();
        const firstDir = DirectionsUtils.randomSingleDirection();
        let dir = firstDir;
        const nextCell = () => getAdjacentCell(currentCell, dir);
        let i = 0;
        while (i < 4 && (!canMove(currentCell, dir) || visited[nextCell().y][nextCell().x])) {
            dir = DirectionsUtils.rotateClockwise(dir);
            i++;
        }
        if (!canMove(currentCell, dir) || visited[nextCell().y][nextCell().x]) { // we've exhausted all options
            stack.pop();
            continue;
        }
        push(nextCell());
    }
    return deepestNode.cell;
}

