import Game from "./Game";
import { MapStore, PlayerStore } from "../Types/ReduxTypes";

const FRAME_LENGTH = 20;

export let mapStore: MapStore;
export let playerStore: PlayerStore;

export const runGame: (ms: MapStore, ps: PlayerStore, startTimeInMilliseconds: number, updateInterval: (handler: TimerHandler, timeout?: number) => number) => void = (ms, ps, startTimeInMilliseconds, updateInterval) => {
    mapStore = ms;
    playerStore = ps;
    const currentFrame = Math.floor(((new Date()).getTime() - startTimeInMilliseconds) / FRAME_LENGTH);
    const game = new Game(currentFrame);
    updateInterval(game.update, FRAME_LENGTH);
};
