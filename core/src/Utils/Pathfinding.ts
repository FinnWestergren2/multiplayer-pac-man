import { mapStore } from "../Game";
import { CoordPair, CoordPairUtils } from "../Types/CoordPair"
import { Directions, DirectionsUtils } from "../Types/Directions";

export const BFS: (startFloat: CoordPair, endCell: CoordPair) => CoordPair[] = (startFloat, endCell) => {
    const startCell = CoordPairUtils.roundedPair(startFloat);
    if(CoordPairUtils.equalPairs(startCell, endCell)){
        return [startCell];
    }
    let queue = [startCell];
    let popIndex = 0;
    const mapCells = mapStore.getState().mapCells.map(row => row.map(col => { return { dir: col, isVisited: false, parentCell: {x: -1, y: -1}, depth: 0 }} ));
    mapCells[startCell.y][startCell.x].isVisited = true;

    const getAllBranches = (location: CoordPair) => {
        const branches: CoordPair[] = []
        const x = Math.floor(location.x);
        const y = Math.floor(location.y);
        const directions = mapCells[y][x].dir;
        if (mapCells[y + 1] && mapCells[y + 1][x] && DirectionsUtils.isDown(directions) && !mapCells[y + 1][x].isVisited){
            branches.push({x: x, y: y + 1});
            mapCells[y + 1][x].isVisited = true;
            mapCells[y + 1][x].parentCell = location;
        }
        if (mapCells[y - 1] && mapCells[y - 1][x] && DirectionsUtils.isUp(directions) && !mapCells[y - 1][x].isVisited){
            branches.push({x: x, y: y - 1});
            mapCells[y - 1][x].isVisited = true;
            mapCells[y - 1][x].parentCell = location;
        }
        if (mapCells[y] && mapCells[y][x + 1] && DirectionsUtils.isRight(directions) && !mapCells[y][x + 1].isVisited){
            branches.push({x: x + 1, y: y});
            mapCells[y][x + 1].isVisited = true;
            mapCells[y][x + 1].parentCell = location;
        }
        if (mapCells[y] && mapCells[y][x - 1] && DirectionsUtils.isLeft(directions) && !mapCells[y][x - 1].isVisited){
            branches.push({x: x - 1, y: y});
            mapCells[y][x - 1].isVisited = true;
            mapCells[y][x - 1].parentCell = location;
        }
        return branches;
    }

    while (true) {
        if (popIndex >= queue.length) {
            return [];
        }
        const branches = getAllBranches(queue[popIndex]);
        if (branches.some(b => CoordPairUtils.equalPairs(b, endCell))){
            break;
        }
        queue = [...queue, ...branches];
        popIndex++;
    }
 
    // we reverse the list at the end
    let output = [endCell]
    while (!CoordPairUtils.equalPairs(output[output.length - 1], startCell)) {
        const currentCell = output[output.length - 1];
        output = [...output, mapCells[currentCell.y][currentCell.x].parentCell];
    }
    output = output.reverse();
    if (output.length > 1) {
        const firstDir = CoordPairUtils.getDirection(CoordPairUtils.snappedPair(startFloat), output[0]);
        const secondDir = CoordPairUtils.getDirection(CoordPairUtils.snappedPair(startFloat), output[1]);
        if (DirectionsUtils.getOpposite(firstDir) === secondDir || firstDir === Directions.NONE) {
            output = output.slice(1);
        }
    }
    return output;
}