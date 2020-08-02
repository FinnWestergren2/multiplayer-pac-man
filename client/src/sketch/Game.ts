import Cell from "./GameMap/Cell";
import p5 from "p5";
import { MapStore, PlayerStore } from "../containers/GameWrapper";
import { Player } from "./Player/Player";
import { Directions } from "shared";
import { sendPlayerInput } from "../socket/clientExtensions";

export default class Game {
	private cells: Cell[][] = [];
	private players: Player[] = [];
	public constructor(p: p5) {
		MapStore.subscribe(() => this.initialize(p));
	}

	private initialize = (p: p5) => {
		const mapCells = MapStore.getState().mapCells;
		this.cells = mapCells.map((row: Directions[], y: number) =>
			row.map((column: Directions, x) =>
				new Cell(column, x, y)
			)
		);
		this.players = [new Player(0, 0, PlayerStore.getState().currentPlayer!)];
		this.bindHumanPlayer(p, this.players[0]);
	};

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
