import React, { FunctionComponent } from "react";
import P5Wrapper from "./P5Wrapper";
import Octicon, {Sync} from '@primer/octicons-react';
import styled from "@emotion/styled";

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

const Game: FunctionComponent = () => {
    return (
        <FlexContainer>
            <P5Wrapper />
            <span onClick={console.log}>
                <Octicon
                    icon={Sync} 
                    size={20} />
            </span>
        </FlexContainer>
    );
}

export default Game;