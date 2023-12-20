import React from "react";
import {XCell,XButton, XModal,XInput, XInputProps} from "xdcoreweb";


export interface XInputCronProps extends XInputProps {
  /**
   *计算Cron的执行时间
   */
  crontimeUrl?: string,
}

const baseURL = 'xdcore/cron_html/';
/**
 * 可输入Cron表达式
 * @name Cron输入框
 * @groupName
 */
export default class XInputCron extends XInput<XInputCronProps, any> {
  static ComponentName = "Cron输入框";
  static defaultProps = {
    ...super.defaultProps,
    crontimeUrl: undefined,
  };

  constructor(props) {
    super(props);
  }

  iframe: Element;

  /**
   * 显示编辑框
   */
  ShowEditModal() {
    let cron表达式 = this.GetValue();
    XModal.ModalShow("编辑", () => {// @ts-ignore
      this.SetValue(this.iframe.contentWindow.getCron());
      return true;
    }, <iframe ref={(e) => this.iframe = e} onLoad={() => {// @ts-ignore
      if (this.iframe.contentWindow.pageInit) {// @ts-ignore
        this.iframe.contentWindow.qeueryCrontime = async (cron表达式, callback) => {
          let ret = await this.RequestServerPost(this.props.crontimeUrl, {cron表达式}, false)
          let list = [];
          if (ret.Success) {
            list = ret.Value;
          }
          callback && callback(list);
        }// @ts-ignore
        this.iframe.contentWindow.pageInit(cron表达式);
      }
    }} style={{width: "100%", height: "100%", border: 0}} src={baseURL + "/index.html"}></iframe>, '1100px', "760px");
  }

  editorWrap = (node) => {
    let extraButtons = this.props.extraButtons;
    if (!extraButtons && !this.GetReadOnly()) {
      extraButtons = <XButton width={"60px"} text={"编辑"} isA={true} onClick={() => this.ShowEditModal()}/>
    }
    let showCell = this.props.field ? true : false;
    if (this.props.showCell != undefined) {
      showCell = this.props.showCell;
    }
    if (showCell) {
      return this.styleWrap(<XCell labelMode={this.props.labelMode}
                                   extraButtons={extraButtons}
                                   help={this.props.help}
                                   isRequired={this.props.isRequired}
                                   validateText={this.props.validateText}
                                   label={this.state.showLabel ? this.GetLabel() : undefined}
                                   showValidateText={this.state.showValidateText}
                                   editorStyle={this.getEditorStyle()}
                                   labelStyle={this.getLabelStyle()}
                                   labelWidth={this.getLabelWidth()}
                                   styleType={this.getCellStyleType()}>{node}</XCell>)
    }
    return this.styleWrap(node);
  };
}
