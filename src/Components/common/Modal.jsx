import React from 'react';
import styled from 'styled-components';

const Modal = ({ btn1, btn2, handleMorebutton, handleLogoutbutton, bottom, ...props }) => {
  console.log(props);
  return (
    <ModalLayout bottom={bottom}>
      <SlideBar></SlideBar>
      <button type='buton' {...props} onClick={props.handleProductModify}>
        {btn1}
      </button>
      <button type='button' onClick={handleLogoutbutton} {...props}>
        {btn2}
      </button>
    </ModalLayout>
  );
};

const ModalLayout = styled.div`
  position: fixed;
  left: 50%;
  bottom: ${(props) => (props.bottom ? props.bottom : '74px')};
  transform: translate(-50%);
  width: 389px;
  padding: 16px 0;
  background-color: #fff;
  box-shadow: 0px -2px 2px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  border-radius: 10px 10px 0 0;

  button {
    display: block;
    width: 100%;
    text-align: left;
    font-size: var(--sm);
    padding: 14px 26px;
    box-sizing: border-box;

    :hover {
      background-color: rgba(0, 0, 0, 0.03);
    }
  }
`;

const SlideBar = styled.div`
  margin: ${(props) => props.margin || `0 auto 14px`};
  width: 50px;
  height: 4px;
  border-radius: 10px;
  background-color: var(--light-gray);
`;

export default Modal;
