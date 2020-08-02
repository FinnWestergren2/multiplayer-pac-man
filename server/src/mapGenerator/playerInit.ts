import { Directions, CoordPair, CoordPairUtils, DirectionsUtils } from "shared/static/types";
import Stack from "./Stack";
import { emptyMap, getAdjacentCell } from ".";

export const maxDistPair = (mapDirections: Directions[][], deepestCell: CoordPair, playerIds: string[]) => {
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
