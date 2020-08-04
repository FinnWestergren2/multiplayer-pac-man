"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DirectionsUtils = exports.Directions = void 0;
var Directions;
exports.Directions = Directions;

(function (Directions) {
  Directions[Directions["NONE"] = 0] = "NONE";
  Directions[Directions["UP"] = 1] = "UP";
  Directions[Directions["RIGHT"] = 2] = "RIGHT";
  Directions[Directions["DOWN"] = 4] = "DOWN";
  Directions[Directions["LEFT"] = 8] = "LEFT";
})(Directions || (exports.Directions = Directions = {}));

var isUp = function isUp(dir) {
  return Directions.UP === (Directions.UP & dir);
};

var isDown = function isDown(dir) {
  return Directions.DOWN === (Directions.DOWN & dir);
};

var isLeft = function isLeft(dir) {
  return Directions.LEFT === (Directions.LEFT & dir);
};

var isRight = function isRight(dir) {
  return Directions.RIGHT === (Directions.RIGHT & dir);
};

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

var randomSingleDirection = function randomSingleDirection() {
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

var rotateClockwise = function rotateClockwise(dir) {
  switch (dir) {
    case Directions.UP:
      return Directions.RIGHT;

    case Directions.RIGHT:
      return Directions.DOWN;

    case Directions.DOWN:
      return Directions.LEFT;

    case Directions.LEFT:
      return Directions.UP;

    default:
      return Directions.NONE;
  }
};

var getOpposite = function getOpposite(dir) {
  switch (dir) {
    case Directions.UP:
      return Directions.DOWN;

    case Directions.RIGHT:
      return Directions.LEFT;

    case Directions.DOWN:
      return Directions.UP;

    case Directions.LEFT:
      return Directions.RIGHT;

    default:
      return Directions.NONE;
  }
};

var DirectionsUtils = {
  isUp: isUp,
  isDown: isDown,
  isLeft: isLeft,
  isRight: isRight,
  getString: getString,
  randomSingleDirection: randomSingleDirection,
  rotateClockwise: rotateClockwise,
  getOpposite: getOpposite
};
exports.DirectionsUtils = DirectionsUtils;