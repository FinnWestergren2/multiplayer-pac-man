import { CoordPair } from "./CoordPair";
export declare enum InputType {
    PLAYER_PATH_INPUT = 0
}
export declare type Input = {
    type: InputType.PLAYER_PATH_INPUT;
    destination: CoordPair;
    currentLocation: CoordPair;
};
