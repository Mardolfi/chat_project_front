import { useState } from "react";
import { BsCheck } from "react-icons/bs";
import styled from "styled-components";

function CheckBox({handleCheck}) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <CheckBoxContainer isChecked={isChecked} onClick={() => {
      setIsChecked(!isChecked)
      handleCheck(!isChecked)
    }}>
      <BsCheck />
    </CheckBoxContainer>
  );
}

const CheckBoxContainer = styled.div`
  height: 20px;
  width: 20px;
  border: ${props => props.isChecked ? '2px solid #fff' : '2px solid #999'};
  border-radius: 5px;
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  background: ${props => props.isChecked ? '#4796ce' : 'white'};
  transition: 0.3s;

  :active *:nth-child(1){
    transform: scale(1.2) translate(-1px, -1px);
  }

  *:nth-child(1) {
    width: 20px;
    height: 20px;
    transform: scale(1.1) translate(-0.5px, -0.5px);
    transition: 0.3s;
    color: ${props => props.isChecked ? 'white' : '#999'};
  }
`;

export default CheckBox;
