import p5 from "p5";
import { GlobalStore } from "../../containers/Game";
import Directions, { isRight, isLeft, isDown, isUp } from "../GameMap/directions";

const SPEED = 2;

type coords = {x: number, y:number}

export class Player {
    private initX: number;
    private initY: number;
    private cellX = 0;
    private cellY = 0;
    private locationX = 0;
    private locationY = 0;
    private velocityX = 0;
    private velocityY = 0;
    private size = 0;
    private targetX = 0;
    private targetY = 0;

    public constructor(initX: number, initY: number) {
        this.initX = initX;
        this.initY = initY;
        GlobalStore.subscribe(this.init);
    }

    private init = () => {
        const { cellSize, halfCellSize } = GlobalStore.getState().mapState.cellDimensions;
        this.size = halfCellSize;
        this.cellX = this.initX;
        this.cellY = this.initY;
        this.locationX = cellSize * this.cellX - halfCellSize;
        this.locationY = cellSize * this.cellY - halfCellSize;
        this.velocityX = 0;
        this.velocityY = 0;
    };

    public draw: (p: p5) => void = p => {
        this.locationX += this.velocityX;
        this.locationY += this.velocityY;
        p.push();
        p.translate(this.locationX, this.locationY);
        p.fill(255, 0, 0);
        p.ellipse(0, 0, this.size);
        p.pop();
    };

    public receiveInput(dir: Directions) {
        switch (dir) {
            case (Directions.UP):
                this.setVelocity(0, -SPEED);
                return;
            case (Directions.DOWN):
                this.setVelocity(0, SPEED);
                return;
            case (Directions.LEFT):
                this.setVelocity(-SPEED, 0);
                return;
            case (Directions.RIGHT):
                this.setVelocity(SPEED, 0);
                return;
        }
    }

    private setTarget = (tX: number, tY: number) => {
        this.targetX = tX;
        this.targetY = tY;
    }

    private setVelocity = (dx: number, dy: number) => {
        this.velocityX = dx;
        this.velocityY = dy;
    }

    private canMoveHorizontally = () =>
        this.velocityX > 0
            ? (this.locationX % (this.size * 2) <= this.size || isRight(this.currentCellType()))
            : (this.locationX % (this.size * 2) >= this.size || isLeft(this.currentCellType()));

    private canMoveVertically = () =>
        this.velocityY > 0
            ? (this.locationY % (this.size * 2) <= this.size || isDown(this.currentCellType()))
            : (this.locationY % (this.size * 2) >= this.size || isUp(this.currentCellType()));

    private currentCellType = () => {
        try {
            const cellSize = GlobalStore.getState().mapState.cellDimensions.cellSize
            const x = Math.floor(this.locationX / cellSize);
            const y = Math.floor(this.locationY / cellSize);
            return GlobalStore.getState().mapState.mapCells[y][x];
        } catch (error) {
            return Directions.NONE;
        }
    }
}


