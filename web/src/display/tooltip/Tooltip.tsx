import React from 'react';
import Popper from '../../layout/pop/Popper';

import { PopperPlacement, PopperTrigger } from '../../layout/pop/PopperPropsType';
import "./tooltip.css"

export interface PropsType {
  visible?: boolean;
  hasArrow?: boolean;
  arrowPointAtCenter?: boolean;
  direction?: PopperPlacement;
  trigger?: PopperTrigger;
  // popperOptions?: PopperJS.PopperOptions;
  // modifiers?: PopperJS.Modifiers;
  content?: React.ReactNode;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  onVisibleChange?: (visible: boolean) => void;
}
export interface TooltipProps extends PropsType {
  prefixCls?: string;
  className?: string;
  children?: React.ReactNode;
}

export type TooltipPlacement = PopperPlacement;

export type TooltipTrigger = PopperTrigger;

class Tooltip extends React.Component<TooltipProps, any> {
  static updateAll() {
    Popper.update();
  }

  static defaultProps: TooltipProps = {
    prefixCls: 'za-tooltip',
    direction: 'top' as TooltipPlacement,
    hasArrow: true,
    onVisibleChange: () => {},
  };

  render() {
    const { children, content, ...others } = this.props;

    return !(content === '' || content === null || content === undefined) ? (
      <Popper content={content} {...others}>
        {children}
      </Popper>
    ) : (
      children
    );
  }
}

export default Tooltip;
