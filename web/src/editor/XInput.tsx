import React from 'react';
import { Input } from 'antd';
import XBaseEditor, { XBaseEditorProps } from '../base/XBaseEditor';
import InputBase from "./input/InputBase";
import SearchBar from "./input/SearchBar";


export interface XInputProps extends XBaseEditorProps {
  /**
   * 显示文本
   */
  placeholder?: string,
  /**
   * 回车事件
   * @param value
   * @param record
   * @param e
   */
  onPressEnter?: (value?: any, record?: object, e?: any) => void,
  /**
   * 是否隐藏文本
   */
  isHidden?:boolean,
}

/**
 * 录入单行文本信息
 * @name 输入框
 * @groupName 输入
 */
export default class XInput<P = {}, S = {}> extends XBaseEditor<XInputProps & P, any> {
  static ComponentName = "输入框";
  static Input: typeof Input = Input;
  static StyleType = {web: 'web',common: 'common',search:"search"};

  static RegTel = /^((d{3,4})|d{3,4}-|s)?d{7,14}$/;
  static RegChinese = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
  static RegPhone = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  static RegNumber = /[^-0-9]/g;
  static RegEmail = /^[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/;



  static defaultProps = {
    ...XBaseEditor.defaultProps,
    placeholder: '请输入',
  };

  constructor(props: XInputProps) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();
    if(this.props.dataSourceUrl){
      this.Refresh();
    }
  }

  getValueChangeSleep(){
    return 500;
  }
  onChange=(value)=>{
    let v = value;
    if (value !== null){
      if(typeof value ==="object"&&value.target){
        v = value.target.value;
      }
    }
    super.SetValue(v);
  }

  onPressEnter(e?:any,v?:any){
    if(this.props.onPressEnter){
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
    let styleType = this.GetStyleType();
    if (styleType === XInput.StyleType.common) {
      return <InputBase disabled={this.props.disabled} onChange={this.onChange} placeholder={this.props.placeholder} value={this.GetValue()}
                        ref={(ele) => this.input = ele}/>;
    } else if (styleType === XInput.StyleType.search) {
      return <SearchBar {...this.props}/>;
    } else {
      let style: any = {};
      if (this.props.grid[0] > 0) {
        style.height = "100%";
        style.width = "100%";
      }
      return <Input disabled={this.props.disabled} onClick={e => e.stopPropagation()}
                    onPressEnter={(e) => this.onPressEnter(e)} ref={(e) => this.input = e}
                    placeholder={this.props.placeholder}
                    type="text" value={this.GetValue()}
                    style={style} onChange={this.onChange}
      />;
    }
  };

  render() {
    if (!this.GetVisible() || this.props.isHidden) {
      return <input value={this.GetValue()} ref={(e) => this.input = e} type="hidden"/>;
    } else {
      return super.render();
    }
  }
}
