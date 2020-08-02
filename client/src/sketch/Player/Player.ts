import p5 from "p5";
import { MapStore, PlayerStore } from "../../containers/GameWrapper";
import { toLocationCoords, getCellType, toGridCoords } from "../GameMap/CoordPairUtils";
import { CoordPair, CoordPairUtils, Directions, DirectionsUtils, updatePlayerStatus, PlayerStatusMap, PlayerStatus } from "shared";

const SPEED_FACTOR = 0.035;
const SIZE_FACTOR = 0.9;

export class Player {
    private initialPos: CoordPair;
    private location: CoordPair = { ...CoordPairUtils.zeroPair };
    private velocity: CoordPair = { ...CoordPairUtils.zeroPair };
    private size = 0;
    private speed = 0;
    private currentDirection: Directions = Directions.NONE;
    private nextDirection: Directions = Directions.NONE;
    public id: string;

    public constructor(initX: number, initY: number, id: string) {
        console.log('init');
        this.initialPos = { x: initX, y: initY };
        const { cellSize, halfCellSize } = MapStore.getState().cellDimensions;
        this.size = SIZE_FACTOR * cellSize;
        this.speed = cellSize * SPEED_FACTOR;
        this.location = { x: cellSize * this.initialPos.x + halfCellSize, y: cellSize * this.initialPos.y + halfCellSize };
        this.velocity = { ...CoordPairUtils.zeroPair };
        this.currentDirection = Directions.NONE;
        this.nextDirection = Directions.NONE;
        this.id = id;
    }

    public draw: (p: p5) => void = p => {
        p.push();
        p.translate(this.location.x, this.location.y);
        p.fill(255, 0, 0);
        p.ellipse(0, 0, this.size);
        p.pop();
        // this.drawDebugInfo(p);
    };

    public receiveInput(dir: Directions) {
        const allowImediateOverride = 
            (DirectionsUtils.isDown(dir) && this.canMoveDown() && (DirectionsUtils.isUp(this.currentDirection) || this.notMoving()))  ||
            (DirectionsUtils.isUp(dir) && this.canMoveUp() && (DirectionsUtils.isDown(this.currentDirection) || this.notMoving()))||
            (DirectionsUtils.isLeft(dir) && this.canMoveLeft() && (DirectionsUtils.isRight(this.currentDirection) || this.notMoving()))||
            (DirectionsUtils.isRight(dir) && this.canMoveRight() && (DirectionsUtils.isLeft(this.currentDirection) || this.notMoving()));
        if (allowImediateOverride) {
            this.currentDirection = dir;
            this.nextDirection = Directions.NONE;
            return;
        }
        const allowQueueDirection = 
            (DirectionsUtils.isDown(dir) && DirectionsUtils.isDown(this.targetCellType())) ||
            (DirectionsUtils.isUp(dir) && DirectionsUtils.isUp(this.targetCellType())) ||
            (DirectionsUtils.isRight(dir) && DirectionsUtils.isRight(this.targetCellType())) ||
            (DirectionsUtils.isLeft(dir) && DirectionsUtils.isLeft(this.targetCellType()));
        if (allowQueueDirection) {
            this.nextDirection = dir;
        }
    }

    private drawDebugInfo(p: p5) {
        p.line(this.targetLocation().x, this.targetLocation().y, this.location.x, this.location.y);
        p.push();
        p.translate(this.location.x, this.location.y);
        p.text(this.debugInfo().join("\n"), 0, 20);
        p.pop();
    }

    private debugInfo: () => string[] = () => [
        Object.values(this.location).toString(),
        Object.values(this.targetLocation()).toString(),
        `Right:    ${this.canMoveRight()}`,
        `Left:       ${this.canMoveLeft()}`,
        `Up:        ${this.canMoveUp()}`,
        `Down:   ${this.canMoveDown()}`,
        `CurrentDirection: ${DirectionsUtils.getString(this.currentDirection)}`
    ];

    public updateState = () => {
        this.moveTowardsTarget()
        if (this.isCentered()) {
            if (this.nextDirection !== Directions.NONE) { // take the queued direction
                this.currentDirection = this.nextDirection;
                this.nextDirection = Directions.NONE;
            }
            else {
                this.receiveInput(this.currentDirection); // continue the way you were going
            }
        }
        this.location = CoordPairUtils.addPairs(this.location, this.velocity);
    }

    public getCurrentState: () => PlayerStatus = () => {
        return { location: this.location, direction: this.currentDirection }
    }

    private moveTowardsTarget = () => {
        if (this.currentDirection === Directions.RIGHT && this.canMoveRight()) {
            this.velocity = { x: this.speed, y: 0 };
        }
        if (this.currentDirection === Directions.LEFT && this.canMoveLeft()) {
            this.velocity = { x: -this.speed, y: 0 };
        }
        if (this.currentDirection === Directions.UP && this.canMoveUp()) {
            this.velocity = { x: 0, y: -this.speed };
        }
        if (this.currentDirection === Directions.DOWN && this.canMoveDown()) {
            this.velocity = { x: 0, y: this.speed };
        }
    }

    /*
        returns true if the player has hit the center of the target cell
    */
    public isCentered = () => {
        const target = this.targetLocation();
        const snapX = Math.abs(this.location.x - target.x) < this.speed;
        const snapY = Math.abs(this.location.y - target.y) < this.speed;
        if (snapX) {
            this.velocity.x = 0;
            this.location.x = target.x;
        }
        if (snapY) {
            this.velocity.y = 0;
            this.location.y = target.y;
        }
        if (snapX && snapY) {
            return true;
        }
    } 

    private targetLocation = () => {
        return toLocationCoords(Player.targetCell(this.location, this.currentDirection));
    };

    private canMoveRight = () => DirectionsUtils.isRight(this.currentCellType()) || this.location.x < toLocationCoords(this.currentCell()).x;
    private canMoveLeft = () => DirectionsUtils.isLeft(this.currentCellType()) || this.location.x > toLocationCoords(this.currentCell()).x;
    private canMoveUp = () => DirectionsUtils.isUp(this.currentCellType()) || this.location.y > toLocationCoords(this.currentCell()).y;
    private canMoveDown = () => DirectionsUtils.isDown(this.currentCellType()) || this.location.y < toLocationCoords(this.currentCell()).y;
    private notMoving = () => this.velocity.x === 0 && this.velocity.y === 0;
    private currentCellType = () => getCellType(this.currentCell());
    private targetCellType = () => getCellType(Player.targetCell(this.location, this.currentDirection));
    private currentCell = () => toGridCoords(this.location);

    // maybe this should just be a private method
    static targetCell = (locationCoords: CoordPair,  direction: Directions) => {
        const currentCell = toGridCoords(locationCoords);
        const translation = toLocationCoords(currentCell);
        const targetCell = { ...currentCell };
        const currentCellType = getCellType(currentCell);
        switch (direction) {
            case Directions.UP:
                if (locationCoords.y <= translation.y && DirectionsUtils.isUp(currentCellType)) {
                    targetCell.y--;
                }
                break;
            case Directions.DOWN:
                if (locationCoords.y >= translation.y && DirectionsUtils.isDown(currentCellType)) {
                    targetCell.y++;
                }
                break;
            case Directions.LEFT:
                if (locationCoords.x <= translation.x && DirectionsUtils.isLeft(currentCellType)) {
                    targetCell.x--;
                }
                break;
            case Directions.RIGHT:
                if (locationCoords.x >= translation.x && DirectionsUtils.isRight(currentCellType)) {
                    targetCell.x++;
                }
                break;
        }
        return targetCell;
    }
}
