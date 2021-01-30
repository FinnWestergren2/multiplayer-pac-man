import React, { FunctionComponent, ReactNode } from "react";
import styled from "@emotion/styled";

const StyledControllerGrid = styled.div`
    display: grid;
    grid-template-columns: 12em auto;
    grid-template-rows: min-content;
`;

const ControllerGrid: FunctionComponent<{children: ReactNode}> = ({children}) => 
    <StyledControllerGrid>
        {children}
    </StyledControllerGrid>

export default ControllerGrid;