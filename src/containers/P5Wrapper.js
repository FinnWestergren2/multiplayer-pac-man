import React, { Component } from "react";
import PropTypes from "prop-types";

import sketch from "../sketch/index.ts";

class P5Wrapper extends Component {
    static propTypes = {
        onReady: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.canvas = new window.p5(sketch, "app-p5_container");
    }

    componentWillReceiveProps(nextProps) {
        this.canvas.pushProps(nextProps);
    }

    shouldComponentUpdate() {
        // just in case :)
        return false;
    }

    componentWillUnmount() {
        this.canvas.remove();
    }

    render() {
        // console.log("::: P5Wrapper.props:", this.props);
        return (
            <div id="app-p5_container"/>
        );
    }
}

export default P5Wrapper;
