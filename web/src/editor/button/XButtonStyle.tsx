import XBaseStyle from "../../base/XBaseStyle";
import styled from "styled-components";
import {Button} from "antd";
import React from "react";
import XButton from "../XButton";


export default class XButtonStyle{

  constructor(btn) {
    this.button = btn;
  }
  button;

  GetStyleButton(style,styleType){
    let button =undefined;
    if (styleType ===  XButton.StyleType.style2) {
      const Span = styled.span`
           .ant-btn:hover, .ant-btn:focus {
                color: #ff4d4f;
                border-color: #ff4d4f;
            }
            .ant-btn-primary {
                color: #fff;
                background: #f5222d;
                border-color: #f5222d;
                box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
            }
            .ant-btn-primary:active {
                color: #fff;
                background: #cf1322;
                border-color: #cf1322;
            }
            .ant-btn-primary:hover, .ant-btn-primary:focus {
                color: #fff;
                background: #ff4d4f;
                border-color: #ff4d4f;
            }`
      button = (<Span>
        <Button style={style}
                type={styleType}
                icon={button.props.icon}
                onClick={button.ClickEvent}
                disabled={button.props.disabled}>
          {button.props.showText ? button.GetValue() : undefined}
        </Button>
      </Span>)
    }
    if (styleType === XButton.StyleType.style3) {
      const Span = styled.span`
           .ant-btn:hover, .ant-btn:focus {
                color: #ff4d4f;
                border-color: #ff4d4f;
            }
            .ant-btn-primary {
                color: #fff;
                background: #722ed1;
                border-color: #722ed1;
                box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
            }
            .ant-btn-primary:active {
                color: #fff;
                background: #531dab;
                border-color: #531dab;
            }
            .ant-btn-primary:hover, .ant-btn-primary:focus {
                color: #fff;
                background: #9254de;
                border-color: #9254de;
            }`
      button = (<Span>
        <Button style={style}
                type={styleType}
                icon={button.props.icon}
                onClick={button.ClickEvent}
                disabled={button.props.disabled}>
          {button.props.showText ? button.GetValue() : undefined}
        </Button>
      </Span>)
    }
    if (styleType === XButton.StyleType.style1) {
      const Btn = styled.a`
            font-size: 18px;
            font-weight: bold;
            color: #fff;
            width: 137px;
            height: 41px;
            display: inline-block;
            *display: inline;
            *zoom: 1;
            text-align: center;
            text-decoration: none;
            line-height: 41px;
            background: #16397c;
            background: -webkit-linear-gradient(top, #2554af, #16397c);
            -webkit-border-radius: 4px;
            -moz-border-radius: 5px;
            -o-border-radius: 5px;
            border-radius: 4px;
      `
      button = (<Btn>
        {button.props.showText ? button.GetValue() : undefined}
      </Btn>);
    }
    return button;
  }
}
