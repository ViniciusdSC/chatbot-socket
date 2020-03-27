import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import watson from '~/services/watson';
import { authorizate } from '~/services/auth';

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;

io.origins(process.env.CORS_LIST);
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
        socket.emit('message', output.generic[0].text);
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
