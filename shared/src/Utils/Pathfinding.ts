import { mapStore } from "../Game";
import { CoordPair, CoordPairUtils } from "../Types/CoordPair"
import { DirectionsUtils } from "../Types/Directions";

export const BFS: (startFloat: CoordPair, endCell: CoordPair) => CoordPair[] = (startFloat, endCell) => {
    const startCell = CoordPairUtils.roundedPair(startFloat);
    let queue = [startCell];
    let popIndex = 0;
    const mapCells = mapStore.getState().mapCells.map(row => row.map(col => { return { dir: col, isVisited: false, parentCell: {x: -1, y: -1}, depth: 0 }} ));

    const getAllBranches = (location: CoordPair) => {
        const branches: CoordPair[] = []
        const x = Math.floor(location.x);
        const y = Math.floor(location.y);
        const directions = mapCells[x][y].dir;
        console.log(location, directions);
        if (mapCells[x] && mapCells[x][y + 1] && DirectionsUtils.isDown(directions) && !mapCells[x][y + 1].isVisited){
            branches.push({x: x, y: y + 1});
            console.log("DOWN", x, y + 1);
            mapCells[x][y + 1].isVisited = true;
            mapCells[x][y + 1].parentCell = location;
        }
        if (mapCells[x] && mapCells[x][y - 1] && DirectionsUtils.isUp(directions) && !mapCells[x][y - 1].isVisited){
            branches.push({x: x, y: y - 1});
            console.log("UP", x, y - 1);
            mapCells[x][y - 1].isVisited = true;
            mapCells[x][y - 1].parentCell = location;
        }
        if (mapCells[x + 1] && mapCells[x + 1][y] && DirectionsUtils.isRight(directions) && !mapCells[x + 1][y].isVisited){
            branches.push({x: x + 1, y: y});
            console.log("RIGHT", x + 1, y);
            mapCells[x + 1][y].isVisited = true;
            mapCells[x + 1][y].parentCell = location;
        }
        
        if (mapCells[x - 1] && mapCells[x - 1][y] && DirectionsUtils.isLeft(directions) && !mapCells[x - 1][y].isVisited){
            branches.push({x: x - 1, y: y});
            console.log("LEFT", x - 1, y);
            mapCells[x - 1][y].isVisited = true;
            mapCells[x - 1][y].parentCell = location;
        }
        return branches;
    }

    while (!CoordPairUtils.equalPairs(queue[queue.length - 1], endCell)){
        queue = [...queue, ...getAllBranches(queue[popIndex])];
        popIndex++;
    }

    let output = [endCell]
    while(!CoordPairUtils.equalPairs(queue[output.length - 1], startCell)){
        const currentCell = output[output.length - 1];
        output = [...output, mapCells[currentCell.x][currentCell.y].parentCell];
    }

    return output.reverse();
}