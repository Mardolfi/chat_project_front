import { useEffect, useState } from "react";
import { FiUser, FiUserCheck, FiUserMinus, FiUserPlus } from "react-icons/fi";
import { connect } from "react-redux";
import styled from "styled-components";
import api from "../../services/api";
import { removeFriend, removeRequest } from "../../store/actions";

function UserCard({
  user,
  type,
  handleClick,
  removeAFriend,
  activeUser,
  requests,
  removeARequest,
  activeChat
}) {
  const [profileImage, setProfileImage] = useState();
  const [active, setActive] = useState(false);

  useEffect(() => {
    api.get(`/users/${user.id}/image`).then((res) => {
      setProfileImage(res.data);
    });
  }, []);

  return (
    <UserContainer>
      <Profile
        src={
          profileImage
            ? profileImage.url
            : "https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg"
        }
      >
        {user.is_online && <Online />}
      </Profile>
      <Info>
        <h4>
          {user.first_name} {user.last_name}
        </h4>
        <p>{user.email}</p>
      </Info>
      {type == "addFriend" ? (
        <AddFriend>
          {active ? (
            <FiUserCheck color="#23CE6B" opacity={"50%"} />
          ) : (
            <FiUserPlus
              onClick={() => {
                handleClick(user.id);
                setActive(true);
              }}
            />
          )}
        </AddFriend>
      ) : type == "addUserToChat" ? (
        <AddFriend>
          {active ? (
            <FiUserCheck color="#23CE6B" opacity={"50%"} />
          ) : (
            <FiUserPlus
              onClick={() => {
                handleClick(user.id);
                setActive(true);
              }}
            />
          )}
        </AddFriend>
      ) : type == "chatUsers" ? (
        <>
          {user.id === activeChat.user_id ? (
            <AddFriend>
              <FiUser />
            </AddFriend>
          ) : (
            <AddFriend>
              {active ? (
                <FiUserCheck color="#F13030" opacity={"50%"} />
              ) : (
                <FiUserMinus
                  color="#F13030"
                  onClick={() => {
                    handleClick(user.id);
                    setActive(true);
                  }}
                />
              )}
            </AddFriend>
          )}
        </>
      ) : (
        <AddFriend>
          <FiUserMinus
            color="#F13030"
            onClick={() => {
              const request = requests.find(
                (request) =>
                  (request.sender_id == user.id &&
                    request.recipient_id == activeUser.id) ||
                  (request.recipient_id == user.id &&
                    request.sender_id == activeUser.id)
              );
              removeAFriend(activeUser.id, user.id);
              removeARequest(request.id);
            }}
          />
        </AddFriend>
      )}
    </UserContainer>
  );
}

const Online = styled.div`
  background: #23ce6b;
  height: 13px;
  width: 13px;
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  right: 0;
  box-shadow: 0px 0px 10px -5px black;
`;

const AddFriend = styled.div`
  opacity: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s;
  cursor: pointer;
  padding: 10px;

  :hover {
    opacity: 1;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;

  h4 {
    font-weight: 500;
    margin-bottom: -6px;
  }

  p {
    font-size: 0.8rem;
    color: #999;
  }
`;

const Profile = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-image: ${(props) => `url(${props.src})`};
  background-position: center;
  background-size: cover;
  opacity: 0.9;
  position: relative;
  transition: 0.3s;
  :hover {
    opacity: 1;
  }
  cursor: pointer;
`;

const UserContainer = styled.div`
  background: white;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  gap: 5px;
  border-radius: 20px;
  justify-content: space-between;
`;

const mapStateToProps = (state) => {
  return {
    activeUser: state.user.user,
    requests: state.requests.requests,
    activeChat: state.chat.activeChat
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeAFriend: (userId, id) => {
      dispatch(removeFriend(userId, id));
    },
    removeARequest: (id) => {
      dispatch(removeRequest(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserCard);
