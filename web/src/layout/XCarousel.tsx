import React from 'react';
import XBaseLayout, {XBaseLayoutProps} from "../base/XBaseLayout";
import XFlex from "./XFlex";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import XIcon from '../display/XIcon';
import { Carousel } from "antd";

export interface XCarouselProps extends XBaseLayoutProps {
  /**
   * 显示下标
   */
  visibleIndex?: number;
  /**
   * 左箭头
   */
  leftArrow: React.ReactNode;
  /**
   * 右箭头
   */
  rightArrow: React.ReactNode;
  /**
   * 轮播回调
   * @param index 下标
   */
  onIndexChange?: (index) => {}
}

/**
 * 一组轮播图滑动或者自动显示
 * @name 轮播
 * @groupName 折叠显示
 */
export default class XCarousel extends XBaseLayout<XCarouselProps, any> {
  static ComponentName = "轮播";
  static Carousel: typeof Carousel = Carousel;
  static defaultProps = {
    ...XBaseLayout.defaultProps,
    visibleIndex: 0,
    boxWrapper: XFlex,
  };

  constructor(props: XCarouselProps) {
    super(props);
    this.state.visibleIndex = this.props.visibleIndex;
  }

  /**
   * 获取显示下标
   */
  GetVisibleIndex() {
    return this.state.visibleIndex;
  }

  /**
   * 设置显示下标
   * @param index 下标
   */
  SetVisibleIndex(index: number) {
    this.setState({visibleIndex: index,});
  }

  renderEx() {
    return <Swiper className="mySwiper">
      <SwiperSlide>Slide 1</SwiperSlide>
      <SwiperSlide>Slide 2</SwiperSlide>
      <SwiperSlide>Slide 3</SwiperSlide>
      <SwiperSlide>Slide 4</SwiperSlide>
      <SwiperSlide>Slide 5</SwiperSlide>
      <SwiperSlide>Slide 6</SwiperSlide>
      <SwiperSlide>Slide 7</SwiperSlide>
      <SwiperSlide>Slide 8</SwiperSlide>
      <SwiperSlide>Slide 9</SwiperSlide>
    </Swiper>
  }

  renderLayout() {
    let children: any = this.props.children;
    let visibleIndex = this.state.visibleIndex;
    return (
      <>
        <div style={{cursor: 'pointer'}} onClick={() => {
          if (this.props.children && children.length) {
            visibleIndex -= 1;
            if (visibleIndex < 0) {
              visibleIndex = children.length - 1;
            }
            this.setState({visibleIndex: visibleIndex,});
            if (this.props.onIndexChange) {
              this.props.onIndexChange(visibleIndex);
            }
          }
        }}>
          {this.props.leftArrow || XIcon.ArrowLeftOutlined()}
        </div>
        <div>
          {
            this.props.children && children.length > 0 ? children.map((c, i) => {
                if (this.state.visibleIndex === i) {
                  return <div key={i}>{c}</div>
                }
                return <></>
              })
              : this.props.children
          }
        </div>
        <div style={{cursor: 'pointer'}} onClick={() => {
          if (this.props.children && children.length) {
            visibleIndex += 1;
            if (visibleIndex >= children.length) {
              visibleIndex = 0;
            }
            this.setState({
              visibleIndex: visibleIndex,
            });
            if (this.props.onIndexChange) {
              this.props.onIndexChange(visibleIndex);
            }
          }
        }}>
          {this.props.rightArrow || XIcon.ArrowRightOutlined()}
        </div>
      </>
    );
  }

}
