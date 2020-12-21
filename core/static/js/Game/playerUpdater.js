"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.movePlayerAlongPath = exports.updatePlayers = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ = require(".");

var _Types = require("../Types");

var _playerState = require("../ducks/playerState");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var updatePlayers = function updatePlayers() {
  var psm = _.playerStore.getState().playerStatusMap;

  Object.keys(psm).forEach(function (key) {
    return movePlayerAlongPath(key, psm[key], _.SPEED_FACTOR, _.playerStore);
  });
};

exports.updatePlayers = updatePlayers;

var movePlayerAlongPath = function movePlayerAlongPath(playerId, status, dist, store) {
  var path = status.path;

  if (path.length > 0) {
    var targetCell = path[0];
    var newStatus = movePlayerTowardsTarget(status, targetCell, dist); // console.log(targetCell, newStatus);

    if (isCentered(newStatus.location, targetCell)) {
      newStatus.location = _Types.CoordPairUtils.roundedPair(newStatus.location);
      newStatus.path = newStatus.path.slice(1);

      if (newStatus.path.length === 0) {
        newStatus.direction = _Types.Directions.NONE;
      }
    } // @ts-ignore


    store.dispatch((0, _playerState.updatePlayerStatus)(playerId, newStatus));
  } else if (status.direction !== _Types.Directions.NONE) {
    store.dispatch( //@ts-ignore
    (0, _playerState.updatePlayerStatus)(playerId, {
      location: _Types.CoordPairUtils.roundedPair(status.location),
      direction: _Types.Directions.NONE
    }));
  }
};

exports.movePlayerAlongPath = movePlayerAlongPath;

var isCentered = function isCentered(location, target) {
  var centeredX = Math.abs(location.x - target.x) < _.SPEED_FACTOR;

  var centeredY = Math.abs(location.y - target.y) < _.SPEED_FACTOR;

  return centeredX && centeredY;
};

var movePlayerTowardsTarget = function movePlayerTowardsTarget(status, targetCell) {
  var dist = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _.SPEED_FACTOR;

  if (dist === 0) {
    return status;
  }

  var newStatus = _objectSpread(_objectSpread({}, status), {}, {
    direction: _Types.CoordPairUtils.getDirection(status.location, targetCell)
  });

  switch (newStatus.direction) {
    case _Types.Directions.DOWN:
      newStatus.location.y += dist;
      break;

    case _Types.Directions.UP:
      newStatus.location.y -= dist;
      break;

    case _Types.Directions.RIGHT:
      newStatus.location.x += dist;
      break;

    case _Types.Directions.LEFT:
      newStatus.location.x -= dist;
      break;
  }

  return newStatus;
};