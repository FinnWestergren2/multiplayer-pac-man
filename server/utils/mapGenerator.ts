import Stack from "./Stack"
import CoordPair, { zeroPair } from "./CoordPair"
import Directions from "./directions";


export const generateMapUsingRandomDFS = () => {
    const startingLocation: CoordPair = {...zeroPair};
    const dimensions: CoordPair = {x: 10, y: 10}
    const {mapDirections, visited} = emptyMap(dimensions);
    const stack: Stack<{dir: Directions, visited: boolean}> = new Stack<{dir: Directions, visited: boolean}>();
    return mapDirections;
}

const emptyMap = (dimensions: CoordPair) => {
    function* fillEmptyMap<T> (withWhat: T) {
        function* emptyRow(length: number) {
            for (let j = 0; j < length; j++) {
                yield withWhat
            }
        }
        for (let i = 0; i < dimensions.x; i++) {
            yield Array.from(emptyRow(dimensions.y));
        }
    }
    return {mapDirections : Array.from(fillEmptyMap<Directions>(Directions.NONE)), visited: Array.from(fillEmptyMap<boolean>(false)) }
}
