import React from 'react';

import type {Property}  from 'csstype';
import XBaseLayout, { XBaseLayoutProps } from '../base/XBaseLayout';
import XBaseStyle from "../base/XBaseStyle";

export interface XFlexProps extends XBaseLayoutProps {
  /**
   * 布局方向
   */
  flexDirection?: "row" | "column",
  /**
   * 是否允许折叠
   */
  flexWrap?: boolean,
  /**
   * 行布局的间隔
   */
  rowGap?: string,
  /**
   * 列布局的间隔
   */
  columnGap?: string,
  /**
   * 垂直布局的起始位置
   */
  verticalAlign?: "start" | "end" | "center" | "spaceAround"|"spaceBetween",
  /**
   * 水平布局的起始位置
   */
  horizontalAlign?: "start" | "end" | "center" | "spaceAround"|"spaceBetween",
  contentVAlign?: string,
  contentHAlign?: string,
  contentCenter?: boolean,

  alignContent?: Property.AlignContent,
  alignItems?: Property.AlignItems,
  justifyContent?: Property.AlignContent,

  showDivide?: boolean,
  divideColor?: string,
  divideStyle?: string,
  divideWidth?: string,
}

/**
 * 封装div中的flex布局，简单灵活高效
 * @name 平铺布局
 * @groupName 网格
 */
export default class XFlex extends XBaseLayout<XFlexProps,any> {
  static ComponentName = "平铺布局";
  static FlexDirection={row:"row",column:"column"}

  static defaultProps = {
    ...XBaseLayout.defaultProps,
    flexDirection: "row",
    flexWrap: true,
    rowGap:"5px",
    columnGap:"5px",
    contentVAlign: undefined,
    contentHAlign: "start",
    contentCenter:false,

    alignContent: undefined,
    alignItems: undefined,
    justifyContent: undefined,
    justifyItems: undefined,

    showDivide: false,
    divideColor: undefined,
    divideStyle: undefined,
    divideWidth: undefined,

  };

  constructor(props:XFlexProps) {
    super(props);

  }

  getCurrentStyle(){
    const s:any={};
    if (this.props.contentHAlign === XBaseStyle.Align.start) {
      s.justifyContent = "flex-start";
    } else if (this.props.contentHAlign === XBaseStyle.Align.end) {
      s.justifyContent = "flex-end";
    }else if (this.props.contentHAlign === XBaseStyle.Align.center) {
      s.justifyContent = "center";
    }else if (this.props.contentHAlign === XBaseStyle.Align.spaceAround) {
      s.justifyContent = "space-around";
    }else if (this.props.contentHAlign === XBaseStyle.Align.spaceBetween) {
      s.justifyContent = "space-between";
    }
    if (this.props.horizontalAlign === XBaseStyle.Align.start) {
      s.justifyContent = "flex-start";
    } else if (this.props.horizontalAlign === XBaseStyle.Align.end) {
      s.justifyContent = "flex-end";
    }else if (this.props.horizontalAlign === XBaseStyle.Align.center) {
      s.justifyContent = "center";
    }else if (this.props.horizontalAlign === XBaseStyle.Align.spaceAround) {
      s.justifyContent = "space-around";
    }else if (this.props.horizontalAlign === XBaseStyle.Align.spaceBetween) {
      s.justifyContent = "space-between";
    }
    if (this.props.contentVAlign === XBaseStyle.Align.start) {
      s.alignItems = "flex-start";
    } else if (this.props.contentVAlign === XBaseStyle.Align.end) {
      s.alignItems = "flex-end";
    } else if (this.props.contentVAlign === XBaseStyle.Align.center) {
      s.alignItems = "center";
    }
    if (this.props.verticalAlign === XBaseStyle.Align.start) {
      s.alignItems = "flex-start";
    } else if (this.props.verticalAlign === XBaseStyle.Align.end) {
      s.alignItems = "flex-end";
    } else if (this.props.verticalAlign === XBaseStyle.Align.center) {
      s.alignItems = "center";
    }
    if(this.props.contentCenter){
      s.display="flex";
      s.alignItems="center";
      s.justifyContent= "center";
    }
    this.props.alignContent && (s.alignContent = this.props.alignContent)
    this.props.alignItems && (s.alignItems = this.props.alignItems)
    this.props.justifyContent && (s.justifyContent = this.props.justifyContent)

    s.flexDirection = this.props.flexDirection
    s.flexWrap=this.props.flexWrap?"wrap": 'nowrap';
    s.rowGap = this.props.rowGap
    s.columnGap = this.props.columnGap
    return s;
  }

  render() {
    let s = {};

      s = {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems : "center",
        display: "flex",
        ...this.getCurrentStyle(),
        ...this.getBoxStyle(),
      }
    return (
        <div className={this.props.boxClassName} style={s} {...this.props.htmlProps}>
          {this.props.children}
        </div>
      );

  }
}
