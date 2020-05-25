import * as p5 from "p5";
import * as Loader from "../utils/mapLoader/loader";
import CellTypes from "./GameMap/cellTypes";
import Cell from "./GameMap/Cell";

export default function sketch(p: p5): void {
	const cells: Cell[][] = [];

	p.setup = function (): void {
		Loader.load().then((response: CellTypes[][]) => {
			p.createCanvas(600, 600);
			const size = Math.min(
				p.width/Math.max(...(response.map(r => r.length))),
				p.height/response.length);
			const spacing = size/2;
			response.forEach((row: CellTypes[], y) => {
				cells.push(
					row.map((col: CellTypes, x) => {
						return new Cell(col, spacing + x*size, spacing + y*size, size);
					})
				);
			});
		});
	};

	p.draw = function (): void {
		p.background(0);
		cells.forEach(row => row.forEach(cell => cell.draw(p)));
	};
}