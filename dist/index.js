'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _watson = require('./services/watson');

var _watson2 = _interopRequireDefault(_watson);

var _auth = require('./services/auth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.CORS_LIST);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

const server = _http2.default.createServer(app);
const io = (0, _socket2.default)(server);
const port = process.env.PORT || 3000;

// io.origins(process.env.CORS_LIST);
io.use(async (socket, next) => {
  const token = socket.handshake.query.token;
  socket.handshake.user_id = (await (0, _auth.authorizate)({ token })).data.data.user.user_id;
  return next();
});

io.on('connection', function (socket) {
  const user_id = socket.handshake.user_id;
  const watsonInstance = (0, _watson2.default)();

  const sendMessage = ({ socket, watsonInstance, text, user_id }) => {
    watsonInstance.sendMessage({ text, user_id }).then(res => {
      console.log(res);
      const output = res.result.output;
      if (output.generic.length === 0) {
        socket.emit('message', 'Error ocurred, please contact devs');
      } else {
        socket.emit('message', output.generic[0].text);
      }
    });
  };

  watsonInstance.createSession().then(() => {
    sendMessage({ text: '', watsonInstance, socket, user_id });
    socket.on('message', text => {
      sendMessage({ text, watsonInstance, socket, user_id });
    });
  });
});

server.listen(port, function () {
  console.log(`listening on *:${port}`);
});
//# sourceMappingURL=index.js.map