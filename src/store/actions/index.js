import api from "../../services/api";
import { io } from "socket.io-client";

const socket = io("http://localhost:3333");

export function signUp(firstName, lastName, email, password) {
  const user = {
    first_name: firstName,
    last_name: lastName,
    email,
    password,
    is_online: false,
  };

  return async (dispatch, getState) => {
    dispatch({
      type: "SIGNUP_LOADING",
    });

    api
      .post("/users", user)
      .then((res) => {
        dispatch({
          type: "SIGNUP_SUCCESS",
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: "SIGNUP_ERROR",
          payload: {
            error: err,
          },
        });
      });
  };
}

export function declineARequest(id) {
  return async (dispatch, getState) => {
    dispatch({
      type: "EDITREQUEST_LOADING",
    });

    api
      .patch(`/requests/${id}`, { is_rejected: true })
      .then((res) => {
        socket.emit("requestEdited", res.data);
        dispatch({
          type: "EDITREQUEST_SUCCESS",
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: "EDITREQUEST_ERROR",
          payload: {
            error: err.response.data.error,
          },
        });
      });
  };
}

export function editRequest(request) {
  return {
    type: "EDITREQUEST_SUCCESS",
    payload: request,
  };
}

export function acceptARequest(id) {
  return async (dispatch, getState) => {
    dispatch({
      type: "EDITREQUEST_LOADING",
    });

    api
      .patch(`/requests/${id}`, { is_accepted: true })
      .then((res) => {
        socket.emit("requestEdited", res.data);
        dispatch({
          type: "EDITREQUEST_SUCCESS",
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: "EDITREQUEST_ERROR",
          payload: {
            error: err.response.data.error,
          },
        });
      });
  };
}

export function addedFriend(id) {
  return async (dispatch, getState) => {
    dispatch({
      type: "ADDEDBYFRIEND_LOADING",
    });

    api
      .get(`/users/${id}`)
      .then((res) => {
        dispatch({
          type: "ADDEDBYFRIEND_SUCCESS",
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: "ADDEDBYFRIEND_ERROR",
          payload: {
            error: err.response.data.error,
          },
        });
      });
  };
}

export function addFriend(adding, beAdded) {
  return async (dispatch, getState) => {
    dispatch({
      type: "ADDFRIEND_LOADING",
    });

    api
      .post(`/users/${adding}/addfriend/${beAdded}`)
      .then((res) => {
        socket.emit("userAddFriend", beAdded, adding);
        dispatch({
          type: "ADDFRIEND_SUCCESS",
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: "ADDFRIEND_ERROR",
          payload: {
            error: err.message,
          },
        });
      });
  };
}

export function removeAChat(chat) {
  return {
    type: "REMOVECHAT",
    payload: chat,
  };
}

export function deleteARequest(request) {
  return {
    type: "REMOVEREQUEST_SUCCESS",
    payload: request,
  };
}

export function addAChat(chat) {
  return {
    type: "ADDCHAT",
    payload: chat,
  };
}

export function removeRequest(id) {
  return (dispatch, getState) => {
    dispatch({
      type: "REMOVEREQUEST_LOADING",
    });

    api
      .delete(`/requests/${id}`)
      .then((res) => {
        socket.emit("userRemoveRequest", res.data);
        dispatch({
          type: "REMOVEREQUEST_SUCCESS",
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: "REMOVEREQUEST_ERROR",
          payload: {
            error: err.message,
          },
        });
      });
  };
}

export function deleteUser(userId) {
  return {
    type: "DELETEUSER",
    payload: {
      userId,
    },
  };
}

export function removeFriend(userId, id) {
  return async (dispatch, getState) => {
    dispatch({
      type: "REMOVEFRIEND_LOADING",
    });

    api
      .delete(`/users/${userId}/friends/${id}`)
      .then((res) => {
        socket.emit("userRemoveFriend", userId);
        dispatch({
          type: "REMOVEFRIEND_SUCCESS",
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: "REMOVEFRIEND_ERROR",
          payload: {
            error: err.message,
          },
        });
      });
  };
}

export function chatImageCreate(id, file) {
  return async (dispatch, getState) => {
    const data = new FormData();

    data.append("file", file, file.name);

    api
      .post(`/chats/${id}/image`, data)
      .then((res) => {
        dispatch({
          type: "NEWCHATIMAGE_SUCCESS",
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: "NEWCHATIMAGE_ERROR",
          payload: {
            error: err.message,
          },
        });
      });
  };
}

