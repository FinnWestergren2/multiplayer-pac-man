import p5 from "p5";
import { CoordPair } from "core";
import { MapStore } from "../containers/GameWrapper";
import { playerPathInput } from "../utils/clientActions";

export const bindHumanPlayer = (p: p5, playerId: string) => {
    const oneOverCellSize = 1 / MapStore.getState().cellDimensions.cellSize;
    const cells = MapStore.getState().mapCells;
    const max_y = cells.length, max_x = cells[0].length;
    
    const setPath = (mouse: CoordPair) => {
        const element = document.getElementById("app-p5_container");
        if (!element){
            return;
        }
        const xDest = Math.floor((mouse.x - element.offsetLeft + document.documentElement.scrollLeft) * oneOverCellSize);
        const yDest = Math.floor((mouse.y - element.offsetTop + document.documentElement.scrollTop) * oneOverCellSize);
        if (xDest >= 0 && yDest >= 0 && xDest < max_x && yDest < max_y) {
            playerPathInput(playerId, {x: xDest, y: yDest})
        }
    }

    p.mouseClicked = (e: any) => { 
        const mouse = {x: e.clientX, y: e.clientY} // can't use p.mouse because of scrolling / changing screen sizes
        if (p.keyIsDown(p.CONTROL)) {
            setPath(mouse);
        }
    }
};
