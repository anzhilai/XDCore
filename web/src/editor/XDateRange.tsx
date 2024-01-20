import React from 'react';
import {Button, DatePicker} from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import dayjs from 'dayjs';
import XBaseEditor, {XBaseEditorProps} from '../base/XBaseEditor';
import XGrid from "../layout/XGrid";
import XDate, {getTimeDistance} from '../toolkit/XDate';

const {RangePicker} = DatePicker;
const format = "YYYY-MM-DD HH:mm:ss"

export interface XDateRangeProps extends XBaseEditorProps {
  /**
   * 开始字段
   */
  startField?: string,
  /**
   * 结束字段
   */
  endField?: string,
  /**
   * 是否允许空值
   */
  allowEmpty?: boolean,
  /**
   * 显示时间
   */
  showTime?: boolean,
  /**
   * 显示秒钟
   */
  showSecond?: boolean,
}

export class RangePickerStorage extends XBaseEditor {
  render() {
    return <></>
  }
}

/**
 * 快速录入日期的范围
 * @name 日期范围
 * @groupName 输入
 */
export default class XDateRange extends XBaseEditor<XDateRangeProps, any> {
  static ComponentName = "日期范围";

  static defaultProps = {
    ...super.defaultProps,
    showTime: true,
    showSecond: true,
  }

  onChange = (moments) => {
    const startStr = moments && moments.length > 0 ? moments[0]?.format(format) : ''
    const endStr = moments && moments.length > 0 ? moments[1]?.format(format) : ''
    this.startStorage?.SetValue(startStr)
    this.endStorage?.SetValue(endStr)
  }

  onOk = (moments) => {
    this.onChange(moments)
  }

  GetParent() {
    return null;
  }

  setSelfStartValue = (value) => {
    this.setState({startValue: value ? dayjs(value, format) : undefined})
  }

  setSelfEndValue = (value) => {
    this.setState({endValue: value ? dayjs(value, format) : undefined})
  }

  GetValue() {
    return [this.state.startValue, this.state.endValue]
  }

  setDate(type) {
    let times = getTimeDistance(type);
    this.onChange(times);
    this.setState({open: false, startValue: times[0], endValue: times[1]});
  }

  startStorage: any;
  endStorage: any;
  renderEditor = () => {
    let format = "YYYY-MM-DD";
    let defaultValue = undefined;
    if (this.props.showTime) {
      format = "YYYY-MM-DD HH:mm:ss";
      defaultValue = [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')];
      if (!this.props.showSecond) {
        format = "YYYY-MM-DD HH:mm";
        defaultValue = [dayjs('00:00', 'HH:mm'), dayjs('23:59', 'HH:mm')];
      }
    }
    return <>
      <RangePicker locale={locale} format={format} disabled={this.props.disabled} renderExtraFooter={() => {
        return <XGrid columnsTemplate={["1fr", "1fr", "1fr", "1fr", "1fr"]} columnGap={"10px"} paddingTRBL={"10px"}>
          <Button size={"small"} onClick={() => this.setDate("month")}>本月</Button>
          <Button size={"small"} onClick={() => this.setDate("week")}>本周</Button>
          <Button size={"small"} onClick={() => this.setDate("yesterday2")}>前天</Button>
          <Button size={"small"} onClick={() => this.setDate("yesterday1")}>昨天</Button>
          <Button size={"small"} onClick={() => this.setDate("today")}>今天</Button>
        </XGrid>
      }} showTime={this.props.showTime ? {defaultValue,} : undefined}
                   onOpenChange={open => this.setState({open})} open={this.state.open}// @ts-ignore
                   value={this.GetValue()} onChange={this.onChange} onOk={this.onOk}/>
      <RangePickerStorage inited={e => this.startStorage = e} onValueChange={this.setSelfStartValue}
                          field={this.props.startField} parent={this.props.parent}/>
      <RangePickerStorage inited={e => this.endStorage = e} onValueChange={this.setSelfEndValue}
                          field={this.props.endField} parent={this.props.parent}/>
    </>
  };
}
