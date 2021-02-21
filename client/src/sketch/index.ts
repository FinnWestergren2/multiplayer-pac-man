import p5 from "p5";
import Game from "./Game";
import { Direction, updateAppDimensions } from "core";
import { MapStore } from "../containers/GameWrapper";
import Cell from "./Cell";

export default function sketch(p: p5): void {
	let game: Game;
	let mapLayer: p5.Graphics;

	p.setup = function (): void {
		updateAppDimensions(MapStore, 500, 500);
		const { canvasHeight, canvasWidth } = MapStore.getState().appDimensions;
		p.createCanvas(canvasWidth + 10, canvasHeight + 10);
		mapLayer = p.createGraphics(canvasWidth + 10, canvasHeight + 10);
		mapLayer.pixelDensity(1);
		MapStore.subscribe(() => drawMap(mapLayer));
		game = new Game(p);
	};

	p.draw = function (): void {
		p.background(0);
		p.image(mapLayer, 0, 0);
		game.draw(p);
	};

	p.frameRate(50);

	const drawMap = (mapLayer: p5.Graphics) => {
		mapLayer.clear();
		const mapCells = MapStore.getState().mapCells;
		mapCells.map((row: Direction[], y: number) =>
			row.map((column: Direction, x) => new Cell(x, y))
		).flat().forEach(c => c.draw(mapLayer))
	} 

}
