import React from 'react';
import XModal from "../layout/XModal"
import XBaseDisplay, { XBaseDisplayProps } from "../base/XBaseDisplay";
import XFlex from "../layout/XFlex";
import {Image} from "antd"
export interface XImageProps extends XBaseDisplayProps {
  /**
   * 是否显示为头像
   */
  isAvatar?:boolean,
  /**
   * 图片路径
   */
  src?: string,
  /**
   * 是否可以点击预览
   */
  preview?:boolean,
  /**
   * 点击事件
   */
  onClick?:any,
  /**
   * img alt属性
   */
  alt?: string,
}

/**
 * 显示一个图片，支持预览和异步加载
 * @name 图像
 * @groupName 图像
 */
export default class XImage extends XBaseDisplay<XImageProps,any> {
  static ComponentName = "图像";
  static StyleType = {web: 'web',common: 'common'};
  static Image: typeof Image = Image;

  static defaultProps = {
    ...XBaseDisplay.defaultProps,
    isAvatar:false,
    src: undefined,
    preview:false,
    onClick:undefined,
    alt: undefined,
  };

  constructor(props) {
    super(props);
    this.state.hasBox = false;
  }

  componentDidMount() {
    if(this.props.dataSourceUrl){
      this.Refresh();
    }
  }

  useStateSRC= false;

  /**
   * 获取src
   */
  GetSrc() {
    if (this.useStateSRC) {
      if (this.state.src) {
        return this.state.src;
      }
    } else if (this.props.src) {
      return this.props.src;
    }
    return "";
  }

  /**
   * 设置 src
   * @param src
   */
  SetSrc(src:string) {
    this.useStateSRC = true;
    this.setState({src: src});
  }

  async Refresh(filter?:object,isnew?:boolean){
    let value = await this.RefreshServer(filter,isnew);
    if(value){
      this.SetSrc(value);
    }
  }

  clickEvent=(e)=>{
    if(this.props.onClick) {
      this.props.onClick(this);
    }else {
      if (this.props.preview) {
        XModal.ModalShow("", undefined,
            <XFlex contentCenter={true}><img height={"100%"} alt={this.props.alt}
                                             src={this.state.src}/></XFlex>, '70vw', "70vh");
      }
    }
  }

  renderDisplay() {
    const style = {...this.props.style, ...this.getBoxStyle(),}
    if (this.GetStyleType() === XImage.StyleType.web) {
      return (<Image style={style} width={this.props.width} height={this.props.height}
                     src={this.GetSrc()}/>);
    } else {
      return (<img style={style} onClick={this.clickEvent} width={this.props.width} height={this.props.height}
                   alt={this.props.alt}
                   src={this.GetSrc()}/>);
    }
  }
}
