import React from 'react';
import { DatePicker } from 'antd';
import 'dayjs/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import dayjs from 'dayjs'
import XBaseEditor, { XBaseEditorProps } from '../base/XBaseEditor';
import DateSelectPicker from "./date/DateSelectPicker"
import XTools from "../toolkit/XTools";
import XDate from '../toolkit/XDate';
export interface XDateTimeProps extends XBaseEditorProps {
  /**
   * 时间显示类型
   * @defaultValue date
   */
  type?: "datetime" | "dateMinute" | "date" | "time" | "month" | "year",
  /**
   * 焦点事件
   */
  onFocus?: (e: {}) => void,
  onBlur?: (e: {}) => void,
  /**
   * 存在时间
   */
  hasTime?:boolean,
  /**
   * 弹出框类名
   */
  popupClassName?: string | undefined;
}

/**
 * 录入日期和时间信息
 * @name 日期框
 * @groupName 输入
 */
export default class XDateTime extends XBaseEditor<XDateTimeProps, any> {
  static ComponentName = "日期框";
  static StyleType = {mobile: 'mobile',common: 'common'};

  static Type = {
    datetime: "datetime", dateMinute: "dateMinute", date: "date", time: "time", month: "month", year: "year",
  }

  static defaultProps = {
    ...XBaseEditor.defaultProps,
    type: XDateTime.Type.date,
    hasTime:true,
  };

  input: any;
  changeOpenValue: string;
  changeCloseValue: string;
  openDatePicker: boolean;

  constructor(props: XDateTimeProps) {
    super(props);
    let format = this.getFormat();
    let val = this.props.value;
    if (typeof val === "object") {
      val = dayjs(val).format(format);
    }
    this.state = {
      ...this.state,
      value: val,
      format: format,
    }
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.props.dataSourceUrl) {
      this.Refresh();
    }
  }

  onChange = (value, dateString) => {
    this.SetValue(dateString);
  }

  onOk = (value) => {
    // @ts-ignore
    this.state.moment = value;
  }

  getFormat(){
    let format = "";
    if (this.props.type === XDateTime.Type.datetime) {
      format = "YYYY-MM-DD HH:mm:ss";
    } else if (this.props.type === XDateTime.Type.dateMinute) {
      format = "YYYY-MM-DD HH:mm";
    } else if (this.props.type === XDateTime.Type.date) {
      format = "YYYY-MM-DD";
    } else if (this.props.type === XDateTime.Type.time) {
      format = "HH:mm:ss";
    } else if (this.props.type === XDateTime.Type.month) {
      format = "YYYY-MM";
    } else if (this.props.type === XDateTime.Type.year) {
      format = "YYYY";
    }
    return format;
  }
  GetValue() {
    if (this.useStateValue) {
      return this.state.value;
    }
    let val = this.props.value;
    if (typeof val === "object") {
      val = dayjs(val).format(this.getFormat());
    }
    return val;
  }
  GetText(): any {
    let val = this.GetValue();
    if (val && typeof val === "object") {
      if (val.format) {
        val = val.format(this.state.format);
      } else {
        val = dayjs(val).format(this.state.format);
      }
    }
    if (val && this.state.format === "YYYY-MM-DD") {
      val = val?.substring(0, 10);
    }
    return val;
  }



  validateReadOnlyEditClickTarget(target) {
    return !XTools.FindParentExistsClass(target, "ant-picker-dropdown");
  }

  addEventListener(event) {
    let input = event ? event.target : undefined;
    if (input && input.tagName === "INPUT" && this.input === undefined) {
      let fun = (e) => {
        if (this.openDatePicker) {
          this.changeOpenValue = e.target.value;
        } else {
          this.changeCloseValue = e.target.value;
        }
      };
      input.addEventListener('keyup', fun);
      input.addEventListener('change', fun);
      this.input = input;
    }
  }

  Focus() {
    this.input?.focus && this.input?.focus();
  }

  renderEditor = () => {
    let showtime;
    let picker;
    if (this.props.type === XDateTime.Type.datetime) {
      showtime = {format: "HH:mm:ss"};
    } else if (this.props.type === XDateTime.Type.dateMinute) {
      showtime = {format: "HH:mm"};
    } else if (this.props.type === XDateTime.Type.year) {
      picker = "year";
    } else if (this.props.type === XDateTime.Type.month) {
      picker = "month";
    }
    const style: any = {};
    if (this.props.grid[0] > 0) {
      style.height = "100%";
      style.width = "100%";
    }
    let val = this.GetValue();
    if (val) {
      if (typeof val === "string") {
        val = dayjs(val, this.state.format);
      } else if (typeof val === "object") {
        val = dayjs(val);
      }
    }

    if (val === "") val = undefined;// @ts-ignore
    if (this.GetStyleType() === XDateTime.StyleType.common) {// @ts-ignore
      return <DateSelectPicker value={val?.toDate()} mode={this.props.type}
                               onOk={(date) => date && this.SetValue(XDate.format(date, this.getFormat()))}
                               ref={(ele) => this.input = ele}/>
    }
    return <DatePicker onClick={e => e.stopPropagation()} ref={(ele) => this.input = ele} popupClassName={this.props.popupClassName}
                       onFocus={this.props.onFocus} onBlur={this.props.onBlur} placeholder={"选择时间"} style={style}
                       format={this.state.format} picker={picker} showTime={showtime} value={val} onOpenChange={(v) => {
      this.addEventListener(window.event || event);
      this.openDatePicker = v;
      if (v) {
        this.changeOpenValue = "";
        this.changeCloseValue = "";
      } else {
        if (this.changeOpenValue && this.changeOpenValue != this.changeCloseValue) {
          if (dayjs(this.changeOpenValue, this.state.format).isValid()) {
            this.SetValue(this.changeOpenValue);
          }
        }
      }
    }} onChange={this.onChange} locale={locale} onOk={this.onOk}/>
  };


}
