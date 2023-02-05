const INITIAL_STATE = {
  attachment: [],
  error: null,
  loading: false,
  success: false,
};

function attachment(state = INITIAL_STATE, actions) {
  switch (actions.type) {
    case "ATTACHMENTUPLOAD_LOADING": {
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
      };
    }
    case "ATTACHMENTUPLOAD_SUCCESS": {
      return {
        loading: false,
        error: false,
        success: true,
        attachment: [...state.attachment, actions.payload],
      };
    }
    case "ATTACHMENTUPLOAD_ERROR": {
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

export default attachment;
