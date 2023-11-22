import React, {CSSProperties} from 'react';
import XBaseLayout, {XBaseLayoutProps} from "../base/XBaseLayout";
import Cell, {CellProps} from "./card/Cell";
import {XGrid, XIcon} from "../index";
import {Tooltip} from "antd";
import XTooltip from "../display/XTooltip";

export interface XCellProps extends XBaseLayoutProps {
  /**
   * 图标
   */
  icon?: React.ReactNode,
  /**
   * 名称
   */
  label?: any,
  /**
   * 名称宽度
   */
  labelWidth?: string,
  /**
   * 名称位置
   */
  labelMode?: "left" | "top",
  /**
   * 组件最右边扩展节点
   */
  extraButtons?: React.ReactNode,
  /**
   * 帮助信息
   */
  help?: React.ReactNode,
  /**
   * 编辑组件样式
   */
  editorStyle?: CSSProperties,
  /**
   * 名称样式
   */
  labelStyle?: CSSProperties,
  /**
   * 是否必须
   */
  isRequired?: boolean,
  /**
   * 是否显示验证文本
   */
  showValidateText?: boolean,
  /**
   * 验证文本
   */
  validateText?: string,
  /**
   * 显示箭头
   */
  hasArrow?: boolean,
  /**
   * 右边显示内容
   */
  description?: React.ReactNode,
  /**
   * 点击事件
   * @param e
   */
  onClick?: (e) => void
}

/**
 * 手一个小的布局单元，有标题，有内容，有后缀。
 * @name 单元块
 * @groupName 网格
 */
export default class XCell extends XBaseLayout<XCellProps, any> {
  static ComponentName = "单元块";
  static StyleType = {
    mobile: 'mobile',
    common: 'common',
    topdown: "topdown",
    style1: 'style1',
    style2: 'style2',
    style3: 'style3',
    style4: 'style4',
    style5: 'style5'
  };

  static defaultProps = {
    ...XBaseLayout.defaultProps,
  };


  constructor(props: XCellProps) {
    super(props);
  }


  createLabelNode() {
    if (!this.props.label) {
      return <div/>;
    }
    let width = this.props.labelWidth;
    let labelStyle = {display: 'flex', alignItems: 'center', width, ...this.props.labelStyle,};
    return <span style={labelStyle}>{this.props.isRequired ? <span style={{color: 'red'}}>*</span> : <span/>}
      {this.props.label}：</span>;
  }


  render() {
    if (this.props.styleType === XCell.StyleType.mobile) {
      let props = {...this.props};
      if (this.props.isRequired) {
        props.label = <>
          {this.props.isRequired ? <span style={{color: 'red'}}>*</span> : <span/>}
          {props.label}
        </>
      }
      if (this.props.showValidateText) {
        props.description = <>
          {props.description}
          <XTooltip styleType={"common"} content={this.props.validateText}>
            {XIcon.ExclamationCircleOutlined({color: 'red'})}
          </XTooltip>
        </>;
      }
      return (<Cell {...props}>{this.props.children}</Cell>);
    }
    if (this.props.styleType === XCell.StyleType.topdown) {
      return <XGrid rowsTemplate={["auto", "1fr"]}>
        {this.createLabelNode()}
        <div style={{display: 'flex', alignItems: "center", height: "100%", ...this.props.editorStyle}}>
          {this.props.children}
          {this.props.extraButtons ? <div>{this.props.extraButtons}</div> : <></>}
          {this.props.showValidateText ? <Tooltip title={this.props.validateText}>
            {XIcon.ExclamationCircleOutlined({color: 'red'})}</Tooltip> : <></>}
          {this.props.help ? <Tooltip title={this.props.help}>
            {XIcon.QuestionCircleOutlined({color: "gray"})}</Tooltip> : <></>}
        </div>
      </XGrid>;
    } else {
      return <XGrid columnsTemplate={["auto", "1fr"]}>
        {this.createLabelNode()}
        <div style={{display: 'flex', alignItems: "center", height: "100%", ...this.props.editorStyle}}>
          {this.props.children}
          {this.props.extraButtons ? <div>{this.props.extraButtons}</div> : <></>}
          {this.props.showValidateText ? <Tooltip title={this.props.validateText}>
            {XIcon.ExclamationCircleOutlined({color: 'red'})}</Tooltip> : <></>}
          {this.props.help ? <Tooltip title={this.props.help}>
            {XIcon.QuestionCircleOutlined({color: "gray"})}</Tooltip> : <></>}
        </div>
      </XGrid>
    }
  }

}
