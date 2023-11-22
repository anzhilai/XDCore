import React, {CSSProperties} from 'react';

export interface ResetPositionProps {
  children?: React.ReactNode,
  className?: string,
  style?: CSSProperties,
}

export default class ResetPosition extends React.Component<ResetPositionProps, any> {

  container: HTMLElement;

  componentDidMount() {
    this.ResetPosition();
  }

  /**
   * 重新计算位置,top,left值
   */
  ResetPosition() {
    if (this.container) {
      let rect = this.container.getBoundingClientRect();
      let clientWidth = document.documentElement.clientWidth;
      let clientHeight = document.documentElement.clientHeight;
      if (rect.x + rect.width > clientWidth) {
        let left = clientWidth - rect.width;
        this.container.style.left = left + "px";
      }
      if (rect.y + rect.height > clientHeight) {
        let top = clientHeight - rect.height;
        this.container.style.top = top + "px";
      }
    }
  }

  render() {
    const {className, style, children} = this.props;
    return <div style={style} className={className} ref={e => this.container = e}>{children}</div>
  }
}
