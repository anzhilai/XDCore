import React from 'react';
import XBaseStyle, { XBaseStyleProps } from './XBaseStyle';
import type {Property}  from 'csstype';
/**
 * 布局组件属性
 */
export interface XBaseLayoutProps extends XBaseStyleProps {
  children?: React.ReactNode,
  /**
   * css background
   */
  background?:Property.Background,
  /**
   * css background-attachment
   */
  backgroundAttachment?:Property.BackgroundAttachment,
  /**
   * css background-clip
   */
  backgroundClip?:Property.BackgroundClip,
  /**
   * css background-color
   */
  backgroundColor?:Property.BackgroundColor,
  /**
   * css background-image
   */
  backgroundImage?:Property.BackgroundImage,
  /**
   * css background-position
   */
  backgroundPosition?:Property.BackgroundPosition,
  /**
   * css background-repeat
   */
  backgroundRepeat?:Property.BackgroundRepeat,
  /**
   * css background-size
   */
  backgroundSize?:Property.BackgroundSize,
}

/**
 * 基础布局组件
 * 继承于基础样式组件，为布局类组件提供了统一的属性和方法。
 * 布局类组件一般对子组件进行布局
 * @name 基础布局组件
 * @groupName 分类
 */
export default class XBaseLayout< P = {}, S = {}> extends XBaseStyle<XBaseLayoutProps&P,any> {

  static defaultProps = {
    ...XBaseStyle.defaultProps,
  };

  constructor(props:XBaseLayoutProps&P) {
    super(props);
  }

  getBoxStyle(){
    let s = super.getBoxStyle();
    if (this.props.backgroundImage) {
      s.backgroundImage = `url(${this.props.backgroundImage})`;
      s.backgroundRepeat = "no-repeat";
      s.backgroundSize = "100% 100%";
      s.backgroundPosition = "center center";
    }
    if(this.props.backgroundSize){
      s.backgroundSize = this.props.backgroundSize;
    }
    if(this.props.backgroundColor){
      s.backgroundColor = this.props.backgroundColor;
    }
    if (this.state.fullScreen) {
      s = {
        ...s, background: "white", width: "100%", height: "100%",
        left: 0, right: 0, top: 0, bottom: 0, zIndex: 100000,
        position: "fixed",
      }
    }
    return s;
  }

  renderLayout(){
    return (<></>)
  }

  styleWrap = (node?: React.ReactNode) => {
    if (this.props.hasBox) {
      return <div id={this.props.id} style={this.getBoxStyle()} onKeyDown={this.keydown}
                  className={this.props.boxClassName}>{node}</div>;
    } else {
      return node;
    }
  };

  /**
   * 切换全屏
   */
  ToggleFullScreen(callback?: () => void) {
    window.removeEventListener("keydown", this.keydown);
    if (!this.state.fullScreen) {
      window.addEventListener("keydown", this.keydown);
    }
    let list = document.getElementsByClassName("ant-drawer-open");
    for (let i = 0; i < list.length; i++) {
      let item = list[i];// @ts-ignore
      item.style.transform = this.state.fullScreen ? "" : "none";// @ts-ignore
      item.style.transition = this.state.fullScreen ? "" : "none";
    }
    this.setState({fullScreen: !this.state.fullScreen}, () => {
      window.dispatchEvent(new Event('resize'));
      callback && callback();
    })
  }

  keydown = (e) => {
    if (this.state.fullScreen && e.keyCode == 27) {//ESC键
      this.ToggleFullScreen();
      e.stopPropagation();
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    window.removeEventListener("keydown", this.keydown);
  }

  render() {
    if(this.props.hasBox) {
      return this.styleWrap(this.renderLayout());
    }else{
      return this.renderLayout();
    }
  }
}
