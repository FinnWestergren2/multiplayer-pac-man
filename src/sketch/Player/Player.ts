import p5 from "p5";
import { GlobalStore } from "../../containers/Game";
import Directions, { isRight, isLeft, isDown, isUp } from "../GameMap/directions";

const SPEED = 2;

export class Player {
    private cellX: number;
    private cellY: number;
    private locationX = 0;
    private locationY = 0;
    private velocityX = 0;
    private velocityY = 0;
    private size = 0;

    public constructor(cellX: number, cellY: number) {
        this.cellX = cellX;
        this.cellY = cellY;
        GlobalStore.subscribe(this.init);
    }

    private init = () => {
        const { cellSize, halfCellSize } = GlobalStore.getState().mapState.cellDimensions;
        this.size = halfCellSize;
        this.locationX = cellSize * this.cellX - halfCellSize;
        this.locationY = cellSize * this.cellY - halfCellSize;
    }

    public draw: (p: p5) => void = p => {
        p.push();
        p.translate(this.locationX, this.locationY);
        p.fill(255, 0, 0);
        p.ellipse(0, 0, this.size);
        p.pop();
        this.move();
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

    private setVelocity = (dx: number, dy: number) => {
        this.velocityX = dx;
        this.velocityY = dy;
    }

    private move = () => {
        if (this.canMoveLeftHorizontally()) {
            this.locationX += this.velocityX;
        }
        if (this.canMoveVertically()) {
            this.locationY += this.velocityY;
        }
    };

    private canMoveLeftHorizontally = () =>
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


