const INITIAL_STATE = {
  user: null,
  users: [],
  error: null,
  success: null,
  loading: false,
};

function user(state = INITIAL_STATE, actions) {
  switch (actions.type) {
    case "SIGNUP_LOADING": {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case "CONNECTORDISCONNECT": {
      const newUsers = state.users.filter(
        (user) => user.id !== actions.payload.user2.id
      );
      newUsers.push(actions.payload.user2);

      if (actions.payload.user2.id === state.user.id) {
        return {
          ...state,
          user: actions.payload.user2,
          users: newUsers,
        };
      } else {
        return {
          ...state,
          users: newUsers,
        };
      }
    }
    case "SIGNUP_ERROR": {
      return {
        ...state,
        loading: false,
        success: null,
        error: actions.payload.error.response.data.error,
      };
    }
    case "SIGNUP_SUCCESS": {
      return {
        ...state,
        loading: false,
        error: null,
        success: "Sign Up with successfully!",
        user: actions.payload,
        users: [...state.users, actions.payload],
      };
    }
    case "EDITUSER_LOADING": {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case "EDITUSER_ERROR": {
      return {
        ...state,
        loading: false,
        success: null,
        error: actions.payload.error,
      };
    }
    case "EDITUSER_SUCCESS": {
      const newUsers = state.users.filter(
        (user) => user.id !== actions.payload.id
      );
      newUsers.push(actions.payload);
      return {
        ...state,
        loading: false,
        error: null,
        success: "User edited with successfully!",
        user: actions.payload,
        users: newUsers,
      };
    }
    case "ADDFRIEND_LOADING": {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case "ADDFRIEND_ERROR": {
      return {
        ...state,
        loading: false,
        success: null,
        error: actions.payload.error,
      };
    }
    case "ADDFRIEND_SUCCESS": {
      return {
        ...state,
        loading: false,
        error: null,
        success: "User added with successfully!",
        users: [...state.users, actions.payload],
      };
    }
    case "REMOVEFRIEND_LOADING": {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case "REMOVEFRIEND_ERROR": {
      return {
        ...state,
        loading: false,
        success: null,
        error: actions.payload.error,
      };
    }
    case "DELETEUSER": {
      const newUsers = state.users.filter(
        (user) => user.id !== actions.payload.userId
      );

      return {
        ...state,
        loading: false,
        error: null,
        success: "User removed with successfully!",
        users: newUsers,
      };
    }
    case "REMOVEFRIEND_SUCCESS": {
      const newUsers = state.users.filter(
        (user) => user.id !== actions.payload.id
      );

      return {
        ...state,
        loading: false,
        error: null,
        success: "User removed with successfully!",
        users: newUsers,
      };
    }
    case "ADDEDBYFRIEND_LOADING": {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case "ADDEDBYFRIEND_ERROR": {
      return {
        ...state,
        loading: false,
        success: null,
        error: actions.payload.error,
      };
    }
    case "ADDEDBYFRIEND_SUCCESS": {
      return {
        ...state,
        loading: false,
        error: null,
        success: "User added with successfully!",
        users: [...state.users, actions.payload],
      };
    }
    case "SIGNIN_LOADING": {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case "SIGNIN_ERROR": {
      return {
        ...state,
        loading: false,
        success: null,
        error: actions.payload.error,
      };
    }
    case "SIGNIN_SUCCESS": {
      return {
        ...state,
        loading: false,
        error: null,
        success: "Logged with successfully!",
        user: actions.payload,
        users: [...state.users, actions.payload],
      };
    }
    case "INITIALFRIENDS_LOADING": {
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
      };
    }
    case "INITIALFRIENDS_ERROR": {
      return {
        ...state,
        loading: false,
        success: false,
        error: actions.payload.error,
      };
    }
    case "INITIALFRIENDS_SUCCESS": {
      return {
        ...state,
        users: [...state.users, ...actions.payload.friends],
        loading: false,
        success: true,
        error: false,
      };
    }
    default:
      return state;
  }
}

export default user;
