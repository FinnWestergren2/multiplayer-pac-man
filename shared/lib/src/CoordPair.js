"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.equalPairs = exports.randomPair = exports.addPairs = exports.zeroPair = void 0;
var zeroPair = {
  x: 0,
  y: 0
};
exports.zeroPair = zeroPair;

var addPairs = function addPairs(p1, p2) {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y
  };
};

exports.addPairs = addPairs;

var randomPair = function randomPair(dimensions) {
  var x = Math.floor(Math.random() * dimensions.x);
  var y = Math.floor(Math.random() * dimensions.y);
  return {
    x: x,
    y: y
  };
};

exports.randomPair = randomPair;

var equalPairs = function equalPairs(a, b) {
  return a.x === b.x && a.y === b.y;
};

exports.equalPairs = equalPairs;