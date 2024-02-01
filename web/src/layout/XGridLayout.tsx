import React from 'react';
import XBaseLayout, {XBaseLayoutProps} from "../base/XBaseLayout";
import XModal from "./XModal";
import XIcon from "../display/XIcon";


// import {Responsive, WidthProvider} from "react-grid-layout";

// const ResponsiveReactGridLayout = WidthProvider(Responsive);
require('react-grid-layout/css/styles.css')

export interface XGridLayoutProps extends XBaseLayoutProps {
  /**
   * 列定义
   * @defaultValue {lg: 24, md: 20, sm: 12, xs: 8, xxs: 4}
   */
  cols?: Object,
  /**
   * 边缘
   */
  margin?: Array<number>,
  /**
   * 行高
   */
  rowHeight?: number,
  /**
   * 单项宽度
   */
  itemWidth?: number,
  /**
   * 单项高度
   */
  itemHeight?: number,
  /**
   * 一行最大个数
   */
  itemRowMaxNum?: number,
  /**
   * 打开事件
   */
  onOpenFun?: (gridLayut: XGridLayout, item: {}) => void,
  /**
   * 编辑事件
   */
  onEditFun?: (gridLayut: XGridLayout, item: {}) => void,
  /**
   * 保存事件
   */
  onSaveFun?: (gridLayut: XGridLayout, layouts: {}, data: []) => void,
  /**
   * 是否为编辑模式
   */
  isEdit?: boolean,
  /**
   * 是否允许重叠
   */
  allowOverlap?: boolean,
  /**
   * 可拖拽大小位置
   * @defaultValue ["s", "w", "e", "n", "sw", "nw", "se", "ne"]
   */
  resizeHandles?: Array<string>,
  /**
   * 显示方式
   */
  compactType?: false | "vertical" | "horizontal",
  /**
   * 自定义render
   */
  itemRender?: (item: {}, layoutObj: {}, index: number) => React.ReactNode,
  /**
   * 拖拽停止回调
   */
  onResizeStop?: (obj: {}, layoutObj: {}, oldResizeItem: {}) => void,
}

/**
 * 可以自定义拖动布局的仪表盘
 * @name 仪表盘布局
 * @groupName
 */
export default class XGridLayout extends XBaseLayout<XGridLayoutProps, any> {
  static ComponentName = "仪表盘布局";

  static async GetReactGridLayout(): Promise<any> {// @ts-ignore
    return await import(/* webpackChunkName: "tReactGridLayout" */ 'react-grid-layout');
  }

  static defaultProps = {
    ...XBaseLayout.defaultProps,
    cols: {lg: 24, md: 20, sm: 12, xs: 8, xxs: 4},
    margin: [10, 10],
    rowHeight: 30,
    itemWidth: 2,
    itemHeight: 3,
    itemRowMaxNum: 11,
    onOpenFun: undefined,
    onEditFun: undefined,
    onSaveFun: undefined,
    isEdit: false,
    allowOverlap: false,
    compactType: "vertical",
    resizeHandles: ["se"],//右下角拖拉
    itemRender: undefined,
    onResizeStop: undefined,
  };

  isLayoutChange: boolean;
  defaultData: object;
  itemWidth: number;
  itemHeight: number;
  isEdit: boolean;
  isFirst: boolean;
  data: Array<object>;
  dataMap: object;

  constructor(props) {
    super(props);
    this.defaultData = {};
    this.itemWidth = this.props.itemWidth;
    this.itemHeight = this.props.itemHeight;
    this.isEdit = this.props.isEdit;
    this.state.currentBreakpoint = "lg";
    this.state.compactType = this.props.compactType;//横纵布局:vertical|horizontal
    this.state.layouts = {lg: []};
    this.isFirst = true;
    this.data = [];//数据列表
    this.dataMap = {};
  }


  /**
   * 设置数据集
   * @param layouts 布局列表
   * @param data 数据列表
   */
  SetData(layouts = {lg: []}, data = []) {
    this.data = data;
    this.dataMap = {};
    data.forEach((item) => {
      this.dataMap[item.id] = item;
    })
    layouts.lg.forEach(item => {
      item.static = !this.isEdit;
    })
    this.setState({layouts: layouts}, () => this.isLayoutChange = false);
  }

  getNextPoint(lg = []) {
    let point = {x: 0, y: 0};
    if (lg.length > 0) {
      let pointMap = {};
      lg.forEach((item) => {
          pointMap[item.x + "_" + item.y] = item;
        }
      );
      let itemRowMaxNum = this.props.itemRowMaxNum;//一行多少个
      let i = 0;
      while (true) {
        let num = i % itemRowMaxNum;
        point = {x: num * this.itemWidth, y: ((i - num) / itemRowMaxNum) * this.itemHeight};
        if (!pointMap[point.x + "_" + point.y]) {
          break;
        }
        i++;
      }
    }
    return point;
  }

  getNextLayout(id, layouts) {
    return {
      ...this.getNextPoint(layouts.lg),
      w: this.itemWidth,
      h: this.itemHeight,
      i: id,
      static: !this.isEdit,//固定不动
      resizeHandles: this.props.resizeHandles,
    }
  }

  /**
   * 添加新项
   * @param obj
   */
  AddItem(obj = {id: this.CreateUUID()},) {
    this.data.push(obj);
    this.dataMap[obj.id] = obj;
    let layouts = this.state.layouts;
    let id = obj.id;
    this.defaultData[id] = this.getNextLayout(id, layouts);
    layouts.lg.push(this.defaultData[id]);
    this.setState({layouts: layouts}, () => this.isLayoutChange = false);
  }

