import * as p5 from "p5";
import GameMap from "./GameMap";
import { updateAppDimensions } from "../ducks/mapState";
import { GlobalStore } from "../containers/Game";
import { Player } from "./Player/Player";

export default function sketch(p: p5): void {
	var gameMap: GameMap;
	var player: Player

	p.setup = function (): void {
		// @ts-ignore
		GlobalStore.dispatch(updateAppDimensions(600, 600));
		const {canvasHeight, canvasWidth} = GlobalStore.getState().mapState.appDimensions
		p.createCanvas(canvasWidth, canvasHeight);
		gameMap = new GameMap();
		player = new Player(1,1);
		player.makeHumanPlayer(p);
	};

	p.draw = function (): void {
		p.background(255);
		gameMap.draw(p);
		player.draw(p);
	};
}