import styled from "@emotion/styled";
import React, { FunctionComponent, useState } from "react";

type Props = {
    className?: string
    label: string;
    timer?: number;
    update: () => string | number;
};

const DebugIndicator: FunctionComponent<Props> = ({ label, update, timer, className }) => {
    const [value, setValue] = useState(update());
    window.setInterval(() => setValue(update()), timer ?? 1000)
    return (<div className={className}>
        <div className="key">{label}</div>
        <div className="value">{value}</div>
    </div>)
}

export default styled(DebugIndicator)`
    height: min-content;
    display: grid;
    .key {
        height: min-content;
        grid-column-start: 1;
        grid-column-end: 2;
    }
    .value {
        height: min-content;
        grid-column-start: 2;
        grid-column-end: 3;
    }
`;
