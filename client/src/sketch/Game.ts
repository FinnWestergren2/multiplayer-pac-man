import Cell from "./Cell";
import p5 from "p5";
import { MapStore, PlayerStore } from "../containers/GameWrapper";
import { Directions, addPlayerInput, BFS, updatePlayerPath } from "shared";
import { sendPlayerInput } from "../socket/clientExtensions";

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
		p.keyPressed = function (): void {
			if (p.keyCode === p.RIGHT_ARROW) {
				// @ts-ignore
				PlayerStore.dispatch(addPlayerInput(playerId, { frame: (new Date()).getTime(), direction: Directions.RIGHT }));
				sendPlayerInput(playerId, Directions.RIGHT);
			}
			if (p.keyCode === p.LEFT_ARROW) {
				// @ts-ignore
				PlayerStore.dispatch(addPlayerInput(playerId, { frame: (new Date()).getTime(), direction: Directions.LEFT }));
				sendPlayerInput(playerId, Directions.LEFT);
			}
			if (p.keyCode === p.UP_ARROW) {
				// @ts-ignore
				PlayerStore.dispatch(addPlayerInput(playerId, { frame: (new Date()).getTime(), direction: Directions.UP }));
				sendPlayerInput(playerId, Directions.UP);
			}
			if (p.keyCode === p.DOWN_ARROW) {
				// @ts-ignore
				PlayerStore.dispatch(addPlayerInput(playerId, { frame: (new Date()).getTime(), direction: Directions.DOWN }));
				sendPlayerInput(playerId, Directions.DOWN);
			}
		};
		const oneOverCellSize = 1 / MapStore.getState().cellDimensions.cellSize;
		p.mouseClicked = (e: any) => { 
			const element = document.getElementById("app-p5_container");
			if (!element || !PlayerStore.getState().playerStatusMap[playerId]){
				return;
			}
			const xDest = Math.floor((e.clientX - element.offsetLeft + document.documentElement.scrollLeft) * oneOverCellSize);
			const yDest = Math.floor((e.clientY - element.offsetTop + document.documentElement.scrollTop) * oneOverCellSize);
			const start = PlayerStore.getState().playerStatusMap[playerId].location;
			const end = { x: xDest, y: yDest };
			const bfs = BFS(start, end);
			console.log(bfs);
			updatePlayerPath(PlayerStore, playerId, bfs);
		}
	};
};
