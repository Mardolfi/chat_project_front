const INITIAL_STATE = {
  chatImages: [],
  error: null,
  loading: false,
  success: false,
};

function chatImages(state = INITIAL_STATE, actions) {
  switch (actions.type) {
    case "INITIALCHATIMAGES_LOADING": {
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
      };
    }
    case "INITIALCHATIMAGES_ERROR": {
      return {
        ...state,
        loading: false,
        success: false,
        error: actions.payload.error,
      };
    }
    case "INITIALCHATIMAGES_SUCCESS": {
      return {
        chatImages: [...actions.payload.chatImages],
        loading: false,
        success: true,
        error: false,
      };
    }
    case "NEWCHATIMAGE_SUCCESS": {
      const newChatImages = state.chatImages.filter(
        (chatImage) => chatImage.chat_id !== actions.payload.chat_id
      );
      newChatImages.push(actions.payload);
      return {
        loading: false,
        error: false,
        success: true,
        chatImages: newChatImages,
      };
    }
    case "NEWCHATIMAGE_ERROR": {
      return {
        ...state,
        loading: false,
        error: true,
        success: false,
      };
    }
    default: {
      return state;
    }
  }
}

export default chatImages;
