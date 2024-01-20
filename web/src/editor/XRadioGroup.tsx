import React from 'react';
import {Radio, Space} from 'antd';
import XGroup, {XGroupProps} from "./group/XGroup";
import RadioGroup from "./group/RadioGroup";
import MRadio, {RadioProps} from "./group/Radio";

// @ts-ignore
export interface XRadioGroupProps extends XGroupProps, RadioProps {
  /**
   * Radio按钮的显示模式，bool则显示是否，gender显示男女
   */
  mode?: 'items' | 'bool' | 'gender',
  /**
   * 是否选择项  选择 是|否
   */
  useBool?: boolean,
  /**
   * 男女选择项  选择 男|女
   */
  useGender?: boolean,
  /**
   * 根据radioName进行显示
   */
  useRadioName?: boolean,
  /**
   * 当radio按钮不在一起时，可以radioName组对
   */
  radioName?: string,
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
 * 一组单选框
 * @name 单选组
 * @groupName 选择
 */
export default class XRadioGroup extends XGroup<XRadioGroupProps, any> {
  static ComponentName = "单选组";
  static Radio: typeof Radio = Radio;
  static StyleType = {web: 'web', common: 'common'};
  static defaultProps = {
    ...XGroup.defaultProps,
    mode: "items",
    useBool: false,
    useGender: false,
    useRadioName: false,
    radioName: "radio",
  };


  constructor(props) {
    super(props);
    if (this.props.mode === "bool" || this.props.useBool) {
      this.state.items = this.formatData(["是", "否"]);
    }
    if (this.props.mode === "gender" || this.props.useGender) {
      this.state.items = this.formatData(["男", "女"]);
    }
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.inputEle) {
      this.inputEle.name = this.props.radioName;
    }
  }

  onRadioChange = (e) => {
    this.SetValue(e.target.value);
  }

  /**
   * 设置值
   * @param value 字符串
   * @param triggerValueChange 是否触发onValueChange
   */
  SetValue(value, triggerValueChange = true) {
    this.useStateValue = true;
    this.state.record = undefined;
    this.state.value = value;
    for (let i = 0; i < this.state.items.length; i++) {
      if (this.state.items[i][this.props.valueField] === value) {
        this.state.record = this.state.items[i];
        break;
      }
    }
    this.setState({
      value: this.state.value,
      record: this.state.record,
    });
    if (triggerValueChange) {
      this.onValueChangeEvent();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.useRadioName) {
      if ('indeterminate' in nextProps) {
        this.inputEle.indeterminate = nextProps.indeterminate;
      }
      if ('checked' in nextProps) {
        // @ts-ignore
        this.state.checked = nextProps.checked;
        this.inputEle.checked = nextProps.checked;
      }
    }
  }

  GetText() {
    let value = this.GetValue();
    for (let i = 0; i < this.state.items.length; i++) {
      if (this.state.items[i][this.props.valueField] === value) {
        value = this.state.items[i][this.props.displayField];
        break;
      }
    }
    return value;
  }

  inputEle: any;

  renderEditor() {
    if (this.GetStyleType() === XRadioGroup.StyleType.common) {// @ts-ignore
      return <RadioGroup {...this.props} value={this.GetValue()} onChange={(value) => this.SetValue(value)}>
        {this.state.items.map(d => (
          <MRadio key={d[this.props.valueField]}
                  value={d[this.props.valueField]}>{d[this.props.displayField]}</MRadio>))}</RadioGroup>
    }
    if (this.props.useRadioName) {
      return (<input ref={(e) => this.inputEle = e} type={"radio"} value={this.GetValue()}/>);
    }
    let style: any = {};
    style.height = "100%";
    style.width = "100%";
    if (this.props.grid[0] > 0) {
      style.fontSize = "14px";
    }
    style.display = "flex";
    style.alignItems = "center";

    return (
      <Radio.Group key={this.props.field+this.props.label} style={style} disabled={this.props.disabled} onChange={this.onRadioChange} value={this.GetValue()}>
        <Space direction={this.props.itemDirection} align={this.props.itemAlign} wrap={this.props.wrap}>
          {this.state.items.map(d => (<Radio key={d[this.props.valueField]}
                                             value={d[this.props.valueField]}>{d[this.props.displayField]}</Radio>))}
        </Space>
      </Radio.Group>
    );
  }
}
