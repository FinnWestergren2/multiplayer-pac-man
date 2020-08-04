import Game from "./Game";
import { MapStore, PlayerStore } from "../Types/ReduxTypes";

export const runGame = (mapStore: MapStore, playerStore: PlayerStore) => {
    const game = new Game(mapStore, playerStore);
    window.setInterval(game.update, 10);
};

 