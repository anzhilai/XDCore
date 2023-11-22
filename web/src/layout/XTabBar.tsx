import React from 'react';
import XBaseLayout, {XBaseLayoutProps} from "../base/XBaseLayout";
import TabBar, {TabBarProps} from './tab/TabBar';
import TabBarItem from "./tab/TabBarItem";

// @ts-ignore
export interface XTabBarProps extends XBaseLayoutProps, TabBarProps {
  /**
   * 激活key
   */
  activeKey?: string,
}

/**
 * 类似Tab页的导航栏，一般在手机页面的最下面
 * @name 页签栏
 * @groupName 折叠显示
 */
export default class XTabBar extends XBaseLayout<XTabBarProps, any> {
  static ComponentName = "页签栏";
  static Item: typeof TabBarItem = TabBarItem;
  static defaultProps = {
    ...XBaseLayout.defaultProps,
  };


  constructor(props: XTabBarProps) {
    super(props);
    this.state.activeKey = this.props.activeKey;
  }

  /**
   * 获取激活key
   */
  GetActiveKey() {
    return this.state.activeKey;
  }

  /**
   * 设置激活key
   * @param key
   */
  SetActiveKey(key) {
    this.setState({activeKey: key,})
  }

  render() {
    return (<TabBar activeKey={this.state.activeKey}
                    onChange={(key) => this.SetActiveKey(key)} {...this.props}>{this.props.children}</TabBar>);
  }

}
