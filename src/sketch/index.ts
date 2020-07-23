import p5 from "p5";
import Game from "./Game";
import { updateAppDimensions } from "../ducks/mapState";
import { MapStore } from "../containers/GameWrapper";
import initializeSocket from "../client/socket";

export default function sketch(p: p5): void {
	let game: Game;
	const socket = initializeSocket();

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
		game.update(p.frameCount);
	};

	p.mouseClicked = () => {
		socket.send(JSON.stringify({ message: 'test message' }));
	}
}