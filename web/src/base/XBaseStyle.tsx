import React, {CSSProperties, HTMLProps} from 'react';
import type {Property}  from 'csstype';
import XBaseObject, { XBaseObjectProps } from './XBaseObject';

/**
 * 样式组件属性
 */
export interface XBaseStyleProps extends XBaseObjectProps{
  /**
   * 样式类型
   */
  styleType?: string | 'web' | 'common' | 'mobile' | 'style1' | 'style2' | 'style3' | 'style4' | 'style5', // 样式类型，每个组件都有若干个样式类型，样式类型可以注册
  /**
   * 样式类型
   */
  theme?: string, // 样式类型，每个组件都有若干个样式类型，样式类型可以注册
  /**
   * 组件class
   */
  className?: string;
  /**
   * 组件样式
   */
  style?: CSSProperties,
  /**
   * 是否存在盒子
   */
  hasBox?: boolean,
  /**
   * 容器盒className
   */
  boxClassName?: string;
  /**
   *  所有组件的容器盒样式，容器盒为一个div,参考react的style
   */
  boxStyle?: CSSProperties,
  /**
   * 组件宽度
   */
  width?: Property.Width,
  /**
   * 组件最大宽度
   */
  maxWidth?: Property.MaxWidth,
  /**
   * 组件最小宽度
   */
  minWidth?: Property.MinWidth,
  /**
   * 组件高度
   */
  height?: Property.Height,
  /**
   * 组件最大高度
   */
  maxHeight?: Property.MaxHeight,
  /**
   * 组件最小高度
   */
  minHeight?: Property.MinHeight,
  /**
   * 设置是否显示边框，默认边框为1px的黑色实线
   */
  showBorder?: boolean,
  /**
   * 内部填充范围 TRBL分别为上右下左，参考Css中padding
   */
  paddingTRBL?: string,
  /**
   * 外部边框范围，参考Css中margin
   */
  marginTRBL?: string,
  /**
   * 组件是否可见
   */
  visible?: boolean,
  /**
   * 组件的z-index
   */
  zIndex?: Property.ZIndex,
  /**
   * 滚动条
   */
  overflow?: Property.Overflow,
  /**
   * 鼠标样式
   */
  cursor?: Property.Cursor,
  /**
   * 字体颜色
   */
  color?: Property.Color,

  /**
   * 组件在XFlex布局中的flex定义，如：0 0 auto
   */
  flex?: Property.Flex,
  /**
   * 组件在XGrid布局中的位置，[1,2]表示在第1行第2列
   */
  grid?: number[],
  /**
   * 组件在XGrid布局中的跨行列的数量，[2,2]表示在对应位置上跨两行两列
   */
  gridSpan?: number[],
  /**
   * 组件在XFlex和XGrid布局中，所在单元格中垂直方向的布局，与css中定义一致
   */
  alignSelf?: Property.AlignSelf,
  /**
   *  组件在XFlex和XGrid布局中，所在单元格中水平方向的布局，与css中定义一致
   */
  justifySelf?: Property.JustifySelf,

  htmlProps?:HTMLProps<any>,
}

/**
 * 基础样式组件
 * 基础样式组件继承于基础组件，统一每个组件的样式设置
 * 为每个组件增加一个外包盒，提供了样式相关的属性和方法，兼容HTML的样式设置。
 * @name 基础样式组件
 * @groupName 基础
 */
export default class XBaseStyle<P,S> extends XBaseObject<XBaseStyleProps&P,any> {

  static Theme = {light: 'light', dark: 'dark', gray:"gray",red:"red",green:"green", blue: 'blue',};

  static Overflow = {auto: 'auto', hidden: 'hidden', unset: 'unset',};

  static FontSize = {small: 'small', middle: 'middle', large: 'large',};

  static Color = {success:"success",warn:"success",error:"success"};

  static Align = {start: 'start', end: 'end', center: 'center',spaceAround:"spaceAround",spaceBetween:"spaceBetween"};

