import React from 'react';
import {Spin} from 'antd';
import  {XTools,XBaseEditor,XBaseEditorProps} from 'xdcoreweb';

export interface XUEditorProps extends XBaseEditorProps {
  /**
   * 服务端的配置Url
   */
  serverUrl?: string,
  /**
   * 上传文件后缀
   */
  fileUrlPrefix?: string,
  inModal?: boolean,
}

const baseURL = 'xdcore/ueditor/';
/**
 * 百度的UEditor组件封装，编写HTML富文本，并保存到后端
 * @name 富文本编辑
 * @groupName 输入
 */
export default class XUEditor extends XBaseEditor<XUEditorProps, any> {
  static ComponentName = "富文本编辑";
  static defaultProps = {
    ...XBaseEditor.defaultProps,
    serverUrl: undefined,
    fileUrlPrefix: undefined,
    inModal: false,
    width: "100%",
    height: "100%",
  };

  UEditorId: string;
  ue: any

  constructor(props) {
    super(props);
    this.UEditorId = "UEditor" + new Date().getTime() + "_" + this.CreateUUID();
    this.state.loading = false;
  }

  async loadUE() {
    const url = baseURL + 'ueditor.all.min.js';
    const configUrl = baseURL + 'ueditor.config.js';
    const langUrl = baseURL + 'lang/zh-cn/zh-cn.js';
    await XTools.CreateScript(configUrl);
    await XTools.CreateScript(url);
    await XTools.CreateScript(langUrl);
    this.initUE();
    // @ts-ignore
    let zoom: number = parseFloat(document.body.style.zoom);
    if (zoom) {//处理zoom的问题
      zoom = 1 / zoom;// @ts-ignore
      let getViewportRect = window.UE.ui.uiUtils.getViewportRect;// @ts-ignore
      window.UE.ui.uiUtils.getViewportRect = function () {
        let ret = getViewportRect();
        let height = ret.height * zoom;
        let width = ret.width * zoom;
        ret.height = height;
        ret.width = width;
        ret.bottom = height;
        ret.right = width;
        return ret;
      }
    }
  }


  initUE() {
    // @ts-ignore
    if (!window.UE || !window.UE.getEditor) {
      window.setTimeout(() => this.initUE(), 500);
      return;
    }

    // @ts-ignore
    let opt = {
      UEDITOR_HOME_URL: baseURL,
      initialFrameWidth: '100%',
      // initialFrameHeight: 0,
      zIndex: this.props.inModal ? 1001 : 999,

      autoHeight: true,
      autoFloatEnabled: !this.props.inModal,
      removeFormatAttributes: 'lang, align, hspace, valign',
    };
    if (this.props.serverUrl) {
      // @ts-ignore
      opt.serverUrl = this.props.serverUrl;
    }
    if (this.props.fileUrlPrefix) {
      // @ts-ignore
      opt.fileUrlPrefix = this.props.fileUrlPrefix;
      // @ts-ignore
      opt.imageUrlPrefix = this.props.fileUrlPrefix;
    }

    try {
      // @ts-ignore
      let ue = this.ue = window.UE.getEditor(this.UEditorId, opt);
      ue.ready(() => {// @ts-ignore
        let clientHeight = document.getElementById(this.UEditorId).parentNode.clientHeight;
        let id = document.getElementById(this.UEditorId).children[0].id;
        let height = clientHeight - document.getElementById(id + "_toolbarbox").clientHeight
          - document.getElementById(id + "_bottombar").clientHeight;
        // @ts-ignore
        let zoom = document.body.style.zoom;
        if (zoom) {
          height = height * parseFloat(zoom);
        }
        ue.setHeight(height - 20);
        if (this.state.value) {
          ue.setContent(this.state.value);
        }
        this.setState({loading: false});
      });

      ue.on('serverConfigLoaded', () => {
        if (this.props.fileUrlPrefix) {
          ue.options.imageUrlPrefix = this.props.fileUrlPrefix;
          ue.options.fileUrlPrefix = this.props.fileUrlPrefix;
        }
      });
    } catch (e) {
    }
  }

  GetValue() {
    return this.ue.getContent();
  }

  SetValue(html, triggerValueChange = true) {
    super.SetValue(html, triggerValueChange);
    this.ue && this.ue.ready(() => {
      if (this.state.value) {
        this.ue.setContent(this.state.value);
      }
    });
  }

  getUploadFileList() {
    return this.ue.uploadFileList;
  }


  componentDidMount() {
    super.componentDidMount();
    // @ts-ignore
    if (!window.baidu || !baidu.editor) {
      this.loadUE();
      this.setState({loading: true});
    } else {
      window.setTimeout(() => this.initUE(), 100);
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    try {
      this.ue.destroy();
    } catch (e) {
    }
  }

  renderEditor() {
    let style: any = {height: "100%", overflow: 'auto'};
    return <div style={style}>
      {this.state.loading ? <Spin/> : null}
      <script id={this.UEditorId} type="text/plain"/>
    </div>
  }
}
