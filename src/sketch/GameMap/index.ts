import Cell from "./Cell";
import * as Loader from "../../utils/mapLoader/loader";
import CellTypes from "./cellTypes";
import p5 from "p5";

export default class GameMap {
    private cells: Cell[][] =[];

    public constructor(width: number, height: number){
        Loader.load().then((response: CellTypes[][]) => {
			const size = Math.min(
				(width-1)/Math.max(...(response.map(r => r.length))),
				(height-1)/response.length);
			const spacing = size/2;
			this.cells = response.map((row: CellTypes[], y) =>
				row.map((col: CellTypes, x) => {
					return new Cell(col, spacing + x*size, spacing + y*size, size);
				})
			);
		});
    }

    public draw = (p: p5) => {
        this.cells.forEach(row => row.forEach(cell => cell.draw(p)));
    }
}
