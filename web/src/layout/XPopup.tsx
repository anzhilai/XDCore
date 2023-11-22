import React, {ReactNode} from 'react';
import XBaseLayout, {XBaseLayoutProps} from "../base/XBaseLayout";
import { Drawer } from "antd";
import {XTools} from "..";
import PropsType from "./pop/PropsType";
import Popup from "./pop/Popup";

export interface XPopupProps extends XBaseLayoutProps, PropsType {
  /**
   * 标题
   */
  title?: string,
  /**
   * 显示位置
   */
  placement?: "top" | "right" | "bottom" | "left",
  /**
   * 宽度
   */
  width?: string;
  /**
   * 高度
   */
  height?: string;
  /**
   * 容器
   */
  container?: any,
  mask?: boolean,
  /**
   * 关闭事件
   */
  onClose?: Function
}

/**
 * 从上下左右弹出对话框
 * @name 弹出框
 * @groupName 弹出
 */
export default class XPopup extends XBaseLayout<XPopupProps,any> {
  static ComponentName = "弹出框";
  static StyleType = {web: 'web',mobile: 'mobile',};


  static Placement ={
    top:"top", right: "right", bottom:"bottom", left:"left"
  }

  static defaultProps = {
    ...XBaseLayout.defaultProps,
    title: '',
    placement: XPopup.Placement.right,
    width: '300px',
    height: '100%',
    mask:false,
    container:undefined,
    forceRender: false,
    onClose:undefined,
  };

  constructor(props:XPopup) {
    super(props);
    this.state = {
      ...this.state,
      title:this.props.title,
      placement:this.props.placement,
      visible:false,
    }
  }

  /**
   * 显示浮层
   * @param title 标题
   */
  Show(title: string | ReactNode) {
    if (this.props.container) {
      this.state.container = XTools.GetValueOrFromFunction(this.props.container);
    }
    this.setState({
      title: title,
      container: this.state.container,
      visible: true,
    });
  }

  /**
   * 隐藏浮层
   */
  Close(){
    this.setState({visible: false,});
  }

  onClose = () => {
    this.setState({visible: false,});
    this.props.onClose && this.props.onClose();
  };

  render() {
    if (this.props.styleType === XPopup.StyleType.mobile) {
      return <Popup {...this.props}>{this.props.children}</Popup>
    } else {
      let style;
      if (this.props.container) {
        style = {position: 'absolute'};
      }
      return <Drawer
        title={this.state.title}
        placement={this.state.placement}
        onClose={this.onClose}
        width={this.props.width}
        height={this.props.height}
        forceRender={true}
        open={this.state.visible}
        style={style}
        mask={this.props.mask}
        getContainer={this.state.container}>
        {this.props.children}
      </Drawer>;
    }
  }
}

