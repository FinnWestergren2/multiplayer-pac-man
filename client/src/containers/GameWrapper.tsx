import React, { FunctionComponent } from "react";
import P5Wrapper from "./P5Wrapper";
import styled from "@emotion/styled";
import { createStore } from "redux";
import initializeSocket from "../socket";
import { sendSimulatedLagInput } from "../socket/clientExtensions";
import { runGame, getUpdateFrequency, ReduxStore, gameReducer } from "core";
import Slider from "../debugComponents/DebugSlider";
import ControllerGrid from "../debugComponents/ControllerGrid";
import DebugIndicator from "../debugComponents/DebugIndicator";

const FlexContainer = styled.div`
    display: flex;
    justify-content: center;
`;
export const Store: ReduxStore = createStore(gameReducer)
export const ClientSocket = initializeSocket();

const GameWrapper: FunctionComponent = () => {
    runGame(Store, window.setInterval);
    return (
        <FlexContainer>
            <P5Wrapper log={console.log} />
            <ControllerGrid>
                <Slider
                    min={0}
                    max={100}
                    value={0}
                    onChange={sendSimulatedLagInput}
                    sliderId="sim-lag-input"
                    label="simulated lag (ms)" />
                <DebugIndicator
                    label='UPS'
                    timer={2000}
                    update={() => Math.floor(getUpdateFrequency() * 1000)} />
            </ControllerGrid>
        </FlexContainer>
    );
};

export default GameWrapper;
