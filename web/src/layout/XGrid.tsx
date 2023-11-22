import React from 'react';
import type {Property} from 'csstype';
import XBaseLayout, {XBaseLayoutProps} from '../base/XBaseLayout';
import XBaseStyle from "../base/XBaseStyle";
import XTools from "../toolkit/XTools";

const {toBodyZoom} = XTools

export interface XGridProps extends XBaseLayoutProps {
  /**
   * 列模板定义
   */
  columnsTemplate?: Array<string | number>,
  /**
   * 行模板定义
   */
  rowsTemplate?: Array<string | number>,
  /**
   * 列间隔
   */
  columnGap?: string,
  /**
   * 行间隔
   */
  rowGap?: string,
  /**
   * 垂直布局的起始位置
   */
  verticalAlign?: "start" | " end" | "center" | "spaceAround",
  /**
   * 水平布局的起始位置
   */
  horizontalAlign?: "start" | " end" | "center" | "spaceAround",
  contentVAlign?: string,
  contentHAlign?: string,
  contentCenter?: boolean,

  autoFlow?: string,
  autoColumns?: string,
  autoRows?: string,
  templateAreas?: string,
  templateRows?: string,
  templateColumns?: string,

  alignContent?: Property.AlignContent,
  alignItems?: Property.AlignItems,
  justifyContent?: Property.JustifySelf,
  justifyItems?: Property.JustifyItems,

  showDivide?: boolean,
  divideColor?: string,
  divideStyle?: string,
  divideWidth?: string,
  /**
   * 分隔线颜色
   */
  splitDividerColor?: string,
  /**
   * 拖拽宽高度回调
   */
  onResizeCallback?: boolean | (() => void),
}

/**
 * 封装div中的grid布局，功能强大且简单易用
 * @name 网格布局
 * @groupName 网格
 */
export default class XGrid extends XBaseLayout<XGridProps, any> {
  static ComponentName = "网格布局";
  static defaultProps = {
    ...XBaseLayout.defaultProps,
    columnsTemplate: ['auto'],
    rowsTemplate: ['auto'],
    columnGap: '0px',
    rowGap: '0px',
    width: '100%',
    height: '100%',
    splitDividerColor: "#EBEBEB",
  };

  rootDiv: any;
  dividerDiV: any;
  initPos: object;
  dragIndex: number;
  isResizeRow: boolean;

  constructor(props: XGridProps) {
    super(props);
    this.dragIndex = -1;
  }

  isResize() {
    let resize = false;
    if (this.props.onResizeCallback) {
      if (this.props.rowsTemplate.length > 1) {
        this.isResizeRow = true;
        resize = true;
      } else if (this.props.columnsTemplate.length > 1) {
        this.isResizeRow = false;
        resize = true;
      }
    }
    return resize;
  }

  //repeat(auto-fit, minmax(min(100%, 300px), 1fr));

  getCurrentStyle() {
    const s: any = {};
    if (this.props.contentHAlign === XBaseStyle.Align.start) {
      s.justifyContent = "flex-start";
    } else if (this.props.contentHAlign === XBaseStyle.Align.end) {
      s.justifyContent = "flex-end";
    } else if (this.props.contentHAlign === XBaseStyle.Align.center) {
      s.justifyContent = "center";
    }
    if (this.props.contentVAlign === XBaseStyle.Align.start) {
      s.alignItems = "flex-start";
    } else if (this.props.contentVAlign === XBaseStyle.Align.end) {
      s.alignItems = "flex-end";
    } else if (this.props.contentVAlign === XBaseStyle.Align.center) {
      s.alignItems = "center";
    }
    if (this.props.contentCenter) {
      s.alignItems = "center";
      s.justifyItems = "center";
    }
    this.props.alignContent && (s.alignContent = this.props.alignContent)
    this.props.alignItems && (s.alignItems = this.props.alignItems)
    this.props.justifyContent && (s.justifyContent = this.props.justifyContent)
    this.props.justifyItems && (s.justifyItems = this.props.justifyItems)
    return s;
  }

