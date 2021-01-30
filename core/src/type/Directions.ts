export enum Directions {
    "NONE" = 0,
    "UP" = 1,
    "RIGHT" = 2,
    "DOWN" = 4,
    "LEFT" = 8
}

const isUp: (dir: Directions) => boolean = dir =>
    Directions.UP === (Directions.UP & dir);
const isDown: (dir: Directions) => boolean = dir =>
    Directions.DOWN === (Directions.DOWN & dir);
const isLeft: (dir: Directions) => boolean = dir =>
    Directions.LEFT === (Directions.LEFT & dir);
const isRight: (dir: Directions) => boolean = dir =>
    Directions.RIGHT === (Directions.RIGHT & dir);

const getString: (dir: Directions) => string = dir => {
    let out = "";
    if (dir === Directions.NONE) {
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
            return Directions.DOWN;
        case 1:
            return Directions.UP;
        case 2:
            return Directions.LEFT;
        case 3:
            return Directions.RIGHT;
        default:
            return Directions.NONE;
    }
};

const rotateClockwise = (dir: Directions) => {
    switch (dir) {
        case Directions.UP:
            return Directions.RIGHT;
        case Directions.RIGHT:
            return Directions.DOWN;
        case Directions.DOWN:
            return Directions.LEFT;
        case Directions.LEFT:
            return Directions.UP;
        default:
            return Directions.NONE;
    }
};

const getOpposite = (dir: Directions) => {
    switch (dir) {
        case Directions.UP:
            return Directions.DOWN;
        case Directions.RIGHT:
            return Directions.LEFT;
        case Directions.DOWN:
            return Directions.UP;
        case Directions.LEFT:
            return Directions.RIGHT;
        default:
            return Directions.NONE;
    }
};

export const DirectionsUtils = {  
    isUp,
    isDown,
    isLeft,
    isRight,
    getString,
    randomSingleDirection,
    rotateClockwise,
    getOpposite
};
