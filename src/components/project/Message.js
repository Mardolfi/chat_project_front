import styled from "styled-components";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineError } from "react-icons/md";
import { useEffect, useState } from "react";

function Message({ type, text }) {
  const [messageVisibility, setMessageVisibility] = useState(0);

  useEffect(() => {
    setMessageVisibility(100)
    setTimeout(() => {
      setMessageVisibility(0);
    }, 3000);
  }, []);

  return (
        <MessageContainer type={type} visibility={messageVisibility}>
          {type == "success" ? (
            <FaCheckCircle />
          ) : (
            <MdOutlineError />
          )}
          <p>{text}</p>
        </MessageContainer>
  );
}

const MessageContainer = styled.div`
  position: absolute;
  right: 0;
  top: 50px;
  background: white;
  z-index: 2;
  padding: 14px;
  transition: 0.4s;
  opacity: ${props => `${props.visibility}%`};
  border: ${(props) =>
    props.type == "success" ? "3px solid #23CE6B" : "3px solid #F13030"};
  color: ${(props) => (props.type == "success" ? "#23CE6B" : "#F13030")};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export default Message;
