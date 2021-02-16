import styled from "@emotion/styled";
import React, { FunctionComponent, useState } from "react";

type Props = {
    className?: string
    label: string;
    timer?: number;
    update: () => string | number;
};

const StyledKey = styled.div`
    height: min-content;
    grid-column-start: 1;
    grid-column-end: 2;
` 

const StyledVal = styled.div`
    height: min-content;
    grid-column-start: 2;
    grid-column-end: 3;
` 

const DebugIndicator: FunctionComponent<Props> = ({ label, update, timer, className }) => {
    const [value, setValue] = useState(update());
    window.setInterval(() => setValue(update()), timer ?? 1000)
    return (<>
        <StyledKey>{label}</StyledKey>
        <StyledVal>{value}</StyledVal>
    </>)
}

export default DebugIndicator;
