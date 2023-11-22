import React, {
  PureComponent,
  MouseEventHandler,
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,ReactNode
} from 'react';

export type ButtonTheme = 'default' | 'primary'  | 'info' | 'success'  | 'warning' | 'danger' | 'dashed';
export type ButtonSize = 'lg' | 'md' | 'sm' | 'xs'|'large' | 'normal' | 'small';
export type ButtonShape = 'radius' | 'rect' | 'round' | 'circle';
import classnames from 'classnames';
import"./button.css"

interface BaseButtonPropsType {
  type?: ButtonTheme;
  size?: ButtonSize;
  shape?: ButtonShape;
  block?: boolean;
  ghost?: boolean;
  shadow?: boolean;
  focus?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  prefixCls?: string;
  onClick?: MouseEventHandler<HTMLElement>;

  isBlock?:boolean,
}

export type AnchorButtonProps = {
  mimeType?: string;
} & BaseButtonPropsType &
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'type' | 'onClick'>;

export type NativeButtonProps = {
  htmlType?: 'button' | 'submit' | 'reset';
} & BaseButtonPropsType &
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'>;

export type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps>;

export default class Button extends PureComponent<ButtonProps, {}> {
  static displayName = 'Button';

  static defaultProps: ButtonProps = {
    prefixCls: 'za-button',
    type: 'default',
    size: 'md',
    shape: 'radius',
    block: false,
    ghost: false,
    shadow: false,
    disabled: false,
    loading: false,
    htmlType: 'button',
  };

  onClick: ButtonProps['onClick'] = (e) => {
    const { disabled, onClick } = this.props;
    if (disabled) {
      return;
    }
    if (typeof onClick === 'function') {
      onClick(e);
    }
  };

  render() {
    const {
      prefixCls,
      className,
      type,
      size,
      shape,
      icon,
      block,
      ghost,
      shadow,
      disabled,
      loading,
      onClick,
      children,
      ...rest
    } = this.props;

    let cls = classnames(prefixCls, className, {
      [`${prefixCls}--${type}`]: !!type,
      [`${prefixCls}--${size}`]: !!size,
      [`${prefixCls}--${shape}`]: !!shape,
      [`${prefixCls}--block`]: !!block,
      [`${prefixCls}--ghost`]: !!ghost,
      [`${prefixCls}--shadow`]: !!shadow,
      [`${prefixCls}--disabled`]: !!disabled,
      [`${prefixCls}--loading`]: loading,
    });

    const iconRender =  icon;

    const childrenRender = children && <span>{children}</span>;

    const contentRender =
        !!icon || loading ? (
            <div className={`${prefixCls}__content`}>
              {iconRender}
              {childrenRender}
            </div>
        ) : (
            childrenRender
        );

    if ((rest as AnchorButtonProps).href !== undefined) {
      const { htmlType, ...filteredRest } = rest;
      const { mimeType, ...anchorRest } = filteredRest as AnchorButtonProps;
      cls = classnames(cls, `${prefixCls}--link`);

      return (
          <a
              {...anchorRest}
              type={mimeType}
              aria-disabled={disabled}
              className={cls}
              onClick={this.onClick}
          >
            {contentRender}
          </a>
      );
    }

    const { mimeType, target, ...filteredRest } = rest;
    const { htmlType, ...nativeRest } = filteredRest as NativeButtonProps;

    return (
        <button
            {...nativeRest}
            type={htmlType}
            aria-disabled={disabled}
            className={cls}
            onClick={this.onClick}
        >
          {contentRender}
        </button>
    );
  }
}
