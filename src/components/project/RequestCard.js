import { useEffect, useState } from "react";
import { FiUserCheck, FiUserMinus, FiUserPlus, FiUserX } from "react-icons/fi";
import { BiUserVoice } from "react-icons/bi";
import { connect } from "react-redux";
import styled from "styled-components";
import api from "../../services/api";
import {
  acceptARequest,
  addFriend,
  declineARequest,
} from "../../store/actions";

function RequestCard({
  id,
  userSender,
  userRecipient,
  isAccepted,
  isRejected,
  user,
  friendAdd,
  declineRequest,
  acceptRequest,
}) {
  const [profileImageSender, setProfileImageSender] = useState();
  const [profileImageRecipient, setProfileImageRecipient] = useState();
  const [userSending, setUserSending] = useState();
  const [userRecepting, setUserRecepting] = useState();

  useEffect(() => {
    api.get(`/users/${userSender}`).then((res) => {
      setUserSending(res.data);
    });

    api.get(`/users/${userSender}/image`).then((res) => {
      setProfileImageSender(res.data);
    });

    api.get(`/users/${userRecipient}/image`).then((res) => {
      setProfileImageRecipient(res.data);
    });

    api.get(`/users/${userRecipient}`).then((res) => {
      setUserRecepting(res.data);
    });
  }, []);

  return (
    <UserContainer>
      <UserSender>
        <Profile
          src={
            profileImageSender
              ? profileImageSender.url
              : "https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg"
          }
        >
          {userSending?.is_online && <Online />}
        </Profile>
        <Info>
          <h4>{userSending?.first_name}</h4>
          <p>Sender</p>
        </Info>
      </UserSender>
      {userRecepting?.id == user?.id ? (
        <>
          {isAccepted || isRejected ? (
            <>
              {isAccepted && (
                <FiUserCheck size={20} color={"#23CE6B"} opacity={"30%"} />
              )}
              {isRejected && (
                <FiUserX size={20} color={"#F13030"} opacity={"30%"} />
              )}
            </>
          ) : (
              <AcceptOrDecline>
                <FiUserMinus
                  size={20}
                  color={"#F13030"}
                  onClick={() => {
                    declineRequest(id);
                  }}
                />
                <FiUserPlus
                  size={20}
                  color={"#23CE6B"}
                  onClick={() => {
                    acceptRequest(id);
                    friendAdd(userRecipient, userSender);
                  }}
                />
              </AcceptOrDecline>
          )}
        </>
      ) : (
        <>
          {isAccepted || isRejected ? (
            <>
              {isAccepted && (
                <FiUserCheck size={20} color={"#23CE6B"} opacity={"30%"} />
              )}
              {isRejected && (
                <FiUserX size={20} color={"#F13030"} opacity={"30%"} />
              )}
            </>
          ) : (
            <RequestLoading>
              <BiUserVoice size={20} color={"#999"} />
            </RequestLoading>
          )}
        </>
      )}
      <UserRecipient>
        <Info>
          <h4>{userRecepting?.first_name}</h4>
          <p>Recipient</p>
        </Info>
        <Profile
          src={
            profileImageRecipient
              ? profileImageRecipient.url
              : "https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg"
          }
        >
          {userRecepting?.is_online && <Online />}
        </Profile>
      </UserRecipient>
    </UserContainer>
  );
}

const RequestLoading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AcceptOrDecline = styled.div`
  display: flex;
  gap: 10px;

  * {
    cursor: pointer;
    opacity: 0.8;
    transition: 0.3s;

    :hover {
      opacity: 1;
    }
  }
`;

const UserRecipient = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  text-align: center;
`;

const UserSender = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  text-align: center;
`;

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
    user: state.user.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    friendAdd: (adding, beAdded) => {
      dispatch(addFriend(adding, beAdded));
    },
    declineRequest: (id) => {
      dispatch(declineARequest(id));
    },
    acceptRequest: (id) => {
      dispatch(acceptARequest(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestCard);
