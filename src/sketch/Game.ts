import Cell from "./GameMap/Cell";
import Directions, { randomSingleDir } from "./GameMap/Direction";
import p5 from "p5";
import { GlobalStore } from "../containers/GameWrapper";
import { refreshMap } from "../ducks/mapState";
import { Player } from "./Player/Player";

export default class Game {
    private cells: Cell[][] =[];
    private players: Player[] = [];
    public constructor(p: p5){
		// @ts-ignore
		GlobalStore.dispatch(refreshMap());
        GlobalStore.subscribe(() => this.initialize(p));
    }

    private initialize = (p: p5) => {
        const mapCells = GlobalStore.getState().mapState.mapCells;
		this.cells = mapCells.map((row: Directions[], y: number) =>
			row.map((column: Directions, x) => 
				new Cell(column, x, y)
			)
        );
		const { cellA, cellB } = GlobalStore.getState().mapState.playerLocations;
		this.players = [new Player(cellA.x, cellA.y), new Player(cellB.x, cellB.y)];
		this.bindHumanPlayer(p, this.players[0]);
    }


    public draw = (p: p5) => {
        this.cells.forEach(row => row.forEach(cell => cell.draw(p)));
		this.players.forEach(pl => pl.draw(p));
    }

    public update = (frame: number) => {
		if (this.players[1] && this.players[1].isCentered()){
			this.players[1].receiveInput(randomSingleDir());
		}
        const shouldRollback: boolean = false;
		this.players.forEach(p => p.updateState(frame, shouldRollback));
    }

	private bindHumanPlayer = (p: p5, player: Player) => {
		p.keyPressed = function (): void {
			if (p.keyCode === p.RIGHT_ARROW) {
				player.receiveInput(Directions.RIGHT);
			}
			if (p.keyCode === p.LEFT_ARROW) {
				player.receiveInput(Directions.LEFT);
			}
			if (p.keyCode === p.UP_ARROW) {
				player.receiveInput(Directions.UP);
			}
			if (p.keyCode === p.DOWN_ARROW) {
				player.receiveInput(Directions.DOWN);
			}
		};
	};
}
