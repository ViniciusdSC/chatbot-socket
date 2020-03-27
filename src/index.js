import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import watson from '~/services/watson';
import { authorizate } from '~/services/auth';

const app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.CORS_LIST);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next()
})

const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;

// io.origins(process.env.CORS_LIST);
io.use(async (socket, next) => {
  const token = socket.handshake.query.token;
  socket.handshake.user_id = (await authorizate({ token })).data.data.user.user_id
  return next();
});

io.on('connection', function(socket) {
  const user_id = socket.handshake.user_id;
  const watsonInstance = watson();

  const sendMessage = ({ socket, watsonInstance, text, user_id }) => {
    watsonInstance.sendMessage({ text, user_id })
      .then(res => {
        const output = res.result.output;
        if (output.generic.length === 0) {
          socket.emit('message', 'Error ocurred, please contact devs');
        } else {
          socket.emit('message', output.generic[0].text);
        }
      });
  }

  watsonInstance.createSession().then(() => {
    sendMessage({ text: '', watsonInstance, socket, user_id })
    socket.on('message', (text) => {
      sendMessage({ text, watsonInstance, socket, user_id })
    });
  });
});

server.listen(port, function() {
  console.log(`listening on *:${port}`);
});
