import React, { FunctionComponent, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useDebounce } from "../hooks/useDebounce";

type Props = {
    min: number;
    max: number;
    onChange: (val: number) => void;
    value: number;
    sliderId: string;
    label?: string;
};

const SliderLabel = styled.label`
    height: min-content;
    grid-column-start: 1;
    grid-column-end: 2;
`;

const SliderInput = styled.input`
    width: 100%;
    height: min-content;
    grid-column-start: 2;
    grid-column-end: 3;
`;

const Slider: FunctionComponent<Props> = ({
    min,
    max,
    onChange,
    value,
    sliderId,
    label,
}) => {
    const [immediateValue, setImmediateValue] = useState(value);
    const debouncedValue = useDebounce<number>(immediateValue, 500);
    // eslint-disable-next-line
    useEffect(() => onChange(debouncedValue), [debouncedValue]);

    return (
        <>
            <SliderLabel htmlFor={sliderId}>{`${label}: ${immediateValue}`}</SliderLabel>
            <SliderInput
                type="range"
                min={min}
                max={max}
                value={immediateValue}
                onChange={(e) => setImmediateValue(parseInt(e.target.value))}
                id={sliderId}
            />
        </>
    );
};

export default Slider;
