import { MapStore, PlayerStore } from "..";
export default class Game {
    private players;
    private playerList;
    constructor(mapStore: MapStore, playerStore: PlayerStore);
    private initializePlayers;
    update: () => void;
}
