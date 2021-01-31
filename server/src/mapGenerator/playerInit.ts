import { Direction, CoordPair, CoordPairUtils, DirectionUtils } from "shared/static/types";
import Stack from "./Stack";
import { emptyMap, getAdjacentCell } from ".";

export const maxDistPair = (mapCells: Direction[][], deepestCell: CoordPair, playerIds: string[]) => {
    let cellA = { ...deepestCell };
    let cellB = findFarthest(cellA, mapCells);
    while (true) {
        const cellANext = findFarthest(cellB, mapCells);
        const cellBNext = findFarthest(cellANext, mapCells);
        if (CoordPairUtils.equalPairs(cellA, cellANext) && CoordPairUtils.equalPairs(cellB, cellBNext)) {
            break;
        }
        cellA = { ...cellANext };
        cellB = { ...cellBNext };
    }
    return {
        [playerIds[0]]: { location: cellA, direction: Direction.NONE },
        [playerIds[1]]: { location: cellB, direction: Direction.NONE }
    }
}

const findFarthest = (start: CoordPair, mapCells: Direction[][]) => {
    const stack = new Stack<CoordPair>();
    const dimensions = { y: mapCells.length, x: mapCells[0].length };
    const canMove = (cell: CoordPair, dir: Direction) => (dir === (mapCells[cell.y][cell.x] & dir));
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
        const firstDir = DirectionUtils.randomSingleDirection();
        let dir = firstDir;
        const nextCell = () => getAdjacentCell(currentCell, dir);
        let i = 0;
        while (i < 4 && (!canMove(currentCell, dir) || visited[nextCell().y][nextCell().x])) {
            dir = DirectionUtils.rotateClockwise(dir);
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
