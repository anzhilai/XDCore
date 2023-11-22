import {Cascader} from 'antd';
import React from 'react';
import XBaseEditor, {XBaseEditorProps} from '../base/XBaseEditor';
import SelectPicker from "./picker/SelectPicker"
import StackPicker from "./picker/StackPicker"

export interface XSelectCascaderProps extends XBaseEditorProps {
  /**
   * 数据列表
   */
  items?: any[],
}

/**
 * 级联选择一个层次结构，如省市区
 * @name 级联选择
 * @groupName 选择
 */
export default class XSelectCascader extends XBaseEditor<XSelectCascaderProps, any> {
  static ComponentName = "级联选择";
  static StyleType = {picker: 'picker', common: 'common', stack: "stack"};

  static defaultProps = {
    ...XBaseEditor.defaultProps,
  };

  constructor(props) {
    super(props);
    this.state.items = this.props.items;
  }

  onChange() {

  }

  renderEditor = () => {
    let styleType = this.GetStyleType();
    if (styleType === XSelectCascader.StyleType.picker) {
      return <SelectPicker/>
    } else if (styleType === XSelectCascader.StyleType.stack) {
      return <StackPicker dataSource={this.state.items}/>
    } else {
      return (<Cascader options={this.state.items} onChange={this.onChange} placeholder="请选择"/>);
    }
  };
}
