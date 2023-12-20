import React from "react";
import PropTypes from 'prop-types'
import XBaseEditor, {XBaseEditorProps} from '../base/XBaseEditor';
import {Image, Button} from 'antd';
import XNumber from "../toolkit/XNumber";
import XButton from "./XButton";
import XModal from "../layout/XModal";
import XMessage from "../display/XMessage";

// import SignatureCanvas from 'react-signature-canvas'

export interface XSignBoardProps extends XBaseEditorProps {
}


/**
 * 多用于手机端的现场签名
 * @name 写字板
 * @groupName
 */
export default class XSignBoard extends XBaseEditor<XSignBoardProps, any> {
  static ComponentName = "写字板";
  static defaultProps = {
    ...XBaseEditor.defaultProps,
    width: "1000px",
    height: "500px",
  };

  constructor(props) {
    super(props);
  }

  sigCanvas: any;
  /**
   * 清空画布
   */
  ClearSign = () => {
    this.sigCanvas?.clear();
  };
  handleSign = () => {
    this.setState({signImg: this.sigCanvas?.toDataURL('image/png')})
  };
  isEmpty = () => {
    return this.sigCanvas?.isEmpty();
  }

  dataURLToBlob(dataURL) {
    // Code taken from https://github.com/ebidel/filer.js
    var parts = dataURL.split(';base64,')
    var contentType = parts[0].split(':')[1]
    var raw = window.atob(parts[1])
    var rawLength = raw.length
    var uInt8Array = new Uint8Array(rawLength)
    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }
    return new Blob([uInt8Array], {type: contentType})
  }

  async componentDidMount() {
    super.componentDidMount();// @ts-ignore
    const SignatureCanvas = await import(/* webpackChunkName: "tSignatureCanvas" */ 'react-signature-canvas');
    this.setState({SignatureCanvas: SignatureCanvas.default})
  }

  showModal(base64) {
    let SignatureCanvas = this.state.SignatureCanvas;
    const Ele = <SignatureCanvas penColor='black' ref={ref => this.sigCanvas = ref}
                                 onBegin={() => this.sigCanvas?.fromDataURL(base64)}
                                 canvasProps={{
                                   width: this.props.width,
                                   height: this.props.height,
                                   outline: "1px white dashed",
                                   outlineOffset: "-20px",
                                   borderRadius: "5px",
                                   border: "20px solid rgba(128,128,128,1)",
                                   background: "rgb(255,255,255)",
                                   className: "unzoom"
                                 }}/>;
    XModal.ModalShow("签名板", () => {
        let flag = false;
        if (this.isEmpty()) {
          XMessage.ShowWarn('请签名!')
        } else {
          this.handleSign();
          flag = true
        }
        return flag;// @ts-ignore
      }, Ele, this.props.width, XNumber.parseFloat(this.props.height) + 100,
      (items, modal) => {
        return <>
          {items[0]}
          <Button type="dashed" onClick={() => this.ClearSign()}>清除</Button>
          {items[1]}
        </>
      });
  }

  GetValue() {
    return this.state.signImg;
  }

  SetValue(base64) {
    this.setState({signImg: base64})
  }

  ValidateValue() {
    return ""
  }


  render() {
    if (!this.state.SignatureCanvas) {
      return <div></div>
    }
    const {field, label, showLabel, labelWidth, parent, value} = this.props
    return <>
      <XButton field={field} text={this.state.signImg ? "更换" : "签名"} onClick={() => this.showModal(value)}
               label={label} showLabel={showLabel} labelWidth={labelWidth}/>
      {this.state.signImg &&
        <Image width={"200px"} height={"100px"} src={this.state.signImg} style={{backgroundColor: '#ffffff'}}/>}
    </>
  }
}
export const XSignBoardHelp = {
  name: "XSignBoard",
  parent: "XBaseEditor",
  desc: "签字板组件",
  properties: [],
  methods: []
}
