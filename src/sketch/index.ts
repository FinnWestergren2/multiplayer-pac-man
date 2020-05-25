import * as p5 from "p5";
import GameMap from "./GameMap";
import { updateAppDimensions } from "../ducks/mapState";
import { GlobalStore } from "../containers/Game";

export default function sketch(p: p5): void {
	var gameMap: GameMap;

	p.setup = function (): void {
		// @ts-ignore
		GlobalStore.dispatch(updateAppDimensions(600, 600));
		const {canvasHeight, canvasWidth} = GlobalStore.getState().mapState.appDimensions
		p.createCanvas(canvasWidth, canvasHeight);
		gameMap = new GameMap();
	};

	p.draw = function (): void {
		gameMap.draw(p);
	};
}