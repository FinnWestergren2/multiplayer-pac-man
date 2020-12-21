import { Directions, PlayerStatus } from "../Types";
export declare class Player {
    private location;
    private velocity;
    private speed;
    private currentDirection;
    private nextDirection;
    private mostRecentUpdate;
    id: string;
    constructor(id: string);
    receiveInput(dir: Directions): void;
    updateState: () => void;
    private moveTowardsTarget;
    private isCentered;
    setCurrentStatus: (status: PlayerStatus) => void;
    private handleInput;
    private targetLocation;
    private canMoveRight;
    private canMoveLeft;
    private canMoveUp;
    private canMoveDown;
    private notMoving;
    private currentCellType;
    private targetCellType;
    private currentCell;
    private targetCell;
    private getCellType;
    private toGridCoords;
}
