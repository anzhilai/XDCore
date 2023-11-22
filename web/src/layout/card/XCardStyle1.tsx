import React from 'react';
import styled from 'styled-components';

const MainTop = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid #2C58A6;
  box-shadow: 0px 0px 6px #2C58A6;
  position: relative;
  .t_line_box {
  position: absolute;
  width: 100%;
  height: 100%;
  }
  .t_line_box i {
    background-color: #4788fb;
    box-shadow: 0px 0px 10px #4788fb;
    position: absolute;
      &.t_r_line {
        height: 5px;
        width: 26px;
        right: -3px;
        top: -3px;
      }

      &.r_t_line {
        width: 5px;
        height: 24px;
        right: -3px;
        top: -3px;
      }

      &.l_b_line {
        width: 5px;
        height: 24px;
        left: -3px;
        bottom: -3px;
      }

      &.b_l_line {
        height: 5px;
        width: 26px;
        left: -3px;
        bottom: -3px;
      }

      &.r_b_line {
        width: 5px;
        height: 24px;
        right: -3px;
        bottom: -3px;
      }

      &.b_r_line {
        height: 5px;
        width: 26px;
        right: -3px;
        bottom: -3px;
      }
      &.l_t_line {
        width: 5px;
        height: 24px;
        left: -3px;
        top: -3px;
      }

      &.t_l_line {
        height: 5px;
        width: 26px;
        left: -3px;
        top: -3px;
      }
  }
  `
const MainTitle = styled.div`
  text-align: center;
  width: 180px;
  height: 35px;
  line-height: 33px;
  background-color: #2C58A6;
  border-radius: 18px;
  position: absolute;
  top: -17px;
  left: 50%;
  margin-left: -90px;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  box-sizing: border-box;
  // padding-left: 45px;
  z-index: 10;`

export function XCardStyle1(props) {


  return (
    <MainTop>
      <div className={"t_line_box"}>
        <i className={"t_l_line"}/>
        <i className={"l_t_line"}/>
      </div>
      <div className={"t_line_box"}>
        <i className={"t_r_line"}/>
        <i className={"r_t_line"}/>
      </div>
      <div className={"t_line_box"}>
        <i className={"l_b_line"}/>
        <i className={"b_l_line"}/>
      </div>
      <div className={"t_line_box"}>
        <i className={"r_b_line"}/>
        <i className={"b_r_line"}/>
      </div>
      <MainTitle>
        {props.title}
      </MainTitle>
      {props.children}
    </MainTop>
  );
}
