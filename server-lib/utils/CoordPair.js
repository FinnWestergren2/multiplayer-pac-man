"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addPairs = exports.zeroPair = void 0;
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