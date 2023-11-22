import React from "react";
import {Popover} from "antd";
import XBaseLayout, {XBaseLayoutProps} from "../base/XBaseLayout";
import Popper, {PopperProps} from "./pop/Popper";

export interface XPopoverProps extends XBaseLayoutProps, PopperProps {
  /**
   * 显示内容
   */
  content?: React.ReactNode,
  /**
   * 是否显示
   */
  open?: boolean,
  /**
   * 位置
   */
  placement?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom',
  /**
   * 显示隐藏的回调事件
   * @param visible
   */
  onVisibleChange?: (visible: boolean) => void,
  /**
   * 标题
   */
  title?: React.ReactNode,
  /**
   * 触发机制
   */
  trigger?: 'hover' | 'click' | 'focus',
}

/**
 * 从一个元素上面滑出对话框
 * @name 滑出框
 * @groupName 弹出
 */
export default class XPopover extends XBaseLayout<XPopoverProps, any> {
  static ComponentName = "滑出框";
  static Popover: typeof Popover = Popover;
  static StyleType = {web: 'web', common: 'common',};

  static defaultProps = {
    ...XBaseLayout.defaultProps,
    placement: "bottom",
    content: undefined,
    onVisibleChange: undefined,
  };

  constructor(props:XPopoverProps) {
    super(props);
    this.state.content = this.props.content;
  }

  renderLayout() {
    if (this.props.styleType === XPopover.StyleType.common) {
      return <Popper {...this.props}>{this.props.children}</Popper>
    } else {
      return <Popover placement={this.props.placement || "bottom"} trigger={this.props.trigger}
                      content={this.state.content} open={this.props.open}
                      title={this.props.title} onOpenChange={this.props.onVisibleChange}>
        <>
          {this.props.children}
        </>
      </Popover>;
    }
  }
}
