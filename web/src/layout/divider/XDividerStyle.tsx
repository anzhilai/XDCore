import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components'

const Line = styled.div`
          .line{
           tbackground:#E7E7E7;/*背景色为浅灰色*/
          twidth:0.6px;/*设置宽高*/
          theight:45px;
          tposition:relative;/*调整位置*/
          tleft:150px;
          tfloat:left;/*让此div与前面的并排显示*/
          }`;
export function XDividerStyle1(props) {
  return <Line/>
}
export function XDividerStyle2(props) {
  return (<div
    style={{background:'linear-gradient( to left,#efefef,#b6b6b6 ,#efefef)',height: '1px'}}/>);
}
