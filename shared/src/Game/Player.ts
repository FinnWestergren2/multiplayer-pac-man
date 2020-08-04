import { CoordPair, Directions, CoordPairUtils, DirectionsUtils, PlayerStatus} from "../Types";
import { updatePlayerStatus } from "../ducks/playerState";
import { mapStore, playerStore } from ".";
const SPEED_FACTOR = 0.08;

export class Player {
    private location: CoordPair;
    private velocity: CoordPair = { ...CoordPairUtils.zeroPair };
    private speed: number;
    private currentDirection: Directions = Directions.NONE;
    private nextDirection: Directions = Directions.NONE;
    private mostRecentUpdate: number = 0;
    public id: string;

    public constructor(id: string) {
        console.log('psm', playerStore.getState().playerStatusMap);
        console.log('cellSize', mapStore.getState().cellDimensions.cellSize);
        const { cellSize, halfCellSize } = mapStore.getState().cellDimensions;
        this.speed = cellSize * SPEED_FACTOR;
        this.velocity = { ...CoordPairUtils.zeroPair };
        this.currentDirection = playerStore.getState().playerStatusMap[id]?.direction ?? Directions.NONE;
        this.nextDirection = playerStore.getState().playerStatusMap[id]?.nextDirection ?? Directions.NONE;
        this.id = id;
        this.location = playerStore.getState().playerStatusMap[id]?.location ??  { x: halfCellSize, y: halfCellSize }
        playerStore.subscribe(() => {
            const previousUpdate = this.mostRecentUpdate;
            const myInputHistory = playerStore.getState().playerInputHistory[id];
            this.mostRecentUpdate = myInputHistory ? myInputHistory[myInputHistory.length-1].frame : 0;
            if (previousUpdate !== this.mostRecentUpdate){
                this.receiveInput(myInputHistory[myInputHistory.length-1].direction);
            }
        })
    }

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
        // @ts-ignore
        playerStore.dispatch(updatePlayerStatus(this.id, { location: this.location, direction: this.currentDirection, nextDirection: this.nextDirection }));
    };

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
    };

    // returns true if the player has hit the center of the target cell
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
    };

    private targetLocation = () => {
        return this.toLocationCoords(this.targetCell(this.location, this.currentDirection));
    };

    private canMoveRight = () => DirectionsUtils.isRight(this.currentCellType()) || this.location.x < this.toLocationCoords(this.currentCell()).x;
    private canMoveLeft = () => DirectionsUtils.isLeft(this.currentCellType()) || this.location.x > this.toLocationCoords(this.currentCell()).x;
    private canMoveUp = () => DirectionsUtils.isUp(this.currentCellType()) || this.location.y > this.toLocationCoords(this.currentCell()).y;
    private canMoveDown = () => DirectionsUtils.isDown(this.currentCellType()) || this.location.y < this.toLocationCoords(this.currentCell()).y;
    private notMoving = () => this.velocity.x === 0 && this.velocity.y === 0;
    private currentCellType = () => this.getCellType(this.currentCell());
    private targetCellType = () => this.getCellType(this.targetCell(this.location, this.currentDirection));
    private currentCell = () => this.toGridCoords(this.location);

    private targetCell = (locationCoords: CoordPair,  direction: Directions) => {
        const currentCell = this.toGridCoords(locationCoords);
        const translation = this.toLocationCoords(currentCell);
        const targetCell = { ...currentCell };
        const currentCellType = this.getCellType(currentCell);
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
        
    // these methods could get moved to reselect if we want a performance boost
    private getCellType = (gridCoords: CoordPair) => {
        try {
            return mapStore.getState().mapCells[gridCoords.y][gridCoords.x];
        } catch (error) {
            return Directions.NONE;
        }
    };

    // returns the absolute center of a cell
    private toLocationCoords = (gridCoords: CoordPair) => {
        const halfCellSize = mapStore.getState().cellDimensions.halfCellSize;
        return {
            x: (gridCoords.x) * (halfCellSize * 2) + halfCellSize,
            y: (gridCoords.y) * (halfCellSize * 2) + halfCellSize
        };
    };

    // definitely the most expensive method, memoize this first
    private toGridCoords: (locationCoords: CoordPair) => CoordPair = (locationCoords) => {
        const factor = 1 / mapStore.getState().cellDimensions.cellSize;
        return { x: Math.floor(locationCoords.x * factor), y: Math.floor(locationCoords.y * factor) };
    };
}
