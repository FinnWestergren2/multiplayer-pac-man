import Cell from "./Cell";
import p5 from "p5";
import { MapStore, PlayerStore } from "../containers/GameWrapper";
import { Directions } from "shared";
import { playerPathInput } from "../utils/clientActions";

const SIZE_FACTOR = 0.9;

export default class Game {
	private cells: Cell[][] = [];
	private playerSize: number = 0;
	private currentPlayer?: string;
	public constructor(p: p5) {
		MapStore.subscribe(() => this.initializeMap(p));
		PlayerStore.subscribe(() => {
			const oldAssignment = this.currentPlayer;
			this.currentPlayer = PlayerStore.getState().currentPlayer;
			if (this.currentPlayer !== oldAssignment && this.currentPlayer) {
				this.bindHumanPlayer(p, this.currentPlayer);
			}
		});
	}

	private initializeMap = (p: p5) => {
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
		PlayerStore.getState().playerList.filter(pl => PlayerStore.getState().playerStatusMap[pl]).forEach(pl => {
			const location = PlayerStore.getState().playerStatusMap[pl].location;
			const { halfCellSize, cellSize } = MapStore.getState().cellDimensions;
			p.push();
			p.translate(location.x * cellSize + halfCellSize, location.y * cellSize + halfCellSize);
			(pl === this.currentPlayer) ? p.fill(0, 0, 255) : p.fill(255, 0, 0);
			p.ellipse(0, 0, this.playerSize);
			p.pop();
		});
	};

	private bindHumanPlayer = (p: p5, playerId: string) => {
		const oneOverCellSize = 1 / MapStore.getState().cellDimensions.cellSize;
		const cells = MapStore.getState().mapCells;
		const max_y = cells.length, max_x = cells[0].length;
		p.mouseClicked = (e: any) => { 
			const element = document.getElementById("app-p5_container");
			if (!element){
				return;
			}
			const xDest = Math.floor((e.clientX - element.offsetLeft + document.documentElement.scrollLeft) * oneOverCellSize);
			const yDest = Math.floor((e.clientY - element.offsetTop + document.documentElement.scrollTop) * oneOverCellSize);
			if (xDest >= 0 && yDest >= 0 && xDest < max_x && yDest < max_y) {
				playerPathInput(playerId, {x: xDest, y: yDest})
			}
		}
	};
};
