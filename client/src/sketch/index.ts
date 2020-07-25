import p5 from "p5";
import Game from "./Game";
import { updateAppDimensions } from "../ducks/mapState";
import { MapStore } from "../containers/GameWrapper";
import initializeSocket from "../socket";
import { ClientRequest, MessageType } from "shared";

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
		const request: ClientRequest = { type: MessageType.PING, payload: (new Date()).getTime()}
		socket.send(JSON.stringify(request));
	}
}