import { ReduxStore } from "../types/redux";
import { updateActors } from "./actorUpdater";
import { getAverageFrameLength, updateFrameManager } from "./frameManager";

export const IDEAL_FRAME_LENGTH = 16;
export const CELLS_PER_MILLISECOND = 0.005;

export let store: ReduxStore

export const runGame: (_store: ReduxStore, updateInterval: (handler: TimerHandler, timeout?: number) => number) => void = (_store, updateInterval) => {
    store = _store;
    updateInterval(update, IDEAL_FRAME_LENGTH);
};

export const getUpdateFrequency = () => 1 / getAverageFrameLength();

const update = () => {
    updateFrameManager();
    updateActors();
}