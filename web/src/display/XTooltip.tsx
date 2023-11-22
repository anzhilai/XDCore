import React from "react";
import {Tooltip} from "antd";
import XBaseDisplay, {XBaseDisplayProps} from "../base/XBaseDisplay";
import MTooltip, {TooltipProps} from "./tooltip/Tooltip"

export interface XTooltipProps extends XBaseDisplayProps, TooltipProps {
  /**
   * 提示文字
   */
  title?: React.ReactNode,
  /**
   * 位置
   */
  placement?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom',
  /**
   * 获取弹出式容器
   * @param triggerNode
   */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement,
}

/**
 * 在一个组件上显示提示文字
 * @name 提示文字
 * @groupName 列表
 */
export default class XTooltip extends XBaseDisplay<XTooltipProps, any> {
  static ComponentName = "提示文字";
  static Tooltip: typeof Tooltip = Tooltip;
  static StyleType = {web: 'web', common: 'common'};

  static defaultProps = {
    ...XBaseDisplay.defaultProps,
    width: "auto",
    height: "auto",
    title: "",
  };

  constructor(props) {
    super(props);
  }

  renderDisplay() {
    if (this.GetStyleType() === XTooltip.StyleType.common) {
      return <MTooltip {...this.props}>{this.props.children}</MTooltip>
    }
    return <Tooltip title={this.props.title} placement={this.props.placement}
                    getPopupContainer={this.props.getPopupContainer}>
      <div>{this.props.children}</div>
    </Tooltip>
  }
}
