import * as p5 from "p5";
import { MapStore } from "../containers/GameWrapper";
import { CoordPair, Directions, DirectionsUtils } from "core";

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

    public constructor(cellType: Directions, x: number, y: number) {
        this.cellType = cellType;
        this.gridCoords = { x, y };
        this.halfSize = MapStore.getState().cellDimensions.halfCellSize;
        this.cellSize = MapStore.getState().cellDimensions.cellSize;
        this.location = { x: (this.halfSize + x * this.cellSize), y: (this.halfSize + y * this.cellSize) };
        this.up = DirectionsUtils.isUp(cellType);
        this.down = DirectionsUtils.isDown(cellType);
        this.left = DirectionsUtils.isLeft(cellType);
        this.right = DirectionsUtils.isRight(cellType);
    }

    public draw: (p: p5) => void = (p) => {
        p.push();
        p.translate(this.location.x, this.location.y);
        this.drawDebugText(p);
        this.drawWalls(p);
        if (this.withinBounds(p.mouseX, p.mouseY)){
            p.fill(255, 0, 0, 20);
            p.noStroke();
            p.rect(-this.halfSize, -this.halfSize, this.cellSize, this.cellSize);
        }
        p.pop();
    }

    private drawDebugText(p: p5) {
        p.textAlign("center", "center");
        p.text(`(${this.gridCoords.x}, ${this.gridCoords.y})`, 0, 0);
    }

    private drawWalls: (p: p5) => void = (p) => {
        if (!this.down) {
            p.line(-this.halfSize, this.halfSize, this.halfSize, this.halfSize);
        }

        if (!this.up) {
            p.line(-this.halfSize, -this.halfSize, this.halfSize, -this.halfSize);
        }

        if (!this.right) {
            p.line(this.halfSize, -this.halfSize, this.halfSize, this.halfSize);
        }

        if (!this.left) {
            p.line(-this.halfSize, -this.halfSize, -this.halfSize, this.halfSize);
        }
    }

    private withinBounds = (x: number, y: number) => {
        return (x > this.location.x - this.halfSize && 
        x < this.location.x + this.halfSize &&
        y > this.location.y - this.halfSize && 
        y < this.location.y + this.halfSize)
    }
}