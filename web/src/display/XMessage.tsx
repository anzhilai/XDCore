import {message, notification} from "antd";
import React, {ReactNode} from "react";
import Toast, {ToastProps} from "./message/Toast";
import XTools from "../toolkit/XTools";
import Message from "./message/Message";

/**
 * 拥有很多静态函数，直接调用显示提示信息
 * @name 消息显示
 * @groupName 列表
 */
export default class XMessage extends React.Component{
  static ComponentName = "消息显示";
  static message: typeof message = message;
  static notification: typeof notification = notification;

  static ShowToast(content: ReactNode | ToastProps) {
    Toast.show(content)
  }

  static HideToast() {
    Toast.hide();
  }

  static ShowInfo(m: any, duration?: any, onClose?: any) {
    if (XTools.IsMobile()) {
      Toast.show(m);
      return;
    }
    //message.info(m, duration, onClose);
    notification.info({
      message: `系统消息`,
      description: m,
      placement: 'bottomRight',
    });
  }

  static ShowError(m: any, duration?: any, onClose?: any) {
    if (!m) {
      return;
    }
    if (XTools.IsMobile()) {
      Toast.show(m);
      return;
    }
    //message.error(m, duration, onClose);
    notification.error({
      message: `系统错误`,
      description: m,
      placement: 'bottomRight',
    });
  }

  static ShowWarn(m: any, duration?: any, onClose?: any) {
    if (XTools.IsMobile()) {
      Toast.show(m);
      return;
    }
    //message.warn(m, duration, onClose);
    notification.warning({
      message: `系统警告`,
      description: m,
      placement: 'bottomRight',
    });
  }

  static ShowAlert(m: any, duration?: any, onClose?: any) {
    message.warning(m, duration, onClose);
  }

  static ShowConfirm(m: any, duration?: any, onClose?: any) {
    message.warning(m, duration, onClose);
  }

  static ShowNotification(m: any, config?: object) {
    message.warning(m);
  }

  static ShowLoading(content: any, duration?: number) {
    message.loading(content, duration);
  }

  render() {
    return <Message {...this.props}/>;
  }
}
