import { IDEAL_FRAME_LENGTH } from ".";

const trackerLength = 16;
const divisor = 1 / trackerLength;

let frameTracker: number[];

const getTime = () => (new Date()).getTime();
let lastFrame: number;
let frameCounter = 0;

export const updateFrameManager = () => {
    if (frameCounter === 0) {
        frameTracker = new Array(trackerLength).fill(IDEAL_FRAME_LENGTH);
        lastFrame = getTime();
        frameCounter++;
        return;
    }
    const currentTime = getTime();
    const frameLength = currentTime - lastFrame;
    frameTracker[frameCounter % trackerLength] = frameLength;
    lastFrame = currentTime;
    frameCounter++;
};

export const getAverageFrameLength = () => frameTracker.reduce((p, c) => p + c) * divisor;