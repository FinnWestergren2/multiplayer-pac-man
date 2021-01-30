import { MapStore, GameStore } from "../types/ReduxTypes";
import { updateActors } from "./actorUpdater";

const FRAME_LENGTH = 16;

export const UPDATE_FREQUENCY = 1 / FRAME_LENGTH;
export const SPEED_FACTOR = 0.08;

export let mapStore: MapStore;
export let gameStore: GameStore;

export const runGame: (ms: MapStore, ps: GameStore, updateInterval: (handler: TimerHandler, timeout?: number) => number) => void = (ms, ps, updateInterval) => {
    mapStore = ms;
    gameStore = ps;
    updateInterval(update, FRAME_LENGTH);
};

const update = () => {
    updateActors();
}