import React from 'react';
import {Button, Modal, Spin} from 'antd';
import Draggable from 'react-draggable';
import XBaseLayout, {XBaseLayoutProps} from '../base/XBaseLayout';
import XTools from "../toolkit/XTools";

const {toBodyZoom} = XTools
import ReactDOMClient from "react-dom/client";
import XIcon from '../display/XIcon';
import {default as Mobile} from "./modal/index"
import XMessage from "../display/XMessage";

export interface XModalProps extends XBaseLayoutProps {
  /**
   * 标题
   */
  title?: string,
  iconType?: string,
  /**
   * 是否可见
   */
  visible?: boolean,
  closable?: boolean,
  /**
   * 是否点击蒙板关闭
   */
  maskClosable?: boolean,
  /**
   * 是否可以拖动
   */
  draggable?: boolean,
  /**
   * cancel按钮的文字
   */
  onOK?: (callback: (boolean) => void) => void,
  /**
   * ok按钮的文字
   */
  okText?: React.ReactNode,
  /**
   * cancel按钮的文字
   */
  cancelText?: string,
  /**
   * footer底部的展示
   */
  footer?: ((footer: React.ReactNode[], modal: XModal) => React.ReactNode | React.ReactNode[]) | React.ReactNode[],
  /**
   * cancel按钮点击事件
   */
  onCancel?: () => undefined | boolean,
  modalRender?: (modal) => React.ReactNode,
  showFooter?: boolean,
  loading?: boolean,
  Enabled?: boolean,
  destroyOnClose?: boolean,
  style?: object,
  bodyStyle?: object,
  zIndex: number,
}

/**
 * 屏幕中间弹出一个对话框
 * @name 模态框
 * @groupName 弹出
 */
export default class XModal extends XBaseLayout<XModalProps, any> {
  static ComponentName = "模态框";
  static Mobile: typeof Mobile = Mobile;
  static Modal: typeof Modal = Modal;
  static Spin: typeof Spin = Spin;

  static ModalShowMobile(title: React.ReactNode, okfun?: () => boolean | Promise<boolean> | void, content?: React.ReactNode, footer?: ((footer: React.ReactNode[], modal: { handleOk: () => void, handleCancel: () => void }) => React.ReactNode) | React.ReactNode[], height = "100%") {
    return Mobile.ModalShow(title, okfun, content, footer, height);
  }

  static defaultProps = {
    ...XBaseLayout.defaultProps,
    title: "信息",
    width: "800px",
    visible: true,
    closable: true,
    maskClosable: false,
    draggable: false,
    onOK: undefined,
    onCancel: undefined,
    okText: "确定",
    cancelText: "取消",
    footer: undefined,
    showFooter: true,
    loading: false,
    Enabled: true,
    destroyOnClose: false,
    style: undefined,
    bodyStyle: undefined,
    zIndex: undefined,
  };

