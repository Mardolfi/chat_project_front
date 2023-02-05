const INITIAL_STATE = {
  profileImages: [],
  error: null,
  loading: false,
  success: false,
};

function profileImages(state = INITIAL_STATE, actions) {
  switch (actions.type) {
    case "INITIALPROFILEIMAGES_LOADING": {
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
      };
    }
    case "INITIALPROFILEIMAGES_ERROR": {
      return {
        ...state,
        loading: false,
        success: false,
        error: actions.payload.error,
      };
    }
    case "INITIALPROFILEIMAGES_SUCCESS": {
      return {
        profileImages: [...state.profileImages, actions.payload],
        loading: false,
        success: true,
        error: false,
      };
    }
    case "NEWPROFILEIMAGE_SUCCESS": {
      const newProfileImages = state.profileImages.filter(
        (profileImage) => profileImage.user_id !== actions.payload.user_id
      );
      newProfileImages.push(actions.payload);
      return {
        loading: false,
        error: false,
        success: true,
        profileImages: newProfileImages,
      };
    }
    case "NEWPROFILEIMAGE_ERROR": {
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

export default profileImages;
