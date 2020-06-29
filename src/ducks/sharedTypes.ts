import CoordPair from "../sketch/GameMap/CoordPair";
import Directions from "../sketch/GameMap/Direction";

type PlayerMap<T> = {
    [key: string]: T;
}

export type PlayerCoordMap = PlayerMap<CoordPair>
export type PlayerDirectionMap = PlayerMap<Directions>

