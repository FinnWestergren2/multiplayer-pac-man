import p5 from "p5";
import { Player } from "./Player";
import { randomSingleDir } from "../GameMap/Direction";

export class RandomAi extends Player {
    public constructor(initX: number, initY: number) {
        super(initX, initY);
        this.updateState = () => {
            if (this.moveTowardsTarget()) {
                this.receiveInput(randomSingleDir()); // continue the way you were going
            }
        };
    }
}
