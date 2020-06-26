import React, { Component } from "react";
import GameWrapper from "./containers/GameWrapper";


export default class App extends Component {
	render() {
		return (
			<div className="app">
				<GameWrapper />
			</div>
		);
	}
}
