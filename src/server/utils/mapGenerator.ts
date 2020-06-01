import Stack from "./Stack"
import Directions from "../../sketch/GameMap/directions"

type CellWithFlag = {
    dir: Directions;
    visited: boolean;
}

const generateMapUsingRandomDFS = () => {
    const stack: Stack<CellWithFlag> = new Stack<CellWithFlag>();
}