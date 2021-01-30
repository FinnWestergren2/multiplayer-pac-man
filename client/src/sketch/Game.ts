import Cell from "./Cell";
import p5 from "p5";
import { MapStore, GameStore } from "../containers/GameWrapper";
import { ActorType, Directions } from "core";
import { bindHumanPlayer } from "./Controls";

const SIZE_FACTOR = 0.9;

export default class Game {
	private cells: Cell[][] = [];
	private playerSize: number = 0;
	private currentPlayer?: string;
	public constructor(p: p5) {
		MapStore.subscribe(() => this.initializeMap());
		GameStore.subscribe(() => {
			const oldAssignment = this.currentPlayer;
			this.currentPlayer = GameStore.getState().currentPlayer;
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
		GameStore.getState().playerList.filter(player => GameStore.getState().actorOwnershipDict[player]).forEach(player => {
			this.drawPlayer(p, player);
		});
	};

	private drawPlayer = (p: p5, playerId: string) => {
		const actorDict = GameStore.getState().actorDict;
		const actorId = GameStore.getState().actorOwnershipDict[playerId]?.find(aId => actorDict[aId].type === ActorType.CHAMPION);
		if(!actorId) return;
		const location = actorDict[actorId].status.location;
		const { halfCellSize, cellSize } = MapStore.getState().cellDimensions;
		p.push();
		p.translate(location.x * cellSize + halfCellSize, location.y * cellSize + halfCellSize);
		p.noStroke();
		p.fill(`#${playerId.substr(0,6)}`);
		if (playerId === this.currentPlayer) {
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
		p.text(playerId.substr(0,6), 0, 0);
		p.pop();
	}
};
