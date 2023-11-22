import React, { PureComponent } from 'react';
import classnames from 'classnames';
import PropsType from './AlertPropsType';
import Modal from '../modal';
import "./alert.css"
import localeZhCn from "../../theme/locale/zh_CN";
export interface AlertProps extends PropsType {
  prefixCls?: string;
  className?: string;
}

export default class Alert extends PureComponent<AlertProps, {}> {
  static defaultProps: AlertProps = {
    prefixCls: 'za-alert',
    animationType: 'zoom',
    shape: 'radius',
  };

  render() {
    const {
      prefixCls,
      className,
      content,
      cancelText,
      onCancel,
      locale = localeZhCn,
      shape,
      ...others
    } = this.props;
    const cls = {
      alert: classnames(prefixCls, className, {
        [`${prefixCls}--${shape}`]: !!shape,
      }),
    };

    return (
      <div className={cls.alert}>
        <Modal
          {...others}
          footer={
            <button type="button" className={`${prefixCls}__button`} onClick={onCancel}>
              {cancelText || locale!.closeText}
            </button>
          }
        >
          {content}
        </Modal>
      </div>
    );
  }
}
