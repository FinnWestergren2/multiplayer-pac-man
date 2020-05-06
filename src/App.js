import React, { Component } from 'react';
import './App.css';
import P5Wrapper from './containers/P5Wrapper';

export default class App extends Component {
  render() {
    return (
      <div className="app">
        <div
          className="jumbotron"
          style={{ marginTop: "-8px", background: "rgb(120, 120, 120)" }} >
          <P5Wrapper />
        </div>
      </div>
    );
  }
}
