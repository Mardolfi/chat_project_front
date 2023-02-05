import { useEffect, useState } from "react";
import styled from "styled-components";

function Input({ placeholder, type, handleValue }) {
  const [inputValue, setInputValue] = useState("");
  const [labelActive, setLabelActive] = useState(false);
  const [inputType, setInputType] = useState(type);

  useEffect(() => {
    if (inputValue) {
      setLabelActive(true);
    } else {
      setLabelActive(false);
    }
  }, [inputValue]);

  return (
    <InputContainer labelActive={labelActive}>
      <input
        type={inputType}
        required
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value)
          handleValue(e.target.value)
        }}
      />
      <label>{placeholder}</label>
      {type == "password" && (
        <p
          onClick={() =>
            inputType == "password"
              ? setInputType("text")
              : setInputType("password")
          }
        >
          {inputType == 'password' ? 'MOSTRAR' : 'OCULTAR'}
        </p>
      )}
    </InputContainer>
  );
}

const InputContainer = styled.div`
  width: 100%;
  position: relative;
  input {
    width: 100%;
    padding: 16px 20px;
    border-radius: 30px;
    border: 1px solid #999;
    font-size: 1.1rem;
    :focus {
      border: 1px solid #999;
      outline: none;
    }
  }

  input:focus ~ label {
    color: #4796ce;
    transform: scale(0.9) translate(-15px, -45px);
  }

  label {
    color: ${(props) => (props.labelActive ? "#4796ce" : "#999")};
    position: absolute;
    left: 21px;
    top: 14px;
    pointer-events: none;
    transform: ${(props) =>
      props.labelActive ? "scale(0.9) translate(-15px, -45px)" : ""};
    transition: 0.4s;
  }

  p {
    position: absolute;
    right: 21px;
    top: 16px;
    cursor: pointer;
    color: #999;
  }
`;

export default Input;
