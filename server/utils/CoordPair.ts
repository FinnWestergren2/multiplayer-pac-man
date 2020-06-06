type CoordPair = { x: number, y: number }
export const zeroPair = { x: 0, y: 0 };
export const addPairs = (p1: CoordPair, p2: CoordPair) => {
    return { x: p1.x + p2.x, y: p1.y + p2.y }
}

export default CoordPair;