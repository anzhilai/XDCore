import React from 'react';
import XBaseLayout, {XBaseLayoutProps} from "../base/XBaseLayout";
import SwipeAction, {SwipeActionProps} from "./swipe/SwipeAction";

export interface XSwipeActionProps extends XBaseLayoutProps, SwipeActionProps {
}

/**
 * 滑动一个元素，显示一组按钮
 * @name 滑动
 * @groupName 折叠显示
 */
export default class XSwipeAction extends XBaseLayout<XSwipeActionProps, any> {
  static ComponentName = "滑动";
  static defaultProps = {
    ...XBaseLayout.defaultProps,
  };

  constructor(props: XSwipeActionProps) {
    super(props);
  }

  render() {
    return (<SwipeAction {...this.props}>{this.props.children}</SwipeAction>);
  }

}
