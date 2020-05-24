import * as p5 from "p5";
import CellTypes , { getString } from "./cellTypes";

export default class Cell {
    public cellType: CellTypes;
    private xPos: number;
    private yPos: number;
    private size: number;
    private cellTypeName: string;

    public constructor(cellType: CellTypes, x: number, y: number, size: number){
        this.cellType = cellType
        this.xPos = x;
        this.yPos = y;
        this.size = size;
        this.cellTypeName = getString(cellType)
    }

    public draw: (p: p5) => void = (p) => {
        p.rect(this.xPos - this.size/2, this.yPos - this.size/2, this.size, this.size);
        p.textAlign("center","center");
        p.text(this.cellTypeName, this.xPos, this.yPos);
    }
}