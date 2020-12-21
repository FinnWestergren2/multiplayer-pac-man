export declare enum Directions {
    "NONE" = 0,
    "UP" = 1,
    "RIGHT" = 2,
    "DOWN" = 4,
    "LEFT" = 8
}
export declare const DirectionsUtils: {
    isUp: (dir: Directions) => boolean;
    isDown: (dir: Directions) => boolean;
    isLeft: (dir: Directions) => boolean;
    isRight: (dir: Directions) => boolean;
    getString: (dir: Directions) => string;
    randomSingleDirection: () => Directions;
    rotateClockwise: (dir: Directions) => Directions;
    getOpposite: (dir: Directions) => Directions;
};
