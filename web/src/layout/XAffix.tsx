import React from 'react';
import PropTypes from 'prop-types';
import XBaseLayout, {XBaseLayoutProps} from "../base/XBaseLayout";
import MAffix, {AffixProps} from './affix/Affix';
import {ContainerType} from "../toolkit/utils/dom";
import { Affix } from 'antd';

export interface XAffixProps extends XBaseLayoutProps {
  /**
   * 距离窗口顶部达到指定偏移量后触发
   */
  offsetTop?: number,

  /**
   * 距离窗口底部达到指定偏移量后触发
   */
  offsetBottom?: number,
  /**
   * 设置 Affix 需要监听滚动事件的元素
   */
  scrollContainer?: ContainerType;
  /**
   * 固定状态改变时出发的回调函数
   *
   * @param affixed 是否固定
   */
  onChange?: (affixed?: boolean) => void,

  /**
   * 滚动条滚动回调
   *
   * @param affixed 是否固定
   */
  onScroll?(top: number): void;

  /**
   * 位置
   */
  target?: () => Window | HTMLElement | null;
}

/**
 * 把元素固定在某个位置，一般是最上或者最下
 * @name 固定位置
 * @groupName 网格
 */
export default class XAffix extends XBaseLayout<XAffixProps, any> {
  static ComponentName = "固定位置";
  static StyleType = {web: "web", common: "common"}

  static defaultProps = {
    ...XBaseLayout.defaultProps,
    offsetTop: 0,
    offsetBottom: undefined,
  };


  constructor(props: XAffixProps) {
    super(props);
  }

  render() {
    if (this.props.styleType === XAffix.StyleType.common) {
      return <MAffix {...this.props}>{this.props.children}</MAffix>
    } else {
      return (
        <Affix offsetTop={this.props.offsetTop} offsetBottom={this.props.offsetBottom} onChange={this.props.onChange}
               target={this.props.target}>
          {this.props.children}
        </Affix>);
    }
  }
}
