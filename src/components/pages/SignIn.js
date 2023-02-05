import styled from "styled-components";
import Input from "../project/Input";
import image1 from "../../img/image1.png";
import image2 from "../../img/image2.png";
import image3 from "../../img/image3.png";
import imagesBg from "../../img/blue-pattern.jpg";
import { BsFillChatFill } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { useEffect, useState } from "react";
import CheckBox from "../project/CheckBox";
import loading from "../../img/loading.png";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { signIn } from "../../store/actions";
import Message from "../project/Message";

function SignIn({ user, signInDispatch }) {
  const [imageActive, setImageActive] = useState(0);
  const [marginLeft, setMarginLeft] = useState(200);
  const [textMarginLeft, setTextMarginLeft] = useState(33.5);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [messageText, setMessageText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user.error) {
      setMessage(true);
      setMessageType("error");
      setMessageText(user.error);
      setTimeout(() => {
        user.error = null;
        setMessage(false)
        setMessageType('')
        setMessageText('')
      }, 3000);
    }
  }, [user.error]);

  useEffect(() => {
    if (user.success) {
      setMessage(true);
      setMessageType("success");
      setMessageText(user.success);
      setTimeout(() => {
        user.success = null;
        setMessage(false)
        setMessageType('')
        setMessageText('')
      }, 3000);
    }
  }, [user.success]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (imageActive === 0) {
        setImageActive(1);
        setMarginLeft(10);
        setTextMarginLeft(0);
      } else if (imageActive === 1) {
        setImageActive(2);
        setMarginLeft(-175);
        setTextMarginLeft(-33.4);
      } else if (imageActive === 2) {
        setImageActive(0);
        setMarginLeft(200);
        setTextMarginLeft(33.5);
      }
    }, 10000);
    return () => clearTimeout(timeout);
  }, [imageActive]);

  useEffect(() => {
    if (user.user) {
      setTimeout(() => {
        navigate("/");
      }, 3500)
    }
  }, [user.user]);

  function findUser(e) {
    e.preventDefault();

    if (!email || !password) return;

    signInDispatch(email, password);
  }

  return (
    <Container>
      {message && <Message text={messageText} type={messageType} />}
      <FormContainer>
        <ChatLogo />
        <Info>
          <h1>Login</h1>
          <p>
            Chat online and totally free! Speak with your best friends and
            parents!
          </p>
        </Info>
        <GoogleSign>
          <GoogleLogo />
          <p>Sign in with Google</p>
        </GoogleSign>
        <OrSignWithEmail>
          <hr></hr>
          <p>or Sign in with Email</p>
        </OrSignWithEmail>
        <Form onSubmit={findUser} isSuccess={user.success} isError={user.error}>
          <InputsContainer>
            <Input
              placeholder={"Email"}
              type={"email"}
              handleValue={(value) => setEmail(value)}
            />
            <Input
              placeholder={"Password"}
              type={"password"}
              handleValue={(value) => setPassword(value)}
            />
          </InputsContainer>
          <RememberControl>
            <div>
              <CheckBox />
              <label>Remember me?</label>
            </div>
            <LinkToForgot to={"forgotpassword"}>Forgot password?</LinkToForgot>
          </RememberControl>
          <button>{user.loading ? <img src={loading} /> : "Login"}</button>
          <p>
            Not registered yet?{" "}
            <LinkToSignUp
              onClick={() => {
                if (user.error) {
                  user.error = null;
                }
              }}
              to={"/signup"}
            >
              Create an Account
            </LinkToSignUp>
          </p>
          <Copyright>
            <p>©2023 Mardolfi All rights reserverd.</p>
          </Copyright>
        </Form>
      </FormContainer>
      <Slide src={imagesBg}>
        <Images marginLeft={marginLeft}>
          <img src={image1} />
          <img src={image2} />
          <img src={image3} />
        </Images>
        <Texts marginLeft={textMarginLeft} imageActive={imageActive}>
          <div>
            <h1>No price tag!</h1>
            <p>
              The best text apps are all free to use. Part of this is because
              most people aren't prepared to pay for them, but it's also because
              large corporations actually make surprisingly decent apps
              sometimes.
            </p>
          </div>
          <div>
            <h1>Support for pictures, video, and other multimedia!</h1>
            <p>
              Text messages are no longer 140 characters long (at least if
              you're not using SMS). They can be long essays, but also photos,
              GIFs, voice notes, YouTube links, documents, and lots of other
              forms of multimedia.
            </p>
          </div>
          <div>
            <h1>Support for group chat!</h1>
            <p>
              A lot of text messaging doesn't happen one-to-one. For a free chat
              app to make this list, it had to be able to support group
              messaging. To be honest, this requirement didn't exclude many apps
              as it's a very common feature, but I still felt it needed to be
              stated.
            </p>
          </div>
        </Texts>
        <ActionControlSlide imageActive={imageActive}>
          <div
            onClick={() => {
              setImageActive(0);
              setMarginLeft(200);
              setTextMarginLeft(33.5);
            }}
          ></div>
          <div
            onClick={() => {
              setImageActive(1);
              setMarginLeft(10);
              setTextMarginLeft(0);
            }}
          ></div>
          <div
            onClick={() => {
              setImageActive(2);
              setMarginLeft(-175);
              setTextMarginLeft(-33.4);
            }}
          ></div>
        </ActionControlSlide>
      </Slide>
    </Container>
  );
}

