import React from "react";
import {Popconfirm} from "antd";
import XBaseLayout, {XBaseLayoutProps} from "../base/XBaseLayout";

export interface XPopConfirmProps extends XBaseLayoutProps {
  /**
   * 确认提示标题
   */
  title?: React.ReactNode | string,
  /**
   * Cancel按钮的点击事件
   */
  onCancel?: () => void,
  /**
   * ok按钮的点击事件
   */
  onOK?: () => void,
}

/**
 * 在元素上滑出的对话框包含确认和取消按钮
 * @name 滑出确认
 * @groupName 弹出
 */
export default class XPopConfirm extends XBaseLayout<XPopConfirmProps, any> {
  static ComponentName = "滑出确认";
  static defaultProps = {
    ...XBaseLayout.defaultProps,
    title: "",
    width: "auto",
    height: "auto",
    onCancel: undefined,
    onOK: undefined,
  };


  constructor(props:XPopConfirmProps) {
    super(props);
  }

  onOK(e) {
    e.stopPropagation();
    this.props.onOK && this.props.onOK();
  }

  onCancel(e) {
    e.stopPropagation();
    this.props.onCancel && this.props.onCancel();
  }


  renderLayout() {
    return (
      <Popconfirm title={this.props.title} okText="确定" cancelText="取消" onCancel={(e) => {
        this.onCancel(e)
      }} onConfirm={(e) => {
        this.onOK(e)
      }}>
        {this.props.children}
      </Popconfirm>
    );
  }
}