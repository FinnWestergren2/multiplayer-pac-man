import p5 from "p5";
import { MapStore, GameStore } from "../containers/GameWrapper";
import { Actor, ActorType, Dijkstras, CoordPair, CoordPairUtils, Direction } from "core";
import { bindHumanPlayer } from "./Controls";
import Cell from "./Cell";

const SIZE_FACTOR = 0.7;

export default class Game {
	private champSize: number = 0;
	private currentPlayer?: string;
	private selectedActor?: string;

	private mapGraphicsContext: p5.Graphics;

	public constructor(p: p5) {
		this.mapGraphicsContext = p.createGraphics(p.width, p.height);
		this.mapGraphicsContext.pixelDensity(1);

		MapStore.subscribe(() => {
			if (this.currentPlayer) {
				bindHumanPlayer(p, this.currentPlayer, (actorId) => { this.selectedActor = actorId }, () => this.selectedActor);
			}
			this.champSize = SIZE_FACTOR * MapStore.getState().cellDimensions.cellSize;
			this.drawMap();
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
		p.image(this.mapGraphicsContext, 0, 0);
		let selectedActorLocation: CoordPair | undefined = undefined;
		const actorDrawStack: (() => void)[] = [];
		Object.values(GameStore.getState().actorDict).forEach(actor => {
			if (actor.id === this.selectedActor) {
				selectedActorLocation = actor.status.location;
			}
			actorDrawStack.push(() => this.drawActor(p, actor));
		});
		
		if (MapStore.getState().mapCells.length > 0) {
			const oneOverCellSize = MapStore.getState().cellDimensions.oneOverCellSize;
			const mousedOverCell = CoordPairUtils.flooredPair({ x: p.mouseX * oneOverCellSize, y: p.mouseY * oneOverCellSize });
			const withinBounds = mousedOverCell.x >= 0 && mousedOverCell.x < MapStore.getState().mapCells[0].length
				&& mousedOverCell.y >= 0 && mousedOverCell.y < MapStore.getState().mapCells.length; 
			if (mousedOverCell && withinBounds && selectedActorLocation) {
				const { totalDist, path } = Dijkstras(CoordPairUtils.roundedPair(selectedActorLocation), mousedOverCell);
				this.drawPath(p, path, totalDist);
		}}
		actorDrawStack.forEach(d => d());
	};

	private drawActor = (p: p5, actor: Actor) => {
		const location = actor.status.location;
		const cellSize = MapStore.getState().cellDimensions.cellSize;
		const actorSize = actor.type === ActorType.CHAMPION ? this.champSize : this.champSize * 0.66
		const color = `#${actor.ownerId.substr(0, 6)}`;
		p.push();
		p.translate((location.x + 0.5) * cellSize, (location.y + 0.65) * cellSize);
		p.angleMode(p.DEGREES);
		p.rotate(Math.log2(actor.status.direction) * 90); // *chefs kiss*
		this.selectedActor === actor.id ? p.fill(color): p.fill(0);
		p.stroke(color);
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
		const textOffset = 5;
		const cellSize = MapStore.getState().cellDimensions.cellSize;
		const center = (cell: CoordPair) => [cellSize * cell.x + cellSize * 0.5, cellSize * cell.y + cellSize * 0.5]
		p.push();
		this.makeItLookSick(p, () => {
			p.textAlign(p.CENTER);
			p.text(path.length === 0 ? 'X' : totalDist, p.mouseX + textOffset, p.mouseY - textOffset);
			p.noFill()
			p.beginShape();
			p.strokeWeight(2);
			// @ts-ignore
			path.forEach(cell => p.vertex(...center(cell)));
			p.endShape();
		}, 3 * (Math.random() - 0.5) * 0.5)
		p.pop();
	}

	private makeItLookSick = (p: p5, render: () => void, offset: number) => {
		p.blendMode(p.LIGHTEST)
		p.push();
		p.translate(offset, offset);
		p.stroke(255, 100, 100, 150);
		render();
		p.pop();
		p.push();
		p.translate(-offset, -offset);
		p.stroke(100, 255, 100, 150);
		render();
		p.pop();
	}

	private drawMap = () => {
		this.mapGraphicsContext.clear();
		const mapCells = MapStore.getState().mapCells;
		mapCells.map((row: Direction[], y: number) =>
			row.map((column: Direction, x) => new Cell(x, y))
		).flat().forEach(c => c.draw(this.mapGraphicsContext));
	}
};
