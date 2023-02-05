const INITIAL_STATE = {
  requests: [],
  success: false,
  error: null,
  loading: true,
};

function requests(state = INITIAL_STATE, actions) {
  console.log(actions)
  switch (actions.type) {
    case "INITIALREQUEST_LOADING": {
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
      };
    }
    case "INITIALREQUEST_ERROR": {
      return {
        ...state,
        loading: false,
        success: false,
        error: actions.payload.error,
      };
    }
    case "REMOVEREQUEST_SUCCESS": {
      const newRequests = state.requests.filter(
        (request) => request.id !== actions.payload.id
      );

      return {
        ...state,
        loading: false,
        error: null,
        success: "Request removed with successfully!",
        requests: newRequests,
      };
    }
    case "INITIALREQUESTS_SUCCESS": {
      return {
        requests: actions.payload.requests,
        loading: false,
        success: true,
        error: false,
      };
    }
    case "REMOVEREQUESTS_LOADING": {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case "REMOVEREQUESTS_ERROR": {
      return {
        ...state,
        loading: false,
        success: null,
        error: actions.payload.error,
      };
    }
    case "CREATEREQUEST_LOADING": {
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
      };
    }
    case "CREATEREQUEST_ERROR": {
      return {
        ...state,
        loading: false,
        success: false,
        error: actions.payload.error,
      };
    }
    case "CREATEREQUEST_SUCCESS": {
      return {
        requests: [...state.requests, actions.payload],
        loading: false,
        success: true,
        error: false,
      };
    }
    case "EDITREQUEST_LOADING": {
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
      };
    }
    case "EDITREQUEST_ERROR": {
      return {
        ...state,
        loading: false,
        success: false,
        error: actions.payload.error,
      };
    }
    case "EDITREQUEST_SUCCESS": {
      const newRequests = state.requests.filter(
        (request) => request.id !== actions.payload.id
      );
      newRequests.push(actions.payload);
      return {
        requests: newRequests,
        loading: false,
        success: true,
        error: false,
      };
    }
    case "ADDREQUEST": {
      return {
        ...state,
        requests: [...state.requests, actions.payload.request],
      };
    }
    default: {
      return state;
    }
  }
}

export default requests;
