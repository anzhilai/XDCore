import React from "react";
import {Badge, Avatar} from "antd";
import XBaseEditor, {XBaseEditorProps} from "../base/XBaseEditor";


export interface XBadgeProps extends XBaseEditorProps {
  children?: React.ReactNode,
}

/**
 * 在元素的右上角显示
 * @name 徽标位置
 * @groupName 网格
 */
export default class XBadge extends XBaseEditor<XBadgeProps, any> {
  static ComponentName = "徽标位置";
  static Badge: typeof Badge = Badge;
  static defaultProps = {
    ...super.defaultProps,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.props.dataSourceUrl) {
      this.Refresh();
    }
  }

  render() {
    return <Badge count={this.GetValue()}>{this.props.children}</Badge>;
  }

}
