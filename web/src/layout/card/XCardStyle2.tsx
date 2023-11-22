import React from 'react';
import styled from 'styled-components';

const SelectedWrapper = styled.div`
        border: 2px solid #FF3333;
        position: relative;
        transition: all 0.5s ease;
        &::after {
          content: '✔';
          display: block;
          height: 0px;
          width: 0px;
          position: absolute;
          bottom: 0;
          right: 0;
          color: #ffffff;
          font-size: 14px;
          line-height: 18px;
          border: 18px solid;
          border-color: transparent #3333FF #3333FF transparent;;
        }`

export function XCardStyle2(props) {

  return <SelectedWrapper>
    {props.children}
  </SelectedWrapper>
}
