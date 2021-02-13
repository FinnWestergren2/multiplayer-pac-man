import { Direction, DirectionUtils } from "../types";

export default class MapNode {
    public neighbors:  (MapNode | null) [] = new Array(4).fill(null); // 0 = UP, 1 = RIGHT, 2 = DOWN, 3 = LEFT
    public x: number;
    public y: number;
    
    public constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public TieNeighbor(otherNode: MapNode | null, dir: Direction, bothWays: boolean = true) {
        switch (dir) {
            case Direction.UP:
                this.neighbors[0] = otherNode;
                break;
            case Direction.RIGHT:
                this.neighbors[1] = otherNode;
                break;
            case Direction.DOWN:
                this.neighbors[2] = otherNode;
                break;
            case Direction.LEFT:
                this.neighbors[3] = otherNode;
                break;
            default:
                console.warn('MapNode.TieNeighbor recieved invalid direction', DirectionUtils.getString(dir))
                return;
        }

        if (otherNode !== null && bothWays) {
            otherNode.TieNeighbor(this, DirectionUtils.getOpposite(dir), false);
        }
    }
}