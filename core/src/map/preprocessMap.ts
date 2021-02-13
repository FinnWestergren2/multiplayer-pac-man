import { Direction, DirectionUtils } from "../types/direction";
import MapNode from "./mapNode";

const preprocessMap = (cells: Direction[][]) => {
    const [height, width] = [cells.length, cells[0].length];
    let nodesSoFar: (MapNode | null)[][] = [];

    const findLeftNode = (x: number, y: number) => {
        for (let i = x - 1; i >= 0; i--) {
            if (nodesSoFar[y][i] !== null) return nodesSoFar[y][i];
        }
        throw Error
    }

    const findUpNode = (x: number, y: number) => {
        for (let i = y - 1; i >= 0; i--) {
            if (nodesSoFar[i][x] !== null) return nodesSoFar[i][x];
        }
        throw Error
    }

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
                nodesSoFar[y][x]!.TieNeighbor(findLeftNode(x,y), Direction.LEFT);
            }
            if (DirectionUtils.isUp(cell)) {
                nodesSoFar[y][x]!.TieNeighbor(findUpNode(x,y), Direction.UP);
            }
        }
    }

    return nodesSoFar;
};

export default preprocessMap;
