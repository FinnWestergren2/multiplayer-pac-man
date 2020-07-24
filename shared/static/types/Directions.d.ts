declare enum Directions {
    "NONE" = 0,
    "UP" = 1,
    "RIGHT" = 2,
    "DOWN" = 4,
    "LEFT" = 8
}
export declare const isUp: (dir: Directions) => boolean;
export declare const isDown: (dir: Directions) => boolean;
export declare const isLeft: (dir: Directions) => boolean;
export declare const isRight: (dir: Directions) => boolean;
export declare const getString: (dir: Directions) => string;
export declare const randomSingleDirection: () => Directions;
export declare const rotateClockwise: (dir: Directions) => Directions;
export declare const getOpposite: (dir: Directions) => Directions;
export default Directions;
