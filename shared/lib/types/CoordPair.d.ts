export declare type CoordPair = {
    x: number;
    y: number;
};
export declare const zeroPair: {
    x: number;
    y: number;
};
export declare const addPairs: (p1: CoordPair, p2: CoordPair) => {
    x: number;
    y: number;
};
export declare const randomPair: (dimensions: CoordPair) => CoordPair;
export declare const equalPairs: (a: CoordPair, b: CoordPair) => boolean;
