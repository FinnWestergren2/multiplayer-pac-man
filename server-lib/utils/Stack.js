"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

// There are probably libraries for this, but I wanted to see if I could do this myself
var Stack = function Stack() {
  var _this = this;

  (0, _classCallCheck2.default)(this, Stack);
  (0, _defineProperty2.default)(this, "stack", []);
  (0, _defineProperty2.default)(this, "push", function (item) {
    _this.stack.push(item);
  });
  (0, _defineProperty2.default)(this, "pop", function () {
    if (_this.stack.length === 0) {
      throw new Error("no elements to pop");
    }

    var toReturn = _this.stack[_this.stack.length - 1];
    _this.stack = _this.stack.slice(0, _this.stack.length - 1);
    return toReturn;
  });
  (0, _defineProperty2.default)(this, "peek", function () {
    if (_this.stack.length === 0) {
      return null;
    }

    return _this.stack[_this.stack.length - 1];
  });
};

exports.default = Stack;