import React, { HTMLAttributes, PureComponent, ReactNode } from 'react';
import classnames from 'classnames';
import "./cell.css";
export type HTMLDivProps = Omit<HTMLAttributes<HTMLDivElement>, 'label'>;

export interface CellProps {
  children?: React.ReactNode,
  prefixCls?: string;
  className?: string;

  disabled?: boolean;
  hasArrow?: boolean;
  icon?: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  help?: ReactNode;
  selected?:boolean,
  isCheck?:boolean,
  onCheckChange?: (check: boolean) => void,
  onClick?: (e: {}) => void,
}

export default class Cell extends PureComponent<CellProps, {}> {
  static defaultProps: CellProps = {
    prefixCls: 'x-cell',
    hasArrow: false,
    disabled: false,
  };

  render() {
    const {
      prefixCls,
      className,
      hasArrow,
      icon,
      label,
      description,
      help,
      disabled,
      onClick,
      children,
      ...others
    } = this.props;

    const cls = classnames(prefixCls, className, {
      [`${prefixCls}--disabled`]: disabled,
      [`${prefixCls}--link`]: !disabled && !!onClick,
      [`${prefixCls}--arrow`]: hasArrow,
    });

    const labelCls = classnames(`${prefixCls}__label`, {
      [`${prefixCls}__label--label`]: !!children,
    });

    const iconRender = icon && <div className={`${prefixCls}__icon`}>{icon}</div>;
    const labelRender = label && <div className={labelCls}>{label}</div>;
    const contentRender = children && <div className={`${prefixCls}__content`}>{children}</div>;
    const arrowRender = hasArrow && <div className={`${prefixCls}__arrow`} />;
    const helpRender = help && <div className={`${prefixCls}__help`}>{help}</div>;

    return (
      <div className={cls} onClick={(e)=>{this.props.onClick&&this.props.onClick(e)}} onTouchStart={() => {}} {...others}>
        <div className={`${prefixCls}__inner`}>
          <div className={`${prefixCls}__header`}>{iconRender}</div>
          <div className={`${prefixCls}__body`}>
            {labelRender}
            {contentRender}
          </div>
          <div className={`${prefixCls}__footer`}>{description}</div>
          {arrowRender}
        </div>
        {helpRender}
      </div>
    );
  }
}