const LinkToSignUp = styled(Link)`
  color: #4796ce;
  cursor: pointer;
  text-decoration: none;
`;

const LinkToForgot = styled(Link)`
  color: #4796ce;
  cursor: pointer;
  text-decoration: none;
  font-weight: 600;
`;

const Images = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  margin-bottom: -50px;
  img {
    transition: 1s;
  }

  img:nth-of-type(1) {
    width: 400px;
    margin-left: ${(props) => `${props.marginLeft}%`};
    margin-right: 200px;
  }

  img:nth-of-type(3) {
    transform: scale(1.5);
    margin-left: 30px;
  }
`;

const Texts = styled.div`
  width: 150vw;
  height: 500px;
  text-align: center;
  display: flex;
  overflow: hidden;
  position: relative;
  color: white;
  margin-bottom: -50px;
  div {
    transition: 1s;
  }

  div:nth-of-type(1) {
    width: ${(props) => (props.imageActive === 0 ? "98vw" : "50vw")};
    margin-left: ${(props) => `${props.marginLeft}%`};
  }

  div:nth-of-type(2) {
    width: 50vw;
  }

  div:nth-of-type(3) {
    width: 50vw;
  }
`;

const Slide = styled.div`
  height: 100vh;
  width: 50%;
  background-image: ${(props) => `url(${props.src})`};
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
`;

const Copyright = styled.div`
  p {
    color: #999;
    font-size: 0.9rem;
  }
`;

const RememberControl = styled.div`
  display: flex;
  justify-content: space-between;
  color: #4796ce;
  p {
    font-weight: 500;
    cursor: pointer;
  }

  label {
    font-weight: 500;
  }

  div {
    display: flex;
    gap: 10px;
    align-items: center;
    color: black;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;

  button {
    padding: 14px;
    color: white;
    transition: 0.4s;
    background: ${(props) =>
      props.isSuccess ? "#23CE6B !important" : "#4796ce"};
    background: ${(props) =>
      props.isError ? "#F13030 !important" : "#4796ce"};
    border: none;
    border-radius: 30px;
    font-size: 1.1rem;
    font-weight: 500;
    cursor: pointer;
  }

  img{
    width: 20px;
    transform: scale(1.5);
    height: 20px;
  }
`;

const OrSignWithEmail = styled.div`
  color: #999;
  position: relative;
  margin-bottom: 30px;

  p {
    position: absolute;
    background: white;
    top: -12px;
    padding: 0 10px;
    left: 32%;
  }
`;

const GoogleLogo = styled(FcGoogle)`
  width: 25px;
  height: 25px;
`;

const GoogleSign = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px;
  gap: 10px;
  border: 1px solid #999;
  border-radius: 30px;
  margin-bottom: 30px;
  cursor: pointer;

  p {
    font-weight: 500;
  }
`;

const Info = styled.div`
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  h1 {
    font-weight: 600;
  }
  p {
    color: #666;
  }
`;

const ActionControlSlide = styled.div`
  position: absolute;
  bottom: 100px;
  display: flex;
  gap: 4px;

  div {
    transition: 0.5s;
  }

  div:nth-of-type(1) {
    height: 8px;
    width: ${(props) => (props.imageActive == 0 ? "19px" : "8px")};
    cursor: ${(props) => (props.imageActive == 0 ? "normal" : "pointer")};
    border-radius: 10px;
    bottom: 100px;
    background: ${(props) => (props.imageActive == 0 ? "white" : "#999")};
  }
  div:nth-of-type(2) {
    height: 8px;
    cursor: ${(props) => (props.imageActive == 1 ? "normal" : "pointer")};
    width: ${(props) => (props.imageActive == 1 ? "19px" : "8px")};
    border-radius: 10px;
    bottom: 100px;
    background: ${(props) => (props.imageActive == 1 ? "white" : "#999")};
  }
  div:nth-of-type(3) {
    cursor: ${(props) => (props.imageActive == 2 ? "normal" : "pointer")};
    height: 8px;
    width: ${(props) => (props.imageActive == 2 ? "19px" : "8px")};
    border-radius: 10px;
    bottom: 100px;
    background: ${(props) => (props.imageActive == 2 ? "white" : "#999")};
  }
`;

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  position: relative;
`;

const ChatLogo = styled(BsFillChatFill)`
  color: #4796ce;
  height: 40px;
  width: 40px;
  margin-left: 10px;
  margin-bottom: 40px;
`;

const FormContainer = styled.div`
  height: 100vh;
  width: 50%;
  display: flex;
  flex-direction: column;
  padding: 50px 150px;
`;

const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signInDispatch: (email, password) => {
      dispatch(signIn(email, password));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
