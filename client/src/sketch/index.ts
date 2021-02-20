import p5 from "p5";
import Game from "./Game";
import { updateAppDimensions } from "core";
import { MapStore } from "../containers/GameWrapper";

export default function sketch(p: p5): void {
	let game: Game;

	p.setup = function (): void {
		updateAppDimensions(MapStore, 500, 500);
		const {canvasHeight, canvasWidth} = MapStore.getState().appDimensions;
		p.createCanvas(canvasWidth + 10, canvasHeight + 10);
		game = new Game(p);
	};

	p.draw = function (): void {
		p.background(0);
		game.draw(p);
	};

	p.frameRate(50);

}
