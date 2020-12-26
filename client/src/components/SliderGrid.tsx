import React, { FunctionComponent, ReactNode } from "react";
import styled from "@emotion/styled";

const StyledSliderGrid = styled.div`
    display: inline-grid;
    grid-template-columns: 12em auto;
    grid-template-rows: min-content;
`;

const SliderGrid: FunctionComponent<{children: ReactNode}> = ({children}) => 
    <StyledSliderGrid>
        {children}
    </StyledSliderGrid>

export default SliderGrid;