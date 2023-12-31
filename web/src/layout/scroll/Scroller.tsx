import React, { PureComponent } from 'react';
import Events from '../../toolkit/utils/events';
import throttle from '../../toolkit/utils/throttle';
import { canUseDOM, getScrollContainer, getScrollTop } from '../../toolkit/utils/dom';
import type { ContainerType } from '../../toolkit/utils/dom';
import noop from '../../toolkit/utils/noop';

export interface ScrollerProps {
  prefixCls?: string;
  container?: ContainerType;
  onScroll?: (scrollTop?: number) => void;
  children?:React.ReactNode;
}

export default class Scroller extends PureComponent<ScrollerProps, {}> {
  static displayName = 'Scroller';

  static defaultProps: Partial<ScrollerProps> = {
    prefixCls: 'za-scroller',
    container: canUseDOM ? window : undefined,
  };

  private mounted: boolean;

  private scrollThrottled = this.props.onScroll ? throttle(this.props.onScroll, 250) : noop;

  componentDidMount() {
    this.bindEvent();
    this.mounted = true;
  }

  componentDidUpdate(prevProps: ScrollerProps) {
    const { container } = this.props;
    if (prevProps.container !== container) {
      this.bindEvent();
    }
  }

  componentWillUnmount() {
    this.unBindEvent();
    this.mounted = false;
  }

  get scrollContainer(): HTMLElement | Window {
    const { container } = this.props;
    return getScrollContainer(container);
  }

  get scrollTop(): number {
    return getScrollTop(this.scrollContainer);
  }

  onScroll = (): void => {
    const { onScroll } = this.props;
    if (!this.mounted) return;
    typeof onScroll === 'function' && this.scrollThrottled(this.scrollTop);
  };

  bindEvent = (): void => {
    this.scrollContainer && Events.on(this.scrollContainer, 'scroll', this.onScroll);
  };

  unBindEvent = (): void => {
    this.scrollContainer && Events.off(this.scrollContainer, 'scroll', this.onScroll);
  };

  render() {
    const { children } = this.props;
    return children || null;
  }
}
