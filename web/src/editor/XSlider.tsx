import React from 'react';
import {Rate, Slider} from 'antd';
import XBaseEditor, { XBaseEditorProps } from '../base/XBaseEditor';
import { XGrid, XInputNum } from "../index";
import MSlider,{SliderProps} from "./slider/Slider";

// @ts-ignore
export interface XSliderProps extends XBaseEditorProps, SliderProps {
  /**
   * 最大值
   */
  max?: number,
  /**
   * 最小值
   */
  min?: number,
  /**
   * 自定义显示列表
   */
  items?: any[],
  tipFormatter?: null | ((value?: number) => React.ReactNode);
  /**
   * 显示输入框
   */
  showInput?: boolean,
}

/**
 * 录入数字范围或者程度信息
 * @name 滑块
 * @groupName 输入
 */
export default class XSlider extends XBaseEditor<XSliderProps, any> {
  static ComponentName = "滑块";
  static Slider: typeof Slider = Slider;
  static StyleType = {web: 'web',common: 'common',rate:"rate"};
  static defaultProps = {
    ...XBaseEditor.defaultProps,
    max: 100,
    min: 0,
    showInput: false,
    size: "default",
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


  onChange = (value) => {
    let v = value;
    super.SetValue(v);
  }

  input: any;
  renderEditor = () => {
    let styleType = this.GetStyleType();
    if (styleType === XSlider.StyleType.common) {
      return <MSlider {...this.props}/>
    } else if (styleType === XSlider.StyleType.rate) {
      return <Rate {...this.props}/>
    }
    return <XGrid columnsTemplate={this.props.showInput ? ["30%", "1fr"] : ["1fr"]} contentVAlign="center">
      {this.props.showInput &&
        <XInputNum showLabel={false} field={"完成率"} onValueChange={v => this.SetValue(v)} max={this.props.max}
                   width={"130px"}
                   min={this.props.min} value={this.GetValue()}/>}
      <Slider style={{margin: '0px 10px 0px 10px'}} value={this.GetValue()} onChange={this.onChange}
              tipFormatter={this.props.tipFormatter}
              // marks={}
              max={this.props.max} min={this.props.min}/>
    </XGrid>;
  };

  render() {
    if (!this.GetVisible()) {
      return <input value={this.GetValue()} ref={(e) => this.input = e} type="hidden"/>;
    } else {
      return super.render();
    }
  }
}
