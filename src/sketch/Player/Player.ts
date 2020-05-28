import p5 from "p5";
import { GlobalStore } from "../../containers/Game";
import Directions, { isRight, isLeft, isDown, isUp } from "../GameMap/directions";
import { thisExpression } from "@babel/types";

const SPEED = 5;

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
    private location: CoordPair = {...zeroPair};
    private velocity: CoordPair = {...zeroPair};
    private target: CoordPair = {x: 1, y: 1};
    private size = 0;

    public constructor(initX: number, initY: number) {
        this.initialPos = {x: initX, y: initY}
        GlobalStore.subscribe(this.initialize);
    }

    private initialize = () => {
        const { cellSize, halfCellSize } = GlobalStore.getState().mapState.cellDimensions;
        this.size = halfCellSize;
        this.location = {x: cellSize * this.initialPos.x - halfCellSize, y: cellSize * this.initialPos.y - halfCellSize};
        this.velocity = {...zeroPair};
    };

    public draw: (p: p5) => void = p => {
        this.moveTowardsTarget();
        this.location = addPairs(this.location, this.velocity);
        p.push();
        p.translate(this.location.x, this.location.y);
        p.fill(255, 0, 0);
        p.ellipse(0, 0, this.size);
        p.pop();
        this.drawDebugInfo(p);
    };


    public receiveInput(dir: Directions) {
        switch (dir) {
            case (Directions.UP):
                this.target = {...this.target, y: this.target.y - 1};
                return;
            case (Directions.DOWN):
                this.target = {...this.target, y: this.target.y + 1};
                return;
            case (Directions.LEFT):
                this.target = {...this.target, x: this.target.x - 1};
                return;
            case (Directions.RIGHT):
                this.target = {...this.target, x: this.target.x + 1};
                return;
        }
    }

    private drawDebugInfo(p: p5){
        p.line(this.targetLocation().x, this.targetLocation().y, this.location.x, this.location.y);
        p.push();
        p.translate(this.location.x, this.location.y);
        p.text(Object.values(this.location).toString() + "\n" + Object.values(this.targetLocation()).toString(), 0, 20);
        p.pop();
    }

    private moveTowardsTarget = () => {
        const target = this.targetLocation();
        if (Math.abs(this.location.x - target.x) < SPEED && Math.abs(this.location.y - target.y) < SPEED){
            this.velocity = {...zeroPair}
            this.location = target;
            return;
        }
        if (Math.floor(this.location.x) < Math.floor(target.x) && this.canMoveRight()){
            this.velocity = { x: SPEED, y: 0 };
            return;
        }
        if (Math.floor(this.location.x) > Math.floor(target.x) && this.canMoveLeft()){
            this.velocity = { x: -SPEED, y: 0 };
            return;
        }
        if (Math.floor(this.location.y) > Math.floor(target.y) && this.canMoveUp()){
            this.velocity = { x: 0, y: -SPEED };
            return;
        }
        if (Math.floor(this.location.y) < Math.floor(target.y)  && this.canMoveDown()){
            this.velocity = { x: 0, y: SPEED };
            return;
        }
    }

    private targetLocation = () => {
        const translate = (num: number) => (num - 1) * (this.size * 2) + this.size;
        return {x: translate(this.target.x), y: translate(this.target.y)}
    }

    private currentCell: () => CoordPair = () => {
        return {x: Math.floor(this.location.x / (this.size * 2)), y: Math.floor(this.location.y / (this.size * 2))}
    }

    private canMoveRight = () => this.location.x % (this.size * 2) <= this.size || isRight(this.currentCellType());
    private canMoveLeft = () => this.location.x % (this.size * 2) >= this.size || isLeft(this.currentCellType());
    private canMoveUp = () => this.location.y % (this.size * 2) >= this.size || isUp(this.currentCellType());
    private canMoveDown = () => this.location.y % (this.size * 2) <= this.size || isDown(this.currentCellType());

    private currentCellType = () => {
        try {
            const currentCell = this.currentCell();
            return GlobalStore.getState().mapState.mapCells[currentCell.y][currentCell.x];
        } catch (error) {
            return Directions.NONE;
        }
    }
}


