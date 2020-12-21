"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoordPairUtils = void 0;

var _Directions = require("./Directions");

var zeroPair = {
  x: 0,
  y: 0
};

var addPairs = function addPairs(p1, p2) {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y
  };
};

var randomPair = function randomPair(dimensions) {
  var x = Math.floor(Math.random() * dimensions.x);
  var y = Math.floor(Math.random() * dimensions.y);
  return {
    x: x,
    y: y
  };
};

var equalPairs = function equalPairs(a, b) {
  return a.x === b.x && a.y === b.y;
};

var roundedPair = function roundedPair(p) {
  return {
    x: Math.round(p.x),
    y: Math.round(p.y)
  };
};

var flooredPair = function flooredPair(p) {
  return {
    x: Math.floor(p.x),
    y: Math.floor(p.y)
  };
}; // WARNING: kinda jenky. really only supposed to be used when you know its not a diagonal line between start and finish


var getDirection = function getDirection(start, finish) {
  if (start.x < finish.x) {
    return _Directions.Directions.RIGHT;
  }

  if (start.x > finish.x) {
    return _Directions.Directions.LEFT;
  }

  if (start.y < finish.y) {
    return _Directions.Directions.DOWN;
  }

  if (start.y > finish.y) {
    return _Directions.Directions.UP;
  }

  return _Directions.Directions.NONE;
};

var CoordPairUtils = {
  zeroPair: zeroPair,
  addPairs: addPairs,
  randomPair: randomPair,
  equalPairs: equalPairs,
  roundedPair: roundedPair,
  flooredPair: flooredPair,
  getDirection: getDirection
};
exports.CoordPairUtils = CoordPairUtils;