  render() {
    let boxStyle = this.getBoxStyle();
    if (this.isResize()) {
      boxStyle.position = 'relative';
    }
    let style = {
      width: "100%",
      height: "100%",
      display: 'grid',
      gridTemplateRows: this.props.rowsTemplate.join(' '),
      gridTemplateColumns: this.props.columnsTemplate.join(' '),
      gridAutoRows: this.props.rowsTemplate[this.props.rowsTemplate.length - 1],
      gridAutoColumns: this.props.columnsTemplate[this.props.columnsTemplate.length - 1],
      gridRowGap: this.props.rowGap,
      gridColumnGap: this.props.columnGap,
      ...this.getCurrentStyle(),
    };
    if (this.props.templateRows) {
      style.gridTemplateRows = this.props.templateRows;
    }
    if (this.props.templateColumns) {
      style.gridTemplateColumns = this.props.templateColumns;
    }
    if (this.props.autoColumns) {
      style.gridAutoColumns = this.props.autoColumns;
    }
    if (this.props.autoRows) {
      style.gridAutoRows = this.props.autoRows;
    }
    if (this.props.autoFlow) {
      style.gridAutoFlow = this.props.autoFlow;
    }
    let length = 0;
    if (this.props.children) {
      // @ts-ignore
      length = this.props.children.length;
    }

    let children: any = [];
    if (this.props.children) {
      if (length > 0) {
        children = this.props.children;
      } else {
        children.push(this.props.children);
      }
    } else {
      for (const i in this.props.rowsTemplate) {
        for (const j in this.props.columnsTemplate) {
          children.push(<div key={i + "_" + j} style={{border: 'solid 1px black'}}></div>);
        }
      }
    }
    if (this.isResize()) {
      return <div style={{width: '100%', height: '100%', ...boxStyle}}>
        <div ref={e => this.rootDiv = e} className={this.props.boxClassName} style={style}>
          {children}
        </div>
        {this.renderDivider(style)}
      </div>;
    } else {
      return <div ref={e => this.rootDiv = e} className={this.props.boxClassName} style={{...style, ...boxStyle,}} {...this.props.htmlProps}>
        {children}
      </div>;
    }

  }

