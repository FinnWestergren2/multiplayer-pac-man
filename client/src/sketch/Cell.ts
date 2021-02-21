import p5 from "p5";
import { MapStore } from "../containers/GameWrapper";
import {
    CellModifier,
    CoordPair,
    Direction,
    DirectionUtils,
    junctionSelector,
} from "core";

export default class Cell {
    private cellModifier: CellModifier;
    public gridCoords: CoordPair;
    private location: CoordPair;
    private halfSize: number;
    private cellSize: number;
    private cellType: Direction;

    public constructor(x: number, y: number) {
        this.cellType = MapStore.getState().mapCells[y][x];
        this.cellModifier = MapStore.getState().cellModifiers[y][x];
        this.gridCoords = { x, y };
        this.halfSize = MapStore.getState().cellDimensions.cellSize * 0.5;
        this.cellSize = MapStore.getState().cellDimensions.cellSize;
        this.location = {
            x: this.halfSize + x * this.cellSize,
            y: this.halfSize + y * this.cellSize,
        };
        console.log(this.location);
    }

    public draw: (p: p5.Graphics) => void = (p) => {
        p.push();
        p.translate(this.location.x, this.location.y);
        p.textAlign("center", "center");
        // this.drawDebugText(p);
        // this.drawDebugNodeOverlay(p);
        this.drawWalls(p);
        // this.drawModifier(p);
        // this.drawShadedCellOnHover(p);
        p.pop();
    };

    private drawDebugText(p: p5) {
        p.text(`(${this.gridCoords.x}, ${this.gridCoords.y})`, 0, 0);
    }

    private drawDebugNodeOverlay(p: p5) {
        const juncs = junctionSelector(MapStore.getState());
        if (
            juncs &&
            juncs[this.gridCoords.y] &&
            juncs[this.gridCoords.y][this.gridCoords.x]
        ) {
            p.ellipse(0, 0, this.halfSize * 0.5);
        }
    }

    private drawWalls: (p: p5) => void = (p) => {
        const verteces: CoordPair[] = [];
        const push = (x: number, y: number) => {
            verteces.push({ x, y });
        }
        const unit = this.halfSize;

        if (!DirectionUtils.isUp(this.cellType)) {
            push(-unit, -unit);
            push(unit, -unit);
        }

        if (!DirectionUtils.isRight(this.cellType)) {
            push(unit, -unit);
            push(unit, unit);
        }

        if (!DirectionUtils.isDown(this.cellType)) {
            push(-unit, unit);
            push(unit, unit);
        }

        if (!DirectionUtils.isLeft(this.cellType)) {
            push(-unit, -unit);
            push(-unit, unit);
        }
        p.push()
        p.strokeWeight(0.5);
        p.stroke(255);
        p.fill(0);
        p.beginShape(p.QUADS);
        for(let i = 0; i < verteces.length; i += 2) {
            p.vertex(verteces[i].x, verteces[i].y);
            p.vertex(verteces[i].x + 10, verteces[i].y + 10);
            p.vertex(verteces[i + 1].x + 10, verteces[i + 1].y + 10);
            p.vertex(verteces[i + 1].x, verteces[i + 1].y);
        } 
        p.endShape();
        p.pop()
    };

    private drawModifier = (p: p5) => {
        if (this.cellModifier === CellModifier.MINE) {
            p.text("MINE", 0, 0);
        }
    };

    private drawShadedCellOnHover(p: p5) {
        if (this.withinBounds(p.mouseX, p.mouseY)) {
            p.fill(255, 0, 0, 20);
            p.noStroke();
            p.rect(
                -this.halfSize,
                -this.halfSize,
                this.cellSize,
                this.cellSize
            );
        }
    }

    public withinBounds = (x: number, y: number) => {
        return (
            x > this.location.x - this.halfSize &&
            x < this.location.x + this.halfSize &&
            y > this.location.y - this.halfSize &&
            y < this.location.y + this.halfSize
        );
    };
}
