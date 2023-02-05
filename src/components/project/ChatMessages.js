import moment from "moment/moment";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

function ChatMessages({
  id,
  text,
  createdAt,
  user,
  activeUser,
  profileImages,
  attachment,
}) {
  const [dateMessage, setDateMessage] = useState();
  const [profileImage, setProfileImage] = useState();
  const [isMyMessage, setIsMyMessage] = useState();
  const [attachmentActive, setAttachmentActive] = useState();

  useEffect(() => {
    if (activeUser.id === user) {
      setIsMyMessage(true);
    } else {
      setIsMyMessage(false);
    }
  }, [user]);

  useEffect(() => {
    const date = moment(createdAt).locale("pt-br").format("LT");
    setDateMessage(date);
  }, [text]);

  useEffect(() => {
    setProfileImage(
      profileImages.find((profileImage) => profileImage.user_id == user)
    );
  }, [profileImages, user]);

  useEffect(() => {
    setAttachmentActive(
      attachment.find((attachment) => attachment.message_id === id)
    );
  }, [attachment]);

  return (
    <MessageContainer isMyMessage={isMyMessage}>
      {isMyMessage ? (
        <>
          <MessageInfo>
            <UserProfile
              src={
                profileImage
                  ? profileImage.url
                  : "https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg"
              }
            />
            <p>{dateMessage}</p>
          </MessageInfo>
          <MessageContent isMyMessage={isMyMessage}>
            {attachmentActive && <Attachment src={attachmentActive.url} />}
            <p>{text}</p>
          </MessageContent>
        </>
      ) : (
        <>
          <MessageContent isMyMessage={isMyMessage}>
            {attachmentActive && <Attachment src={attachmentActive.url} />}
            <p>{text}</p>
          </MessageContent>
          <MessageInfo>
            <UserProfile
              src={
                profileImage
                  ? profileImage.url
                  : "https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg"
              }
            />
            <p>{dateMessage}</p>
          </MessageInfo>
        </>
      )}
    </MessageContainer>
  );
}

const UserProfile = styled.div`
  height: 50px;
  width: 50px;
  background-image: ${(props) => `url(${props.src})`};
  background-position: center;
  background-size: cover;
  border-radius: 50%;
`;

const Attachment = styled.div`
  background-image: ${props => `url(${props.src})`};
  background-size: cover;
  background-position: center;
  width: 200px;
  height: 200px;
`

const MessageInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const MessageContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: ${(props) =>
    props.isMyMessage ? "flex-start" : "flex-end"};
  align-items: top;
  gap: 12px;
`;

const MessageContent = styled.div`
  background: ${(props) => (props.isMyMessage ? "#53325f" : "#ddd")};
  color: ${(props) => (props.isMyMessage ? "#fff" : "#333")};
  border-top-right-radius: ${(props) => (props.isMyMessage ? "20px" : "0")};
  border-top-left-radius: ${(props) => (props.isMyMessage ? "0" : "20px")};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  padding: 26px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
  max-width: 50%;
`;

const mapStateToProps = (state) => {
  return {
    activeUser: state.user.user,
    profileImages: state.profileImages.profileImages,
    attachment: state.attachment.attachment,
  };
};

export default connect(mapStateToProps)(ChatMessages);
