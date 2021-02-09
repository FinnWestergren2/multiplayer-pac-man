import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";

type Props = {
    onClick: () => void;
    label?: string;
};

const StyledButton = styled.button`
    width: 50%;
    height: 2em;
    grid-column-start: 1;
    grid-column-end: 2;
`;
const Spacer = styled.div`
    height: 2em;
    grid-column-start: 2;
    grid-column-end: 3;
`
const Button: FunctionComponent<Props> = ({
    onClick,
    label
}) => {

    return (
        <>
            <StyledButton onClick={(e) => {
                e.preventDefault(); 
                onClick();
            }}>{label}</StyledButton>
            <Spacer/>
        </>
    );
};

export default Button;
