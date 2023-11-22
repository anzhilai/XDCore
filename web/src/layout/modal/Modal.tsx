import React, {Component} from 'react';
import classnames from 'classnames';
import {BaseModalProps} from './ModalPropsType';
import Popup from '../pop/Popup';
import ModalHeader from './ModalHeader';
import ModalBody from './ModalBody';
import ModalFooter from './ModalFooter';
import "./modal.css"
import {XButton, XCard, XForm, XIcon, XInput, XMessage, XNavBar, XPopup} from "../../index";
import XGrid from '../XGrid';
import ReactDOMClient from "react-dom/client";

export interface ModalProps extends BaseModalProps {
  prefixCls?: string;
  className?: string;
  children?: React.ReactNode;
}

export default class Modal extends Component<ModalProps, any> {
  static alert;

  static confirm;

  static defaultProps: ModalProps = {
    prefixCls: 'za-modal',
    visible: false,
    animationType: 'fade',
    animationDuration: 200,
    width: '70%',
    mask: true,
    maskType: 'normal',
    shape: 'radius',
    closable: false,
    maskClosable: false,
    destroy: true,
  };

  render() {
    const {
      prefixCls,
      className,
      shape,
      children,
      maskClosable,
      title,
      closable,
      footer,
      onCancel,
      ...others
    } = this.props;

    const cls = {
      modal: classnames(prefixCls, className, {
        [`${prefixCls}--${shape}`]: !!shape,
      }),
      dialog: classnames(`${prefixCls}__dialog`),
    };

    const showHeader = title || closable;
    const noop = () => {
    };

    return (
      <Popup
        className={cls.modal}
        direction="center"
        onMaskClick={maskClosable ? onCancel : noop}
        {...others}
      >
        <div className={cls.dialog}>
          {showHeader && <ModalHeader title={title} closable={closable} onCancel={onCancel}/>}
          <ModalBody>{children}</ModalBody>
          {footer && <ModalFooter>{footer}</ModalFooter>}
        </div>
      </Popup>
    );
  }

  //update by tangbin
  static ModalShow(title: React.ReactNode, okfun?: () => boolean | Promise<boolean> | void, content?: React.ReactNode, footer?: ((footer: React.ReactNode[], modal: { handleOk: () => void, handleCancel: () => void }) => React.ReactNode) | React.ReactNode[], height = "100%") {
    const mountNode = document.body;
    const container = document.createElement('div');
    mountNode.appendChild(container);
    const root = ReactDOMClient.createRoot(container);
    let handleCancel = () => {
      root.unmount();
      mountNode.removeChild(container);
    }
    let handleOk = async () => {
      let isOk: boolean | Promise<boolean> | void = true;
      if (okfun) {
        isOk = okfun();
        if (isOk == undefined) {
          isOk = false;
        } else if (typeof isOk === "boolean") {
        } else {// @ts-ignore
          isOk.then(function (data) {
            data && handleCancel();
          });
          return;
        }
      }
      isOk && handleCancel();
    }
    let buttons: React.ReactNode[] = okfun ? [
      <XButton styleType={XButton.StyleType.common}
               onClick={() => handleCancel()} block type={"default"} cellStyleType={"mobile"} text={"取消"}/>,
      <XButton styleType={XButton.StyleType.common}
               onClick={() => handleOk()} block type={"primary"} cellStyleType={"mobile"} text={"确认"}/>] : undefined;
    if (footer) {
      if (typeof footer == "function") {// @ts-ignore
        buttons = footer(buttons, {handleOk, handleCancel});
      } else {
        buttons = footer;
      }
    }
    root.render(<XPopup direction={"bottom"} height={height} styleType={"mobile"} mask={true} onMaskClick={() => handleCancel()}>
      <XGrid rowsTemplate={["auto", "1fr", "auto"]} boxStyle={{background: "#ffffff"}}>
        <XNavBar left={<XIcon.ArrowLeft onClick={() => handleCancel()}/>} title={title}/>
        <XCard overflow={"auto"}>{content}</XCard>
        {buttons &&
          <XGrid boxStyle={{padding: "5px 10px"}} columnsTemplate={["1fr", "1fr"]} columnGap={"5px"}>
            {buttons}
          </XGrid>}
      </XGrid>
    </XPopup>);
    return {handleOk, handleCancel};
  }
}
