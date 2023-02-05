import { useEffect, useState } from "react";
import { BsFillChatDotsFill, BsFillChatFill } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { connect } from "react-redux";
import styled from "styled-components";

function Header({
  user,
  handleProfileClick,
  profileImages,
  handleFriendsClick,
}) {
  const [profileImage, setProfileImage] = useState();

  useEffect(() => {
    setProfileImage(
      profileImages.find((profileImage2) => user.id === profileImage2.user)
    );
  }, [profileImages]);

  return (
    <HeaderContainer>
      <Logo>
        <BsFillChatDotsFill size={40} color={"#20BF55"} />
        <BsFillChatFill size={40} color={"#fff"} />
        <BsFillChatFill size={40} color={"#3F88C5"} />
        <h3>MardolfiChat</h3>
      </Logo>
      <ProfileAbout>
        <Friends onClick={() => handleFriendsClick()}>
          <FiUsers size={30} />
        </Friends>
        <Profile
          src={
            profileImage
              ? profileImage.url
              : "https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg"
          }
          onClick={() => handleProfileClick()}
        >
          {user.user.is_online && <Online />}
        </Profile>
      </ProfileAbout>
    </HeaderContainer>
  );
}

const Online = styled.div`
  background: #23ce6b;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  right: 0;
  box-shadow: 0px 0px 10px -5px black;
`;

const Friends = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
  cursor: pointer;
  opacity: 0.8;
  transition: 0.3s;

  :hover {
    opacity: 1;
  }
`;

const ProfileAbout = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  *:nth-child(2),
  *:nth-child(3) {
    opacity: 0.8;
    transition: 0.3s;
    cursor: pointer;

    :hover {
      opacity: 1;
    }
  }
`;

const Profile = styled.div`
  height: 60px;
  width: 60px;
  border-radius: 50%;
  background-image: ${(props) => `url(${props.src})`};
  background-position: center;
  background-size: cover;
  opacity: 0.9;
  transition: 0.3s;
  position: relative;
  :hover {
    opacity: 1;
  }
  cursor: pointer;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 15vh;
  align-items: center;
  padding: 40px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  cursor: pointer;
  *:nth-child(1) {
    position: relative;
    z-index: 2;
  }
  *:nth-child(2) {
    z-index: 1;
    position: absolute;
  }
  *:nth-child(3) {
    position: absolute;
    right: 138px;
    top: -6px;
    transform: scaleX(-1);
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.user,
    profileImages: state.profileImages.profileImages,
  };
};

export default connect(mapStateToProps)(Header);
