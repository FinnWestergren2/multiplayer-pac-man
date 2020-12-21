"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleStateCorrection = exports.handlePlayerInput = exports.popPlayerPath = exports.updatePlayerPath = exports.setCurrentPlayers = exports.removePlayer = exports.addPlayer = exports.updatePlayerStatus = exports.setPlayerStatus = exports.playerStateReducer = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Types = require("../Types");

var _ReduxTypes = require("../Types/ReduxTypes");

var _Pathfinding = require("../Utils/Pathfinding");

var _Game = require("../Game");

var _playerUpdater = require("../Game/playerUpdater");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var initialState = {
  playerStatusMap: {},
  playerList: []
};

var playerStateReducer = function playerStateReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _ReduxTypes.PlayerStateActionTypes.SET_PLAYER_STATUS:
      return _objectSpread(_objectSpread({}, state), {}, {
        playerStatusMap: action.payload
      });

    case _ReduxTypes.PlayerStateActionTypes.UPDATE_PLAYER_STATUS:
      return _objectSpread(_objectSpread({}, state), {}, {
        playerStatusMap: _objectSpread(_objectSpread({}, state.playerStatusMap), {}, (0, _defineProperty2.default)({}, action.payload.playerId, action.payload.status))
      });

    case _ReduxTypes.PlayerStateActionTypes.ADD_PLAYER:
      if (state.playerList.some(function (p) {
        return p === action.payload;
      })) {
        return state;
      }

      var playerStatusMap = state.playerStatusMap;
      playerStatusMap[action.payload] = {
        location: {
          x: 0,
          y: 0
        },
        direction: _Types.Directions.NONE,
        path: []
      };
      return _objectSpread(_objectSpread({}, state), {}, {
        playerList: [].concat((0, _toConsumableArray2.default)(state.playerList), [action.payload]),
        playerStatusMap: playerStatusMap
      });

    case _ReduxTypes.PlayerStateActionTypes.REMOVE_PLAYER:
      var newState = _objectSpread({}, state);

      delete newState.playerStatusMap[action.payload];
      return _objectSpread(_objectSpread({}, newState), {}, {
        playerList: state.playerList.filter(function (p) {
          return p != action.payload;
        })
      });

    case _ReduxTypes.PlayerStateActionTypes.SET_CURRENT_PLAYER_ID:
      return _objectSpread(_objectSpread({}, state), {}, {
        currentPlayer: action.payload
      });

    case _ReduxTypes.PlayerStateActionTypes.SET_PLAYER_LIST:
      return _objectSpread(_objectSpread({}, state), {}, {
        playerList: action.payload
      });

    case _ReduxTypes.PlayerStateActionTypes.SET_PLAYER_PATH:
      {
        var _newStatusMap = _objectSpread(_objectSpread({}, state.playerStatusMap), {}, (0, _defineProperty2.default)({}, action.payload.playerId, _objectSpread(_objectSpread({}, state.playerStatusMap[action.payload.playerId]), {}, {
          path: action.payload.path
        })));

        return _objectSpread(_objectSpread({}, state), {}, {
          playerStatusMap: _newStatusMap
        });
      }

    case _ReduxTypes.PlayerStateActionTypes.POP_PLAYER_PATH:
      var newStatusMap = _objectSpread(_objectSpread({}, state.playerStatusMap), {}, (0, _defineProperty2.default)({}, action.payload, _objectSpread(_objectSpread({}, state.playerStatusMap[action.payload]), {}, {
        path: state.playerStatusMap[action.payload].path.slice(1)
      })));

      return _objectSpread(_objectSpread({}, state), {}, {
        playerStatusMap: newStatusMap
      });

    default:
      return state;
  }
};

exports.playerStateReducer = playerStateReducer;

var setPlayerStatus = function setPlayerStatus(playerStatusMap) {
  return function (dispatch) {
    dispatch({
      type: _ReduxTypes.PlayerStateActionTypes.SET_PLAYER_STATUS,
      payload: playerStatusMap
    });
  };
};

exports.setPlayerStatus = setPlayerStatus;

var updatePlayerStatus = function updatePlayerStatus(playerId, newStatus) {
  return function (dispatch) {
    dispatch({
      type: _ReduxTypes.PlayerStateActionTypes.UPDATE_PLAYER_STATUS,
      payload: {
        playerId: playerId,
        status: newStatus
      }
    });
  };
};

exports.updatePlayerStatus = updatePlayerStatus;

var addPlayer = function addPlayer(playerId) {
  return function (dispatch) {
    dispatch({
      type: _ReduxTypes.PlayerStateActionTypes.ADD_PLAYER,
      payload: playerId
    });
  };
};

exports.addPlayer = addPlayer;

var removePlayer = function removePlayer(playerId) {
  return function (dispatch) {
    dispatch({
      type: _ReduxTypes.PlayerStateActionTypes.REMOVE_PLAYER,
      payload: playerId
    });
  };
};

exports.removePlayer = removePlayer;

var setCurrentPlayers = function setCurrentPlayers(currentPlayerId, fullPlayerList) {
  return function (dispatch) {
    dispatch({
      type: _ReduxTypes.PlayerStateActionTypes.SET_CURRENT_PLAYER_ID,
      payload: currentPlayerId
    });
    dispatch({
      type: _ReduxTypes.PlayerStateActionTypes.SET_PLAYER_LIST,
      payload: fullPlayerList
    });
  };
};

exports.setCurrentPlayers = setCurrentPlayers;

var updatePlayerPath = function updatePlayerPath(store, playerId, path) {
  store.dispatch({
    type: _ReduxTypes.PlayerStateActionTypes.SET_PLAYER_PATH,
    payload: {
      playerId: playerId,
      path: path
    }
  });
};

exports.updatePlayerPath = updatePlayerPath;

var popPlayerPath = function popPlayerPath(store, playerId) {
  store.dispatch({
    type: _ReduxTypes.PlayerStateActionTypes.POP_PLAYER_PATH,
    payload: playerId
  });
};

exports.popPlayerPath = popPlayerPath;

var handlePlayerInput = function handlePlayerInput(store, playerId, stampedInput) {
  var playerStatus = store.getState().playerStatusMap[playerId];

  if (playerStatus) {
    var frameDiff = (new Date().getTime() - stampedInput.time) * _Game.UPDATE_FREQUENCY;

    var distTravelled = _Game.SPEED_FACTOR * frameDiff * 2; // multiply by two because by the time you update, they'll be crusing along the same speed

    playerStatus.location = stampedInput.input.currentLocation;
    playerStatus.path = (0, _Pathfinding.BFS)(playerStatus.location, stampedInput.input.destination);
    (0, _playerUpdater.movePlayerAlongPath)(playerId, playerStatus, distTravelled, store);
  }
};

exports.handlePlayerInput = handlePlayerInput;

var handleStateCorrection = function handleStateCorrection(store, payload) {
  var hard = payload.hard,
      soft = payload.soft;
  store.getState().playerList.forEach(function (pId) {
    var _hard$pId, _soft$pId;

    var newState = (_hard$pId = hard[pId]) !== null && _hard$pId !== void 0 ? _hard$pId : _objectSpread(_objectSpread({}, store.getState().playerStatusMap[pId]), {}, {
      location: (_soft$pId = soft[pId]) !== null && _soft$pId !== void 0 ? _soft$pId : store.getState().playerStatusMap[pId].location
    }); // @ts-ignore

    store.dispatch(updatePlayerStatus(pId, newState));
  });
};

exports.handleStateCorrection = handleStateCorrection;