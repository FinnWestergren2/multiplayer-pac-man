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

const SliderContainer = styled.div`
    display: flex;
    input {
        width: auto;
        height: 25px;
        background: #d3d3d3;
        outline: none;
        opacity: 0.7;
        transition: opacity 0.2s;
    }

    input:hover {
        opacity: 1;
    }
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
    useEffect(() => {
        onChange(debouncedValue);
    // eslint-disable-next-line
    }, [debouncedValue]);

    return (
        <SliderContainer>
            <input
                type="range"
                min={min}
                max={max}
                value={immediateValue}
                onChange={(e) => setImmediateValue(parseInt(e.target.value))}
                id={sliderId}
            />
            <label htmlFor={sliderId}>{`${label}: ${immediateValue}`}</label>
        </SliderContainer>
    );
};

export default Slider;
