import React, {ReactNode, PureComponent } from 'react';
import Message from './Message';
import { addKeyframe, removeKeyframe, existKeyframe } from '../../toolkit/utils/keyframes';
import XIcon from "../XIcon";

const NOTICEBAR_KEYFRAME_NAME = 'za-notice-bar-scrolling';

import "./noticebar.css"

export interface PropsType {
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  icon?: ReactNode;
  closable?: boolean;
  hasArrow?: boolean;
  speed?: number;
  delay?: number;
}


export interface NoticeBarProps extends PropsType {
  prefixCls?: string;
  className?: string;
  children?:ReactNode;
}

export interface NoticeBarState {
  animationDuration?: number;
}

export default class NoticeBar extends PureComponent<NoticeBarProps, NoticeBarState> {
  static displayName = 'NoticeBar';

  static defaultProps: NoticeBarProps = {
    prefixCls: 'za-notice-bar',
    theme: 'warning',
    icon: XIcon.Volume(),
    hasArrow: false,
    closable: false,
    speed: 50,
    delay: 2000,
  };

  private wrapper: HTMLDivElement | null = null;

  private content: HTMLDivElement | null = null;

  state: NoticeBarState = {
    animationDuration: 0,
  };

  componentDidMount() {
    this.updateScrolling();
  }

  componentDidUpdate() {
    this.updateScrolling();
  }

  updateScrolling() {
    const { speed, delay } = this.props;
    const wrapWidth = this.wrapper!.getBoundingClientRect().width;
    const offsetWidth = this.content!.getBoundingClientRect().width;

    if (offsetWidth > wrapWidth) {
      // 完整的执行时间 = 前后停留时间 + 移动时间
      const animationDuration = Math.round(delay! * 2 + (offsetWidth / speed!) * 1000);

      // 计算停留时间占总时间的百分比
      const delayPercent = Math.round((delay! * 100) / animationDuration);

      // 删除之前的 keyframe 定义
      if (existKeyframe(NOTICEBAR_KEYFRAME_NAME)) {
        removeKeyframe(NOTICEBAR_KEYFRAME_NAME);
      }

      // 增加重新计算后的 keyframe
      addKeyframe(
        NOTICEBAR_KEYFRAME_NAME,
        `
        0%, ${delayPercent}% {
          -webkit-transform: translate3d(0, 0, 0);
          transform: translate3d(0, 0, 0);
        }

        ${100 - delayPercent}%, 100% {
          -webkit-transform: translate3d(${-(offsetWidth - wrapWidth)}px, 0, 0);
          transform: translate3d(${-(offsetWidth - wrapWidth)}px, 0, 0);
        }
      `,
      );

      this.setState({ animationDuration });
    }
  }

  render() {
    const { prefixCls, children, ...others } = this.props;
    const { animationDuration } = this.state;

    return (
      <Message {...others} size="lg">
        <div
          className={prefixCls}
          ref={(ele) => {
            this.wrapper = ele;
          }}
        >
          <div
            className={`${prefixCls}__body`}
            ref={(ele) => {
              this.content = ele;
            }}
            style={
              animationDuration! > 0
                ? {
                    WebkitAnimation: `${NOTICEBAR_KEYFRAME_NAME} ${animationDuration}ms linear infinite`,
                    animation: `${NOTICEBAR_KEYFRAME_NAME} ${animationDuration}ms linear infinite`,
                  }
                : undefined
            }
          >
            {children}
          </div>
        </div>
      </Message>
    );
  }
}
