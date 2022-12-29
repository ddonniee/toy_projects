"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCookie = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactCookie = require("react-cookie");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var cookies = new _reactCookie.Cookie();

var getCookie = function getCookie(token) {
  return cookies.get(token);
};

exports.getCookie = getCookie;