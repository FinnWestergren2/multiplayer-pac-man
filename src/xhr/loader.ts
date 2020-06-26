import Directions from "../sketch/GameMap/Direction";
import $ from "jquery";
import CoordPair from "../sketch/GameMap/CoordPair";

export const loadMap: () => Promise<{mapDirections: Directions[][], startPoints: {cellA: CoordPair; cellB: CoordPair } }> = async () => {
    return await new Promise<{mapDirections: Directions[][], startPoints: {cellA: CoordPair; cellB: CoordPair }}>((resolve: any) => {
        $.getJSON("http://localhost:8080/generateMap", "", resolve);
    });
};

