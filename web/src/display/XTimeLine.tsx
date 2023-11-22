import React from 'react';
import {Timeline} from 'antd';
import XBaseDisplay, {XBaseDisplayProps} from "../base/XBaseDisplay";

export interface XTimeLineProps extends XBaseDisplayProps {
  /**
   * 通过设置 mode 可以改变时间轴和内容的相对位置
   */
  mode?: 'left' | 'alternate' | 'right'
}

export interface XTimeLineItemProps {
  title?: string
}

/**
 * 按时间线显示一组列表
 * @name 时间线
 * @groupName 列表
 */
export default class XTimeLine extends XBaseDisplay<XTimeLineProps, any> {
  static ComponentName = "时间线";
  static Timeline: typeof Timeline = Timeline;
  static defaultProps = {
    ...XBaseDisplay.defaultProps,
    mode: "left"
  };

  static Item = function (props: XTimeLineItemProps) {
    return <div></div>
  }

  constructor(props) {
    super(props);
  }

  renderDisplay() {
    return (<Timeline>step6</Timeline>);
  }

}