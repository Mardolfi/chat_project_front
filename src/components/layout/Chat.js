import { connect } from "react-redux";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { MdAttachFile } from "react-icons/md";
import {
  AiOutlineInfoCircle,
  AiOutlinePlus,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { IoIosSend } from "react-icons/io";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import {
  chatImageCreate,
  clearChat,
  editOneChat,
  sendAMessage,
} from "../../store/actions";
import ChatMessages from "../project/ChatMessages";
import Dropzone from "react-dropzone";
import UserCard from "../project/UserCard";
import api from "../../services/api";
import { io } from "socket.io-client";

const socket = io("http://localhost:3333");

function Chat({
  user,
  activeChat,
  messageSend,
  messages,
  setClearChat,
  editChat,
  newChatImage,
  chatImages,
  friends,
}) {
  const [messageInput, setMessageInput] = useState("");
  const [messagesActive, setMessagesActive] = useState([]);
  const [activeMoreChat, setActiveMoreChat] = useState(false);
  const [activeEditChat, setActiveEditChat] = useState(false);
  const [activeInfoChat, setActiveInfoChat] = useState(false);
  const [activeChatUsers, setActiveChatUsers] = useState(false);
  const [activeAddUserToChat, setActiveAddUserToChat] = useState(false);
  const [myFriends, setMyFriends] = useState();
  const [editChatTitleInput, setEditChatTitleInput] = useState();
  const [editChatAboutInput, setEditChatAboutInput] = useState();
  const [editChatImage, setEditChatImage] = useState();
  const [activeEmojiContainer, setActiveEmojiContainer] = useState(false);
  const [chatImage, setChatImage] = useState();
  const [chatUsers, setChatUsers] = useState();
  const [emojis, setEmojis] = useState();
  const [isOnline, setIsOnline] = useState();
  const [attachment, setAttachment] = useState();
  const messagesContainer = useRef();

  useEffect(() => {
    if (activeChat) {
      api.get(`/chats/${activeChat.id}/users`).then((res) => {
        setChatUsers(res.data);
      });
    }
  }, [activeChat, friends]);

  useEffect(() => {
    if (chatUsers?.length > 0) {
      if (chatUsers.every((user) => user.is_online === true)) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    }
  }, [chatUsers]);

  useEffect(() => {
    fetch(
      "https://emoji-api.com/emojis?access_key=077bd39bf367901d63af798c8ab641ada7281eb9"
    )
      .then((res) => res.json())
      .then((data) => {
        setEmojis(data);
      });
  }, []);

  useEffect(() => {
    if (user && friends.length > 0) {
      setMyFriends(friends.filter((friend) => friend.id !== user.id));
    }
  }, [friends]);

  useEffect(() => {
    setMessagesActive(
      messages.filter((message) => message.chat_id == activeChat.id)
    );
    setActiveEditChat(false);
    setActiveMoreChat(false);
    setChatImage(
      chatImages.find((chatImage) => chatImage?.chat_id == activeChat?.id)
    );
    if (activeChat) {
      setEditChatTitleInput(activeChat.title);
      setEditChatAboutInput(activeChat.about);
    }
  }, [activeChat, messages, chatImages]);

  useEffect(() => {
    if ((messages.length > 0, messagesContainer.current)) {
      if (
        messagesContainer.current.children[
          messagesContainer.current.children.length - 1
        ]
      ) {
        setTimeout(() => {
          const container = Array.from(messagesContainer.current.children);
          messagesContainer.current.scrollTo({
            top: container[container.length - 1].offsetTop,
            behavior: "smooth",
          });
        }, 500);
      }
    }
  }, [messagesContainer.current, messages]);

  return (
    <Container activeChat={activeChat}>
      {activeChat && (
        <>
          <EmojiContainer activeEmojiContainer={activeEmojiContainer}>
            {emojis?.map((emoji) => (
              <Emoji
                onClick={() => {
                  setMessageInput(`${messageInput}${emoji.character}`);
                }}
              >
                {emoji.character}
              </Emoji>
            ))}
          </EmojiContainer>
          <InfoChatContainer activeInfoChat={activeInfoChat}>
            <CloseEditChat
              onClick={() => {
                setActiveMoreChat(true);
                setActiveInfoChat(false);
              }}
            />
            <p>Image:</p>
            <ChatImage
              src={
                chatImage
                  ? chatImage.url
                  : "https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg"
              }
            >
              {isOnline && <Online />}
            </ChatImage>
            <p>Title:</p>
            <span>{activeChat.title}</span>
            <p>About:</p>
            <span>{activeChat.about}</span>
          </InfoChatContainer>
          <EditChatContainer activeEditChat={activeEditChat}>
            <CloseEditChat
              onClick={() => {
                setActiveMoreChat(true);
                setActiveEditChat(false);
                setEditChatImage(false);
              }}
            />
            <label>Image:</label>
            <Dropzone
              accept={{ "image/png": [".png"], "image/jpeg": [".jpeg"] }}
              onDropAccepted={(file) => {
                setEditChatImage(file[file.length - 1]);
              }}
            >
              {({ getInputProps, getRootProps }) => (
                <BackEditChatImage {...getRootProps()}>
                  <EditChatImage
                    src={
                      editChatImage
                        ? URL.createObjectURL(editChatImage)
                        : chatImage
                        ? chatImage.url
                        : "https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg"
                    }
                  >
                    <input {...getInputProps()} />
                  </EditChatImage>
                </BackEditChatImage>
              )}
            </Dropzone>
            <AddImageIcon />
            <label>Title:</label>
            <input
              type={"text"}
              value={editChatTitleInput}
              onChange={(e) => {
                setEditChatTitleInput(e.target.value);
              }}
            />
            <label>About:</label>
            <input
              type={"text"}
              value={editChatAboutInput}
              onChange={(e) => {
                setEditChatAboutInput(e.target.value);
              }}
            />
            <button
              onClick={() => {
                if (editChatAboutInput && editChatTitleInput) {
                  editChat(
                    activeChat.id,
                    editChatTitleInput,
                    editChatAboutInput,
                    user.email,
                    user.password
                  );

                  if (editChatImage) {
                    newChatImage(activeChat.id, editChatImage);
                  }

                  setActiveEditChat(false);
                  setActiveMoreChat(false);
                  setEditChatImage(false);
                }
              }}
            >
              Edit Chat
            </button>
          </EditChatContainer>
          <MoreInfoChat activeMoreChat={activeMoreChat}>
            <button
              onClick={() => {
                setActiveInfoChat(true);
                setActiveMoreChat(false);
              }}
            >
              INFO
            </button>
            <button
              onClick={() => {
                setActiveEditChat(true);
                setActiveMoreChat(false);
              }}
            >
              EDIT
            </button>
          </MoreInfoChat>
          <MyFriends activeAddUserToChat={activeAddUserToChat}>
            <CloseEditChat
              onClick={() => {
                setActiveChatUsers(true);
                setActiveAddUserToChat(false);
              }}
            />
            <ResultMyFriends>
              {myFriends ? (
                myFriends?.map((friend) => (
                  <UserCard
                    user={friend}
                    key={friend.id}
                    type={"addUserToChat"}
                    handleClick={(id) => {
                      const authentication = {
                        email: user.email,
                        password: user.password,
                      };

                      api
                        .post(
                          `/chats/${activeChat.id}/users/${id}`,
                          authentication
                        )
                        .then((res) => {
                          socket.emit("addUserInAChat", id, activeChat);
                          setChatUsers([...chatUsers, res.data]);
                        });
                    }}
                  />
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
          <ChatUsers activeChatUsers={activeChatUsers}>
            <ResultList>
              {chatUsers?.map((users) => (
                <UserCard
                  type={"chatUsers"}
                  user={users}
                  key={users.id}
                  handleClick={(id) => {
                    api
                      .delete(`/chats/${activeChat.id}/users/${id}`)
                      .then((res) => {
                        socket.emit("removeUserInAChat", id, activeChat);
                        setChatUsers(
                          chatUsers.filter(
                            (chatUser) => chatUser.id !== res.data.id
                          )
                        );
                      });
                  }}
                />
              ))}
              <AddUserToChat
                onClick={() => {
                  setActiveChatUsers(false);
                  setActiveAddUserToChat(true);
                }}
              >
                <AiOutlinePlus size={20} />
              </AddUserToChat>
            </ResultList>
          </ChatUsers>
          <ActionControl>
            <ChatInfo>
              <ChatImage
                src={
                  chatImage?.url ||
                  "https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg"
                }
                >
                {isOnline && <Online />}
              </ChatImage>
              <h3>{activeChat.title}</h3>
            </ChatInfo>
            <Buttons>
              <AddUser
                onClick={() => {
                  setActiveChatUsers(!activeChatUsers);
                }}
              >
                <button>USERS</button>
              </AddUser>
              <EditChat
                onClick={() => {
                  setActiveMoreChat(!activeMoreChat);
                }}
                activeMoreChat={activeMoreChat}
              >
                <button>MORE</button>
              </EditChat>
            </Buttons>
          </ActionControl>
        </>
      )}
      <ChatContent>
        {activeChat ? (
          <>
            <ChatMessagesContainer ref={messagesContainer}>
              {messagesActive.length > 0 ? (
                messagesActive.map((message) => (
                  <ChatMessages
                    id={message.id}
                    user={message.user_id}
                    key={message.id}
                    text={message.body}
                    createdAt={message.createdAt}
                  />
                ))
              ) : (
                <WithoutMessages>
                  <AiOutlineInfoCircle size={100} color={"#999"} />
                  <h1>Doesn't have a messages yet?!?</h1>
                  <p>Send a message now!!</p>
                </WithoutMessages>
              )}
            </ChatMessagesContainer>
            <MessageForm
              onSubmit={(e) => {
                e.preventDefault();

                if (messageInput) {
                  messageSend(messageInput, activeChat.id, user.id, attachment);
                }

                setMessageInput("");
                setActiveEmojiContainer(false);
                setAttachment(false);
              }}
            >
              <MessageInput>
                <HiOutlineEmojiHappy
                  size={40}
                  onClick={() => {
                    setActiveEmojiContainer(!activeEmojiContainer);
                  }}
                />
                <input
                  type={"text"}
                  placeholder={"Type a message"}
                  onChange={(e) => setMessageInput(e.target.value)}
                  value={messageInput}
                />
                <Dropzone
                  accept={{ "image/png": [".png"], "image/jpeg": [".jpeg"] }}
                  onDropAccepted={(file) => {
                    setAttachment(file[file.length - 1]);
                  }}
                >
                  {({ getInputProps, getRootProps }) => (
                    <AttachmentContainer {...getRootProps()}>
                      {attachment ? (
                        <AttachmentImage
                          src={URL.createObjectURL(attachment)}
                        />
                      ) : (
                        <MdAttachFile size={40} cursor={"pointer"} />
                      )}
                      <input {...getInputProps()} />
                    </AttachmentContainer>
                  )}
                </Dropzone>
              </MessageInput>
              <SendMessage>
                <IoIosSend size={40} />
              </SendMessage>
            </MessageForm>
          </>
        ) : (
          <WithoutChat>
            <AiOutlineInfoCircle size={100} color={"#999"} />
            <h1>Doesn't have a open chat?</h1>
            <p>Click on a chat and it open's here!</p>
          </WithoutChat>
        )}
      </ChatContent>
    </Container>
  );
}

const Online = styled.div`
  background: #23ce6b;
  height: 15px;
  width: 15px;
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  right: 0;
  box-shadow: 0px 0px 10px -5px black;
`;

const AttachmentContainer = styled.div``;

const AttachmentImage = styled.div`
  height: 50px;
  width: 50px;
  background-image: ${(props) => `url(${props.src})`};
  background-position: center;
  background-size: cover;
  border-radius: 5px;
  cursor: pointer;
  opacity: 0.8;
  transition: 0.3s;

  :hover {
    opacity: 1;
  }
`;

const BackEditChatImage = styled.div`
  background: ${(props) => (props.isDragAccept ? "green !important" : "#000")};
  background: ${(props) => (props.isDragReject ? "red !important" : "#000")};
  border-radius: 50%;
`;

const MyFriends = styled.div`
  position: absolute;
  background: white;
  right: 0;
  top: 100px;
  min-width: 200px;
  height: 300px;
  display: flex;
  gap: 10px;
  flex-direction: column;
  padding: 5px;
  gap: 2px;
  transition: 0.3s;
  z-index: 2;
  box-shadow: 0px 0px 10px -5px black;
  border-bottom-left-radius: 10px;
  border-top-left-radius: 10px;
  transform: ${(props) =>
    props.activeAddUserToChat ? "translateX(0)" : "translateX(100%)"};
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

const ResultMyFriends = styled.div`
  width: 100%;
  height: 100%;
  background: #eee;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: auto;
  padding: 30px 5px 5px 5px;
`;

const ResultList = styled.div`
  width: 100%;
  height: 100%;
  background: #eee;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: auto;
  padding: 5px;
`;

const AddUserToChat = styled.button`
  align-self: center;
  padding: 6px;
  border-radius: 50%;
  border: none;
  background: white;
  color: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-top: 10px;
`;

const CloseEditChat = styled(AiOutlineCloseCircle)`
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

const InfoChatContainer = styled.div`
  position: absolute;
  right: 0;
  z-index: 3;
  background: white;
  transition: 0.4s;
  transform: ${(props) =>
    props.activeInfoChat ? "translateX(0)" : "translateX(100%)"};
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 170px;
  box-shadow: 0px 0px 10px -5px black;
  gap: 10px;
  padding: 14px;

  span {
    color: #999;
    font-size: 0.9rem;
  }
`;

const EditChatContainer = styled.div`
  position: absolute;
  right: 0;
  z-index: 3;
  background: white;
  transition: 0.4s;
  transform: ${(props) =>
    props.activeEditChat ? "translateX(0)" : "translateX(100%)"};
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 170px;
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

const MoreInfoChat = styled.div`
  position: absolute;
  background: white;
  right: 0;
  top: 80px;
  display: flex;
  flex-direction: column;
  padding: 5px;
  transition: 0.3s;
  z-index: 2;
  box-shadow: 0px 0px 10px -5px black;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  transform: ${(props) =>
    props.activeMoreChat ? "translateX(0)" : "translateX(100%)"};

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

const EmojiContainer = styled.div`
  position: absolute;
  background: white;
  right: 780px;
  bottom: 90px;
  height: 200px;
  display: flex;
  flex-wrap: wrap;
  width: 250px;
  overflow: auto;
  padding: 5px;
  transition: 0.3s;
  z-index: 2;
  box-shadow: 0px 0px 10px -5px black;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
  opacity: ${(props) => (props.activeEmojiContainer ? "100%" : "0%")};
  transform: ${(props) =>
    props.activeEmojiContainer ? "translateY(0)" : "translateY(150%)"};
`;

const Emoji = styled.div`
  cursor: pointer;
  transition: 0.3s;
  :hover {
    transform: scale(1.1);
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

const WithoutMessages = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #666;
  justify-content: center;
  align-items: center;
`;

const ActionControl = styled.div`
  padding: 0 20px;
  display: flex;
  height: 12%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatInfo = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  h3 {
    font-weight: 500;
  }
`;

const ChatImage = styled.div`
  height: 50px;
  width: 50px;
  background-image: ${(props) => `url(${props.src})`};
  background-position: center;
  background-size: cover;
  border-radius: 50%;
  position: relative;
`;

const EditChatImage = styled(ChatImage)`
  cursor: pointer;
  border: 1px solid #eee;
  opacity: 0.5;
  transition: 0.3s;

  :hover {
    opacity: 0.3;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 10px;
`;

const EditChat = styled.div`
  button {
    background: white;
    border: none;
    border-radius: 30px;
    padding: 14px 36px;
    opacity: ${(props) => (props.activeMoreChat ? "1" : "0.8")};
    font-weight: 500;
    cursor: pointer;
    transition: 0.3s;

    :hover {
      opacity: 1;
    }
  }
`;

const ClearChat = styled.div`
  button {
    background: white;
    border: none;
    border-radius: 30px;
    padding: 14px 36px;
    opacity: ${(props) => (props.activeMoreChat ? "1" : "0.8")};
    font-weight: 500;
    cursor: pointer;
    transition: 0.3s;

    :hover {
      opacity: 1;
    }
  }
`;

const AddUser = styled.div`
  button {
    background: white;
    border: none;
    border-radius: 30px;
    padding: 14px 36px;
    opacity: ${(props) => (props.activeMoreChat ? "1" : "0.8")};
    font-weight: 500;
    cursor: pointer;
    transition: 0.3s;

    :hover {
      opacity: 1;
    }
  }
`;

const WithoutChat = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #666;
  justify-content: center;
  align-items: center;
`;

const ChatMessagesContainer = styled.div`
  width: 100%;
  height: 87%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SendMessage = styled.button`
  border-radius: 50%;
  border: none;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background: #136f63;
  cursor: pointer;
  opacity: 0.9;
  transition: 0.3s;

  :hover {
    opacity: 1;
  }
`;

const ChatUsers = styled.div`
  position: absolute;
  background: white;
  right: 0;
  top: 100px;
  min-width: 200px;
  height: 300px;
  display: flex;
  flex-direction: column;
  padding: 5px;
  transition: 0.3s;
  z-index: 2;
  box-shadow: 0px 0px 10px -5px black;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  transform: ${(props) =>
    props.activeChatUsers ? "translateX(0)" : "translateX(100%)"};
`;

const MessageInput = styled.div`
  display: flex;
  background: #f5f7fb;
  width: 90%;
  padding: 16px 24px;
  border-radius: 50px;
  align-items: center;
  gap: 10px;

  *:nth-child(1) {
    opacity: 0.9;
    transition: 0.3s;
    cursor: pointer;

    :hover {
      opacity: 1;
    }
  }

  input {
    width: 90%;
    height: 100%;
    font-size: 1.1rem;
    background: none;
    outline: none;
    border: none;

    :focus {
      border: none;
      outline: none;
    }
  }
`;

const MessageForm = styled.form`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ChatContent = styled.div`
  width: 100%;
  height: calc(100% - 12%);
  background: white;
  border-radius: 30px;
  padding: 20px;
  position: relative;
`;

const Container = styled.div`
  width: 100%;
  height: ${(props) => (props.activeChat ? "100%" : "113%")};
  padding-top: 10px;
  padding-right: 50px;
  padding-bottom: 10px;
  position: relative;
  overflow: hidden;
  transition: 0.3s;
`;

const mapStateToProps = (state) => {
  return {
    activeChat: state.chat.activeChat,
    user: state.user.user,
    messages: state.messages.messages,
    lastMessage: state.messages.lastMessage,
    chatImages: state.chatImages.chatImages,
    friends: state.user.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    messageSend: (message, chatId, userId, attachment) => {
      dispatch(sendAMessage(message, chatId, userId, attachment));
    },
    setClearChat: (id) => {
      dispatch(clearChat(id));
    },
    editChat: (id, title, about, email, password) => {
      dispatch(editOneChat(id, title, about, email, password));
    },
    newChatImage: (id, file) => {
      dispatch(chatImageCreate(id, file));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
