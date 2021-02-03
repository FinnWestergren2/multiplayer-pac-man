import p5 from "p5";
import { CoordPair } from "core";
import { GameStore, MapStore } from "../containers/GameWrapper";
import { moveUnit } from "../utils/clientActions";

const KeyCodeOne = 49;
const KeyCodeTwo = 50;
const KeyCodeThree = 51;

export const bindHumanPlayer = (p: p5, playerId: string) => {
    const oneOverCellSize = 1 / MapStore.getState().cellDimensions.cellSize;
    const cells = MapStore.getState().mapCells;
    const max_y = cells.length, max_x = cells[0].length;
    const actors = GameStore.getState().actorOwnershipDict[playerId];
    
    const setPath = (mouse: CoordPair, actorId: string) => {
        const element = document.getElementById("app-p5_container");
        if (!element) {
            return;
        }
        const xDest = Math.floor((mouse.x - element.offsetLeft + document.documentElement.scrollLeft) * oneOverCellSize);
        const yDest = Math.floor((mouse.y - element.offsetTop + document.documentElement.scrollTop) * oneOverCellSize);
        if (xDest >= 0 && yDest >= 0 && xDest < max_x && yDest < max_y) {
            moveUnit(actorId, {x: xDest, y: yDest})
        }
    }

    p.mouseClicked = (e: any) => { 
        const mouse = {x: e.clientX, y: e.clientY} // can't use p.mouse because of scrolling / changing screen sizes
        if (p.keyIsDown(KeyCodeOne) && actors.length > 0) {
            setPath(mouse, actors[0]);
        }
        if (p.keyIsDown(KeyCodeTwo) && actors.length > 1) {
            setPath(mouse, actors[1]);
        }
        if (p.keyIsDown(KeyCodeThree) && actors.length > 2) {
            setPath(mouse, actors[2]);
        }
        if (p.keyIsDown(p.CONTROL) && actors.length > 0) {
            setPath(mouse, actors[0]);
        }

    }
};
