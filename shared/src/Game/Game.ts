
import { Player } from "./Player";
import { mapStore, playerStore } from ".";

export default class Game {
	private players: Player[] = [];
	private playerList: string[] = [];
	public constructor() {
		playerStore.subscribe(() => {
			const previousPlayerList = [...this.playerList];
			this.playerList = playerStore.getState().playerList;
			if (JSON.stringify(previousPlayerList) !== JSON.stringify(this.playerList)) {
				this.initializePlayers();
			}
		});
	};

	private initializePlayers = () => {
		this.players = playerStore.getState().playerList.map(pId => new Player(0, 0, pId));
    };
    
	public update = () => {
		this.players.forEach(p => {
			p.updateState();
		});
	};
};
