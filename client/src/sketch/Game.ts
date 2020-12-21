import Cell from "./Cell";
import p5 from "p5";
import { MapStore, PlayerStore } from "../containers/GameWrapper";
import { Directions } from "core";
import { bindHumanPlayer } from "./Controls";

const SIZE_FACTOR = 0.9;

export default class Game {
	private cells: Cell[][] = [];
	private playerSize: number = 0;
	private currentPlayer?: string;
	public constructor(p: p5) {
		MapStore.subscribe(() => this.initializeMap());
		PlayerStore.subscribe(() => {
			const oldAssignment = this.currentPlayer;
			this.currentPlayer = PlayerStore.getState().currentPlayer;
			if (this.currentPlayer !== oldAssignment && this.currentPlayer) {
				bindHumanPlayer(p, this.currentPlayer);
			}
		});
	}

	private initializeMap = () => {
		this.playerSize = SIZE_FACTOR * MapStore.getState().cellDimensions.cellSize
		const mapCells = MapStore.getState().mapCells;
		this.cells = mapCells.map((row: Directions[], y: number) =>
			row.map((column: Directions, x) =>
				new Cell(column, x, y)
			)
		);
	};

	public draw = (p: p5) => {
		this.cells.forEach(row => row.forEach(cell => cell.draw(p)));
		PlayerStore.getState().playerList.filter(player => PlayerStore.getState().objectStatusDict[player]).forEach(player => {
			this.drawPlayer(p, player);
		});
	};

	private drawPlayer = (p: p5, player: string) => {
		const location = PlayerStore.getState().objectStatusDict[player].location;
		const { halfCellSize, cellSize } = MapStore.getState().cellDimensions;
		p.push();
		p.translate(location.x * cellSize + halfCellSize, location.y * cellSize + halfCellSize);
		p.noStroke();
		p.fill(`#${player.substr(0,6)}`);
		if (player === this.currentPlayer){
			p.ellipse(0, 0, this.playerSize);
		}
		else {
			p.rect(-0.5 * (this.playerSize), -0.5 * (this.playerSize), this.playerSize, this.playerSize );
		}
		p.fill(255);
		p.rect(-0.32 * (this.playerSize), -0.18 * (this.playerSize), 0.64 * (this.playerSize), 0.2 * (this.playerSize));
		p.fill(0);
		p.textAlign(p.CENTER);
		p.textSize(14);
		p.text(player.substr(0,6), 0, 0);
		p.pop();
	}
};
