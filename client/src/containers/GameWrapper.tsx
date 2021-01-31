import React, { FunctionComponent } from "react";
import P5Wrapper from "./P5Wrapper";
import Octicon, {Sync} from "@primer/octicons-react";
import styled from "@emotion/styled";
import { createStore } from "redux";
import initializeSocket from "../socket";
import { requestMap, sendSimulatedLagInput } from "../socket/clientExtensions";
import { mapStateReducer, gameStateReducer, runGame } from "core";
import Slider from "../components/Slider";
import ControllerGrid from "../components/ControllerGrid";
import DebugButton from "../components/DebugButton";

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
            <P5Wrapper log={console.log}/>
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
                    onClick={() => console.log('test')}
                    label="add miner" />
            </ControllerGrid>
        </FlexContainer>
    );
};

export default GameWrapper;
