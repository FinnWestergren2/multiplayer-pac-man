import Directions from "../sketch/GameMap/directions";
import $ from "jquery";

export const loadMap: () => Promise<Directions[][]> = async () => {
    return await new Promise<Directions[][]>((resolve: any) => {
        $.getJSON("http://localhost:8080/test1", "", resolve);
    });
};

