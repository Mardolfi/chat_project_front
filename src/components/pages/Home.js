import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  addAChat,
  addARequest,
  addedFriend,
  attachmentCreate,
  connectOrDisconnectUser,
  createMessage,
  deleteARequest,
  deleteUser,
  editRequest,
  editUser,
  getInitialAttachmentRequest,
  getInitialChatImagesRequests,
  getInitialChatRequests,
  getInitialFriendsRequests,
  getInitialMessagesRequests,
  getInitialProfileImagesRequests,
  getInitialRequestsRequests,
  profileImageCreate,
  removeAChat,
  sendANewRequest,
} from "../../store/actions";
import Aside from "../layout/Aside";
import Chat from "../layout/Chat";
import Header from "../layout/Header";
import loading2 from "../../img/loadingblack.png";
import Dropzone from "react-dropzone";
import {
  AiOutlineCloseCircle,
  AiOutlineInfoCircle,
  AiOutlinePlus,
  AiOutlineSearch,
} from "react-icons/ai";
import UserCard from "../project/UserCard";
import api from "../../services/api";
import { io } from "socket.io-client";
import RequestCard from "../project/RequestCard";

const socket = io("http://localhost:3333");

function Home({
  chat,
  messages,
  user,
  initialChatRequest,
  initialChatImagesRequest,
  initialMessagesRequest,
  chatImages,
  initialProfileImagesRequest,
  profileImages,
  newProfileImage,
  editProfile,
  friends,
  connectOrDisconnectAUser,
  initialRequestsRequests,
  requests,
  addRequest,
  createRequest,
  addedByFriend,
  editARequest,
  initialFriendsRequests,
  deleteAUser,
  deleteRequest,
  addChat,
  removeChat,
  createAMessage,
  attachments,
  createAttachment,
  initialAttachmentRequest
}) {
  const navigate = useNavigate();
  const [profileIsActive, setProfileIsActive] = useState(false);
  const [activeEditProfile, setActiveEditProfile] = useState(false);
  const [activeInfoProfile, setActiveInfoProfile] = useState(false);
  const [addFriendInput, setAddFriendInput] = useState("");
  const [addFriends, setAddFriends] = useState(false);
  const [activeMyFriends, setActiveMyFriends] = useState(false);
  const [friendsActive, setFriendsActive] = useState(false);
  const [editProfileImage, setEditProfileImage] = useState();
  const [profileImage, setProfileImage] = useState();
  const [editProfileFirstNameInput, setEditProfileFirstNameInput] = useState();
  const [editProfileLastNameInput, setEditProfileLastNameInput] = useState();
  const [editProfileEmailInput, setEditProfileEmailInput] = useState();
  const [editProfilePasswordInput, setEditProfilePasswordInput] = useState();
  const [myFriends, setMyFriends] = useState([]);
  const [activeMyRequests, setActiveMyRequests] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user) {
      initialChatRequest(user.id);
      initialProfileImagesRequest(user.id);
      initialRequestsRequests(user.id);
      initialFriendsRequests(user.id);
      setEditProfileEmailInput(user.email);
      setEditProfileFirstNameInput(user.first_name);
      setEditProfileLastNameInput(user.last_name);
      setEditProfilePasswordInput(user.password);
      socket.emit("userConnected", user.id);
    } else {
      navigate("/signin");
    }
  }, []);

  useEffect(() => {
    socket.on("userNewRequest", (request) => {
      if (request && user) {
        if (request.recipient_id === user.id) {
          addRequest(request);
        }
      }
    });

    socket.on("addedByUser", (userAddedId, userAddingId) => {
      if (user && userAddedId && userAddingId) {
        if (userAddedId === user.id) {
          addedByFriend(userAddingId);
        }
      }
    });

    socket.on("requestHasEdited", (request) => {
      if (request && user) {
        if (request.sender_id === user.id) {
          editARequest(request);
        }
      }
    });

    socket.on("userAddingAnotherUserInAChat", (id, activeChat) => {
      if (user) {
        if (user.id === id) {
          addChat(activeChat);
        }
      }
    });

    socket.on("userRemovingAnotherUserInAChat", (id, activeChat) => {
      if (user) {
        if (user.id === id) {
          removeChat(activeChat);
        }
      }
    });
  }, []);

  useEffect(() => {
    socket.off("userSendingAAttachment").on("userSendingAAttachment", (attachment, messageId) => {
      if(messages.messages.some((message) => message.id === messageId)){
        if(attachments.some((attachment2) => attachment2.id === attachment.id)){
          createAttachment(attachment)
        }
      }
    })
  }, [messages, attachments])

  useEffect(() => {
    myFriends.map((friend) => {
      initialProfileImagesRequest(friend.id)
    })
  }, [myFriends])

  useEffect(() => {
    socket.off("userSendingAMessage").on("userSendingAMessage", (userId, chatId, message) => {
      if (chat.chats.some((chat2) => chat2.id === chatId)) {
        if (user.id !== userId) {
          createAMessage(message);
        }
      }
    });
  }, [chat.chats]);

  useEffect(() => {
    if(messages.messages.length > 0){
      messages.messages.map((message) => {
        initialAttachmentRequest(message.id);
      })
    }
  }, [messages.messages])

  useEffect(() => {
    socket.off("requestRemoved").on("requestRemoved", (request2) => {
      if (request2 && user) {
        if (requests.some((request) => request.id === request2.id)) {
          deleteRequest(request2);
        }
      }
    });
  }, [requests]);

  useEffect(() => {
    if (user && friends.length > 0) {
      setMyFriends(friends.filter((friend) => friend.id !== user.id));
    }

    socket.off("userConnecting").on("userConnecting", (user2) => {
      if (user2 && friends.length > 0) {
        if (friends.some((friend) => friend.id === user2.id)) {
          connectOrDisconnectAUser(user2);
        }
      }
    });

    socket.off("userDisconnecting").on("userDisconnecting", (user2) => {
      if (user2 && friends.length) {
        if (friends.some((friend) => friend.id === user2.id)) {
          connectOrDisconnectAUser(user2);
        }
      }
    });

    socket.off("removedByUser").on("removedByUser", (userRemoving) => {
      if (friends.length && userRemoving) {
        if (friends.some((friend) => friend.id == userRemoving)) {
          deleteAUser(userRemoving);
        }
      }
    });
  }, [friends]);

  function searchUsers(e) {
    e.preventDefault();

    if (addFriendInput) {
      if (addFriendInput.includes(" ")) {
        api
          .get(
            `/finduser/name?firstname=${
              addFriendInput.split(" ")[0]
            }&lastname=${addFriendInput.split(" ")[1]}`
          )
          .then((res) => {
            setUsers(res.data);
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else {
        api
          .get(`/finduser/name?firstname=${addFriendInput}`)
          .then((res) => {
            setUsers(res.data);
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    }
  }

  useEffect(() => {
    if (chat.chats.length > 0) {
      initialMessagesRequest(chat.chats);
      initialChatImagesRequest(chat.chats);
    }
  }, [chat.chats]);

  useEffect(() => {
    setProfileImage(
      profileImages.find((profileImage) => profileImage.user_id == user.id)
    );
  }, [profileImages]);

  return (
    <Container>
      {!user ||
      chat.loading ||
      user.loading ||
      messages.loading ||
      chatImages.loading ? (
        <LoadingContainer>
          <img src={loading2} />
        </LoadingContainer>
      ) : (
        <>
          <InfoProfileContainer activeInfoProfile={activeInfoProfile}>
            <CloseEditProfile
              onClick={() => {
                setProfileIsActive(true);
                setActiveInfoProfile(false);
              }}
            />
            <p>Image:</p>
            <ProfileImage
              src={
                profileImage
                  ? profileImage.url
                  : "https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg"
              }
            />
            <p>First Name:</p>
            <span>{user.first_name}</span>
            <p>Last Name:</p>
            <span>{user.last_name}</span>
            <p>Email:</p>
            <span>{user.email}</span>
            <p>Password:</p>
            <span>{user.password}</span>
          </InfoProfileContainer>
          <EditProfileContainer activeEditProfile={activeEditProfile}>
            <CloseEditProfile
              onClick={() => {
                setProfileIsActive(true);
                setActiveEditProfile(false);
                setEditProfileImage(false);
              }}
            />
            <label>Image:</label>
            <Dropzone
              accept={{ "image/png": [".png"], "image/jpeg": [".jpeg"] }}
              onDropAccepted={(file) => {
                setEditProfileImage(file[file.length - 1]);
              }}
            >
              {({ getInputProps, getRootProps }) => (
                <BackEditProfileImage {...getRootProps()}>
                  <EditProfileImage
                    src={
                      editProfileImage
                        ? URL.createObjectURL(editProfileImage)
                        : profileImage
                        ? profileImage.url
                        : "https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg"
                    }
                  >
                    <input {...getInputProps()} />
                  </EditProfileImage>
                </BackEditProfileImage>
              )}
            </Dropzone>
            <AddImageIcon />
            <label>First Name:</label>
            <input
              type={"text"}
              value={editProfileFirstNameInput}
              onChange={(e) => {
                setEditProfileFirstNameInput(e.target.value);
              }}
            />
            <label>Last Name:</label>
            <input
              type={"text"}
              value={editProfileLastNameInput}
              onChange={(e) => {
                setEditProfileLastNameInput(e.target.value);
              }}
            />
            <label>Email:</label>
            <input
              type={"text"}
              value={editProfileEmailInput}
              onChange={(e) => {
                setEditProfileEmailInput(e.target.value);
              }}
            />
            <label>Password:</label>
            <input
              type={"text"}
              value={editProfilePasswordInput}
              onChange={(e) => {
                setEditProfilePasswordInput(e.target.value);
              }}
            />
            <button
              onClick={() => {
                if (
                  editProfileFirstNameInput &&
                  editProfileLastNameInput &&
                  editProfileEmailInput &&
                  editProfilePasswordInput
                ) {
                  editProfile(
                    user.id,
                    editProfileFirstNameInput,
                    editProfileLastNameInput,
                    editProfileEmailInput,
                    editProfilePasswordInput
                  );

                  if (editProfileImage) {
                    newProfileImage(user.id, editProfileImage);
                  }

                  setActiveEditProfile(false);
                  setProfileIsActive(false);
                  setEditProfileImage(false);
                }
              }}
            >
              Edit Profile
            </button>
          </EditProfileContainer>
          <MoreInfoProfile profileIsActive={profileIsActive}>
            <button
              onClick={() => {
                setActiveInfoProfile(true);
                setProfileIsActive(false);
              }}
            >
              INFO
            </button>
            <button
              onClick={() => {
                setActiveEditProfile(true);
                setProfileIsActive(false);
              }}
            >
              EDIT
            </button>
          </MoreInfoProfile>
          <FriendsInfo friendsActive={friendsActive}>
            <button
              onClick={() => {
                setFriendsActive(false);
                setAddFriends(true);
              }}
            >
              ADD FRIENDS
            </button>
            <button
              onClick={() => {
                setFriendsActive(false);
                setActiveMyFriends(true);
              }}
            >
              MY FRIENDS
            </button>
            <button
              onClick={() => {
                setFriendsActive(false);
                setActiveMyRequests(true);
              }}
            >
              REQUESTS
            </button>
          </FriendsInfo>
          <AddFriendsInfo addFriends={addFriends}>
            <CloseEditChat
              onClick={() => {
                setFriendsActive(true);
                setAddFriends(false);
                setAddFriendInput("");
                setUsers([]);
              }}
            />
            <Form>
              <form onSubmit={searchUsers}>
                <input
                  type={"text"}
                  value={addFriendInput}
                  placeholder={"Name of your future friend!"}
                  onChange={(e) => setAddFriendInput(e.target.value)}
                />
                <button>
                  <AiOutlineSearch />
                </button>
              </form>
            </Form>

            <ResultList>
              {users.length > 0 ? (
                users.map((user2) => (
                  <UserCard
                    type={"addFriend"}
                    user={user2}
                    key={user2.id}
                    handleClick={(id) => {
                      createRequest(user.id, id);
                    }}
                  />
                ))
              ) : (
                <WithoutUsers>
                  <AiOutlineInfoCircle size={40} color={"#999"} />
                  <h1>We not found :(</h1>
                  <p>Maybe you write wrong, see that!!</p>
                </WithoutUsers>
              )}
            </ResultList>
          </AddFriendsInfo>
          <MyFriends activeMyFriends={activeMyFriends}>
            <CloseEditChat
              onClick={() => {
                setFriendsActive(true);
                setActiveMyFriends(false);
              }}
            />
            <ResultMyFriends>
              {myFriends.length > 0 ? (
                myFriends.map((friend) => (
                  <UserCard user={friend} key={friend.id} type={"myFriends"} />
                ))
              ) : (
                <WithoutFriends>
                  <AiOutlineInfoCircle size={40} color={"#999"} />
                  <h1>You don't have a friend??!</h1>
                  <p>Add a user NOW!!</p>
                </WithoutFriends>
              )}
            </ResultMyFriends>
          </MyFriends>
          <RequestFriends activeMyRequests={activeMyRequests}>
            <CloseEditChat
              onClick={() => {
                setFriendsActive(true);
                setActiveMyRequests(false);
              }}
            />
            <ResultRequestFriends>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <RequestCard
                    userSender={request.sender_id}
                    userRecipient={request.recipient_id}
                    isAccepted={request.is_accepted}
                    isRejected={request.is_rejected}
                    id={request.id}
                    key={request.id}
                  />
                ))
              ) : (
                <WithoutRequests>
                  <AiOutlineInfoCircle size={40} color={"#999"} />
                  <h1>You don't have requests??!</h1>
                  <p>Maybe his request lost :(</p>
                </WithoutRequests>
              )}
            </ResultRequestFriends>
          </RequestFriends>
          <Header
            handleProfileClick={() => setProfileIsActive(!profileIsActive)}
            handleFriendsClick={() => setFriendsActive(!friendsActive)}
          />
          <Content>
            <Aside />
            <Chat />
          </Content>
        </>
      )}
    </Container>
  );
}

const ResultRequestFriends = styled.div`
  width: 100%;
  height: 150px;
  background: #eee;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: auto;
  padding: 5px;
`;

const ResultMyFriends = styled.div`
  width: 100%;
  height: 150px;
  background: #eee;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: auto;
  padding: 5px;
`;

const WithoutRequests = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #666;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
`;

const WithoutFriends = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #666;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
`;

const MyFriends = styled.div`
  position: absolute;
  background: white;
  right: 400px;
  top: 0;
  min-width: 300px;
  display: flex;
  gap: 10px;
  flex-direction: column;
  padding: 30px 5px 5px 5px;
  gap: 2px;
  transition: 0.3s;
  z-index: 2;
  box-shadow: 0px 0px 10px -5px black;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  transform: ${(props) =>
    props.activeMyFriends ? "translateY(0)" : "translateY(-110%)"};
`;

const RequestFriends = styled.div`
  position: absolute;
  background: white;
  right: 400px;
  top: 0;
  min-width: 300px;
  display: flex;
  gap: 10px;
  flex-direction: column;
  padding: 30px 5px 5px 5px;
  gap: 2px;
  transition: 0.3s;
  z-index: 2;
  box-shadow: 0px 0px 10px -5px black;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  transform: ${(props) =>
    props.activeMyRequests ? "translateY(0)" : "translateY(-110%)"};
`;

const Form = styled.div`
  padding-left: 30px;
`;

const CloseEditChat = styled(AiOutlineCloseCircle)`
  position: absolute;
  top: 5px;
  left: 5px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  opacity: 0.8;
  transition: 0.3s;

  :hover {
    opacity: 1;
  }
`;

const WithoutUsers = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #666;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
`;

const ResultList = styled.div`
  width: 100%;
  height: 150px;
  background: #eee;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: auto;
  padding: 5px;
`;

const AddFriendsInfo = styled.div`
  position: absolute;
  background: white;
  right: 400px;
  top: 0;
  min-width: 300px;
  display: flex;
  gap: 10px;
  flex-direction: column;
  padding: 5px;
  transition: 0.3s;
  z-index: 2;
  box-shadow: 0px 0px 10px -5px black;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  transform: ${(props) =>
    props.addFriends ? "translateY(0)" : "translateY(-110%)"};

  form {
    width: 100%;
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    padding: 5px;
    border-radius: 10px;
    input {
      width: 100%;
      border: none;
      outline: none;
      background: none;

      :focus {
        border: none;
        background: none;
        outline: none;
      }
    }

    button {
      background: none;
      border: none;
      cursor: pointer;
      opacity: 0.8;
      transition: 0.3s;

      :hover {
        opacity: 1;
      }
    }
  }
`;

const FriendsInfo = styled.div`
  position: absolute;
  background: white;
  right: 250px;
  top: 0;
  display: flex;
  flex-direction: column;
  padding: 5px;
  transition: 0.3s;
  z-index: 2;
  box-shadow: 0px 0px 10px -5px black;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  transform: ${(props) =>
    props.friendsActive ? "translateY(0)" : "translateY(-110%)"};

  button {
    background: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    transition: 0.4s;
    opacity: 0.8;

    :hover {
      opacity: 1;
    }
  }

  button:not(:last-child) {
    border-bottom: 1px solid #ddd;
  }
`;

const BackEditProfileImage = styled.div`
  background: ${(props) => (props.isDragAccept ? "green !important" : "#000")};
  background: ${(props) => (props.isDragReject ? "red !important" : "#000")};
  border-radius: 50%;
`;

const CloseEditProfile = styled(AiOutlineCloseCircle)`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  opacity: 0.8;
  transition: 0.3s;

  :hover {
    opacity: 1;
  }
`;

const ProfileImage = styled.div`
  height: 50px;
  width: 50px;
  background-image: ${(props) => `url(${props.src})`};
  background-position: center;
  background-size: cover;
  border-radius: 50%;
`;

const EditProfileImage = styled(ProfileImage)`
  cursor: pointer;
  border: 1px solid #eee;
  opacity: 0.5;
  transition: 0.3s;

  :hover {
    opacity: 0.3;
  }
`;

const AddImageIcon = styled(AiOutlinePlus)`
  position: absolute;
  top: 60px;
  color: white;
  pointer-events: none;
  width: 25px;
  height: 25px;
`;

const InfoProfileContainer = styled.div`
  position: absolute;
  right: 320px;
  z-index: 3;
  background: white;
  transition: 0.4s;
  transform: ${(props) =>
    props.activeInfoProfile ? "translateY(0)" : "translateY(-110%)"};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 0;
  box-shadow: 0px 0px 10px -5px black;
  gap: 10px;
  padding: 14px;

  span {
    color: #999;
    font-size: 0.9rem;
  }
`;

const EditProfileContainer = styled.div`
  position: absolute;
  top: 0;
  z-index: 3;
  background: white;
  transition: 0.4s;
  transform: ${(props) =>
    props.activeEditProfile ? "translateY(0)" : "translateY(-110%)"};
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  right: 320px;
  box-shadow: 0px 0px 10px -5px black;
  gap: 10px;
  padding: 14px;

  input {
    text-align: center;
  }

  button {
    margin-top: 10px;
    cursor: pointer;
    opacity: 0.8;
    background: #999;
    border: 1px solid white;
    color: white;
    padding: 8px 14px;
    border-radius: 20px;
    transition: 0.3s;

    :hover {
      opacity: 1;
    }
  }
`;

const MoreInfoProfile = styled.div`
  position: absolute;
  background: white;
  right: 200px;
  top: 0;
  display: flex;
  flex-direction: column;
  padding: 5px;
  transition: 0.3s;
  z-index: 2;
  box-shadow: 0px 0px 10px -5px black;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  transform: ${(props) =>
    props.profileIsActive ? "translateY(0)" : "translateY(-110%)"};

  button {
    background: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    transition: 0.4s;
    opacity: 0.8;

    :hover {
      opacity: 1;
    }
  }

  button:not(:last-child) {
    border-bottom: 1px solid #ddd;
  }
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100px;
    height: 100px;
  }
`;

const Content = styled.div`
  width: 100%;
  height: 85vh;
  display: flex;
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: #f5f7fb;
  overflow: hidden;
`;

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    friends: state.user.users,
    chat: state.chat,
    messages: state.messages,
    chatImages: state.chatImages,
    profileImages: state.profileImages.profileImages,
    requests: state.requests.requests,
    attachments: state.attachment.attachment
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initialChatRequest: (id) => {
      dispatch(getInitialChatRequests(id));
    },
    initialMessagesRequest: (id) => {
      dispatch(getInitialMessagesRequests(id));
    },
    initialChatImagesRequest: (id) => {
      dispatch(getInitialChatImagesRequests(id));
    },
    initialProfileImagesRequest: (id) => {
      dispatch(getInitialProfileImagesRequests(id));
    },
    initialRequestsRequests: (id) => {
      dispatch(getInitialRequestsRequests(id));
    },
    initialFriendsRequests: (id) => {
      dispatch(getInitialFriendsRequests(id));
    },
    newProfileImage: (id, file) => {
      dispatch(profileImageCreate(id, file));
    },
    addChat: (chat) => {
      dispatch(addAChat(chat));
    },
    createAMessage: (message) => {
      dispatch(createMessage(message));
    },
    removeChat: (chat) => {
      dispatch(removeAChat(chat));
    },
    editProfile: (id, firstname, lastname, email, password) => {
      dispatch(editUser(id, firstname, lastname, email, password));
    },
    connectOrDisconnectAUser: (id) => {
      dispatch(connectOrDisconnectUser(id));
    },
    createRequest: (userSender, userRecepting) => {
      dispatch(sendANewRequest(userSender, userRecepting));
    },
    addRequest: (request) => {
      dispatch(addARequest(request));
    },
    addedByFriend: (id) => {
      dispatch(addedFriend(id));
    },
    editARequest: (request) => {
      dispatch(editRequest(request));
    },
    deleteAUser: (userId) => {
      dispatch(deleteUser(userId));
    },
    deleteRequest: (request) => {
      dispatch(deleteARequest(request));
    },
    createAttachment: (attachment) => {
      dispatch(attachmentCreate(attachment))
    },
    initialAttachmentRequest: (messageId) => {
      dispatch(getInitialAttachmentRequest(messageId))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
