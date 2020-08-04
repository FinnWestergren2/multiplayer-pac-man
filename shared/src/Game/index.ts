import Game from "./Game";
import { MapStore, PlayerStore } from "../Types/ReduxTypes";

export let mapStore: MapStore
export let playerStore: PlayerStore

export const runGame: (ms: MapStore, ps: PlayerStore) => void = (ms, ps) => {
    mapStore = ms;
    playerStore = ps;
    const game = new Game();
    window.setInterval(game.update, 10);
};
