import React, { FunctionComponent } from "react";
import P5Wrapper from "./P5Wrapper";
import Octicon, {Sync} from "@primer/octicons-react";
import styled from "@emotion/styled";
import { createStore, applyMiddleware } from "redux";
import MapStateReducer from "../ducks/mapState";
import thunk from "redux-thunk";
import { refreshMap } from "../ducks/mapState";
import initializeSocket from "../socket";
import { requestMap } from "../socket/clientExtensions";

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

export const MapStore = createStore(MapStateReducer, applyMiddleware(thunk));
export const ClientSocket = initializeSocket();


const GameWrapper: FunctionComponent = () => {
    return (
        <FlexContainer>
            <P5Wrapper />
            <span onClick={requestMap}>
                <Octicon
                    icon={Sync} 
                    size={20} />
            </span>
        </FlexContainer>
    );
};

export default GameWrapper;