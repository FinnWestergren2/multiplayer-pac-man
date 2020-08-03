"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCurrentPlayers = exports.removePlayer = exports.addPlayer = exports.addPlayerInput = exports.updatePlayerStatus = exports.playerStateReducer = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var ActionTypes;

(function (ActionTypes) {
  ActionTypes["UPDATE_PLAYER_STATUS"] = "UPDATE_PLAYER_STATUS";
  ActionTypes["ADD_PLAYER_INPUT"] = "ADD_PLAYER_INPUT";
  ActionTypes["ADD_PLAYER"] = "ADD_PLAYER";
  ActionTypes["REMOVE_PLAYER"] = "REMOVE_PLAYER";
  ActionTypes["SET_CURRENT_PLAYER_ID"] = "SET_CURRENT_PLAYER_ID";
  ActionTypes["SET_PLAYER_LIST"] = "SET_PLAYER_LIST";
})(ActionTypes || (ActionTypes = {}));

;
var initialState = {
  playerStatusMap: {},
  playerInputHistory: {},
  playerList: [],
  mostRecentInput: null
};

var playerStateReducer = function playerStateReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case ActionTypes.UPDATE_PLAYER_STATUS:
      return _objectSpread(_objectSpread({}, state), {}, {
        playerStatusMap: _objectSpread(_objectSpread({}, state.playerStatusMap), {}, (0, _defineProperty2.default)({}, action.payload.playerId, action.payload.status))
      });

    case ActionTypes.ADD_PLAYER_INPUT:
      var newHistory = state.playerInputHistory[action.payload.playerId] ? [].concat((0, _toConsumableArray2.default)(state.playerInputHistory[action.payload.playerId]), [action.payload.input]) : [action.payload.input];
      return _objectSpread(_objectSpread({}, state), {}, {
        playerInputHistory: _objectSpread(_objectSpread({}, state.playerInputHistory), {}, (0, _defineProperty2.default)({}, action.payload.playerId, newHistory)),
        mostRecentInput: action.payload
      });

    case ActionTypes.ADD_PLAYER:
      if (state.playerList.some(function (p) {
        return p === action.payload;
      })) {
        return state;
      }

      return _objectSpread(_objectSpread({}, state), {}, {
        playerList: [].concat((0, _toConsumableArray2.default)(state.playerList), [action.payload])
      });

    case ActionTypes.REMOVE_PLAYER:
      return _objectSpread(_objectSpread({}, state), {}, {
        playerList: state.playerList.filter(function (p) {
          return p != action.payload;
        })
      });

    case ActionTypes.SET_CURRENT_PLAYER_ID:
      return _objectSpread(_objectSpread({}, state), {}, {
        currentPlayer: action.payload
      });

    case ActionTypes.SET_PLAYER_LIST:
      return _objectSpread(_objectSpread({}, state), {}, {
        playerList: action.payload
      });

    default:
      return state;
  }
};

exports.playerStateReducer = playerStateReducer;

var updatePlayerStatus = function updatePlayerStatus(playerId, newStatus) {
  return function (dispatch) {
    dispatch({
      type: ActionTypes.UPDATE_PLAYER_STATUS,
      payload: {
        playerId: playerId,
        status: newStatus
      }
    });
  };
};

exports.updatePlayerStatus = updatePlayerStatus;

var addPlayerInput = function addPlayerInput(playerId, input) {
  return function (dispatch) {
    dispatch({
      type: ActionTypes.ADD_PLAYER_INPUT,
      payload: {
        playerId: playerId,
        input: input
      }
    });
  };
};

exports.addPlayerInput = addPlayerInput;

var addPlayer = function addPlayer(playerId) {
  return function (dispatch) {
    dispatch({
      type: ActionTypes.ADD_PLAYER,
      payload: playerId
    });
  };
};

exports.addPlayer = addPlayer;

var removePlayer = function removePlayer(playerId) {
  return function (dispatch) {
    dispatch({
      type: ActionTypes.REMOVE_PLAYER,
      payload: playerId
    });
  };
};

exports.removePlayer = removePlayer;

var setCurrentPlayers = function setCurrentPlayers(currentPlayerId, fullPlayerList) {
  return function (dispatch) {
    dispatch({
      type: ActionTypes.SET_CURRENT_PLAYER_ID,
      payload: currentPlayerId
    });
    dispatch({
      type: ActionTypes.SET_PLAYER_LIST,
      payload: fullPlayerList
    });
  };
};

exports.setCurrentPlayers = setCurrentPlayers;