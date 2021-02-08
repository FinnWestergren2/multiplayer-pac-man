import { MapStore, GameStore } from "../types/redux";
import { updateActors } from "./actorUpdater";
import { getAverageFrameLength, updateFrameManager } from "./frameManager";

export const IDEAL_FRAME_LENGTH = 16;
export const CELLS_PER_MILLISECOND = 0.005;

export let mapStore: MapStore;
export let gameStore: GameStore;

export const runGame: (ms: MapStore, ps: GameStore, updateInterval: (handler: TimerHandler, timeout?: number) => number) => void = (ms, ps, updateInterval) => {
    mapStore = ms;
    gameStore = ps;
    updateInterval(update, IDEAL_FRAME_LENGTH);
};

export const getUpdateFrequency = () => 1 / getAverageFrameLength();

const update = () => {
    updateFrameManager();
    updateActors();
}