import Game from "./Game";
import { MapStore, PlayerStore } from "../Types/ReduxTypes";

const FRAME_LENGTH = 20;

export const UPDATE_FREQUENCY = 1/FRAME_LENGTH;
export const SPEED_FACTOR = 0.08;

export let mapStore: MapStore;
export let playerStore: PlayerStore;

export const runGame: (ms: MapStore, ps: PlayerStore, startTimeInMilliseconds: number, updateInterval: (handler: TimerHandler, timeout?: number) => number) => void = (ms, ps, startTimeInMilliseconds, updateInterval) => {
    mapStore = ms;
    playerStore = ps;
    const game = new Game();
    updateInterval(game.update, FRAME_LENGTH);
};
