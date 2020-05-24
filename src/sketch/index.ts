import * as p5 from "p5";
import { Player } from "./Player";
import * as Loader from "../utils/mapLoader/loader";
import GameMap, { CellTypes, Cell } from "./GameMap";

export default function sketch(p: p5) {
	const players: Player[] = [];
	const cells: Cell[][] = [];

	p.setup = function (): void {
		Loader.load().then((response: CellTypes[][]) => {
			p.createCanvas(600, 600);
			const size = p.width/response.length;
			const spacing = size/2;
			response.forEach((row: CellTypes[], y) => {
				cells.push(
					row.map((col: CellTypes, x) => {
						return new Cell(col, spacing + x*size, spacing + y*size, size);
					})
				)
			})
		});
	};

	p.draw = function () {
		p.background(0);
		players.forEach(pl => pl.draw(p));
		cells.forEach(row => row.forEach(cell => cell.draw(p)));
	};
    

	p.mouseWheel = (e: { delta: number}) => {
		players.forEach(pl => pl.rotate(e.delta * Math.PI / 180));
	};
}