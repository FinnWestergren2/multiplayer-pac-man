import p5 from "p5";
import Game from "./Game";
import { updateAppDimensions } from "core";
import { Store } from "../containers/GameWrapper";

export default function sketch(p: p5): void {
	let game: Game;

	p.setup = function (): void {
		updateAppDimensions(Store, 437.5, 500);
		const { canvasHeight, canvasWidth } = Store.getState().mapState.appDimensions;
		p.createCanvas(canvasWidth + 10, canvasHeight + 10);
		game = new Game(p);
	};

	p.draw = function (): void {
		p.background(0);
		game.draw(p);
	};

	p.frameRate(50);
}
