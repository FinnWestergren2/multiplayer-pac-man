import { MapStore, PlayerStore } from "../Types/ReduxTypes";
export declare const UPDATE_FREQUENCY: number;
export declare const SPEED_FACTOR = 0.08;
export declare let mapStore: MapStore;
export declare let playerStore: PlayerStore;
export declare const runGame: (ms: MapStore, ps: PlayerStore, updateInterval: (handler: TimerHandler, timeout?: number) => number) => void;
