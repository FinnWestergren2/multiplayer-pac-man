import { CoordPair } from "./CoordPair";

export enum InputType {
    PLAYER_PATH_INPUT
}

export type Input = { type: InputType.PLAYER_PATH_INPUT, destination: CoordPair}