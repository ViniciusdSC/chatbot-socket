'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  const assistant = new _v2.default({
    version: '2020-02-05',
    authenticator: new _auth.IamAuthenticator({
      apikey: process.env.API_KEY
    }),
    url: process.env.WATSON_URL
  });

  const assistantId = process.env.ASSISTANT_ID;

  let sessionId = '';

  function createSession() {
    return assistant.createSession({ assistantId }).then(res => {
      sessionId = res.result.session_id;
      return res;
    });
  }

  function deleteSession() {
    return assistant.deleteSession({ assistantId, sessionId });
  }

  function sendMessage({ message_type = 'text', text, user_id }) {
    return assistant.message({
      assistantId,
      sessionId,
      input: { message_type, text, suggestion_id: user_id.toString() }
    });
  }

  return {
    createSession,
    deleteSession,
    sendMessage
  };
};

var _v = require('ibm-watson/assistant/v2');

var _v2 = _interopRequireDefault(_v);

var _auth = require('ibm-watson/auth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=watson.js.map