  /**
   * 清空数据
   */
  ClearData() {
    this.data = [];
    this.dataMap = {};
    let layouts = this.state.layouts;
    this.defaultData = {};
    layouts.lg = [];
    this.setState({layouts: layouts}, () => this.isLayoutChange = false);
    this.onSaveFun(layouts, this.data);
  }

  /**
   * 设置编辑模式
   * @param isEdit
   * @constructor
   */
  SetIsEdit(isEdit: boolean) {
    this.isEdit = isEdit;
    let layouts = this.getNewLayouts(this.state.layouts, !isEdit);
    this.setState({layouts: layouts}, () => this.isLayoutChange = false);
  }

  /**
   * 刷新
   */
  Refresh() {
    this.setState({timeKey: new Date().getTime()});
  }

  renderItemContent(obj, layoutObj, index) {
    if (this.props.itemRender) {
      return this.props.itemRender(obj, layoutObj, index)
    }
    let imgWidth = 88;
    let title = obj?.菜单名称;
    let imgSrc = "app.png";
    if (obj && obj.菜单图标) {
      imgSrc = this.GetServerRootUrl() + "/xtpz/download?filename=" + obj.菜单图标.split("|")[1];
    }
    return <div style={{textAlign: "center", overflow: "hidden", cursor: "pointer", width: 114, height: 114}}
                title={title}>
      <div style={{width: "100%", height: imgWidth,}}>
        <div style={{
          width: imgWidth,
          height: imgWidth,
          position: 'relative',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
          <img src={imgSrc} style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: imgWidth - 2,
            maxHeight: imgWidth - 2,
          }}/>
        </div>
      </div>
      <span className="text">{title}</span>
    </div>;
  }

  renderItem(layoutObj, index) {
    let obj = this.dataMap[layoutObj.i];
    let onClick = undefined;
    if (this.props.onEditFun || this.props.onOpenFun) {
      onClick = () => {
        if (!this.isLayoutChange) {
          if (this.isEdit) {
            this.props.onEditFun && this.props.onEditFun(this, obj);
          } else {
            this.props.onOpenFun && this.props.onOpenFun(this, obj);
          }
        }
        this.isLayoutChange = false;
      }
    }
    return <div key={layoutObj.i} className={layoutObj.static ? "static" : ""} onClick={onClick}>
      {this.renderItemContent(obj, layoutObj, index)}
      {this.isEdit ?
        <div style={{position: "absolute", right: 0, top: 0, color: "red", zIndex: 1000, cursor: "pointer"}}
             onClick={(e) => {
               e.stopPropagation();
               XModal.Confirm("是否确认删除选中项", () => {
                 delete this.dataMap[layoutObj.i];//删除对象
                 let index = this.data.indexOf(obj);
                 this.data.splice(index, 1);
                 let layouts = this.state.layouts;
                 layouts.lg.splice(index, 1);
                 this.setState({layouts: layouts}, () => this.isLayoutChange = false);
                 this.onSaveFun(layouts, this.data);
                 return true;
               })
             }}>
          <XIcon.CloseCircleOutlined/>
        </div> : undefined}
    </div>
  }

  getNewLayouts(_layout = this.state.layouts, _static: any) {
    let layouts = {lg: []};
    _layout.lg.forEach(item => {
      layouts.lg.push({
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        i: item.i,
        resizeHandles: item.resizeHandles,
        static: _static == undefined ? item.static : _static,
      })
    })
    return layouts;
  }

  onSaveFun(_layout, data) {
    let layouts = this.getNewLayouts(_layout, undefined);
    this.props.onSaveFun && this.props.onSaveFun(this, layouts, data);
  }

  async componentDidMount() {
    super.componentDidMount();
    const reactGridLayout = await XGridLayout.GetReactGridLayout();
    const {Responsive, WidthProvider} = reactGridLayout.default;
    const ResponsiveReactGridLayout = WidthProvider(Responsive);
    this.setState({ResponsiveReactGridLayout})
  }

  render() {
    let ResponsiveReactGridLayout = this.state.ResponsiveReactGridLayout;
    if (!ResponsiveReactGridLayout) {
      return <div></div>
    }
    let myProps = undefined;
    if (this.props.compactType === false) {
      myProps = {
        verticalCompact: false,
        preventCollision: true,
      };
    } else {
      myProps = {
        compactType: this.props.compactType,
        preventCollision: !this.props.compactType
      };
    }
    return <ResponsiveReactGridLayout
      className={"layout"}
      rowHeight={this.props.rowHeight}
      layouts={this.state.layouts}
      margin={this.props.margin}
      cols={this.props.cols}
      allowOverlap={this.props.allowOverlap}
      onBreakpointChange={(breakpoint) => {
        this.setState({currentBreakpoint: breakpoint});
      }}
      onResizeStop={(layoutObj, oldResizeItem) => {
        // @ts-ignore
        let obj = this.dataMap[layoutObj.i];
        this.props.onResizeStop && this.props.onResizeStop(obj, layoutObj, oldResizeItem);
      }}
      onLayoutChange={(layout, layouts) => {
        this.isLayoutChange = true;
        layouts.lg.forEach((item, index) => {
          if (this.defaultData[item.i]) {//处理默认值
            Object.keys(this.defaultData[item.i]).forEach((key) => {
              item[key] = this.defaultData[item.i][key];
            })
            delete this.defaultData[item.i]
          }
        })
        this.setState({layouts: layouts})
        this.onSaveFun(layouts, this.data);
      }}
      measureBeforeMount={true}
      useCSSTransforms={true}
      {...myProps}>
      {this.state.layouts.lg.map((obj, index) => {
        return this.renderItem(obj, index);
      })}
    </ResponsiveReactGridLayout>
  }
}

