import React from 'react';
import XBaseEditor, {XBaseEditorProps} from '../base/XBaseEditor';
import type {Property} from "csstype";

import {Anchor, Affix, Typography, Descriptions, Segmented, Space, Rate} from 'antd';

export interface XTextProps extends XBaseEditorProps {
  children?: React.ReactNode,
  /**
   * 字体
   */
  fontFamily?: Property.FontFamily,
  /**
   * 字体大小
   */
  fontSize?: Property.FontSize,
  /**
   * 字体样式
   */
  fontStyle?: Property.FontStyle,
  /**
   * 字体粗细
   */
  fontWeight?: Property.FontWeight,
  /**
   * 文本对齐方式
   */
  textAlign?: Property.TextAlign,
  /**
   * 字体颜色
   */
  textColor?: Property.Color,
  /**
   * 文本装饰
   */
  textDecoration?: Property.TextDecoration,
  textOverflow?: Property.TextOverflow,
  textTransform?: Property.TextTransform,
  /**
   * 字体样式
   */
  textStyle?: object,
}

/**
 * 文本显示，可以设置各种文本属性
 * @name 文本
 * @groupName 导航显示
 */
export default class XText extends XBaseEditor<XTextProps, any> {
  static ComponentName = "文本";
  static Descriptions: typeof Descriptions = Descriptions;
  static Segmented: typeof Segmented = Segmented;
  static Space: typeof Space = Space;
  static Rate: typeof Rate = Rate;
  static Affix: typeof Affix = Affix;
  static Anchor: typeof Anchor = Anchor;
  static Typography: typeof Typography = Typography;
  static Paragraph: typeof Typography.Paragraph = Typography.Paragraph;
  static defaultProps = {
    ...XBaseEditor.defaultProps,
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

  getTextStyle() {
    let s: any = {};
    if (this.props.color) {
      s.color = this.props.color;
    }
    if (this.props.fontFamily) {
      s.fontFamily = this.props.fontFamily;
    }
    if (this.props.fontSize) {
      s.fontSize = this.props.fontSize;
    }
    if (this.props.fontWeight) {
      s.fontWeight = this.props.fontWeight;
    }
    if (this.props.textAlign) {
      s.textAlign = this.props.textAlign;
    }
    if (this.props.textColor) {
      s.textColor = this.props.textColor;
    }
    if (this.props.textDecoration) {
      s.textDecoration = this.props.textDecoration;
    }
    if (this.props.textOverflow) {
      s.textOverflow = this.props.textOverflow;
    }
    if (this.props.textDecoration) {
      s.textTransform = this.props.textTransform;
    }
    return s;

  }

  renderEditor() {

    return (<div style={{...this.props.textStyle, ...this.getTextStyle()}}>
      {this.GetValue()}
      {this.props.children}
    </div>);
  };
}
