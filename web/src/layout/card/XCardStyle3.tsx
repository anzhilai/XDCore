import React from 'react';
import styled from 'styled-components';

const BoxDiv = styled.div`
      border: #dfdfdf 1px solid;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      -o-border-radius: 5px;
      border-radius: 5px;
      -webkit-box-shadow: 0px 0px 5px 4px rgba(232, 232, 232, .3);
      -moz-box-shadow: 0px 0px 5px 4px rgba(232, 232, 232, .3);
      -o-box-shadow: 0px 0px 5px 4px rgba(232, 232, 232, .3);
      box-shadow: 0px 0px 5px 4px rgba(232, 232, 232, .3);
      margin: 10px 30px;
      min-height: 187px;
      overflow: hidden;`

const StrongTitle = styled.strong`
            line-height: 48px;
      font-size: 18px;
      color: #484848;
      font-weight: bold;
      padding-left: 15px;`

const SpanTitle = styled.span`
            display: block;
            float: right;
            width: 0;
            height: 0;
            border-top: 40px solid #fec64d;
            border-left: 40px solid transparent;
            position: relative;
            -webkit-transition: all .2s ease 0s;
            -ms-transition: all .2s ease 0s;
            -moz-transition: all .2s ease 0s;
            transition: all .2s ease 0s;
            &:hover {
              margin-top: 4px;
              margin-right: 4px;
            }
      `

const SpanA = styled.a`
            display: block;
            width: 40px;
            height: 40px;
            position: absolute;
            left: -22px;
            top: -56px;
            font-size: 30px;
            &:hover {
              color: #ffffff;
            }
      `
export function XCardStyle3(props) {
  return <BoxDiv>
    <div style={{background: "#f6f6f6"}}>
      <SpanTitle><SpanA>...</SpanA></SpanTitle>
      <StrongTitle style={{borderTopColor: "#f8931d"}}>{props.title}</StrongTitle>
    </div>
    {props.children}
  </BoxDiv>
}
