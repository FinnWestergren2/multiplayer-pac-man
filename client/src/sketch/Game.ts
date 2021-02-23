import p5 from "p5";
import { Store } from "../containers/GameWrapper";
import { Actor, ActorType, Dijkstras, CoordPair, CoordPairUtils, Direction } from "core";
import { bindHumanPlayer } from "./Controls";
import Cell from "./Cell";

const SIZE_FACTOR = 0.7;

export default class Game {
	private champSize: number = 0;
	private currentPlayer?: string;
	private selectedActorId?: string;

	private mapGraphicsContext: p5.Graphics;

	public constructor(p: p5) {
		this.mapGraphicsContext = p.createGraphics(p.width, p.height);
		this.mapGraphicsContext.pixelDensity(1);

		Store.subscribe(() => {
			if (this.currentPlayer) {
				bindHumanPlayer(p, this.currentPlayer, (actorId) => { this.selectedActorId = actorId }, () => this.selectedActorId);
			}
			this.champSize = SIZE_FACTOR * Store.getState().mapState.cellDimensions.cellSize;
			this.drawMap();
		});

		Store.subscribe(() => {
			const oldAssignment = this.currentPlayer;
			this.currentPlayer = Store.getState().actorState.currentPlayer;
			if (this.currentPlayer !== oldAssignment && this.currentPlayer) {
				bindHumanPlayer(p, this.currentPlayer, (actorId) => { this.selectedActorId = actorId }, () => this.selectedActorId);
			}
		});
	}
	public draw = (p: p5) => {
		p.image(this.mapGraphicsContext, 0, 0);
		let pathOrigin: CoordPair | undefined = undefined;
		const selectedActor = this.selectedActorId ? Store.getState().actorState.actorDict[this.selectedActorId] : undefined;
		if (selectedActor && selectedActor.ownerId === Store.getState().actorState.currentPlayer) {
			pathOrigin = selectedActor.status.location;
		}
		if (Store.getState().mapState.mapCells.length > 0 && pathOrigin) {
			const oneOverCellSize = Store.getState().mapState.cellDimensions.oneOverCellSize;
			const mousedOverCell = CoordPairUtils.flooredPair({ x: p.mouseX * oneOverCellSize, y: p.mouseY * oneOverCellSize });
			const withinBounds = mousedOverCell.x >= 0 && mousedOverCell.x < Store.getState().mapState.mapCells[0].length
				&& mousedOverCell.y >= 0 && mousedOverCell.y < Store.getState().mapState.mapCells.length;
			if (mousedOverCell && withinBounds) {
				const { totalDist, path } = Dijkstras(CoordPairUtils.roundedPair(pathOrigin), mousedOverCell);
				this.drawPath(p, path, totalDist);
			}
		}
		Object.values(Store.getState().actorState.actorDict)
		.sort((a) => {
			if (a.id === this.selectedActorId) {
				return 2;
			}
			if (a.ownerId === Store.getState().actorState.currentPlayer) {
				return 1;
			}
			return 0;
		})
		.forEach(actor => this.drawActor(p, actor));
	};

	private drawActor = (p: p5, actor: Actor) => {
		const location = actor.status.location;
		const cellSize = Store.getState().mapState.cellDimensions.cellSize;
		const actorSize = actor.type === ActorType.CHAMPION ? this.champSize : this.champSize * 0.66
		const color = `#${actor.ownerId.substr(0, 6)}`;
		p.push();
		p.translate((location.x + 0.5) * cellSize, (location.y + 0.65) * cellSize);
		p.angleMode(p.DEGREES);
		p.rotate(Math.log2(actor.status.direction) * 90); // *chefs kiss*
		this.selectedActorId === actor.id ? p.fill(color) : p.fill(0);
		p.stroke(color);
		p.beginShape(p.QUADS);
		p.vertex(0, -actorSize * 0.5); // tip
		p.vertex(actorSize * 0.3, actorSize * 0.3); // rightwing
		p.vertex(0, 0); // nut
		p.vertex(-actorSize * 0.3, actorSize * 0.3); //leftwing
		p.endShape(p.CLOSE);
		p.pop();
	};

	private drawPath = (p: p5, path: CoordPair[], totalDist: number) => {
		const textOffset = 5;
		const cellSize = Store.getState().mapState.cellDimensions.cellSize;
		const center = (cell: CoordPair) => [cellSize * cell.x + cellSize * 0.5, cellSize * cell.y + cellSize * 0.5]
		this.makeItLookSick(p, () => {
			p.textAlign(p.CENTER);
			p.text(path.length === 0 ? 'X' : totalDist, p.mouseX + textOffset, p.mouseY - textOffset);
			p.beginShape();
			// @ts-ignore
			path.forEach(cell => p.vertex(...center(cell)));
			p.endShape();
		})
	}

	private sicknessOffset = 0;

	private makeItLookSick = (p: p5, render: () => void) => {
		if (p.frameCount % 4 === 0) {
			this.sicknessOffset = 2 * (Math.random() - 0.5)
		}
		p.push();
		p.noFill()
		p.strokeWeight(2);
		p.blendMode(p.LIGHTEST)
		p.translate(this.sicknessOffset, this.sicknessOffset);
		p.stroke(255, 100, 100, 150);
		render();
		p.translate(-this.sicknessOffset, -this.sicknessOffset);
		p.stroke(0, 255, 100, 150);
		render();
		p.pop();
	}

	private drawMap = () => {
		this.mapGraphicsContext.clear();
		const mapCells = Store.getState().mapState.mapCells;
		mapCells.map((row: Direction[], y: number) =>
			row.map((column: Direction, x) => new Cell(x, y))
		).flat().forEach(c => c.draw(this.mapGraphicsContext));
	}
};
