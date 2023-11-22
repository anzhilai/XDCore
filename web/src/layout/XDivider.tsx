import React from 'react';
import PropTypes from 'prop-types';
import XBaseLayout, {XBaseLayoutProps} from "../base/XBaseLayout";
import styled from 'styled-components';
import {Divider} from "antd";
import {XDividerStyle1, XDividerStyle2} from "./divider/XDividerStyle"

export const XCardStyle = {
  style1: XDividerStyle1,
  style2: XDividerStyle2,
}

export interface XDividerProps extends XBaseLayoutProps {
  /**
   * 分隔方向: horizontal: 纵向,vertical: 横向
   */
  direction?: 'horizontal' | 'vertical';
  /**
   * 是否虚线
   */
  dashed?: boolean,
  /**
   * 分割线标题的位置
   */
  orientation?: "left" | "right" | "center"
  plain?: boolean,
}

/**
 * 一根横向或者纵向的分割线
 * @name 分割线
 * @groupName 网格
 */
export default class XDivider extends XBaseLayout<XDividerProps, any> {
  static ComponentName = "分割线";
  static Divider: typeof Divider = Divider;
  static Direction = {vertical: "vertical", horizontal: "horizontal"};
  static defaultProps = {
    ...XBaseLayout.defaultProps,
    direction: "vertical",
  };

  constructor(props: XDividerProps) {
    super(props);
  }

  render() {
    if (this.props.styleType) {

    }
    return (
      <Divider type={this.props.direction} dashed={this.props.dashed} plain={this.props.plain}
               orientation={this.props.orientation}>{this.props.children}</Divider>
    );
  }
}
