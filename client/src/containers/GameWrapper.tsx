import React, { FunctionComponent } from "react";
import P5Wrapper from "./P5Wrapper";
import Octicon, { Sync } from "@primer/octicons-react";
import styled from "@emotion/styled";
import { createStore } from "redux";
import initializeSocket from "../socket";
import { requestMap, sendSimulatedLagInput } from "../socket/clientExtensions";
import { mapStateReducer, gameStateReducer, runGame, CoordPairUtils, ActorType, getUpdateFrequency, refreshMap, Direction, MapResponse, DirectionUtils } from "core";
import Slider from "../debugComponents/DebugSlider";
import ControllerGrid from "../debugComponents/ControllerGrid";
import DebugButton from "../debugComponents/DebugButton";
import { createUnit } from "../utils/clientActions";
import DebugIndicator from "../debugComponents/DebugIndicator";

const FlexContainer = styled.div`
    display: flex;
    justify-content: center;
    svg{
        color: cornflowerblue;
        position: relative;
        right: 1.6rem;
        scale: 2;
        top: .5rem;
        cursor: pointer;
        :hover{
            color: rebeccapurple;
        }
    }
`;
export const MapStore = createStore(mapStateReducer);
export const GameStore = createStore(gameStateReducer);
export const ClientSocket = initializeSocket();

const GameWrapper: FunctionComponent = () => {
    runGame(MapStore, GameStore, window.setInterval);
    return (
        <FlexContainer>
            <P5Wrapper log={console.log} />
            <span onClick={requestMap}>
                <Octicon
                    icon={Sync}
                    size={20} />
            </span>
            <ControllerGrid>
                <Slider
                    min={0}
                    max={100}
                    value={0}
                    onChange={sendSimulatedLagInput}
                    sliderId="sim-lag-input"
                    label="simulated lag (ms)" />
                <DebugButton
                    onClick={() => createUnit(CoordPairUtils.zeroPair, ActorType.MINER)}
                    label="add miner" />
                <DebugButton
                    onClick={deleteRandomWall}
                    label="delete random wall" />
                <DebugIndicator
                    label='UPS'
                    timer={2000}
                    update={() => Math.floor(getUpdateFrequency() * 1000)} />
            </ControllerGrid>
        </FlexContainer>
    );
};

const deleteRandomWall = () => {
    const cells = [...MapStore.getState().mapCells]
    let randomDir = DirectionUtils.randomSingleDirection();
    let x = Math.floor(Math.random() * (cells[0].length - 2)) + 1;
    let y = Math.floor(Math.random() * (cells.length - 2)) + 1;
    while (DirectionUtils.containsDirection(cells[y][x], randomDir)) {
        randomDir = DirectionUtils.randomSingleDirection();
    }
    cells[y][x] = cells[y][x] | randomDir;
    switch (randomDir) {
        case Direction.DOWN: y++; break;
        case Direction.UP: y--; break;
        case Direction.RIGHT: x++; break;
        case Direction.LEFT: x--; break;
    }
    cells[y][x] = cells[y][x] | DirectionUtils.getOpposite(randomDir); 
    const response: MapResponse = {
        cells,
        cellModifiers: MapStore.getState().cellModifiers
    }
    refreshMap(MapStore, response);
}

export default GameWrapper;
