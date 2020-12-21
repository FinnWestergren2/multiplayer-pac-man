"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moveObjectAlongPath = exports.updatePlayers = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ = require(".");

var _Types = require("../Types");

var _playerState = require("../ducks/playerState");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var idleStatus = function idleStatus(location) {
  return {
    location: _Types.CoordPairUtils.roundedPair(location),
    // snap to grid
    direction: _Types.Directions.NONE
  };
};

var updatePlayers = function updatePlayers() {
  return _.playerStore.getState().playerList.forEach(function (playerId) {
    var status = _.playerStore.getState().objectStatusDict[playerId];

    var path = _.playerStore.getState().objectPathDict[playerId];

    if (path) {
      var newStatus = moveObjectAlongPath(_.SPEED_FACTOR, path, status, function () {
        return (0, _playerState.popPlayerPath)(_.playerStore, playerId);
      }); // @ts-ignore

      _.playerStore.dispatch((0, _playerState.updatePlayerStatus)(playerId, newStatus));

      return;
    }

    if (!path && status && status.direction !== _Types.Directions.NONE) {
      // @ts-ignore
      _.playerStore.dispatch((0, _playerState.updatePlayerStatus)(playerId, idleStatus(status.location)));
    }
  });
};

exports.updatePlayers = updatePlayers;

var moveObjectAlongPath = function moveObjectAlongPath(dist, path, status, popPath) {
  if (dist === 0) {
    return status;
  }

  if (path.length === 0) {
    return idleStatus(status.location);
  }

  path = checkCurrentPathStatus(status, path, popPath);

  var nextLocation = _Types.CoordPairUtils.snappedPair(status.location);

  var nextDirection = status.direction;
  var remainingDist = dist;

  for (var pathIndex = 0; pathIndex < path.length; pathIndex++) {
    var targetCell = path[pathIndex];
    nextDirection = _Types.CoordPairUtils.getDirection(nextLocation, targetCell);
    var distToCell = Math.sqrt(_Types.CoordPairUtils.distSquared(nextLocation, targetCell));

    if (remainingDist > distToCell) {
      nextLocation = _objectSpread({}, targetCell);
      continue;
    }

    switch (nextDirection) {
      case _Types.Directions.DOWN:
        nextLocation.y += remainingDist;
        break;

      case _Types.Directions.UP:
        nextLocation.y -= remainingDist;
        break;

      case _Types.Directions.RIGHT:
        nextLocation.x += remainingDist;
        break;

      case _Types.Directions.LEFT:
        nextLocation.x -= remainingDist;
        break;
    }

    break;
  }

  return {
    location: nextLocation,
    direction: nextDirection
  };
};

exports.moveObjectAlongPath = moveObjectAlongPath;

var checkCurrentPathStatus = function checkCurrentPathStatus(status, path, popPath) {
  var out = (0, _toConsumableArray2.default)(path);

  for (var i = 0; i < path.length - 1; i++) {
    var firstDir = _Types.CoordPairUtils.getDirection(_Types.CoordPairUtils.snappedPair(status.location), path[i]);

    var secondDir = _Types.CoordPairUtils.getDirection(_Types.CoordPairUtils.snappedPair(status.location), path[i + 1]);

    if (_Types.DirectionsUtils.getOpposite(firstDir) === secondDir) {
      out = out.slice(1);
      popPath();
      break;
    }
  }

  return out;
};