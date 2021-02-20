import Cell from "./Cell";
import p5 from "p5";
import { MapStore, GameStore } from "../containers/GameWrapper";
import { Actor, ActorType, Dijkstras, CoordPair, CoordPairUtils, Direction, junctionSelector, MapNode } from "core";
import { bindHumanPlayer } from "./Controls";

const SIZE_FACTOR = 0.9;

export default class Game {
	private cells: Cell[][] = [];
	private champSize: number = 0;
	private currentPlayer?: string;
	private selectedActor?: string

	public constructor(p: p5) {
		MapStore.subscribe(() => {
			if (this.currentPlayer) {
				bindHumanPlayer(p, this.currentPlayer, (actorId) => { this.selectedActor = actorId }, () => this.selectedActor);
			}
			this.initializeMap()
		});
		GameStore.subscribe(() => {
			const oldAssignment = this.currentPlayer;
			this.currentPlayer = GameStore.getState().currentPlayer;
			if (this.currentPlayer !== oldAssignment && this.currentPlayer) {
				bindHumanPlayer(p, this.currentPlayer, (actorId) => { this.selectedActor = actorId }, () => this.selectedActor);
			}
		});
	}

	private initializeMap = () => {
		this.champSize = SIZE_FACTOR * MapStore.getState().cellDimensions.cellSize
		const mapCells = MapStore.getState().mapCells;
		this.cells = mapCells.map((row: Direction[], y: number) =>
			row.map((column: Direction, x) => new Cell(x, y))
		);
	};

	public draw = (p: p5) => {
		this.cells.forEach(row => row.forEach(cell => cell.draw(p)));
		let selectedActorLocation: CoordPair | undefined = undefined;
		const drawStack:(() => void)[] = [];
		Object.values(GameStore.getState().actorDict).forEach(actor => {
			if (actor.id === this.selectedActor) {
				selectedActorLocation = actor.status.location;
			}
			drawStack.push(() => this.drawActor(p, actor));
		});
		const mousedOverCell = this.cells.flat().find(c => c.withinBounds(p.mouseX, p.mouseY))
		if (mousedOverCell && selectedActorLocation) {
			const { totalDist, path } = Dijkstras(CoordPairUtils.roundedPair(selectedActorLocation), mousedOverCell.gridCoords);
			this.drawPath(p, path, totalDist);
		}
		drawStack.forEach(d => d());
	};

	private drawActor = (p: p5, actor: Actor) => {
		const location = actor.status.location;
		const { halfCellSize, cellSize } = MapStore.getState().cellDimensions;
		p.push();
		p.translate(location.x * cellSize + halfCellSize, location.y * cellSize + halfCellSize);
		p.noStroke();
		p.fill(`#${actor.ownerId.substr(0, 6)}`); // arbitrary color just to keep track. eventually we should add preset colors
		const actorSize = actor.type === ActorType.CHAMPION ? this.champSize : this.champSize * 0.66
		p.ellipse(0, 0, actorSize);
		if (this.selectedActor === actor.id) {
			p.push();
			p.strokeWeight(3);
			p.stroke(255); // arbitrary color just to keep track. eventually we should add preset colors
			p.noFill();
			p.ellipse(0, 0, actorSize - 7);
			p.pop();
		}
		this.drawPlayerId(p, actor.ownerId);
		p.pop();
	};

	private drawPlayerId = (p: p5, playerId: string) => {
		const factor = 0.28;
		p.fill(255);
		p.rect(-factor * (this.champSize), -0.18 * (this.champSize), factor * 2 * (this.champSize), 0.2 * (this.champSize));
		p.fill(0);
		p.textAlign(p.CENTER);
		p.textSize(14);
		p.text(playerId.substr(0, 4), 0, 0);
	};

	private drawPath = (p: p5, path: CoordPair[], totalDist: number) => {
		const strokeweight = 3;
		const offset = strokeweight * (Math.random() - 0.5) * 0.5;
		const cellSize = MapStore.getState().cellDimensions.cellSize;
		const center = (cell: CoordPair) => { return { x: cellSize * cell.x + cellSize * 0.5 , y: cellSize * cell.y + cellSize * 0.5 } }
		p.push();
		path.forEach((cell, i) => {
			const a = center(cell);
			if (i < path.length - 1) {
				const b = center(path[i + 1]);
				p.blendMode(p.LIGHTEST)
				p.strokeWeight(strokeweight);
				p.stroke(255, 100, 100, 150);
				p.line(a.x - offset, a.y - offset, b.x - offset, b.y - offset);
				p.stroke(100, 255, 100, 150);
				p.line(a.x + offset, a.y + offset, b.x + offset, b.y + offset);
			}
			else {
				p.strokeWeight(1);
				p.textAlign(p.CENTER);
				p.stroke(255, 100, 100, 150);
				p.text(totalDist, a.x + 10 - offset, a.y - 10 - offset);
				p.stroke(100, 255, 100, 150);
				p.text(totalDist, a.x + 10 + offset, a.y - 10 + offset);
			}		
		});
		p.pop();
	}
};
