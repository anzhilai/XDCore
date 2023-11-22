import React, {ReactNode, PureComponent, MouseEventHandler } from 'react';
import classnames from 'classnames';
import XIcon from "../XIcon";
import "./message.css"
export interface MessageProps {
  prefixCls?: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  children?: ReactNode;

  theme?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  icon?: ReactNode;
  closable?: boolean;
  hasArrow?: boolean;
  size?: 'md' | 'lg';
}

export interface MessageState {
  visible?: boolean;
}

export default class Message extends PureComponent<MessageProps, MessageState> {
  static defaultProps: MessageProps = {
    prefixCls: 'za-message',
    theme: 'primary',
    hasArrow: false,
    closable: false,
  };

  constructor(props: MessageProps) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  onClick: MouseEventHandler<HTMLDivElement> = (e) => {
    const { hasArrow, onClick } = this.props;
    if (hasArrow && typeof onClick === 'function') {
      onClick(e);
    }
  };

  onClose: MouseEventHandler<HTMLDivElement> = () => {
    this.setState({ visible: false });
  };

  render() {
    const { prefixCls, className, theme, size, icon, hasArrow, closable, children } = this.props;
    const { visible } = this.state;

    const classes = classnames(prefixCls, className, {
      [`${prefixCls}--${theme}`]: !!theme,
      [`${prefixCls}--${size}`]: !!size,
      [`${prefixCls}--link`]: !!hasArrow,
    });

    const iconRender = icon && <div className={`${prefixCls}__icon`}>{icon}</div>;
    const renderCloseIcon = closable &&XIcon.Close({onClick:this.onClose});
    const renderArrow = hasArrow && XIcon.ArrowRight();
    const noFooter = !closable && !hasArrow;

    return (
      visible && (
        <div className={classes} onClick={this.onClick}>
          <div className={`${prefixCls}__header`}>{iconRender}</div>
          <div className={`${prefixCls}__body`}>{children}</div>
          {!noFooter && (
            <div className={`${prefixCls}__footer`}>
              {renderArrow}
              {renderCloseIcon}
            </div>
          )}
        </div>
      )
    );
  }
}
