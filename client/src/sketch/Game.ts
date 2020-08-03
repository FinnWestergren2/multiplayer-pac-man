import Cell from "./GameMap/Cell";
import p5 from "p5";
import { MapStore, PlayerStore } from "../containers/GameWrapper";
import { Player } from "./Player/Player";
import { Directions } from "shared";
import { sendPlayerInput } from "../socket/clientExtensions";

export default class Game {
	private cells: Cell[][] = [];
	private players: Player[] = [];
	private playerList: string[] = [];
	public constructor(p: p5) {
		MapStore.subscribe(() => this.initializeMap(p));
		PlayerStore.subscribe(() => {
			const previousPlayerList = [...this.playerList];
			this.playerList = PlayerStore.getState().playerList;
			if (JSON.stringify(previousPlayerList) !== JSON.stringify(this.playerList)) {
				this.initializePlayers(p);
			}
		})
	}

	private initializeMap = (p: p5) => {
		const mapCells = MapStore.getState().mapCells;
		this.cells = mapCells.map((row: Directions[], y: number) =>
			row.map((column: Directions, x) =>
				new Cell(column, x, y)
			)
		);
	};

	private initializePlayers = (p: p5) => {
		this.players = PlayerStore.getState().playerList.map(pId => new Player(0, 0, pId));
		this.bindHumanPlayer(p, this.players.find(player => player.id === PlayerStore.getState().currentPlayer!)!);
	}

	public draw = (p: p5) => {
		this.cells.forEach(row => row.forEach(cell => cell.draw(p)));
		this.players.forEach(pl => pl.draw(p));
	};

	public update = () => {
		this.players.forEach(p => {
			p.updateState();
		});
	};

	private bindHumanPlayer = (p: p5, player: Player) => {
		p.keyPressed = function (): void {
			if (p.keyCode === p.RIGHT_ARROW) {
				player.receiveInput(Directions.RIGHT);
				sendPlayerInput(player.id, Directions.RIGHT);
			}
			if (p.keyCode === p.LEFT_ARROW) {
				player.receiveInput(Directions.LEFT);
				sendPlayerInput(player.id, Directions.LEFT);
			}
			if (p.keyCode === p.UP_ARROW) {
				player.receiveInput(Directions.UP);
				sendPlayerInput(player.id, Directions.UP);
			}
			if (p.keyCode === p.DOWN_ARROW) {
				player.receiveInput(Directions.DOWN);
				sendPlayerInput(player.id, Directions.DOWN);
			}
		};
	};
};
