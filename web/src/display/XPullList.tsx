import React from 'react';
import {XArray} from "..";
import XBaseDisplay, {XBaseDisplayProps} from "../base/XBaseDisplay";
import Cell from "../layout/card/Cell";
import {isEmptyObject} from '../toolkit/XTools';
import Pull from "./list/Pull";
import XGrid from "../layout/XGrid"
import XFilterView from "./table/XFilterView";
import XIcon from "./XIcon";
import XLink from "../editor/XLink";
import XSearchBar from "../editor/XSearchBar";
import XModal from "../layout/XModal"

export interface XPullListProps extends XBaseDisplayProps {
  /**
   * 是否分页
   */
  isPagination?: boolean,
  /**
   * 分页大小
   */
  pageSize?: number,
  /**
   * 是否多选
   */
  isCheck?: boolean,
  /**
   * 值字段
   */
  valueField?: string,
  /**
   * 显示字段
   */
  displayField?: string,
  /**
   * 搜索字段
   */
  searchFields?: string[],
  /**
   * 行点击事件
   */
  onItemClick?: (item: object) => void,
  /**
   * 自定义Render
   */
  itemRender?: (item: object, index: number, list: any[]) => React.ReactNode,
  /**
   * 显示搜索
   */
  showSearch?: boolean,
  /**
   *搜索列
   */
  visibleColumns?: any[],
  /**
   * 附加操作按钮
   */
  extraButtons?: React.ReactNode,
  /**
   * 处理服务器返回列
   * @param cols
   */
  onServerColumn?: (cols: []) => [],
}

/**
 * 同样一组列表可以下拉刷新，无限滚动加载
 * @name 下拉列表
 * @groupName 列表
 */
export default class XPullList extends XBaseDisplay<XPullListProps, any> {
  static ComponentName = "下拉列表";
  static REFRESH_STATE = {
    normal: 0, // 普通
    pull: 1, // 下拉刷新（未满足刷新条件）
    drop: 2, // 释放立即刷新（满足刷新条件）
    loading: 3, // 加载中
    success: 4, // 加载成功
    failure: 5, // 加载失败
  };

  static LOAD_STATE = {
    normal: 0, // 普通
    abort: 1, // 中止
    loading: 2, // 加载中
    success: 3, // 加载成功
    failure: 4, // 加载失败
    complete: 5, // 加载完成（无新数据）
  };
  static defaultProps = {
    ...XBaseDisplay.defaultProps,
    isPagination: true,
    pageSize: 10,
    isCheck: false,
    showSearch: false,
  };

  constructor(props) {
    super(props);
    let pagination = this.initPagination();
    let data = [];
    if (this.props.data) {
      data = this.props.data;
    }
    this.state = {
      ...this.state,
      data: data,
      columns: this.formatColumns(this.props.visibleColumns),
      pagination: pagination,
      refreshing: XPullList.REFRESH_STATE.normal,
      loading: XPullList.LOAD_STATE.normal,
      selectedValue: undefined,
      checkedValues: [],
    }
  }

  formatColumns(visibleColumns) {
    let list = [];
    visibleColumns?.forEach(item => {
      if (item) {
        if (typeof (item) == "string") {
          list.push({id: item, field: item, type: "string", name: item});
        } else {
          if (!item.id) {
            item.id = item.field;
          }
          if (!item.title) {
            item.title = item.field;
          }
          if (!item.type) {
            item.type = "string";
          }
          item.name = item.title;
          list.push(item);
        }
      }
    });
    return list;
  }

  componentDidMount() {
    if (this.props.dataSourceUrl) {
      this.Refresh();
    } else {
      this.SetData(this.props.data);
    }
  }

  initPagination() {
    const pagination: any = {};
    pagination.pageSize = this.props.pageSize;
    pagination.showTotal = false;
    return pagination;
  }

  SetData(data) {
    this.useStateData = true;
    this.state.data = [];
    this.state.datalist = [];
    this.AppendData(data);
  }


