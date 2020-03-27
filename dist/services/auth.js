'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authorizate = exports.instance = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const instance = ({ token }) => _axios2.default.create({
  baseURL: process.env.AUTH_URL,
  timeout: 5000,
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const authorizate = ({ token }) => instance({ token }).post('authorizate');

exports.instance = instance;
exports.authorizate = authorizate;
//# sourceMappingURL=auth.js.map