export function editUser(id, firstname, lastname, email, password) {
  return async (dispatch, getState) => {
    dispatch({
      type: "EDITUSER_LOADING",
    });

    const newUser = {
      first_name: firstname,
      last_name: lastname,
      email,
      password,
      is_online: true,
    };

    api
      .patch(`/users/${id}`, newUser)
      .then((res) => {
        dispatch({
          type: "EDITUSER_SUCCESS",
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: "EDITUSER_ERROR",
          payload: {
            error: err.message,
          },
        });
      });
  };
}

export function profileImageCreate(id, file) {
  return async (dispatch, getState) => {
    const data = new FormData();

    data.append("file", file, file.name);

    api
      .post(`/users/${id}/image`, data)
      .then((res) => {
        dispatch({
          type: "NEWPROFILEIMAGE_SUCCESS",
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: "NEWPROFILEIMAGE_ERROR",
          payload: {
            error: err.message,
          },
        });
      });
  };
}

export function editOneChat(id, title, about, email, password) {
  return async (dispatch, getState) => {
    const newChat = {
      title,
      about,
      email,
      password,
    };

    api
      .patch(`/chats/${id}`, newChat)
      .then((res) => {
        dispatch({
          type: "EDITCHAT_SUCCESS",
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: "EDITCHAT_ERROR",
          payload: {
            error: err.message,
          },
        });
      });
  };
}

export function signIn(email, password) {
  return async (dispatch, getState) => {
    dispatch({
      type: "SIGNIN_LOADING",
    });

    api
      .get(`/users/login?email=${email}&password=${password}`)
      .then((res) => {
        dispatch({
          type: "SIGNIN_SUCCESS",
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: "SIGNIN_ERROR",
          payload: {
            error: err.response.data.error,
          },
        });
      });
  };
}

export function addARequest(request) {
  return {
    type: "ADDREQUEST",
    payload: {
      request,
    },
  };
}

export function sendANewRequest(userSender, userRecepting) {
  return async (dispatch, getState) => {
    dispatch({
      type: "CREATEREQUEST_LOADING",
    });

    const request = {
      is_accepted: false,
      is_rejected: false,
    };

    api
      .post(`/users/${userSender}/friends/${userRecepting}`, request)
      .then((res) => {
        socket.emit("newRequest", res.data);
        dispatch({
          type: "CREATEREQUEST_SUCCESS",
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: "CREATEREQUEST_ERROR",
          payload: {
            error: err.message,
          },
        });
      });
  };
}

export function getInitialRequestsRequests(id) {
  return async (dispatch, getState) => {
    dispatch({
      type: "INITIALREQUESTS_LOADING",
    });

    api
      .get(`/users/${id}/requests/sender`)
      .then((resSender) => {
        api
          .get(`/users/${id}/requests/recipient`)
          .then((resRecipient) => {
            dispatch({
              type: "INITIALREQUESTS_SUCCESS",
              payload: {
                requests: [...resSender.data, ...resRecipient.data],
              },
            });
          })
          .catch((err) => {
            dispatch({
              type: "INITIALREQUESTS_ERROR",
              payload: {
                error: err.message,
              },
            });
          });
      })
      .catch((err) => {
        dispatch({
          type: "INITIALREQUESTS_ERROR",
          payload: {
            error: err.message,
          },
        });
      });
  };
}

export function chatCreate(user) {
  return async (dispatch, getState) => {
    dispatch({
      type: "CHATCREATE_LOADING",
    });

    const newChat = {
      title: "New Chat",
      about: `A new chat created by ${user.first_name} ${user.last_name}!`,
    };

    api
      .post(`/users/${user.id}/chat`, newChat)
      .then((res) => {
        dispatch({
          type: "CHATCREATE_SUCCESS",
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: "CHATCREATE_ERROR",
          payload: err.message,
        });
      });
  };
}

export function clearChat(id) {
  return {
    type: "CLEAR_CHAT",
    payload: {
      id,
    },
  };
}

export function getInitialChatRequests(id) {
  return (dispatch, getState) => {
    dispatch({
      type: "INITIALCHAT_LOADING",
    });

    const userChats = [];

    api
      .get(`/users/${id}/chat`)
      .then((resUserChats) => {
        resUserChats.data.map((userChat) => {
          userChats.push(userChat);
        });
      })
      .then(() => {
        dispatch({
          type: "INITIALCHAT_SUCCESS",
          payload: {
            chats: userChats,
          },
        });
      })
      .catch((err) => {
        dispatch({
          type: "INITIALCHAT_ERROR",
          payload: {
            error: err.message,
          },
        });
      });
  };
}

export function connectOrDisconnectUser(user2) {
  return {
    type: "CONNECTORDISCONNECT",
    payload: {
      user2,
    },
  };
}

