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
};

var getDirection = function getDirection(start, finish) {
  var out = _Directions.Directions.NONE;

  if (start.x < finish.x) {
    out = out | _Directions.Directions.RIGHT;
  }

  if (start.x > finish.x) {
    out = out | _Directions.Directions.LEFT;
  }

  if (start.y < finish.y) {
    out = out | _Directions.Directions.DOWN;
  }

  if (start.y > finish.y) {
    out = out | _Directions.Directions.UP;
  }

  console.log('start', start, 'finish', finish, 'out', out);
  return out;
};

var snappedPair = function snappedPair(p) {
  var rounded = roundedPair(p);

  if (Math.abs(p.x - rounded.x) > Math.abs(p.y - rounded.y)) {
    return {
      x: p.x,
      y: rounded.y
    };
  } else {
    return {
      x: rounded.x,
      y: p.y
    };
  }
};

var distSquared = function distSquared(start, finish) {
  return Math.pow(Math.abs(start.x - finish.x), 2) + Math.pow(Math.abs(start.y - finish.y), 2);
};

var CoordPairUtils = {
  zeroPair: zeroPair,
  addPairs: addPairs,
  randomPair: randomPair,
  equalPairs: equalPairs,
  roundedPair: roundedPair,
  flooredPair: flooredPair,
  snappedPair: snappedPair,
  getDirection: getDirection,
  distSquared: distSquared
};
exports.CoordPairUtils = CoordPairUtils;