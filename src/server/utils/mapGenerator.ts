import Stack from "./Stack"
import Directions from "../../sketch/GameMap/directions"
import CoordPair, { zeroPair } from "../../sketch/GameMap/CoordPair"

type CellWithFlag = {
    dir: Directions;
    visited: boolean;
}

const emptyCell: CellWithFlag = {dir: Directions.NONE, visited: false}


const generateMapUsingRandomDFS = () => {
    const startingLocation: CoordPair = {...zeroPair};
    const dimensions: CoordPair = {x: 10, y: 10}
    const emptyMap = fillEmptyMap(dimensions);
    const stack: Stack<CellWithFlag> = new Stack<CellWithFlag>();
}

const fillEmptyMap = (dimensions: CoordPair) => {
    const map: CellWithFlag[][] = [];
    for (let i = 0; i < dimensions.x; i++) {
        map.push(Array.from(emptyRow(dimensions.y)));
    }
}

function* emptyRow(length: number){
    for (let j = 0; j < length; j++) {
        yield {...emptyCell}
    }
}