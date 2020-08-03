import Game from "./Game";
import { MapStore, PlayerStore } from "../Types/ReduxTypes";

export default (mapStore: MapStore, playerStore: PlayerStore) => {
    const game = new Game(mapStore, playerStore);
    while (true) {
        game.update();
    }
};
