import Cell from "./Cell";
import CellTypes from "./cellTypes";
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
		this.cells = mapCells.map((row: CellTypes[], y: number) =>
			row.map((column: CellTypes, x) => 
				new Cell(column, halfCellSize + x*cellSize, halfCellSize + y*cellSize, cellSize)
			)
        );
        this.shouldReDraw = true;        
    }


    public draw = (p: p5) => {
        if (this.shouldReDraw) { // performance optimization (may be unnecessary)
            this.cells.forEach(row => row.forEach(cell => cell.draw(p)));
            this.shouldReDraw = false;
        }
    }
}
