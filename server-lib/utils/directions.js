"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomSingleDir = exports.getString = exports.isRight = exports.isLeft = exports.isDown = exports.isUp = exports.default = void 0;
var Directions;

(function (Directions) {
  Directions[Directions["NONE"] = 0] = "NONE";
  Directions[Directions["UP"] = 1] = "UP";
  Directions[Directions["RIGHT"] = 2] = "RIGHT";
  Directions[Directions["DOWN"] = 4] = "DOWN";
  Directions[Directions["LEFT"] = 8] = "LEFT";
})(Directions || (Directions = {}));

var _default = Directions;
exports.default = _default;

var isUp = function isUp(dir) {
  return Directions.UP === (Directions.UP & dir);
};

exports.isUp = isUp;

var isDown = function isDown(dir) {
  return Directions.DOWN === (Directions.DOWN & dir);
};

exports.isDown = isDown;

var isLeft = function isLeft(dir) {
  return Directions.LEFT === (Directions.LEFT & dir);
};

exports.isLeft = isLeft;

var isRight = function isRight(dir) {
  return Directions.RIGHT === (Directions.RIGHT & dir);
};

exports.isRight = isRight;

var getString = function getString(dir) {
  var out = "";

  if (dir === Directions.NONE) {
    return "NONE";
  }

  if (isUp(dir)) {
    out += "UP ";
  }

  if (isDown(dir)) {
    out += "DOWN ";
  }

  if (isLeft(dir)) {
    out += "LEFT ";
  }

  if (isRight(dir)) {
    out += "RIGHT ";
  }

  return out.trim();
};

exports.getString = getString;

var randomSingleDir = function randomSingleDir() {
  var randomNum = Math.random() * 4;

  switch (Math.floor(randomNum)) {
    case 0:
      return Directions.DOWN;

    case 1:
      return Directions.UP;

    case 2:
      return Directions.LEFT;

    case 3:
      return Directions.RIGHT;

    default:
      return Directions.NONE;
  }
};

exports.randomSingleDir = randomSingleDir;