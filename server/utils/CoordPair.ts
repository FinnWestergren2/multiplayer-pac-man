type CoordPair = { x: number, y: number }
export const zeroPair = { x: 0, y: 0 };
export const addPairs = (p1: CoordPair, p2: CoordPair) => {
    return { x: p1.x + p2.x, y: p1.y + p2.y }
}

export const randomPair: (dimensions: CoordPair) => CoordPair = (dimensions) => {
    const x = Math.floor(Math.random() * dimensions.x);
    const y = Math.floor(Math.random() * dimensions.y);
    return {x, y}
}

export default CoordPair;