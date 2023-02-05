import styled from "styled-components";
import { CiSearch } from "react-icons/ci";
import { connect } from "react-redux";
import { AiOutlineInfoCircle, AiOutlinePlus } from "react-icons/ai";
import { chatCreate } from "../../store/actions";
import ChatCard from "../project/ChatCard";
import { useState } from "react";

function Aside({ chats, createAChat, user }) {
  const [chatsAside, setChatsAside] = useState(chats);

  function searchChats(e) {
    if (e.target.value) {
      const chatsSearch = [];
      chats.forEach((chat) => {
        if (chat.title.includes(e.target.value)) {
          chatsSearch.push(chats.find((chatAside) => chatAside.id === chat.id));
        }
      });
      setChatsAside(chatsSearch)
    } else {
      setChatsAside(chats);
    }
  }

  return (
    <Container>
      <Search>
        <CiSearch size={25} />
        <input type={"text"} placeholder={"SEARCH"} onChange={searchChats} />
      </Search>
      <Chats>
        {chatsAside.length ? (
          <>
            {chatsAside.map((chat) => (
              <ChatCard key={chat.id} id={chat.id} title={chat.title} />
            ))}
          </>
        ) : (
          <WithoutChats>
            <AiOutlineInfoCircle size={50} color={"#999"} />
            <h3>You still continue without chats???</h3>
            <p>Create a one!!</p>
          </WithoutChats>
        )}
        <CreateChats
          onClick={() => {
            createAChat(user);
          }}
        >
          <AiOutlinePlus size={30} />
        </CreateChats>
      </Chats>
    </Container>
  );
}

const CreateChats = styled.button`
  align-self: center;
  padding: 12px;
  border-radius: 50%;
  border: none;
  background: #136f63;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-top: 10px;
`;

const WithoutChats = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
  padding: 20px 0;
`;

const Chats = styled.div`
  height: 100%;
  background: white;
  border-radius: 30px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const Container = styled.div`
  width: 40vw;
  height: 100%;
  padding: 10px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Search = styled.div`
  background: white;
  padding: 16px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 10px;

  input {
    background: none;
    border: none;
    outline: none;
    width: 100%;
    height: 100%;
    font-size: 1.1rem;

    :focus {
      outline: none;
      border: none;
    }
    ::placeholder {
      color: black;
      font-size: 0.9rem;
    }
  }
`;

const mapStateToProps = (state) => {
  return {
    chats: state.chat.chats,
    user: state.user.user,
    messages: state.messages.messages,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createAChat: (user) => {
      dispatch(chatCreate(user));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Aside);
