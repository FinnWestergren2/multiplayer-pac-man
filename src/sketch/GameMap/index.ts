import Cell from "./Cell";
import CellTypes from "./cellTypes";
import p5 from "p5";
import { GlobalStore } from "../../containers/Game";
import { refreshMap } from "../../ducks/mapState";

export default class GameMap {
    private cells: Cell[][] =[];
    public constructor(){
        //@ts-ignore
        GlobalStore.dispatch(refreshMap());
        GlobalStore.subscribe(this.init);
    }

    private init = () => {
        const mapCells = GlobalStore.getState().mapState.mapCells;
        const { cellSize, halfCellSize } = GlobalStore.getState().mapState.cellDimensions;
		this.cells = mapCells.map((row: CellTypes[], y: number) =>
			row.map((column: CellTypes, x) => 
				new Cell(column, halfCellSize + x*cellSize, halfCellSize + y*cellSize, cellSize)
			)
		);
    }


    public draw = (p: p5) => {
        this.cells.forEach(row => row.forEach(cell => cell.draw(p)));
    }
}
