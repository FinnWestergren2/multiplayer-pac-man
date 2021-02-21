import p5 from "p5";
import { MapStore, GameStore } from "../containers/GameWrapper";
import { Actor, ActorType, Dijkstras, CoordPair, CoordPairUtils, Direction } from "core";
import { bindHumanPlayer } from "./Controls";

const SIZE_FACTOR = 0.7;

export default class Game {
	private champSize: number = 0;
	private currentPlayer?: string;
	private selectedActor?: string

	public constructor(p: p5) {
		MapStore.subscribe(() => {
			if (this.currentPlayer) {
				bindHumanPlayer(p, this.currentPlayer, (actorId) => { this.selectedActor = actorId }, () => this.selectedActor);
			}
			this.champSize = SIZE_FACTOR * MapStore.getState().cellDimensions.cellSize;
			console.log('from game',MapStore.getState().cellDimensions.cellSize);
		});
		GameStore.subscribe(() => {
			const oldAssignment = this.currentPlayer;
			this.currentPlayer = GameStore.getState().currentPlayer;
			if (this.currentPlayer !== oldAssignment && this.currentPlayer) {
				bindHumanPlayer(p, this.currentPlayer, (actorId) => { this.selectedActor = actorId }, () => this.selectedActor);
			}
		});
	}
	public draw = (p: p5) => {
		let selectedActorLocation: CoordPair | undefined = undefined;
		const drawStack:(() => void)[] = [];
		Object.values(GameStore.getState().actorDict).forEach(actor => {
			if (actor.id === this.selectedActor) {
				selectedActorLocation = actor.status.location;
			}
			drawStack.push(() => this.drawActor(p, actor));
		});
		const cellSize = MapStore.getState().cellDimensions.cellSize;
		const mousedOverCell = CoordPairUtils.flooredPair({ x: p.mouseX / cellSize, y: p.mouseY / cellSize });
		const withinBounds = mousedOverCell.x >= 0 && mousedOverCell.y >= 0 && mousedOverCell.y < MapStore.getState().mapCells.length && mousedOverCell.x < MapStore.getState().mapCells[0].length;
		if (mousedOverCell && withinBounds && selectedActorLocation) {
			const { totalDist, path } = Dijkstras(CoordPairUtils.roundedPair(selectedActorLocation), mousedOverCell);
			this.drawPath(p, path, totalDist);
		}
		drawStack.forEach(d => d());
	};

	private drawActor = (p: p5, actor: Actor) => {
		const location = actor.status.location;
		const { halfCellSize, cellSize } = MapStore.getState().cellDimensions;
		const actorSize = actor.type === ActorType.CHAMPION ? this.champSize : this.champSize * 0.66
		p.push();
		p.translate(location.x * cellSize + halfCellSize, location.y * cellSize + halfCellSize * 1.3);
		p.angleMode(p.DEGREES);
		switch (actor.status.direction) {
			case Direction.UP:
				break;
			case Direction.RIGHT:
				p.rotate(90);
				break;
			case Direction.DOWN:
				p.rotate(180);
				break;
			case Direction.LEFT:
				p.rotate(270);
				break;
		}
		if (this.selectedActor === actor.id) {
			p.strokeWeight(2);
		}
		p.stroke(`#${actor.ownerId.substr(0, 6)}`);
		p.fill(0, 0, 0, 0);
		p.beginShape(p.QUADS);
		p.vertex(0, -actorSize * 0.5); // tip
		p.vertex(actorSize * 0.3, actorSize * 0.3); // rightwing
		p.vertex(0, 0); // nut
		p.vertex(-actorSize * 0.3, actorSize * 0.3); //leftwing
		p.endShape(p.CLOSE);

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
			p.blendMode(p.LIGHTEST)
			if (i < path.length - 1) {
				const b = center(path[i + 1]);
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