  /**
   * 重新刷新视图
   */
  RefreshView() {
    this.state.datalist = [];
    for (let i = 0; i < this.state.data.length; i++) {
      this.state.datalist.push(this.createCell(this.state.data[i], i, this.state.data));
    }
    this.setState({datalist: this.state.datalist,});
  }

  /**
   * 追加显示列表
   * @param data
   */
  AppendData(data: []) {
    if (data && data.length > 0) {
      this.useStateData = true;
      this.state.data = this.state.data.concat(data);
      const startIndex = this.state.datalist.length;
      for (let i = startIndex; i < startIndex + data.length; i++) {
        this.state.datalist.push(this.createCell(data[i - startIndex], i, this.state.data));
      }
    }
    this.setState({datalist: this.state.datalist,});
  }

  createCell(item, index, list) {
    if (this.props.itemRender) {
      return this.props.itemRender(item, index, list);
    } else {
      if (typeof item === "string") {
        let v = item;
        item = {};
        item[this.props.valueField] = v;
        item[this.props.displayField] = v;
      }
      return <Cell isCheck={this.props.isCheck} key={item[this.props.valueField] + index}
                   onClick={(e) => this.itemClick(item)} onCheckChange={(check) => this.itemCheckChange(check, item)}>
        {item[this.props.displayField]}
      </Cell>;
    }
  }

  itemClick(item) {
    this.state.selectedValue = item;
    if (this.props.onItemClick) {
      this.props.onItemClick(item);
    }
  }

  itemCheckChange(check, item) {
    if (check) {
      this.state.checkedValues.push(item);
    } else {
      XArray.deleteKey(this.state.checkedValues, item);
    }
  }

  Refresh = async (filter?: object, isnew?: boolean, refreshing = XPullList.REFRESH_STATE.loading) => {
    if (!this.props.dataSourceUrl) {
      this.setState({refreshing: XPullList.REFRESH_STATE.loading,}, () => {
        this.setState({refreshing: XPullList.REFRESH_STATE.normal,});
      });
      return;
    }
    this.state.pagination.current = 1;
    this.setState({refreshing, pagination: this.state.pagination});
    const ret = await this.refreshData(filter, isnew);
    if (ret.Success) {
      this.setState({refreshing: XPullList.REFRESH_STATE.normal, loading: XPullList.LOAD_STATE.normal});
      this.SetData(ret.Value.rows);
    } else {
      this.setState({refreshing: XPullList.REFRESH_STATE.failure});
    }
  };

  /**
   * 加载更多数据
   */
  LoadData = async () => {
    if (!this.props.dataSourceUrl || !this.props.isPagination) {
      this.setState({loading: XPullList.LOAD_STATE.normal});
      return;
    }
    this.state.pagination.current = this.state.pagination.current + 1;
    this.setState({loading: XPullList.LOAD_STATE.loading, pagination: this.state.pagination});
    const ret = await this.refreshData();
    if (ret.Success) {
      if (ret.Value && ret.Value.rows.length > 0) {
        this.setState({loading: XPullList.LOAD_STATE.success});
        this.AppendData(ret.Value.rows);
      }
      if (ret.Value && ret.Value.rows.length >= 0 && ret.Value.rows.length < this.state.pagination.pageSize) {
        this.setState({loading: XPullList.LOAD_STATE.complete});
      }
    } else {
      this.setState({loading: XPullList.LOAD_STATE.failure});
    }
  };