export function getInitialChatImagesRequests(chats) {
  return (dispatch, getState) => {
    dispatch({
      type: "INITIALCHATIMAGES_LOADING",
    });

    const chatImages = [];

    chats.map((chat) => {
      api
        .get(`/chats/${chat.id}/image`)
        .then((res) => {
          chatImages.push(res.data);
        })
        .then(() => {
          dispatch({
            type: "INITIALCHATIMAGES_SUCCESS",
            payload: {
              chatImages,
            },
          });
        })
        .catch((err) => {
          dispatch({
            type: "INITIALCHATIMAGES_ERROR",
            payload: {
              error: err.message,
            },
          });
        });
    });
  };
}

export function getInitialFriendsRequests(id) {
  return (dispatch, getState) => {
    dispatch({
      type: "INITIALFRIENDS_LOADING",
    });

    const friends = [];

    api
      .get(`/users/${id}/friendsadded`)
      .then((res) => {
        friends.push(...res.data);
      })
      .then(() => {
        api.get(`/users/${id}/addedfriends`).then((res) => {
          friends.push(...res.data);
          if (friends.length > 0) {
            dispatch({
              type: "INITIALFRIENDS_SUCCESS",
              payload: {
                friends,
              },
            });
          } else {
            dispatch({
              type: "INITIALFRIENDS_ERROR",
              payload: {
                error: "This user doesn't have friends yet!",
              },
            });
          }
        });
      })
      .catch((err) => {
        dispatch({
          type: "INITIALFRIENDS_ERROR",
          payload: {
            error: err.message,
          },
        });
      });
  };
}

export function getInitialProfileImagesRequests(id) {
  return (dispatch, getState) => {
    dispatch({
      type: "INITIALPROFILEIMAGES_LOADING",
    });

    api
      .get(`/users/${id}/image`)
      .then((res) => {
        dispatch({
          type: "INITIALPROFILEIMAGES_SUCCESS",
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: "INITIALPROFILEIMAGES_ERROR",
          payload: {
            error: err.message,
          },
        });
      });
  };
}

export function getInitialMessagesRequests(chats) {
  return (dispatch, getState) => {
    dispatch({
      type: "INITIALMESSAGES_LOADING",
    });

    const chatMessages = [];

    chats.map((chat) => {
      api
        .get(`/chats/${chat.id}/messages`)
        .then((res) => {
          res.data.map((message) => {
            chatMessages.push(message);
          });
        })
        .then(() => {
          dispatch({
            type: "INITIALMESSAGES_SUCCESS",
            payload: {
              chatMessages,
            },
          });
        })
        .catch((err) => {
          dispatch({
            type: "INITIALMESSAGES_ERROR",
            payload: {
              error: err.message,
            },
          });
        });
    });
  };
}

export function activeChat(id) {
  return {
    type: "SET_ACTIVE_CHAT",
    payload: {
      id,
    },
  };
}

export function createMessage(message) {
  return {
    type: "MESSAGE_SEND",
    payload: message,
  };
}

export function attachmentCreate(attachment) {
  return {
    type: "ATTACHMENTUPLOAD_SUCCESS",
    payload: attachment,
  };
}

export function getInitialAttachmentRequest(messageId) {
  return async (dispatch, getState) => {
    api.get(`/messages/${messageId}/attachments`).then((res) => {
      if (res.data.length > 0) {
        dispatch({
          type: "ATTACHMENTUPLOAD_SUCCESS",
          payload: res.data[res.data.length - 1],
        });
      }
    });
  };
}

export function sendAMessage(message, chatId, userId, attachment) {
  return async (dispatch, getState) => {
    dispatch({
      type: "MESSAGE_SENDING",
    });

    const messageBody = {
      body: message,
    };

    api
      .post(`/users/${userId}/chats/${chatId}/messages`, messageBody)
      .then((res) => {
        if (attachment) {
          const data = new FormData();

          data.append("file", attachment, attachment.name);

          api
            .post(`/messages/${res.data.id}/attachments`, data)
            .then((res) => {
              socket.emit("userSendAAttachment", res.data, res.data.message_id);
              dispatch({
                type: "ATTACHMENTUPLOAD_SUCCESS",
                payload: res.data,
              });
            })
            .catch((err) => {
              dispatch({
                type: "ATTACHMENTUPLOAD_ERROR",
                payload: {
                  error: err.message,
                },
              });
            });
        }
        socket.emit("userSendAMessage", userId, chatId, res.data);
        dispatch({
          type: "MESSAGE_SEND",
          payload: res.data,
        });
      });
  };
}
