"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Player = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Types = require("../Types");

var _playerState = require("../ducks/playerState");

var _ = require(".");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Player = /*#__PURE__*/function () {
  function Player(id) {
    var _this = this;

    (0, _classCallCheck2.default)(this, Player);
    (0, _defineProperty2.default)(this, "location", _objectSpread({}, _Types.CoordPairUtils.zeroPair));
    (0, _defineProperty2.default)(this, "velocity", _objectSpread({}, _Types.CoordPairUtils.zeroPair));
    (0, _defineProperty2.default)(this, "speed", void 0);
    (0, _defineProperty2.default)(this, "currentDirection", _Types.Directions.NONE);
    (0, _defineProperty2.default)(this, "nextDirection", _Types.Directions.NONE);
    (0, _defineProperty2.default)(this, "mostRecentUpdate", 0);
    (0, _defineProperty2.default)(this, "id", void 0);
    (0, _defineProperty2.default)(this, "updateState", function () {
      _this.moveTowardsTarget();

      if (_this.isCentered()) {
        if (_this.nextDirection !== _Types.Directions.NONE) {
          // take the queued direction
          _this.currentDirection = _this.nextDirection;
          _this.nextDirection = _Types.Directions.NONE;
        } else {
          _this.receiveInput(_this.currentDirection); // continue the way you were going

        }
      }

      _this.location = _Types.CoordPairUtils.addPairs(_this.location, _this.velocity); // @ts-ignore

      _.playerStore.dispatch((0, _playerState.updatePlayerStatus)(_this.id, {
        location: _this.location,
        direction: _this.currentDirection,
        nextDirection: _this.nextDirection
      }));
    });
    (0, _defineProperty2.default)(this, "moveTowardsTarget", function () {
      if (_this.currentDirection === _Types.Directions.RIGHT && _this.canMoveRight()) {
        _this.velocity = {
          x: _this.speed,
          y: 0
        };
      }

      if (_this.currentDirection === _Types.Directions.LEFT && _this.canMoveLeft()) {
        _this.velocity = {
          x: -_this.speed,
          y: 0
        };
      }

      if (_this.currentDirection === _Types.Directions.UP && _this.canMoveUp()) {
        _this.velocity = {
          x: 0,
          y: -_this.speed
        };
      }

      if (_this.currentDirection === _Types.Directions.DOWN && _this.canMoveDown()) {
        _this.velocity = {
          x: 0,
          y: _this.speed
        };
      }
    });
    (0, _defineProperty2.default)(this, "isCentered", function () {
      var target = _this.targetLocation();

      var snapX = Math.abs(_this.location.x - target.x) < _this.speed;

      var snapY = Math.abs(_this.location.y - target.y) < _this.speed;

      if (snapX) {
        _this.velocity.x = 0;
        _this.location.x = target.x;
      }

      if (snapY) {
        _this.velocity.y = 0;
        _this.location.y = target.y;
      }

      return snapX && snapY;
    });
    (0, _defineProperty2.default)(this, "setCurrentStatus", function (status) {
      _this.currentDirection = status.direction;
      _this.nextDirection = status.nextDirection;
      _this.location = status.location;
    });
    (0, _defineProperty2.default)(this, "handleInput", function () {
      var previousUpdate = _this.mostRecentUpdate;

      var myInputHistory = _.playerStore.getState().playerInputHistory[_this.id];

      _this.mostRecentUpdate = myInputHistory ? myInputHistory[myInputHistory.length - 1].frame : 0;

      if (myInputHistory && previousUpdate !== _this.mostRecentUpdate) {
        _this.receiveInput(myInputHistory[myInputHistory.length - 1].direction);
      }
    });
    (0, _defineProperty2.default)(this, "targetLocation", function () {
      return _this.targetCell(_this.location, _this.currentDirection);
    });
    (0, _defineProperty2.default)(this, "canMoveRight", function () {
      return _Types.DirectionsUtils.isRight(_this.currentCellType()) || _this.location.x < _this.currentCell().x;
    });
    (0, _defineProperty2.default)(this, "canMoveLeft", function () {
      return _Types.DirectionsUtils.isLeft(_this.currentCellType()) || _this.location.x > _this.currentCell().x;
    });
    (0, _defineProperty2.default)(this, "canMoveUp", function () {
      return _Types.DirectionsUtils.isUp(_this.currentCellType()) || _this.location.y > _this.currentCell().y;
    });
    (0, _defineProperty2.default)(this, "canMoveDown", function () {
      return _Types.DirectionsUtils.isDown(_this.currentCellType()) || _this.location.y < _this.currentCell().y;
    });
    (0, _defineProperty2.default)(this, "notMoving", function () {
      return _this.velocity.x === 0 && _this.velocity.y === 0;
    });
    (0, _defineProperty2.default)(this, "currentCellType", function () {
      return _this.getCellType(_this.currentCell());
    });
    (0, _defineProperty2.default)(this, "targetCellType", function () {
      return _this.getCellType(_this.targetCell(_this.location, _this.currentDirection));
    });
    (0, _defineProperty2.default)(this, "currentCell", function () {
      return _this.toGridCoords(_this.location);
    });
    (0, _defineProperty2.default)(this, "targetCell", function (locationCoords, direction) {
      var currentCell = _this.toGridCoords(locationCoords);

      var targetCell = _objectSpread({}, currentCell);

      var currentCellType = _this.getCellType(currentCell);

      switch (direction) {
        case _Types.Directions.UP:
          if (locationCoords.y <= currentCell.y && _Types.DirectionsUtils.isUp(currentCellType)) {
            targetCell.y--;
          }

          break;

        case _Types.Directions.DOWN:
          if (locationCoords.y >= currentCell.y && _Types.DirectionsUtils.isDown(currentCellType)) {
            targetCell.y++;
          }

          break;

        case _Types.Directions.LEFT:
          if (locationCoords.x <= currentCell.x && _Types.DirectionsUtils.isLeft(currentCellType)) {
            targetCell.x--;
          }

          break;

        case _Types.Directions.RIGHT:
          if (locationCoords.x >= currentCell.x && _Types.DirectionsUtils.isRight(currentCellType)) {
            targetCell.x++;
          }

          break;
      }

      return targetCell;
    });
    (0, _defineProperty2.default)(this, "getCellType", function (gridCoords) {
      return _.mapStore.getState().mapCells[gridCoords.y][gridCoords.x];
    });
    (0, _defineProperty2.default)(this, "toGridCoords", function (locationCoords) {
      return {
        x: Math.floor(locationCoords.x),
        y: Math.floor(locationCoords.y)
      };
    });
    this.speed = _.SPEED_FACTOR;
    this.velocity = _objectSpread({}, _Types.CoordPairUtils.zeroPair);
    this.id = id;

    var currentStatus = _.playerStore.getState().playerStatusMap[id];

    if (currentStatus) {
      this.setCurrentStatus(currentStatus);
    }

    _.playerStore.subscribe(function () {
      _this.handleInput();
    });
  }

  (0, _createClass2.default)(Player, [{
    key: "receiveInput",
    value: function receiveInput(dir) {
      var allowImediateOverride = _Types.DirectionsUtils.isDown(dir) && this.canMoveDown() && (_Types.DirectionsUtils.isUp(this.currentDirection) || this.notMoving()) || _Types.DirectionsUtils.isUp(dir) && this.canMoveUp() && (_Types.DirectionsUtils.isDown(this.currentDirection) || this.notMoving()) || _Types.DirectionsUtils.isLeft(dir) && this.canMoveLeft() && (_Types.DirectionsUtils.isRight(this.currentDirection) || this.notMoving()) || _Types.DirectionsUtils.isRight(dir) && this.canMoveRight() && (_Types.DirectionsUtils.isLeft(this.currentDirection) || this.notMoving());

      if (allowImediateOverride) {
        this.currentDirection = dir;
        this.nextDirection = _Types.Directions.NONE;
        return;
      }

      var allowQueueDirection = _Types.DirectionsUtils.isDown(dir) && _Types.DirectionsUtils.isDown(this.targetCellType()) || _Types.DirectionsUtils.isUp(dir) && _Types.DirectionsUtils.isUp(this.targetCellType()) || _Types.DirectionsUtils.isRight(dir) && _Types.DirectionsUtils.isRight(this.targetCellType()) || _Types.DirectionsUtils.isLeft(dir) && _Types.DirectionsUtils.isLeft(this.targetCellType());

      if (allowQueueDirection) {
        this.nextDirection = dir;
      }
    }
  }]);
  return Player;
}();

exports.Player = Player;