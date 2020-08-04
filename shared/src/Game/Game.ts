
import { Player } from "./Player";
import { playerStore } from ".";

export default class Game {
	private players: { [key: string]: Player } = {};
	private playerIdList: string[] = [];
	private currentFrame: number
	public constructor(currentFrame: number) {
		this.currentFrame = currentFrame;
		playerStore.subscribe(() => {
			const previousPlayerList = [...this.playerIdList];
			this.playerIdList = playerStore.getState().playerList;
			if (JSON.stringify(previousPlayerList) !== JSON.stringify(this.playerIdList)) {
				this.initializePlayers();
			}
		});
	};

	private initializePlayers = () => {
		Object.keys(this.players).forEach(key => {
			if (!this.playerIdList.includes(key)) {
				delete this.players[key];
			}
		})
		this.playerIdList.filter(pId => !this.players[pId]).forEach(pId => {
			this.players[pId] = new Player(pId);
		})
	};

	public update = () => {
		Object.keys(this.players).forEach(key => {
			this.players[key].updateState();
		});
		this.currentFrame++;
	};
};
