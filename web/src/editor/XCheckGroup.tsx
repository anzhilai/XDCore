import React from 'react';
import {Checkbox, Space} from 'antd';
import XGroup, {XGroupProps} from "./group/XGroup";
import CheckboxGroup from "./group/CheckboxGroup";
import MCheckbox, {CheckboxProps} from "./group/Checkbox";

// @ts-ignore
export interface XCheckGroupProps extends XGroupProps, CheckboxProps {
  /**
   * 显示方向
   */
  itemDirection?: 'horizontal' | 'vertical';
  /**
   * 显示位置
   */
  itemAlign?: 'start' | 'end' | 'center' | 'baseline';
  /**
   * 换行
   */
  wrap?: boolean,
}

/**
 * 一组多选框
 * @name 多选组
 * @groupName 选择
 */
export default class XCheckGroup extends XGroup<XCheckGroupProps, any> {
  static ComponentName = "多选组";
  static StyleType = {web: 'web', common: 'common'};
  static Checkbox: typeof Checkbox = Checkbox;
  static defaultProps = {
    ...XGroup.defaultProps,
    itemAlign: "start",
    itemDirection: "horizontal",
    wrap: true,
  };

  constructor(props) {
    super(props);
  }

  onCheckboxChange = value => {
    this.SetValue(value);
  }

  GetText() {
    const textList = [];
    let values = this.GetValue();
    if (typeof values === "string") {
      values = [values];
    }
    this.state.items.forEach((item) => {
      values.forEach((v) => {
          if (v === item[this.props.displayField]) {
            textList.push(item);
          }
        }
      )
    });
    return textList.join();
  }

  renderEditor() {
    let values = this.GetValue();
    if (typeof values == "string") {
      values = values.split(",");
    } else {
      values = values ? values : [];
    }
    if (this.GetStyleType() === XCheckGroup.StyleType.common) {
      // @ts-ignore
      return <CheckboxGroup {...this.props} value={values}
                            onChange={(value) => this.SetValue(value.length == 0 ? "" : value)}>
        {this.state.items.map((d, i) => (
          <MCheckbox key={d[this.props.valueField]}
                     value={d[this.props.valueField]}>{d[this.props.displayField]}</MCheckbox>))}</CheckboxGroup>
    }
    let style: any = {};
    style.height = "100%";
    style.width = "100%";
    if (this.props.grid[0] > 0) {
      style.fontSize = "14px";
      style.display = "flex";
      style.alignItems = "center";
    }// @ts-ignore
    return <Checkbox.Group style={style} onClick={(e) => e.stopPropagation()} onChange={this.onCheckboxChange} disabled={this.props.disabled}
                           value={values}>
      <Space direction={this.props.itemDirection} align={this.props.itemAlign} wrap={this.props.wrap}>
        {this.state.items.map((d, i) => (
          <Checkbox key={i} value={d[this.props.valueField]}>{d[this.props.displayField]}</Checkbox>
        ))}
      </Space>
    </Checkbox.Group>;
  }
}
