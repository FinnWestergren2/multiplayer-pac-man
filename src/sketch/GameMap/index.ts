import Cell from "./Cell";
import Directions from "./directions";
import p5 from "p5";
import { GlobalStore } from "../../containers/Game";
import { refreshMap } from "../../ducks/mapState";
import { Player } from "../Player/Player";
import { RandomAi } from "../Player/RandomAI";
import { bindHumanPlayers } from "../Player/controller";

export default class GameMap {
    private cells: Cell[][] =[];
    private players: Player[] = [];
    private p: p5;
    public constructor(p: p5){
        this.p = p;
		// @ts-ignore
		GlobalStore.dispatch(refreshMap());
        GlobalStore.subscribe(this.updateCells);
        GlobalStore.subscribe(this.initializePlayers);
    }

    private updateCells = () => {
        const mapCells = GlobalStore.getState().mapState.mapCells;
		this.cells = mapCells.map((row: Directions[], y: number) =>
			row.map((column: Directions, x) => 
				new Cell(column, x, y)
			)
        );
    }

    private initializePlayers = () => {
		const { cellA, cellB } = GlobalStore.getState().mapState.playerLocations;
		this.players = [new Player(cellA.x, cellA.y), new RandomAi(cellB.x, cellB.y)];
		bindHumanPlayers(this.p, this.players.slice(0,1));
    }


    public draw = () => {
            this.cells.forEach(row => row.forEach(cell => cell.draw(this.p)));
			this.players.forEach(pl => pl.draw(this.p));
    }
}
