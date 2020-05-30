import p5 from "p5";
import { Player } from "./Player";
import Directions from "../GameMap/directions";

export const bindHumanPlayers = (p: p5, players: Player[]) => {
    p.keyPressed = function (): void {
        if (p.keyCode === p.RIGHT_ARROW) {
            players.forEach(pl => pl.receiveInput(Directions.RIGHT));
        }
        if (p.keyCode === p.LEFT_ARROW) {
            players.forEach(pl => pl.receiveInput(Directions.LEFT));
        }
        if (p.keyCode === p.UP_ARROW) {
            players.forEach(pl => pl.receiveInput(Directions.UP));
        }
        if (p.keyCode === p.DOWN_ARROW) {
            players.forEach(pl => pl.receiveInput(Directions.DOWN));
        }
    };
};
