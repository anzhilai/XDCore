import React from "react";
import {Form} from "antd";
import XBaseEditor, { XBaseEditorProps } from "../base/XBaseEditor";

export interface XFormProps extends XBaseEditorProps {
  children?: React.ReactNode,

  /**
   * 获取服务端记录信息的URL
   */
  infoUrl?: string,
  /**
   * 数据记录详细信息
   */
  infoData?: object,
  /**
   * 是否访问服务信息
   */
  useServerInfo?: boolean,
  /**
   * 是否初始赋值时，触发onValueChange事件，
   */
  triggerValueChange: boolean,
  /**
   * 设置values回调
   * @param values
   * @param form
   */
  onSetValues?: (values: {}, form: XForm) => void,
  /**
   * 获取values回调
   * @param values
   * @param form
   */
  onGetValues?: (values: {}, form: XForm) => void,
}

/**
 * 综合一组表单元素，统一布局显示提交，赋值等
 * @name 表单
 * @groupName 导航显示
 */
export default class XForm extends XBaseEditor<XFormProps, any> {
  static ComponentName = "表单";
  static Form: typeof Form = Form;
  static defaultProps = {
    ...XBaseEditor.defaultProps,
    infoUrl: undefined,
    infoData: undefined,
    useServerInfo: false,
    triggerValueChange: true,
  };

  constructor(props) {
    super(props);
  }

  getCellStyleType() {
    return this.props.cellStyleType;
  }

  getLabelWidth() {
    return this.props.labelWidth;
  }

  getLabelStyle() {
    let style = this.props.labelStyle;
    if (!style) {
      if (this.GetStyleType() === "style1") {
        style = {
          minHeight: '40px',
          paddingLeft: "10px",
          paddingRight: "10px",
          height: "100%",
          border: '1px solid #f0f0f0',
          backgroundColor: '#fafafa'
        };
      }
    }
    return style ? style : {};
  }

  getEditorStyle() {
    let style = this.props.editorStyle;
    if (!style) {
      if (this.GetStyleType() === "style1") {
        style = {
          minHeight: '40px',
          paddingLeft: "10px",
          paddingRight: "10px",
          height: "100%",
          border: '1px solid #f0f0f0',
        };
      }
    }
    return style ? style : {};
  }

  GetValues() {
    let values = {};
    for (const i in this.Children) {
      const editor = this.Children[i];
      if(editor instanceof XBaseEditor) {
        const f = editor.GetField();
        if (f) {
          values[f] = editor.GetValue();
          if (values[f] === undefined) {
            values[f] = "";
          }
        }
      }
    }
    if(this.props.onGetValues){
      this.props.onGetValues(values,this);
    }
    return values;
  }

  GetEditorValues(): object {
    return this.GetValues();
  }

  ValidateEditorValues() {
    let e = "";
    for (const i in this.Children) {
      const editor = this.Children[i];
      if(editor instanceof XBaseEditor) {
        let ee = editor.ValidateValue();
        if (ee) {
          e += ee + "\r\n";
        }
      }
    }
    return e;
  }

  SetValues(values, triggerValueChange = true) {
    if (values) {
      for (const i in this.Children) {
        let editor = this.Children[i];
        if(editor instanceof XBaseEditor) {
          let f = editor.GetField();
          if (f in values) {
            editor.SetValue(values[f], triggerValueChange);
          }
        }
      }
    }
    if (this.props.onSetValues) {
      this.props.onSetValues(values, this);
    }
  }

  SetEditorValues(values) {
    this.SetValues(values, false);
  }

  ClearValues() {
    for (const i in this.Children) {
      let editor = this.Children[i];
      if(editor instanceof XBaseEditor) {
        let f = editor.GetField();
        editor.SetValue(undefined, false);
      }
    }
  }

  ClearEditorValues() {
    this.ClearValues();
  }

  SetValuesFromServer(id, url, clear) {
    this.SetEditorValuesFromServer(id, url, clear);
  }

  SetEditorValuesFromServer(id, url, clear = true) {
    let infourl = this.props.infoUrl;
    if (!infourl) {
      infourl = this.props.dataSourceUrl;
    }
    if (url) {
      infourl = url;
    }
    this.requestServerInfo(infourl, {id: id}, clear);
  }

  async requestServerInfo(url, data, clear = false) {
    let p = {};
    for (const d in data) {
      if (typeof data[d] !== "object") {
        p[d] = data[d];
      }
    }
    const retData = await this.RequestServerPost(url, p, false);
    if (clear) {
      this.ClearValues();
    }
    if (retData.Success && retData.Value) {
      let result = {...p, ...retData.Value};
      this.SetValues(result, this.props.triggerValueChange);
    } else {
      let result = {...p,};
      this.SetValues(result, this.props.triggerValueChange);
    }
  }


  componentDidMount() {
    super.componentDidMount();
    if (this.props.useServerInfo && this.props.infoUrl && this.props.infoData) {
      this.requestServerInfo(this.props.infoUrl, this.props.infoData);
    } else if (this.props.infoData) {
      this.SetValues(this.props.infoData, this.props.triggerValueChange);
    }
  }

  columns: any;

  render() {
    if (this.props.children) {
      return this.styleWrap(this.props.children);
    }
    let that = this;
    // if(!this.columns){
    //   this.columns = this.requestServerColumns();
    //   const Cols = this.columns.map((col)=>{
    //
    //     return <XInput field={col.field} parent={()=>that}/>
    //   });
    //   return Cols;
    // }
    return <></>
  }
}