  static Confirm(title?: string, okfun?: () => void | boolean | Promise<any>, content?: any) {
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: title,
        content: content,
        okText: "确定",
        cancelText: "取消",
        onOk() {
          let isok = okfun?.();
          if (isok == undefined) {
            isok = true;
          }
          if (typeof isok == "boolean") {
            resolve(isok);
          } else if (isok) {
            isok.then(function (data) {
              //@ts-ignore
              data ? resolve(true) : resolve(false);
            }).catch(function () {
              resolve(false);
            });
          }
        },
        onCancel() {
          resolve(false);
        },
      });
    });
  }

  static MadalInfo(text, content, width, height) {
    return XModal.Info(text, content, width, height);
  }

  static Info(text, content, width, height) {
    if (!content) {
      content = (<div>
        <p>{text}</p>
      </div>);
    }
    return Modal.info({
      title: '系统提示',
      okText: "我知道了",
      content: content,
      width: width,
      bodyStyle: {height: height, overflow: "auto"},
      onOk() {
      },
    });
  }

  static Loading(content = "正在加载中...") {
    return Modal.info({
      icon: <span/>,
      content: <div>
        <XIcon.LoadingOutlined style={{animation: "spin 1s linear infinite"}}/>
        {content}
      </div>,
      bodyStyle: {margin: 0},
      okButtonProps: {style: {display: "none"}},//隐藏确认按钮
    });
  }

  static Show(title: string,  content?: React.ReactNode,okfun?: () => boolean | Promise<boolean> | void,  onCancel?: () => undefined | boolean,width?: string, height?: string, footer?: ((footer: React.ReactNode[], modal: XModal) => React.ReactNode | React.ReactNode[]) | React.ReactNode[], draggable = false, style = {top: 20}) {
    return XModal.ModalShow(title,okfun,content,width,height,footer,draggable,style,onCancel);
  }

  static ModalShow(title: string, okfun?: () => boolean | Promise<boolean> | void, content?: React.ReactNode, width?: string, height?: string, footer?: ((footer: React.ReactNode[], modal: XModal) => React.ReactNode | React.ReactNode[]) | React.ReactNode[], draggable = false, style = {top: 20}, onCancel?: () => undefined | boolean) {
    const div = document.createElement('div');
    document.body.appendChild(div);
    let root = ReactDOMClient.createRoot(div)
    return new Promise(res => {
      root.render(<XModal
        ref={res}
        title={title}
        draggable={draggable}
        destroyOnClose
        onOK={okfun ? (callback) => {
          let isOk: any = true;
          if (okfun) {
            isOk = okfun();
            if (isOk == undefined) {
              isOk = false;
            }
          }
          if (typeof isOk === "boolean") {
            callback(isOk);
          } else {
            isOk.then(function (data) {
              callback(data);
            });
          }
        } : undefined}
        footer={footer}
        width={width}
        style={style}
        Enabled={okfun ? true : false}
        bodyStyle={{height: height, overflow: "auto"}}
        onCancel={() => {
          let update = onCancel && onCancel();
          if (update == undefined || update == true) {
            try {
              // root.unmount();
              document.body.removeChild(div);
            } catch (e) {
              console.log(e);
            }
            return true;
          } else {
            return update;
          }
        }}
        okText="确认">
        {content}
      </XModal>);
    })
  }


  constructor(props: XModalProps) {
    super(props)
    this.state = {
      visible: this.props.visible,
      loading: false,
      bounds: {left: 0, top: 0, bottom: 0, right: 0},
      disabled: true,
    }
    this.draggleRef = React.createRef();
  }


  UNSAFE_componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('visible' in nextProps) {
      const visible = nextProps.visible;
      this.setState({
        visible: visible,
      });
    }
  }

  /**
   * 关闭模态对话框
   */
  handleCancel = () => {
    let update = undefined;
    let onCancel = this.props.onCancel;
    if (onCancel) {
      update = onCancel();
    }
    if (update == undefined || update == true) {
      this.setState({visible: false,});
    }
  }

  /**
   * 点击确认按钮
   */
  handleOk = () => {
    let saveFun = () => {
      const onOK = this.props.onOK;
      if (onOK) {
        onOK(this.OKCallback.bind(this));
      }
    }
    this.setState({loading: true,});
    let myEvent = new CustomEvent("modalColse", {detail: {save: false, callback: () => saveFun()}});
    window.dispatchEvent(myEvent);// @ts-ignore
    if (myEvent.detail.save) {
      return;
    }
    saveFun();
  }

  private OKCallback(ret) {
    let newState = {loading: false, visible: true}
    if (ret) {
      newState.visible = false;
    }
    this.setState(newState);
  }

  onStart = (event, uiData) => {
    let {clientWidth, clientHeight} = window?.document?.documentElement;
    clientWidth = toBodyZoom(clientWidth);
    clientHeight = toBodyZoom(clientHeight);
    const targetRect = this.draggleRef?.current?.getBoundingClientRect();
    this.setState({
      bounds: {
        left: -targetRect?.left + uiData?.x,
        right: clientWidth - (targetRect?.right - uiData?.x) + clientWidth,
        top: -targetRect?.top + uiData?.y,
        bottom: clientHeight - (targetRect?.bottom - uiData?.y) + clientHeight,
      },
    });
  };

  draggleRef?: any;

  render() {
    let footer = [];
    if (this.props.showFooter) {
      if (this.props.Enabled) {
        footer = [
          <Button key="cancel" onClick={this.handleCancel.bind(this)}>
            {this.props.cancelText}
          </Button>,
        ]
        if (this.props.onOK) {
          footer.push(<Button key="submit" type="primary" loading={this.state.loading}
                              onClick={this.handleOk.bind(this)}>{this.props.okText}</Button>);
        }
      } else {
        footer = [
          <Button key="cancel" onClick={this.handleCancel.bind(this)}>我知道了</Button>
        ]
      }
    }
    if (this.props.footer !== undefined) {
      if (typeof this.props.footer == "function") {// @ts-ignore
        footer = this.props.footer(footer, this);
      } else {
        footer = this.props.footer;
      }
    }
    let disabled = this.state.disabled;
    return <Modal title={!this.props.draggable ?
      this.props.title : <div style={{width: '100%', cursor: 'move',}}
                              onMouseOver={() => disabled && this.setState({disabled: false})}
                              onMouseOut={() => this.setState({disabled: true})}>{this.props.title}</div>}
                  open={this.state.visible}
                  destroyOnClose={this.props.destroyOnClose}
                  footer={footer}
                  closable={this.props.closable}
                  onCancel={this.handleCancel}
                  maskClosable={this.props.maskClosable}
                  width={this.props.width}
                  zIndex={this.props.zIndex}
                  wrapClassName="xmodal-wrap"
                  modalRender={modal => this.props.draggable ?
                    <Draggable bounds={this.state.bounds} disabled={disabled}
                               onStart={(event, uiData) => this.onStart(event, uiData)}>
                      <div ref={this.draggleRef}>{this.props.modalRender ? this.props.modalRender(modal) : modal}</div>
                    </Draggable> :
                    this.props.modalRender ? this.props.modalRender(modal) : modal
                  }
                  style={this.props.style ? this.props.style : {height: this.props.height, top: 20}}
                  bodyStyle={this.props.bodyStyle ? this.props.bodyStyle : {
                    height: this.props.height,
                    maxHeight: "90vh",
                    overflow: "auto"
                  }}>
      {this.props.children}
    </Modal>;
  }
}
