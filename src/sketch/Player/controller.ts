import p5 from "p5";
import { Player } from "./Player";
import Directions from "../GameMap/directions";

export const bindHumanPlayer = (p: p5, player: Player) => {
    p.keyPressed = function (): void {
        if (p.keyCode === p.RIGHT_ARROW) {
            player.receiveInput(Directions.RIGHT)
        }
        if (p.keyCode === p.LEFT_ARROW) {
            player.receiveInput(Directions.LEFT)
        }
        if (p.keyCode === p.UP_ARROW) {
            player.receiveInput(Directions.UP)
        }
        if (p.keyCode === p.DOWN_ARROW) {
            player.receiveInput(Directions.DOWN)
        }
    };
};
