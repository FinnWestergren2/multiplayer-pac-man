import * as p5 from "p5";
import CellTypes from "./GameMap/cellTypes";
import Cell from "./GameMap/Cell";
import GameMap from "./GameMap";

export default function sketch(p: p5): void {
	var gameMap: GameMap;

	p.setup = function (): void {
		p.createCanvas(600, 600);
		gameMap = new GameMap(p.width, p.height);
	};

	p.draw = function (): void {
		p.background(0);
		gameMap.draw(p);
	};
}