  renderDivider(style) {
    if (this.isResize()) {
      let dividerStyle = {...style, position: "absolute", top: 0, pointerEvents: "none"};
      let list = [];
      let width = 4.0;
      let background = this.props.splitDividerColor;
      let templateList = undefined;
      let lineStyle = undefined;
      if (this.isResizeRow) {
        let gap = 0 - parseFloat(this.props.rowGap) / 2 - width / 2;
        templateList = this.props.rowsTemplate;
        lineStyle = {
          userSelect: "none",
          background: background,
          pointerEvents: "auto",
          width: '100%',
          height: width,
          cursor: "row-resize",
          marginTop: gap + "px"
        };
      } else {
        let gap = 0 - parseFloat(this.props.columnGap) / 2 - width / 2;
        templateList = this.props.columnsTemplate;
        lineStyle = {
          userSelect: "none",
          background: background,
          pointerEvents: "auto",
          width: width,
          height: '100%',
          cursor: "col-resize",
          marginLeft: gap + "px"
        };
      }
      for (let i = 0; i < templateList.length; i++) {
        if (i == 0 || templateList[i] == "0px" || templateList[i] == "0") {
          list.push(<div key={i + "_"}></div>);
        } else {
          list.push(<div key={i + "_"}>
            <div onMouseDown={this.onMouseDown(i)} onTouchStart={this.onTouchStart(i)} style={lineStyle}></div>
          </div>);
        }
      }
      return <div ref={e => this.dividerDiV = e} style={dividerStyle}>
        {list}
      </div>
    }
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.props.onResizeCallback) {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('touchmove', this.onTouchMove, {
        passive: false
      });
      document.addEventListener('mouseup', this.handleDragEnd);
      document.addEventListener('touchend', this.handleDragEnd, {
        passive: false
      });
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.props.onResizeCallback) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('touchmove', this.onTouchMove);
      document.removeEventListener('mouseup', this.handleDragEnd);
      document.removeEventListener('touchend', this.handleDragEnd);
    }
  }

  handleDragStart = (index, e, x, y) => {
    if (this.isResize()) {
      x = toBodyZoom(x);
      y = toBodyZoom(y);
      this.dividerDiV.style.pointerEvents = "auto";
      let list = [];//全部转成px
      if (this.isResizeRow) {
        list = this.dividerDiV.style.gridTemplateRows.split(' ');
      } else {
        list = this.dividerDiV.style.gridTemplateColumns.split(' ');
      }
      for (let i = 0; i < this.dividerDiV.children.length; i++) {
        if (list[i] != undefined) {
          if (this.isResizeRow) {
            list[i] = this.dividerDiV.children[i].clientHeight + "px";
          } else {
            list[i] = this.dividerDiV.children[i].clientWidth + "px";
          }
        }
      }
      this.setTemplate(list);
      this.dragIndex = index;
      this.initPos = {
        width0: this.dividerDiV.children[index - 1].clientWidth,
        height0: this.dividerDiV.children[index - 1].clientHeight,
        width1: this.dividerDiV.children[index].clientWidth,
        height1: this.dividerDiV.children[index].clientHeight,
        x: x,
        y: y,
      }
    }
  }

  handleDragMove = (e, x, y) => {
    if (this.isResize() && this.dragIndex >= 0) {
      x = toBodyZoom(x);
      y = toBodyZoom(y);
      let list = undefined;
      let key = undefined;
      let value = 0;
      if (this.isResizeRow) {
        key = "height";
        // @ts-ignore
        value = y - this.initPos.y;
        list = this.rootDiv.style.gridTemplateRows.split(' ');
      } else {
        key = "width";
        // @ts-ignore
        value = x - this.initPos.x;
        list = this.rootDiv.style.gridTemplateColumns.split(' ');
      }
      list[this.dragIndex - 1] = (this.initPos[key + "0"] + value) + "px";
      list[this.dragIndex] = (this.initPos[key + "1"] - value) + "px";
      this.setTemplate(list);
    }
  }

  setTemplate(list) {
    if (this.isResizeRow) {
      this.rootDiv.style.gridTemplateRows = list.join(' ');
      this.dividerDiV.style.gridTemplateRows = list.join(' ');
    } else {
      this.rootDiv.style.gridTemplateColumns = list.join(' ');
      this.dividerDiV.style.gridTemplateColumns = list.join(' ');
    }
  }

  onMouseDown(index) {
    return (e) => {
      if (e.button !== 0) {
        return;
      }
      this.handleDragStart(index, e, e.pageX, e.pageY);
    }
  }

  onMouseMove = (e) => {
    this.handleDragMove(e, e.pageX, e.pageY);
  };

  // Event ontouchmove
  onTouchMove = (e) => {
    this.handleDragMove(e, e.touches[0].clientX, e.touches[0].clientY);
  };

  handleDragEnd = (e) => {
    if (this.isResize() && this.dragIndex >= 0) {
      this.dividerDiV.style.pointerEvents = "none";
      e.stopPropagation();
      e.preventDefault();
      this.dragIndex = -1;
      window.dispatchEvent(new Event('resize'));
      window.setTimeout(() => window.dispatchEvent(new Event('resize')), 10);
      if (this.props.onResizeCallback && typeof this.props.onResizeCallback == "function") {
        this.props.onResizeCallback();
      }
    }
  };

  onTouchStart(index) {
    return (e) => {
      this.handleDragStart(index, e, e.touches[0].clientX, e.touches[0].clientY);
    }
  }

}
