import CellTypes from "./cellTypes";
import $ from "jquery";

export const load: () => Promise<CellTypes[][]> = async () => {
    return await fetchCSV();
};

function fetchCSV() {
    return new Promise<CellTypes[][]>((resolve: any) => {
        $.getJSON("http://localhost:8080", "", resolve);
    });
}
