import { MapStore, PlayerStore } from "../Types/ReduxTypes";
import { updatePlayers } from "./playerUpdater";

const FRAME_LENGTH = 16;

export const UPDATE_FREQUENCY = 1 / FRAME_LENGTH;
export const SPEED_FACTOR = 0.008;

export let mapStore: MapStore;
export let playerStore: PlayerStore;

export const runGame: (ms: MapStore, ps: PlayerStore, updateInterval: (handler: TimerHandler, timeout?: number) => number) => void = (ms, ps, updateInterval) => {
    mapStore = ms;
    playerStore = ps;
    updateInterval(update, FRAME_LENGTH);
};

const update = () => {
    updatePlayers();
}