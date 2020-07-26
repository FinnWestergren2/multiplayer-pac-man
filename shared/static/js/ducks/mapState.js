"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAppDimensions = exports.refreshMap = exports.mapStateReducer = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var ActionTypes;

(function (ActionTypes) {
  ActionTypes["REFRESH_MAP"] = "REFRESH_MAP";
  ActionTypes["UPDATE_APP_DIMENSIONS"] = "UPDATE_APP_DIMENSIONS";
  ActionTypes["UPDATE_CELL_DIMENSIONS"] = "UPDATE_CELL_DIMENSIONS";
  ActionTypes["UPDATE_PLAYER_STATUS"] = "UPDATE_PLAYER_STATUS";
})(ActionTypes || (ActionTypes = {}));

var initialState = {
  mapCells: [],
  appDimensions: {
    canvasHeight: 0,
    canvasWidth: 0
  },
  cellDimensions: {
    cellSize: 0,
    halfCellSize: 0
  },
  playerStartPoints: {}
};

var mapStateReducer = function mapStateReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case ActionTypes.REFRESH_MAP:
      return _objectSpread(_objectSpread({}, state), {}, {
        mapCells: action.payload
      });

    case ActionTypes.UPDATE_APP_DIMENSIONS:
      return _objectSpread(_objectSpread({}, state), {}, {
        appDimensions: action.payload
      });

    case ActionTypes.UPDATE_CELL_DIMENSIONS:
      return _objectSpread(_objectSpread({}, state), {}, {
        cellDimensions: action.payload
      });

    case ActionTypes.UPDATE_PLAYER_STATUS:
      return _objectSpread(_objectSpread({}, state), {}, {
        playerStartPoints: action.payload
      });

    default:
      return state;
  }
};

exports.mapStateReducer = mapStateReducer;

var refreshMap = function refreshMap(mapOnServer) {
  return function (dispatch, getState) {
    dispatch({
      type: ActionTypes.REFRESH_MAP,
      payload: mapOnServer.map
    });
    dispatch({
      type: ActionTypes.UPDATE_CELL_DIMENSIONS,
      payload: generateCellDimensions(mapOnServer.map, getState().appDimensions)
    });
    dispatch({
      type: ActionTypes.UPDATE_PLAYER_STATUS,
      payload: mapOnServer.startLocations
    });
  };
};

exports.refreshMap = refreshMap;

var updateAppDimensions = function updateAppDimensions(width, height) {
  return function (dispatch) {
    dispatch({
      type: ActionTypes.UPDATE_APP_DIMENSIONS,
      payload: {
        canvasHeight: height,
        canvasWidth: width
      }
    });
  };
};

exports.updateAppDimensions = updateAppDimensions;

var generateCellDimensions = function generateCellDimensions(data, appDimensions) {
  var size = Math.min((appDimensions.canvasWidth - 1) / Math.max.apply(Math, (0, _toConsumableArray2.default)(data.map(function (r) {
    return r.length;
  }))), (appDimensions.canvasHeight - 1) / data.length);
  return {
    cellSize: size,
    halfCellSize: size * 0.5
  };
};