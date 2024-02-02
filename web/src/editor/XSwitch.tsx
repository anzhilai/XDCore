import React from 'react';
import {Switch} from 'antd';
import {Segmented} from "antd";
import XBaseEditor, {XBaseEditorProps} from '../base/XBaseEditor';
import MSwitch, {SwitchProps} from "./switch/Switch";
import {XFlex, XIcon} from "../index";


// @ts-ignore
export interface XSwitchProps extends XBaseEditorProps, SwitchProps {
  /**
   * 选中时文字
   */
  checkedText?: string,
  /**
   * 未选中时文字
   */
  unCheckedText?: string,
  /**
   * 显示大小
   */
  size?: "default" | "small",
  /**
   * 使用(是|否)字符保存
   */
  useBoolChinese?: boolean,
  /**
   * 选项
   */
  options?: [{ label?: string, value?: string, icon?: object }, { label?: string, value?: string, icon?: object }],
}

/**
 * 录入是否布尔类型
 * @name 开关
 * @groupName 输入
 */
export default class XSwitch extends XBaseEditor<XSwitchProps, any> {
  static ComponentName = "开关";
  static StyleType = {web: 'web', common: 'common', segment: "segmented"};

  static defaultProps = {
    ...XBaseEditor.defaultProps,
    checkedText: '开启',
    unCheckedText: '关闭',
    size: "default",
  };


  constructor(props) {
    super(props);
    if (this.props.options) {
      this.state.options = this.props.options;
    } else {
      this.state.options = [
        {label: '卡片', value: '卡片', icon: <XIcon.Grid/>},
        {label: '表格', value: '表格', icon: <XIcon.List/>},
      ]
    }
    if (this.props.useBoolChinese) {
      this.state.checkedText = "是";
      this.state.unCheckedText = "否";
    } else {
      this.state.checkedText = this.props.checkedText;
      this.state.unCheckedText = this.props.unCheckedText;
    }
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.props.dataSourceUrl) {
      this.Refresh();
    }
  }

  GetText() {
    let value = this.GetValue();
    if (value) {
      return this.props.checkedText;
    } else {
      return this.props.unCheckedText;
    }
  }

  onChange = (value) => {
    let v = value;
    if (this.props.useBoolChinese) {
      if (typeof value == "boolean") {
        v = value ? "是" : "否";
      }
    }
    super.SetValue(v);
  }

  input: any;
  renderEditor = () => {
    if (this.GetStyleType() === XSwitch.StyleType.common) {
      return <MSwitch {...this.props} ref={(e) => this.input = e} onChange={v => this.onChange(v)}/>
    }
    if (this.GetStyleType() === XSwitch.StyleType.segment) {
      return <Segmented value={this.state.value} options={this.state.options} onChange={v => {
        this.onChange(v);
      }}/>
    }
    let value = this.GetValue();
    if (this.props.useBoolChinese) {
      value = value == "是";
    }
    return <Switch disabled={this.GetReadOnly() == true} ref={(e) => this.input = e}
                   checkedChildren={this.state.checkedText}
                   unCheckedChildren={this.state.unCheckedText} onChange={v => this.onChange(v)} size={this.props.size}
                   checked={value}/>;
  };

  getReadOnlyNode() {
    return this.renderEditor();
  }

  render() {
    if (!this.GetVisible()) {
      return <input value={this.GetValue()} ref={(e) => this.input = e} type="hidden"/>;
    } else {
      return super.render();
    }
  }
}
