import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const AlertTop = ({ children, ...props }) => {
  return <AlertLayout>{children}</AlertLayout>;
};

const AlertLayout = styled.div`
  position: absolute;
  top: 48px;
  width: 388px;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 0 0 20px 20px;
  background-color: var(--primary);
  color: white;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
  animation: fadeIn 2s forwards;

  @keyframes fadeIn {
    0% {
      transform: translateY(-60px);
    }
    60% {
      transform: translateY(0px);
    }
    100% {
      transform: translateY(-60px);
    }
  }
`;

export default AlertTop;
