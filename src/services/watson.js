import AssistantV2 from 'ibm-watson/assistant/v2';
import { IamAuthenticator } from 'ibm-watson/auth';

export default function () {
  const assistant = new AssistantV2({
    version: '2020-02-05',
    authenticator: new IamAuthenticator({
      apikey: process.env.API_KEY,
    }),
    url: process.env.WATSON_URL,
  });

  const assistantId = process.env.ASSISTANT_ID;
  
  let sessionId = '';

  function createSession() {
    return assistant.createSession({ assistantId })
      .then(res => {
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
      input: { message_type, text, suggestion_id: user_id.toString() },
    });
  }

  return {
    createSession,
    deleteSession,
    sendMessage
  };
}
