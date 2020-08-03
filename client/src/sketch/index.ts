import p5 from "p5";
import Game from "./Game";
import { updateAppDimensions } from "shared";
import { MapStore } from "../containers/GameWrapper";
import { pingServer } from "../socket/clientExtensions";

export default function sketch(p: p5): void {
	let game: Game;

	p.setup = function (): void {
		// @ts-ignore
		MapStore.dispatch(updateAppDimensions(600, 600));
		const {canvasHeight, canvasWidth} = MapStore.getState().appDimensions;
		p.createCanvas(canvasWidth, canvasHeight);
		game = new Game(p);
	};

	p.draw = function (): void {
		p.background(255);
		game.draw(p);
		game.update();
	};
	
	p.mouseClicked = pingServer
}