  async refreshData(filter?: object, isnew?: boolean) {
    if (!this.props.dataSourceUrl) {
      return {Success: true, Value: {rows: [], total: 0}};
    }
    if (isnew) {
      this.state.filterData = filter;
    } else {
      this.state.filterData = {
        ...this.state.filterData,
        ...filter,
      }
    }
    if (this.props.mustHasFilter && isEmptyObject(this.state.filterData)) {
      return {Success: true, Value: {rows: [], total: 0}};
    }
    const postData = {
      ...this.props.filterData,
      ...this.state.filterData,
    };
    if (this.props.isPagination && this.state.pagination) {
      this.state.pagination.current = this.state.pagination.current ? this.state.pagination.current : 1;
      this.state.pagination.pageSize = this.state.pagination.pageSize ? this.state.pagination.pageSize : this.props.pageSize;
      postData.pageSize = this.state.pagination.pageSize;
      postData.pageIndex = (this.state.pagination.current - 1) * this.state.pagination.pageSize;
    }
    let ret = await this.RequestServerPost(this.props.dataSourceUrl, postData);
    if (ret.Success && ret.Value) {
      let columns = ret.Value.columns;
      if (typeof this.props.onServerColumn === "function") {
        columns = this.props.onServerColumn(ret.Value.columns);
        if (!columns) {
          columns = ret.Value.columns;
        }
      }
      this.SetColumns(columns);
      if (this.state.pagination) {
        this.state.pagination.total = ret.Value.total || 0;
      }
    }
    return ret;
  }

  SetColumns(cols) {
    if (cols) {
      let columns = this.state.columns;
      let map = {};
      columns?.forEach(item => {
        map[item.field] = item;
      });
      this.formatColumns(cols).forEach(item => {
        if (map[item.field]) {
          for (let key in item) {
            if (key == "type" && ["switch", "check", "radio", "select", "tree"].includes(map[item.field][key])) {
              continue;
            }
            map[item.field][key] = item[key];
          }
        } else {
          columns.push(item);
        }
      });
      this.setState({columns});
    }
  }

  SetFilterCond(filterConds) {
    if (filterConds?.length == 0) {
      this.filterView?.ResetData();
    }
    filterConds = XFilterView.GetFilterConds(filterConds);
    let filters = [];
    if (filterConds.length > 0) {
      filterConds[0].items.forEach(item => {
        filters.push(item.columnName);
      })
    }
    let sql = XFilterView.ToSqlString(filterConds);
    this.Refresh({CustomFilterCond: JSON.stringify(filterConds)});
    this.setState({filters, sql, filterConds});
  }


  filterView: XFilterView;
  pull: Pull;

  showSearchModal() {
    XModal.ModalShowMobile("高级搜索", () => {
      this.SetFilterCond(this.filterView.GetFilterGroups());
      return true;
    }, <XGrid overflow={"auto"}>
      <XFilterView ref={e => this.filterView = e} styleType={"common"} overflow={"auto"} height={"auto"}
                   filterGroups={this.state.filterConds} columns={this.state.columns}/>
    </XGrid>, undefined, "80%")
  }

  renderDisplay() {
    let KeywordFields = [];
    this.state.columns?.forEach(item => {
      if (item?.keyword) {
        KeywordFields.push(item.field);
      }
    });
    const style: any = {overflowY: 'auto', maxHeight: this.props.maxHeight, width: "100%", height: "100%"};
    return <XGrid
      rowsTemplate={this.props.showSearch ? ["auto", "1fr"] : undefined}>
      {this.props.showSearch &&
        <XGrid rowsTemplate={this.state.sql ? ["auto", "auto", "1fr"] : ["auto", "1fr"]}>
          <XSearchBar placeholder={KeywordFields.join(" ")} onValueChange={(value) => {
            this.Refresh({KeywordFields: value ? KeywordFields : "", KeywordValue: value});
          }} otherIcon={<XIcon.FilterOutlined style={{color: "#0099FF", paddingRight: 5, paddingLeft: 5}}
                                              onClick={() => this.showSearchModal()}/>}
                      extraButtons={this.props.extraButtons}/>
          {this.state.sql && <XGrid columnsTemplate={["1fr", "auto"]} paddingTRBL={"5px 10px"} columnGap={"5px"}>
            <div>{this.state.sql}</div>
            <XLink onClick={() => this.SetFilterCond([])}>清空条件</XLink>
          </XGrid>}
        </XGrid>}
      <Pull ref={e => this.pull = e} style={style} refresh={{state: this.state.refreshing, handler: this.Refresh,}}
            load={{state: this.state.loading, distance: 200, handler: this.LoadData,}}>
        {this.state.datalist}
      </Pull>
    </XGrid>;
  }
}
