import p5 from "p5";
import { GlobalStore } from "../../containers/Game";
import Directions, { isRight, isLeft, isDown, isUp } from "../GameMap/directions";

const SPEED = 2;

type CoordPair = {x: number, y:number}
const zeroPair = {x: 0, y: 0};
const addPairs = (p1: CoordPair, p2: CoordPair) => {
    return {x: p1.x + p2.x, y: p1.y + p2.y}
}
const subtractPairs = (p1: CoordPair, p2: CoordPair) => {
    return {x: p1.x - p2.x, y: p1.y - p2.y}
}

export class Player {
    private initialPos: CoordPair;
    private cell: CoordPair = {...zeroPair};
    private location: CoordPair = {...zeroPair};
    private velocity: CoordPair = {...zeroPair};
    private target: CoordPair = {...zeroPair};
    private size = 0;

    public constructor(initX: number, initY: number) {
        this.initialPos = {x: initX, y: initY}
        GlobalStore.subscribe(this.initialize);
    }

    private initialize = () => {
        const { cellSize, halfCellSize } = GlobalStore.getState().mapState.cellDimensions;
        this.size = halfCellSize;
        this.cell = {...this.initialPos};
        this.location = {x: cellSize * this.initialPos.x - halfCellSize, y: cellSize * this.initialPos.y - halfCellSize};
        this.velocity = {...zeroPair};
    };

    public draw: (p: p5) => void = p => {
        this.location = addPairs(this.location, this.velocity);
        p.push();
        p.translate(this.location.x, this.location.y);
        p.fill(255, 0, 0);
        p.ellipse(0, 0, this.size);
        p.pop();
    };

    public receiveInput(dir: Directions) {
        switch (dir) {
            case (Directions.UP):
                this.velocity = { x: 0, y: -SPEED };
                return;
            case (Directions.DOWN):
                this.velocity = { x: 0, y: SPEED };
                return;
            case (Directions.LEFT):
                this.velocity = { x: -SPEED, y: 0 };
                return;
            case (Directions.RIGHT):
                this.velocity = { x: SPEED, y: 0 };
                return;
        }
    }

    private moveTowardsTarget = () => {
        
    }

    private canMoveHorizontally = () =>
        this.velocity.x > 0
            ? (this.location.x % (this.size * 2) <= this.size || isRight(this.currentCellType()))
            : (this.location.x % (this.size * 2) >= this.size || isLeft(this.currentCellType()));

    private canMoveVertically = () =>
        this.velocity.y > 0
            ? (this.location.y % (this.size * 2) <= this.size || isDown(this.currentCellType()))
            : (this.location.y % (this.size * 2) >= this.size || isUp(this.currentCellType()));

    private currentCellType = () => {
        try {
            const cellSize = GlobalStore.getState().mapState.cellDimensions.cellSize
            const x = Math.floor(this.location.y / cellSize);
            const y = Math.floor(this.location.x / cellSize);
            return GlobalStore.getState().mapState.mapCells[y][x];
        } catch (error) {
            return Directions.NONE;
        }
    }
}


