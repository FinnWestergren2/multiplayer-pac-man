import * as p5 from "p5";
import Directions , { getString, isDown, isLeft, isRight, isUp } from "./Direction";
import { GlobalStore } from "../../containers/GameWrapper";
import CoordPair from "./CoordPair";

export default class Cell {
    public cellType: Directions;
    private gridCoords: CoordPair;
    private location: CoordPair;
    private halfSize: number;
    private cellSize: number;
    private up: boolean;
    private down: boolean;
    private left: boolean;
    private right: boolean;

    public constructor(cellType: Directions, x: number, y: number){
        this.cellType = cellType;
        this.gridCoords = {x, y};
        this.halfSize = GlobalStore.getState().mapState.cellDimensions.halfCellSize;
        this.cellSize = GlobalStore.getState().mapState.cellDimensions.cellSize;
        this.location = { x: (this.halfSize + x * this.cellSize), y: (this.halfSize + y * this.cellSize) };
        this.up = isUp(cellType);
        this.down = isDown(cellType);
        this.left = isLeft(cellType);
        this.right = isRight(cellType);
    }

    public draw: (p: p5) => void = (p) => {
        p.push();
        p.translate(this.location.x, this.location.y);
        // this.drawDebugLines(p);
        this.drawDebugText(p);
        this.drawWalls(p);
        p.pop();
    }

    private drawDebugText(p: p5){
        p.textAlign("center","center");
        p.text(`(${this.gridCoords.x}, ${this.gridCoords.y})`, 0, 0);
    }

    private drawDebugLines: (p: p5) => void = (p) => {
        p.stroke(0,255,0);
        if (this.up) {
            p.line(0, 0, 0, -this.halfSize);
        }
        if (this.down) {
            p.line(0, 0, 0, this.halfSize);
        }
        if (this.left) {
            p.line(0, 0, -this.halfSize, 0);
        }
        if (this.right) {
            p.line(0, 0, this.halfSize, 0);
        }
        p.stroke(0);
    }

    private drawWalls: (p: p5) => void = (p) => {
        if(!this.down){
            p.line(-this.halfSize, this.halfSize, this.halfSize, this.halfSize);
        }
        
        if(!this.up){
            p.line(-this.halfSize, -this.halfSize, this.halfSize, -this.halfSize);
        }
        
        if(!this.right){
            p.line(this.halfSize, -this.halfSize, this.halfSize, this.halfSize);
        }
        
        if(!this.left){
            p.line(-this.halfSize, -this.halfSize, -this.halfSize, this.halfSize);
        }
    }
}