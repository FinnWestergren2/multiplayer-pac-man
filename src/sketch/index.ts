import * as p5 from "p5";
import GameMap from "./GameMap";
import { updateAppDimensions, refreshMap } from "../ducks/mapState";
import { GlobalStore } from "../containers/Game";
import { Player } from "./Player/Player";
import { bindHumanPlayers } from "./Player/controller";
import { RandomAi } from "./Player/RandomAI";

export default function sketch(p: p5): void {
	let gameMap: GameMap;

	p.setup = function (): void {
		// @ts-ignore
		GlobalStore.dispatch(updateAppDimensions(600, 600));
		const {canvasHeight, canvasWidth} = GlobalStore.getState().mapState.appDimensions;
		p.createCanvas(canvasWidth, canvasHeight);
		gameMap = new GameMap(p);
	};

	p.draw = function (): void {
		p.background(255);
		gameMap.draw();
	};
}