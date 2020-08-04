
import { Player } from "./Player";
import { MapStore, PlayerStore } from "..";

export default class Game {
	private players: Player[] = [];
	private playerList: string[] = [];
	public constructor(mapStore: MapStore, playerStore: PlayerStore) {
		playerStore.subscribe(() => {
			const previousPlayerList = [...this.playerList];
			this.playerList = playerStore.getState().playerList;
			if (JSON.stringify(previousPlayerList) !== JSON.stringify(this.playerList)) {
				this.initializePlayers(mapStore, playerStore);
			}
		});
	};

	private initializePlayers = (mapStore: MapStore, playerStore: PlayerStore) => {
		this.players = playerStore.getState().playerList.map(pId => new Player(0, 0, pId, mapStore, playerStore));
    };
    
	public update = () => {
		this.players.forEach(p => {
			p.updateState();
		});
	};
};
