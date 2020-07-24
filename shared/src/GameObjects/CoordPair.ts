export type CoordPair = { x: number, y: number }
const zeroPair = { x: 0, y: 0 };
const addPairs = (p1: CoordPair, p2: CoordPair) => {
    return { x: p1.x + p2.x, y: p1.y + p2.y }
}

const randomPair: (dimensions: CoordPair) => CoordPair = (dimensions) => {
    const x = Math.floor(Math.random() * dimensions.x);
    const y = Math.floor(Math.random() * dimensions.y);
    return {x, y}
}

const equalPairs: (a: CoordPair, b: CoordPair) => boolean = (a,b) => a.x === b.x && a.y === b.y;

export const CoordPairUtils = { zeroPair, addPairs, randomPair, equalPairs };