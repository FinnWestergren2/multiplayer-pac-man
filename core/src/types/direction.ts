export enum Direction {
    "NONE" = 0,
    "UP" = 1,
    "RIGHT" = 2,
    "DOWN" = 4,
    "LEFT" = 8
}

const isUp: (dir: Direction) => boolean = dir =>
    Direction.UP === (Direction.UP & dir);
const isDown: (dir: Direction) => boolean = dir =>
    Direction.DOWN === (Direction.DOWN & dir);
const isLeft: (dir: Direction) => boolean = dir =>
    Direction.LEFT === (Direction.LEFT & dir);
const isRight: (dir: Direction) => boolean = dir =>
    Direction.RIGHT === (Direction.RIGHT & dir);

const isMultipleDirections: (dir: Direction) => boolean = dir => {
    return getString(dir).split(' ').length > 1;
}

const getString: (dir: Direction) => string = dir => {
    let out = "";
    if (dir === Direction.NONE) {
        return "NONE";
    }
    if (isUp(dir)) {
        out += "UP ";
    }
    if (isDown(dir)) {
        out += "DOWN ";
    }
    if (isLeft(dir)) {
        out += "LEFT ";
    }
    if (isRight(dir)) {
        out += "RIGHT ";
    }
    return out.trim();
};

const randomSingleDirection = () => {
    const randomNum = Math.random() * 4;
    switch (Math.floor(randomNum)) {
        case 0:
            return Direction.DOWN;
        case 1:
            return Direction.UP;
        case 2:
            return Direction.LEFT;
        case 3:
            return Direction.RIGHT;
        default:
            return Direction.NONE;
    }
};

const rotateClockwise = (dir: Direction) => {
    switch (dir) {
        case Direction.UP:
            return Direction.RIGHT;
        case Direction.RIGHT:
            return Direction.DOWN;
        case Direction.DOWN:
            return Direction.LEFT;
        case Direction.LEFT:
            return Direction.UP;
        default:
            return Direction.NONE;
    }
};

const getOpposite = (dir: Direction) => {
    switch (dir) {
        case Direction.UP:
            return Direction.DOWN;
        case Direction.RIGHT:
            return Direction.LEFT;
        case Direction.DOWN:
            return Direction.UP;
        case Direction.LEFT:
            return Direction.RIGHT;
        default:
            return Direction.NONE;
    }
};

const isAJunction = (dir: Direction) => {
    const isHorizontalThroughpass = isRight(dir) && isLeft(dir) && !isUp(dir) && !isDown(dir);
    const isVerticalThroughpass = !isRight(dir) && !isLeft(dir) && isUp(dir) && isDown(dir);
    return !(isHorizontalThroughpass || isVerticalThroughpass)
}

const containsDirection = (dir: Direction, match: Direction) => match === (match & dir)

export const DirectionUtils = {  
    isUp,
    isDown,
    isLeft,
    isRight,
    getString,
    randomSingleDirection,
    rotateClockwise,
    getOpposite,
    isAJunction,
    containsDirection,
    isMultipleDirections
};
