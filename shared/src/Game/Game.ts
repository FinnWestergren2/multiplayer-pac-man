
import { Player } from "./Player";
import { playerStore } from ".";

export default class Game {
	private players: { [key: string]: Player } = {};
	private playerIdList: string[] = [];
	private lastOverrideTime = 0
	public constructor() {
		playerStore.subscribe(() => {
			this.handleUpdatePlayerList();
			this.handleStatusOverride();
		});
	};

	private handleUpdatePlayerList = () => {
		const previousPlayerList = [...this.playerIdList];
		this.playerIdList = playerStore.getState().playerList;
		if (JSON.stringify(previousPlayerList) !== JSON.stringify(this.playerIdList)) {
			this.initializePlayers();
		}
	}

	private handleStatusOverride = () => {
		const previousOverrideTime = this.lastOverrideTime;
		this.lastOverrideTime = playerStore.getState().lastOverrideTime;
		if (this.lastOverrideTime > previousOverrideTime) {
			Object.keys(this.players).filter(id => playerStore.getState().playerStatusMap[id]).forEach(id => {
				this.players[id].setCurrentStatus(playerStore.getState().playerStatusMap[id]);
			})
		}
	}

	private initializePlayers = () => {
		Object.keys(this.players).forEach(id => {
			if (!this.playerIdList.includes(id)) {
				delete this.players[id];
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
	};
};
