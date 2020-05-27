import Cell from "./Cell";
import Directions from "./directions";
import p5 from "p5";
import { GlobalStore } from "../../containers/Game";
import { refreshMap } from "../../ducks/mapState";

export default class GameMap {
    private cells: Cell[][] =[];
    private shouldReDraw: boolean = false;
    public constructor(){
        //@ts-ignore
        GlobalStore.dispatch(refreshMap());
        GlobalStore.subscribe(this.updateCells);
    }

    private updateCells = () => {
        const mapCells = GlobalStore.getState().mapState.mapCells;
        const { cellSize, halfCellSize } = GlobalStore.getState().mapState.cellDimensions;
		this.cells = mapCells.map((row: Directions[], y: number) =>
			row.map((column: Directions, x) => 
				new Cell(column, halfCellSize + x * cellSize, halfCellSize + y * cellSize)
			)
        );
        this.shouldReDraw = true;        
    }


    public draw = (p: p5) => {
        // if (this.shouldReDraw) { // performance optimization (may be unnecessary)
            this.cells.forEach(row => row.forEach(cell => cell.draw(p)));
            this.shouldReDraw = false;
        //}
    }
}
