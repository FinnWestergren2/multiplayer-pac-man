"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleStateCorrection = exports.handlePlayerInput = exports.setCurrentPlayers = exports.removePlayer = exports.addPlayer = exports.updatePlayerStatus = exports.setPlayerStatus = exports.playerStateReducer = void 0;

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
  objectStatusDict: {},
  playerList: [],
  objectDestinationDict: {}
};

var playerStateReducer = function playerStateReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  var draft = _objectSpread({}, state);

  switch (action.type) {
    case _ReduxTypes.PlayerStateActionTypes.SET_OBJECT_STATUSES:
      draft.objectStatusDict = action.payload;
      break;

    case _ReduxTypes.PlayerStateActionTypes.SET_OBJECT_STATUS:
      draft.objectStatusDict[action.payload.playerId] = action.payload.status;
      break;

    case _ReduxTypes.PlayerStateActionTypes.ADD_PLAYER:
      if (!state.playerList.some(function (p) {
        return p === action.payload;
      })) {
        draft.playerList = [].concat((0, _toConsumableArray2.default)(draft.playerList), [action.payload]);
        draft.objectStatusDict[action.payload] = {
          location: {
            x: 0,
            y: 0
          },
          direction: _Types.Directions.NONE
        };
      }

      break;

    case _ReduxTypes.PlayerStateActionTypes.REMOVE_PLAYER:
      delete draft.objectStatusDict[action.payload];
      draft.playerList = draft.playerList.filter(function (p) {
        return p != action.payload;
      });
      break;

    case _ReduxTypes.PlayerStateActionTypes.SET_CURRENT_PLAYER_ID:
      draft.currentPlayer = action.payload;
      break;

    case _ReduxTypes.PlayerStateActionTypes.SET_PLAYER_LIST:
      draft.playerList = action.payload;
      break;

    case _ReduxTypes.PlayerStateActionTypes.SET_OBJECT_DESTINATION:
      draft.objectDestinationDict[action.payload.playerId] = action.payload.dest;
  }

  return draft;
};

exports.playerStateReducer = playerStateReducer;

var setPlayerStatus = function setPlayerStatus(objectStatusDict) {
  return function (dispatch) {
    dispatch({
      type: _ReduxTypes.PlayerStateActionTypes.SET_OBJECT_STATUSES,
      payload: objectStatusDict
    });
  };
};

exports.setPlayerStatus = setPlayerStatus;

var updatePlayerStatus = function updatePlayerStatus(playerId, newStatus) {
  return function (dispatch) {
    dispatch({
      type: _ReduxTypes.PlayerStateActionTypes.SET_OBJECT_STATUS,
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

var handlePlayerInput = function handlePlayerInput(store, playerId, stampedInput) {
  var playerStatus = store.getState().objectStatusDict[playerId];

  if (playerStatus) {
    var frameDiff = (new Date().getTime() - stampedInput.time) * _Game.UPDATE_FREQUENCY;

    var distTravelled = _Game.SPEED_FACTOR * Math.max(frameDiff * 2, 1); // multiply by two because by the time you update, they'll be crusing along the same speed

    var path = (0, _Pathfinding.BFS)(stampedInput.input.currentLocation, stampedInput.input.destination);
    var newStatus = (0, _playerUpdater.moveObjectAlongPath)(distTravelled, path, playerStatus); // @ts-ignore

    store.dispatch(updatePlayerStatus(playerId, newStatus));
    store.dispatch({
      type: _ReduxTypes.PlayerStateActionTypes.SET_OBJECT_DESTINATION,
      payload: {
        playerId: playerId,
        dest: stampedInput.input.destination
      }
    });
  }
};

exports.handlePlayerInput = handlePlayerInput;

var handleStateCorrection = function handleStateCorrection(store, payload) {
  var hard = payload.hard,
      soft = payload.soft;
  store.getState().playerList.forEach(function (pId) {
    var _hard$pId, _soft$pId;

    var newState = (_hard$pId = hard[pId]) !== null && _hard$pId !== void 0 ? _hard$pId : _objectSpread(_objectSpread({}, store.getState().objectStatusDict[pId]), {}, {
      location: (_soft$pId = soft[pId]) !== null && _soft$pId !== void 0 ? _soft$pId : store.getState().objectStatusDict[pId].location
    }); // @ts-ignore

    store.dispatch(updatePlayerStatus(pId, newState));
  });
};

exports.handleStateCorrection = handleStateCorrection;