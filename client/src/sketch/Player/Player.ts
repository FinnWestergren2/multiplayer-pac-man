import p5 from "p5";
import { MapStore, PlayerStore } from "../../containers/GameWrapper";
import { CoordPair, CoordPairUtils } from "shared";

const SIZE_FACTOR = 0.9;

export class Player {
    private location: CoordPair = { ...CoordPairUtils.zeroPair };
    private size = 0;
    public id: string;

    public constructor(id: string) {
        console.log('init');
        const { cellSize, halfCellSize } = MapStore.getState().cellDimensions;
        this.size = SIZE_FACTOR * cellSize;
        this.location = { x: halfCellSize, y: halfCellSize };
        this.id = id;
    }

    public draw: (p: p5) => void = p => {
        p.push();
        p.translate(this.location.x, this.location.y);
        p.fill(255, 0, 0);
        p.ellipse(0, 0, this.size);
        p.pop();
        // this.drawDebugInfo(p);
    };
}
