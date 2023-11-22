import React from 'react';
import styled from 'styled-components';
import XGrid from '../XGrid';


const AllTitleDiv = styled.div`
            font-size:18px; position: relative; padding-left: 12px;margin-bottom: 10px;
            &:before{ width: 5px; height: 20px; top:2px; position: absolute; content: ""; background: #1677FF; border-radius:20px; left: 0; }`
const NavBoxAllDiv = styled.div`
width: 100%;
height: 100%;`

export function XCardStyle6(props) {
  return <XGrid rowsTemplate={["auto", "1fr"]}>
    <AllTitleDiv>
      {props.title}
    </AllTitleDiv>
    <NavBoxAllDiv>
      {props.children}
    </NavBoxAllDiv>
  </XGrid>
}
