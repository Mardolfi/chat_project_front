import moment from "moment/moment";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { activeChat } from "../../store/actions";

function ChatCard({
  title,
  id,
  chats,
  setActiveChat,
  messages,
  chatImages
}) {
  const [time, setTime] = useState();
  const [isActiveChat, setIsActiveChat] = useState(false);
  const [lastMessage, setLastMessage] = useState()
  const [chat, setChat] = useState()
  const [chatImage, setChatImage] = useState()

  useEffect(() => {
    const chatArray = chats.chats.find((chat) => chat.id == id)
    const lastMessageObject = messages.filter((message) => message.chat_id == id)
    setLastMessage(lastMessageObject[lastMessageObject.length - 1]);
    setChat(chatArray);
    setIsActiveChat(chats.chats.some((chat) => chats?.activeChat?.id == id));
    const date = moment(lastMessageObject.length > 0 ? lastMessageObject[lastMessageObject.length - 1].createdAt : chatArray.createdAt).locale("pt-br").fromNow();
    setTime(date);
    setChatImage(chatImages.find((chatImage) => chatImage.chat_id == id))
  }, [chats, messages, chatImages]);

  return (
    <CardContainer
      activeChat={isActiveChat}
      onClick={() => {
        setActiveChat(id);
      }}
    >
      <ChatImage src={chatImage?.url || "https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg"} />
      <ChatNames activeChat={isActiveChat}>
        <div>
          <h4>{title}</h4>
          <span>{time}</span>
        </div>
        <p>{lastMessage ? lastMessage.body : chat?.about}</p>
      </ChatNames>
    </CardContainer>
  );
}

const ChatNames = styled.div`
  display: flex;
  flex-direction: column;
  padding: 18px 0;
  justify-content: center;
  width: calc(100% - 70px);
  height: 100%;
  border-bottom: 1px solid #ddd;
  p {
    font-size: 0.8rem;
    color: #999;
  }

  h4 {
    font-size: 1.1rem;
    font-weight: 500;
  }

  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 0.8rem;
    }
  }
`;

const ChatImage = styled.div`
  height: 70px;
  width: 70px;
  background-image: ${(props) => `url(${props.src})`};
  background-size: cover;
  background-position: center;
  border-radius: 50%;
`;

const CardContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 0px 10px;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  opacity: ${(props) => (props.activeChat ? "1" : "0.6")};
  transition: 0.3s;

  :hover {
    opacity: 1;
  }
`;

const mapStateToProps = (state) => {
  return {
    chats: state.chat,
    messages: state.messages.messages,
    chatImages: state.chatImages.chatImages
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(activeChat(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatCard);
