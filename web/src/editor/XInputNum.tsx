import React from 'react';
import { InputNumber } from 'antd';
import XBaseEditor, { XBaseEditorProps } from '../base/XBaseEditor';
import Stepper from "./input/Stepper";
import MInputNumber from './input/InputNumber'

export interface XInputNumProps extends XBaseEditorProps {
  /**
   * 显示文本
   */
  placeholder?: string,
  /**
   * 最小值
   */
  min?: number,
  /**
   * 最大值
   */
  max?: number,

  step?: number;
  /**
   *精确几位小数
   */
  precision?: number,
  /**
   * 回车事件
   * @param value
   * @param record
   * @param e
   */
  onPressEnter?: (value?: any, record?: object, e?: any) => void,
}

/**
 * 录入数字信息
 * @name 数字框
 * @groupName 输入
 */
export default class XInputNum extends XBaseEditor<XInputNumProps, any> {
  static ComponentName = "数字框";
  static StyleType = {web: 'web',common: 'common',stepper:"stepper"};

  static defaultProps = {
    ...XBaseEditor.defaultProps,
    placeholder: '请输入数字',
    min: undefined,
    max: undefined,
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

  getValueChangeSleep(){
    return 500;
  }
  onChange = (value) => {
    let v = value;
    if (value !== null) {
      if (typeof value === "object" && value.target) {
        v = value.target.value;
      }
    }
    super.SetValue(v);
  }

  onPressEnter(e?: any, v?: any) {
    if (this.props.onPressEnter) {
      if (v == undefined) {
        v = this.GetValue();
      }
      this.props.onPressEnter(v);
    }
  }

  Focus() {
    this.input?.focus && this.input?.focus();
  }

  input: any;
  renderEditor = () => {
    if (this.GetStyleType() === XInputNum.StyleType.common) {
      return <MInputNumber {...this.props} ref={(ele) => this.input = ele} onChange={this.onChange}
                           value={this.GetValue()}/>;
    } else if (this.GetStyleType() === XInputNum.StyleType.stepper) {
      return <Stepper {...this.props}/>;
    } else {
      let style: any = {};
      if (this.props.grid[0] > 0) {
        style.height = "100%";
        style.width = "100%";
      }
      return <InputNumber onClick={e => e.stopPropagation()} onPressEnter={(e) => this.onPressEnter(e)}
                          ref={(e) => this.input = e} precision={this.props.precision} disabled={this.props.disabled}
                          style={style} onChange={this.onChange} placeholder={this.props.placeholder}
                          min={this.props.min} max={this.props.max}
                          value={this.GetValue()}/>;
    }
  };
}
