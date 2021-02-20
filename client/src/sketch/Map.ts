import { Direction } from "core/static/types";
import p5 from "p5";
import { MapStore } from "../containers/GameWrapper";
import Cell from "./Cell";

export default class Map {
	private cells: Cell[][] = [];
    private graphicsLayer: p5.Graphics;
    
	public constructor(p: p5.Graphics) {
        this.graphicsLayer = p;
	}
    
	public drawMap = () => {
        this.graphicsLayer.clear();
		const mapCells = MapStore.getState().mapCells;
		this.cells = mapCells.map((row: Direction[], y: number) =>
			row.map((column: Direction, x) => new Cell(x, y))
		);
        this.cells.flat().forEach(c => c.draw(this.graphicsLayer))
	};
}