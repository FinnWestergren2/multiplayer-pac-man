import { CoordPair, Directions }from "shared";

type PlayerMap<T> = {
    [key: string]: T;
}

export type PlayerCoordMap = PlayerMap<CoordPair>
export type PlayerDirectionMap = PlayerMap<Directions>
