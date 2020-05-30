import p5 from "p5";
import { GlobalStore } from "../../containers/Game";
import Directions, { isRight, isLeft, isDown, isUp, getString } from "../GameMap/directions";

const SPEED_FACTOR = 0.07;
type CoordPair = { x: number, y: number }
const zeroPair = { x: 0, y: 0 };
const addPairs = (p1: CoordPair, p2: CoordPair) => {
    return { x: p1.x + p2.x, y: p1.y + p2.y }
}

export class Player {
    private initialPos: CoordPair;
    private location: CoordPair = { ...zeroPair };
    private velocity: CoordPair = { ...zeroPair };
    private size = 0;
    private speed = 0;
    private halfCellSize = 0;
    private currentDirection: Directions = Directions.NONE;
    private nextDirection: Directions = Directions.NONE;

    public constructor(initX: number, initY: number) {
        this.initialPos = { x: initX, y: initY }
        GlobalStore.subscribe(this.initialize);
    }

    private initialize = () => {
        const { cellSize, halfCellSize } = GlobalStore.getState().mapState.cellDimensions;
        this.size = 1.3 * halfCellSize;
        this.speed = halfCellSize * SPEED_FACTOR;
        this.halfCellSize = halfCellSize;
        this.location = { x: cellSize * this.initialPos.x - halfCellSize, y: cellSize * this.initialPos.y - halfCellSize };
        this.velocity = { ...zeroPair };
        this.currentDirection = Directions.NONE;
        this.nextDirection = Directions.NONE;
    };

    public draw: (p: p5) => void = p => {
        this.handleUpdate();
        this.location = addPairs(this.location, this.velocity);
        p.push();
        p.translate(this.location.x, this.location.y);
        p.fill(255, 0, 0);
        p.ellipse(0, 0, this.size);
        p.pop();
        this.drawDebugInfo(p);
    };


    public receiveInput(dir: Directions) {
        const allowImediateOverride = 
            (isDown(dir) && this.canMoveDown() && (isUp(this.currentDirection) || this.notMoving()))  ||
            (isUp(dir) && this.canMoveUp() && (isDown(this.currentDirection) || this.notMoving()))||
            (isLeft(dir) && this.canMoveLeft() && (isRight(this.currentDirection) || this.notMoving()))||
            (isRight(dir) && this.canMoveRight() && (isLeft(this.currentDirection) || this.notMoving()));
        if (allowImediateOverride) {
            this.currentDirection = dir;
            this.nextDirection = Directions.NONE;
            return;
        }
        const allowQueueDirection = 
            (isDown(dir) && isDown(this.targetCellType())) ||
            (isUp(dir) && isUp(this.targetCellType())) ||
            (isRight(dir) && isRight(this.targetCellType())) ||
            (isLeft(dir) && isLeft(this.targetCellType()))
        if (allowQueueDirection) {
            this.nextDirection = dir;
        }
        
    }

    private drawDebugInfo(p: p5) {
        p.line(this.targetLocation().x, this.targetLocation().y, this.location.x, this.location.y);
        p.push();
        p.translate(this.location.x, this.location.y);
        p.text(this.debugInfo().join('\n'), 0, 20);
        p.pop();
    }

    private debugInfo: () => string[] = () => [
        Object.values(this.location).toString(),
        Object.values(this.targetLocation()).toString(),
        `Right:    ${this.canMoveRight()}`,
        `Left:       ${this.canMoveLeft()}`,
        `Up:        ${this.canMoveUp()}`,
        `Down:   ${this.canMoveDown()}`,
        `CurrentDirection: ${getString(this.currentDirection)}`
    ];

    private handleUpdate = () => {
        if (this.moveTowardsTarget()) {
            if (this.nextDirection !== Directions.NONE) {
                this.currentDirection = this.nextDirection;
                this.nextDirection = Directions.NONE;
            }
            else {
                this.receiveInput(this.currentDirection);
            }
        }
    }

    private moveTowardsTarget = () => {
        const target = this.targetLocation();
        const snapX = Math.abs(this.location.x - target.x) < this.speed
        const snapY = Math.abs(this.location.y - target.y) < this.speed
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
        if (this.currentDirection === Directions.RIGHT && this.canMoveRight()) {
            this.velocity = { x: this.speed, y: 0 };
            return false;
        }
        if (this.currentDirection === Directions.LEFT && this.canMoveLeft()) {
            this.velocity = { x: -this.speed, y: 0 };
            return false;
        }
        if (this.currentDirection === Directions.UP && this.canMoveUp()) {
            this.velocity = { x: 0, y: -this.speed };
            return false;
        }
        if (this.currentDirection === Directions.DOWN && this.canMoveDown()) {
            this.velocity = { x: 0, y: this.speed };
            return false;
        }
    }

    private targetCell = (rootCell: CoordPair = this.currentCell()) => {
        const translation = this.translateToLocation(rootCell);
        const targetCell = { ...rootCell }
        switch (this.currentDirection) {
            case Directions.UP:
                if (this.location.y <= translation.y && isUp(this.currentCellType())) {
                    targetCell.y--;
                }
                break;
            case Directions.DOWN:
                if (this.location.y >= translation.y && isDown(this.currentCellType())) {
                    targetCell.y++;
                }
                break;
            case Directions.LEFT:
                if (this.location.x <= translation.x && isLeft(this.currentCellType())) {
                    targetCell.x--;
                }
                break;
            case Directions.RIGHT:
                if (this.location.x >= translation.x && isRight(this.currentCellType())) {
                    targetCell.x++;
                }
                break;
        }
        return targetCell
    }

    private targetLocation = () => this.translateToLocation(this.targetCell());

    private currentCell: () => CoordPair = () => {
        return { x: Math.floor(this.location.x / (this.halfCellSize * 2)) , y: Math.floor(this.location.y / (this.halfCellSize * 2)) }
    }

    private canMoveRight = () => isRight(this.currentCellType()) ||  this.location.x <this.translateToLocation(this.currentCell()).x;
    private canMoveLeft = () => isLeft(this.currentCellType()) ||  this.location.x >this.translateToLocation(this.currentCell()).x;
    private canMoveUp = () => isUp(this.currentCellType()) ||  this.location.y >this.translateToLocation(this.currentCell()).y;
    private canMoveDown = () => isDown(this.currentCellType()) ||  this.location.y <this.translateToLocation(this.currentCell()).y;

    private currentCellType = () => this.getCellType(this.currentCell());
    private targetCellType = () => this.getCellType(this.targetCell());

    private getCellType = (coords: CoordPair) => {
        try {
            return GlobalStore.getState().mapState.mapCells[coords.y][coords.x];
        } catch (error) {
            return Directions.NONE;
        }
    }

    private translateToLocation = (coords: CoordPair) => {
        return {
            x: (coords.x) * (this.halfCellSize * 2) + this.halfCellSize,
            y: (coords.y) * (this.halfCellSize * 2) + this.halfCellSize
        }
    }

    private notMoving = () => this.velocity.x === 0 && this.velocity.y === 0;
}


