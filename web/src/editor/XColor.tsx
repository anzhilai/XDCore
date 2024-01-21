import React from 'react';
import {Input} from 'antd';
import {SketchPicker} from 'react-color';
import XBaseEditor, {XBaseEditorProps} from "../base/XBaseEditor";
import XTools from '../toolkit/XTools';
import XGrid from "../layout/XGrid";
import ClickOutside from './select/components/ClickOutside';
import ResetPosition from "./select/components/ResetPosition";

export interface XColorProps extends XBaseEditorProps {
  /**
   * 显示输入框
   */
  showInput?: boolean,
  /**
   * 是否输出rgba颜色
   */
  isRgba?: boolean,
  /**
   * 点击按钮宽度
   */
  btnWidth?: number,
  /**
   * 显示输入框
   */
  btnHeight?: number,
}

/**
 * 录入或选择颜色
 * @name 颜色
 * @groupName 输入
 */
export default class XColor extends XBaseEditor<XColorProps, any> {
  static ComponentName = "颜色";
  static defaultProps = {
    ...XBaseEditor.defaultProps,
    showInput: true,
    isRgba: false,
    btnWidth: 45,
    btnHeight: 34,
  };
  input: any;

  constructor(props) {
    super(props)
    if (this.state.value) {
      let color = this.renderColor(this.state.value);
      this.state.oldColor = color;
      this.state.color = color;
    }
  }

  renderColor(value) {
    let color = {r: 255, g: 255, b: 255, a: 1};//白色
    if (value) {
      if (value.trim().indexOf("#") >= 0) {
        color = this.colorHex2RGB(value);
      } else {
        let str = value.split('(');
        if (str.length > 1) {
          value = str[1];
          value = value.split(')')[0];
        }
        let co = value.split(",");
        if (co.length >= 3) {
          color.r = parseInt(co[0]);
          color.g = parseInt(co[1]);
          color.b = parseInt(co[2]);
          if (co[3]) {
            color.a = parseFloat(co[3]);
          } else {
            color.a = 1;
          }
        }
      }
    }
    return color;
  }

  SetValue(value, triggerValueChange = true) {
    let color = this.renderColor(value);
    this.setState({
      oldColor: color,
      color: color,
    });
    super.SetValue(value, triggerValueChange);
  }

  colorRGB2Hex(color) {
    let r = color.r;
    let g = color.g;
    let b = color.b;
    let hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
  }

  colorHex2RGB(code) {
    let color = {r: 255, g: 255, b: 255, a: 1};//白色
    color.r = parseInt(code.substring(1, 3), 16);
    color.g = parseInt(code.substring(3, 5), 16);
    color.b = parseInt(code.substring(5), 16);
    return color;
  }

  handleClick() {
    // @ts-ignore
    this.setState({oldColor: this.state.color, displayColorPicker: "block"});
  }

  handleChange(value) {
    this.setState({color: value.rgb});
  }

  onOK() {
    if (this.state.color) {
      let c = "rgba(" + this.state.color.r + "," + this.state.color.g + "," + this.state.color.b + "," + this.state.color.a + ")";
      if (!this.props.isRgba) {
        c = this.colorRGB2Hex(this.state.color);
      }
      this.SetValue(c);
    }
    this.setState({displayColorPicker: "none"});
  }

  onCancel() {
    // @ts-ignore
    this.state.color = this.state.oldColor;
    this.setState({displayColorPicker: "none", color: this.state.oldColor});
  }

  onChange = (value) => {
    let v = value;
    if (value !== null) {
      if (typeof value === "object" && value.target) {
        v = value.target.value;
      }
    }
    this.SetValue(v);
  }

  Focus() {
    this.input?.focus && this.input?.focus();
  }

  renderEditor() {
    // let background = "#000000";
    let background = "#EFEFEF";
    let opacity = 1;
    if (!XTools.isEmptyObject(this.state.color)) {
      background = this.colorRGB2Hex(this.state.color);
      opacity = this.state.color.a;
    }
    return <ClickOutside onClickOutside={(event) => this.onCancel()}>
      <XGrid columnsTemplate={this.props.showInput ? ["90px", "auto"] : undefined}>
        {this.props.showInput &&
          <Input onClick={e => e.stopPropagation()} ref={(e) => this.input = e}
                 type="text" value={this.GetValue()}
                 onChange={(value) => this.onChange(value)}/>}
        <button onClick={this.handleClick.bind(this)} disabled={this.props.disabled} style={{
          background: background,
          opacity: opacity,
          border: "1px solid #d9d9d9",
          height: this.props.btnHeight,
          width: this.props.btnWidth,
          cursor: "pointer",
          verticalAlign: "top"
        }}/>
      </XGrid>
      {this.state.displayColorPicker == "block" &&
        <ResetPosition style={{position: "fixed", zIndex: 66, background: "white"}}
                       className={"unzoom tui-grid-filter"}>
          <SketchPicker color={this.state.color}  onChange={this.handleChange.bind(this)}/>
          <div style={{textAlign: "right", padding: 2}}>
            <button onClick={this.onCancel.bind(this)}>取消</button>
            <button onClick={this.onOK.bind(this)}>应用</button>
          </div>
        </ResetPosition>
      }
    </ClickOutside>;
  }
}
