import Directions from "../sketch/GameMap/Direction";
import $ from "jquery";
import { PlayerCoordMap } from "../ducks/sharedTypes";

export const loadMap: () => Promise<{mapDirections: Directions[][], startPoints: PlayerCoordMap }> = async () => {
    return await new Promise<{mapDirections: Directions[][], startPoints: PlayerCoordMap}>((resolve: any) => {
        $.getJSON("http://localhost:8080/generateMap", "", resolve);
    });
};

