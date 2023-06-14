import React from 'react';
import styled from 'styled-components';

//todo:  color={color} 이거 왜 안해도 되는지 다시 질문
// 이거는 함수나 이런거 받는 props가 아니고, 아래에서 color값 자체를 받는거라.
export default function AlertModal(props) {
  return (
    <Layout>
      <ModalTxt>{props.txt}</ModalTxt>
      <ModalButtonLayout>
        <ModalButton>{props.leftbtn || '확인'}</ModalButton>
        <ModalButton color='var(--primary)'>{props.rightbtn || '삭제'}</ModalButton>
      </ModalButtonLayout>
    </Layout>
  );

}

const Layout = styled.div`
  width: 252px;
  height: 110px;
  border-radius: 10px;
  background-color: #eff6e3;
`;

const ModalTxt = styled.div`
  font-size: var(--md);
  text-align: center;
  padding: 22px 0;
`;

const ModalButtonLayout = styled.div`
  display: flex;

  button + button {
    border-left: 1px solid #dbdbdb;
    border-bottom-left-radius: 0;
  }
`;
const ModalButton = styled.button`
  width: 126px;
  padding: 14px 0;
  /* height: 46px; */
  font-size: var(--sm);
  /* color: ${(props) => (props.color ? 'var(--primary)' : 'black')}; */
  color: ${(props) => props.color || 'black'};
  border-radius: 0 0 10px 10px;
  border-top: 1px solid #dbdbdb;
  border-color: ${(props) => (props.border ? 'transparent' : '#dbdbdb')};
  box-sizing: border-box;
`;