const INITIAL_STATE = {
  lastMessage: null,
  messages: [],
  success: false,
  error: null,
  loading: false,
};

function messages(state = INITIAL_STATE, actions) {
  switch (actions.type) {
    case "INITIALMESSAGES_LOADING": {
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
      };
    }
    case "INITIALMESSAGES_ERROR": {
      return {
        ...state,
        loading: false,
        success: false,
        error: actions.payload.error,
      };
    }
    case "INITIALMESSAGES_SUCCESS": {
      return {
        lastMessage:
          actions.payload.chatMessages[actions.payload.chatMessages.length - 1],
        messages: [...actions.payload.chatMessages],
        loading: false,
        success: true,
        error: false,
      };
    }
    case "MESSAGE_SENDING": {
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
      };
    }
    case "MESSAGE_ERROR": {
      return {
        ...state,
        loading: false,
        error: actions.payload,
        success: false,
      };
    }
    case "MESSAGE_SEND": {
      return {
        loading: false,
        success: true,
        error: false,
        messages: state.messages.length
          ? [...state.messages, actions.payload]
          : [actions.payload],
        lastMessage: actions.payload,
      };
    }
    case "CLEAR_CHAT": {
      const newMessages = state.messages.filter(
        (message) => message.chat_id !== actions.payload.id
      );

      return {
        ...state,
        messages: newMessages,
      };
    }
    default: {
      return state;
    }
  }
}

export default messages;
