import * as p5 from "p5";
import CellTypes , { getString, isOpenDown, isOpenLeft, isOpenRight, isOpenUp } from "./cellTypes";

export default class Cell {
    public cellType: CellTypes;
    private xPos: number;
    private yPos: number;
    private size: number;
    private cellTypeName: string;
    private up: boolean;
    private down: boolean;
    private left: boolean;
    private right: boolean;

    public constructor(cellType: CellTypes, x: number, y: number, size: number){
        this.cellType = cellType;
        this.xPos = x;
        this.yPos = y;
        this.size = size;
        this.cellTypeName = getString(cellType);
        this.up = isOpenUp(cellType);
        this.down = isOpenDown(cellType);
        this.left = isOpenLeft(cellType);
        this.right = isOpenRight(cellType);
    }

    public draw: (p: p5) => void = (p) => {
        p.push();
        p.translate(this.xPos, this.yPos);
        p.rect(-this.size/2, -this.size/2, this.size, this.size);
        p.textAlign("center","center");
        p.text(this.cellTypeName, 0, 0);
        this.drawDebugLines(p);
        p.pop();
    }

    private drawDebugLines: (p: p5) => void = (p) => {
        p.stroke(0,255,0);
        if (this.up) {
            p.line(0, 0, 0, -this.size/2);
        }
        if (this.down) {
            p.line(0, 0, 0, this.size/2);
        }
        if (this.left) {
            p.line(0, 0, -this.size/2, 0);
        }
        if (this.right) {
            p.line(0, 0, this.size/2, 0);
        }
    }
}