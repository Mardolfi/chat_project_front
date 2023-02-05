const INITIAL_STATE = {
  activeChat: null,
  chats: [],
  success: false,
  error: null,
  loading: true,
};

function chat(state = INITIAL_STATE, actions) {
  switch (actions.type) {
    case "INITIALCHAT_LOADING": {
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
      };
    }
    case "REMOVECHAT": {
      const newChats = state.chats.filter(
        (chat) => chat.id !== actions.payload.id
      );

      return {
        ...state,
        activeChat: newChats.length > 0 ? newChats[newChats.length - 1] : null,
        chats: newChats,
      };
    }
    case "INITIALCHAT_ERROR": {
      return {
        ...state,
        loading: false,
        success: false,
        error: actions.payload.error,
      };
    }
    case "INITIALCHAT_SUCCESS": {
      return {
        activeChat: actions.payload.chats[0],
        chats: actions.payload.chats,
        loading: false,
        success: true,
        error: false,
      };
    }
    case "ADDCHAT": {
      return {
        ...state,
        chats: [...state.chats, actions.payload],
      };
    }
    case "EDITCHAT_ERROR": {
      return {
        ...state,
        loading: false,
        success: false,
        error: actions.payload.error,
      };
    }
    case "EDITCHAT_SUCCESS": {
      const chatListUpdated = state.chats.filter(
        (chat) => chat.id !== actions.payload.id
      );
      const newChatList = [];
      newChatList.push(actions.payload);
      chatListUpdated.map((chat) => {
        newChatList.push(chat);
      });
      return {
        activeChat: actions.payload,
        chats: newChatList,
        loading: false,
        success: true,
        error: false,
      };
    }
    case "SET_ACTIVE_CHAT": {
      return {
        ...state,
        activeChat: state.chats.find((chat) => chat.id == actions.payload.id),
      };
    }
    case "CHATCREATE_LOADING": {
      return {
        ...state,
        loading: true,
      };
    }
    case "CHATCREATE_SUCCESS": {
      return {
        loading: false,
        error: false,
        success: true,
        chats: [...state.chats, actions.payload],
        activeChat: actions.payload,
      };
    }
    case "CHATCREATE_ERROR": {
      return {
        ...state,
        loading: false,
        error: true,
        success: false,
      };
    }
    default:
      return state;
  }
}

export default chat;
