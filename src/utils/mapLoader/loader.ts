import CellTypes from "../../sketch/GameMap/cellTypes";
import $ from "jquery";

export const load: () => Promise<CellTypes[][]> = async () => {
    return await new Promise<CellTypes[][]>((resolve: any) => {
        $.getJSON("http://localhost:8080", "", resolve);
    });
};