  static BoxStyleCenterContent = {display: "flex", alignItems: "center", justifyContent: "center"};

  static defaultProps = {
    ...XBaseObject.defaultProps,
    styleType: "",
    hasBox:true,
    showBorder: false,
    overflow: XBaseStyle.Overflow.hidden,
    boxStyle:{},
    width: '100%',
    height: '100%',
    visible: true,
    grid: [0, 0],
    gridSpan: [1, 1],
  };


  constructor(props:XBaseStyleProps&P) {
    super(props);

    this.state={
      ...this.state,
      visible:this.props.visible,
      hasBox:this.props.hasBox,
    }
  }
  useStateVisible:boolean=false;

  /**
   * 设置组件的可见性
   * @param visible
   */
  SetVisible(visible:boolean){
    this.useStateVisible =true;
    // @ts-ignore
    this.state.visible = visible;
    this.setState({
      visible :this.state.visible,
    })
  }

  /**
   * 返回组件的可见性
   */
  GetVisible(){
    if(this.useStateVisible){
      return this.state.visible;
    }
    return this.props.visible;
  }


  useStateStyleType:boolean=false;

  /**
   * 获取style type
   */
  GetStyleType() {
    if(this.useStateStyleType){
      return this.state.styleType;
    }
    return this.props.styleType;
  }

  /**
   * 设置 style type
   */
  SetStyleType(styleType){
    this.useStateStyleType = true;
    this.setState({styleType});
  }

  getBoxStyle(){
    let gridRowStart = this.props.grid?this.props.grid[0]:0;
    let gridColumnStart = this.props.grid?this.props.grid[1]:0;
    let gridRowSpan = this.props.gridSpan?this.props.gridSpan[0]:0;
    let gridColumnSpan = this.props.gridSpan?this.props.gridSpan[1]:0;

    let s:any={};


    s.height = this.props.height;
    s.width = this.props.width;
    if(this.props.minHeight){
      s.minHeight=this.props.minHeight;
    }
    if(this.props.minWidth){
      s.minWidth=this.props.minWidth;
    }

    if(this.props.maxHeight){
      s.maxHeight=this.props.maxHeight;
    }
    if(this.props.maxWidth){
      s.maxWidth=this.props.maxWidth;
    }
    if(gridRowStart>0){
      s.gridRowStart= gridRowStart;
      s.gridRowEnd= gridRowStart + gridRowSpan;
    }
    if(gridColumnStart>0){
      s.gridColumnStart= gridColumnStart;
      s.gridColumnEnd= gridColumnStart + gridColumnSpan;
    }
    if (this.props.showBorder) {
      s.border = 'solid 1px black';
    }

    if(this.props.paddingTRBL) {
      s.padding = this.props.paddingTRBL;
    }
    if(this.props.marginTRBL) {
      s.margin = this.props.marginTRBL;
    }
    if(this.props.overflow){
      s.overflow= this.props.overflow;
    }
    if(this.props.cursor){
      s.cursor= this.props.cursor;
    }
    if(this.props.zIndex){
      s.zIndex = this.props.zIndex;
    }
    if(this.props.color){
      s.color = this.props.color;
    }

    if(this.props.alignSelf){
      s.alignSelf = this.props.alignSelf;
    }
    if(this.props.justifySelf){
      s.justifySelf = this.props.justifySelf;
    }

    s = {
      ...s,
      ...this.props.boxStyle,// 用 props
    }
    if(!this.GetVisible()){
      s.display = "none";
    }
    return s;
  }

  styleWrap = (node?: React.ReactNode) => {
    if (this.GetVisible()) {
      if (this.state.hasBox) {
        return <div id={this.props.id} style={this.getBoxStyle()}
                    className={this.props.boxClassName} {...this.props.htmlProps}>{node}</div>;
      } else {
        return node;
      }
    } else {
      return <></>
    }
  };
}

