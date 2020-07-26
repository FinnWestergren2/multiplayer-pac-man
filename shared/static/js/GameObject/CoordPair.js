"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoordPairUtils = void 0;
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

var CoordPairUtils = {
  zeroPair: zeroPair,
  addPairs: addPairs,
  randomPair: randomPair,
  equalPairs: equalPairs
};
exports.CoordPairUtils = CoordPairUtils;