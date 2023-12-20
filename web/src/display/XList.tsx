import React, { CSSProperties } from 'react';
import { Pagination } from "antd";
import XBaseDisplay, { XBaseDisplayProps } from "../base/XBaseDisplay";
import XFlex, { XFlexProps } from "../layout/XFlex";
import XGrid from "../layout/XGrid";
import XTools from "../toolkit/XTools";

export interface XListProps extends XBaseDisplayProps, XFlexProps {
  /**
   * 每个数据项的渲染方式
   */
  itemRender?: (item: any, index: number, list: object[]) => React.ReactNode,
  /**
   * 是否分页
   */
  isPagination?: boolean,
  /**
   * 默认页数
   */
  page?: number,
  /**
   * 默认分页大小
   */
  pageSize?: number,
  /**
   * 分页样式
   */
  paginationStyle?: CSSProperties,
  /**
   *分页事件
   */
  onPageChange?: (page: number, pageSize: number) => void,
}

/**
 * 一组列表按照横向或者竖行布局显示数据列表，同时支持分页和排序
 * @name 列表
 * @groupName 列表
 */
export default class XList extends XBaseDisplay<XListProps, any> {
  static ComponentName = "列表";
  static defaultProps = {
    ...XFlex.defaultProps,
    ...XBaseDisplay.defaultProps,
    itemRender: undefined,
    isPagination: false,
    page: 1,
    pageSize: 30,
    paginationStyle: {},
  };


  constructor(props) {
    super(props);
    let data = [];
    if (this.props.data) {
      data = this.props.data;
    }
    let pagination = this.initPagination();
    this.state = {
      ...this.state,
      data: data,
      pagination: pagination,
    }
  }

  componentDidMount() {
    if (this.props.dataSourceUrl) {
      this.Refresh();
    }
  }

  initPagination() {
    const pagination: any = {};
    pagination.current = this.props.page;
    pagination.pageSize = this.props.pageSize;
    pagination.showTotal = false;
    pagination.showSizeChanger = false;
    pagination.onChange = (page, pageSize) => {
      this.state.pagination.current = page;
      this.state.pagination.pageSize = pageSize;
      this.Refresh();
      this.props.onPageChange?.(page, pageSize);
    }
    pagination.onShowSizeChange = (current, size) => {
      this.state.pagination.pageSize = size;
      this.Refresh();
    };
    return pagination;
  }

  async Refresh(filter?: object, isnew?: boolean) {
    if (!this.props.dataSourceUrl) {
      return;
    }
    if (isnew) {
      this.state.filterData = filter;
      if (this.state.pagination) {
        this.state.pagination.current = 1;
      }
    } else {
      this.state.filterData = {
        ...this.state.filterData,
        ...filter,
      }
    }
    if (this.props.mustHasFilter  && XTools.isEmptyObject(this.state.filterData)) {
      return;
    }
    const postData = {
      ...this.props.filterData,
      ...this.state.filterData,
    };
    if (this.props.isPagination && this.state.pagination) {
      this.state.pagination.current = this.state.pagination.current ? this.state.pagination.current : this.props.page;
      this.state.pagination.pageSize = this.state.pagination.pageSize ? this.state.pagination.pageSize : this.props.pageSize;
      postData.pageSize = this.state.pagination.pageSize;
      postData.pageIndex = (this.state.pagination.current - 1) * this.state.pagination.pageSize;
    }
    const ret = await this.RequestServerPost(this.props.dataSourceUrl, postData);
    if (ret.Success && ret.Value) {
      if (this.state.pagination) {
        this.state.pagination.total = ret.Value.total || 0;
      }
      this.SetData(ret.Value.rows);
    }
  }

  SetData(data) {
    this.useStateData = true;
    this.state.data = data;
    this.setState({
      data: this.state.data,
      pagination: this.state.pagination,
    });
  }


  flex: any;
  renderDisplay() {
      let data = this.GetData()
      const node = data.map((item, index) => {
        if (this.props.itemRender) {
          return this.props.itemRender(item, index, data);
        } else {
          return (<div key={index}>
            {item}
          </div>);
        }
      });

      let hasPage = this.props.isPagination && this.props.dataSourceUrl && this.state.pagination;
      if (hasPage) {
        return (<XGrid rowsTemplate={["1fr", "auto"]}>
          <XFlex {...this.props} inited={(e) => this.flex = e}>{node}</XFlex>
          <XFlex height={"auto"} contentHAlign={XFlex.Align.center}>
            <Pagination size="small" style={this.props.paginationStyle}  {...this.state.pagination}/>
          </XFlex>
        </XGrid>);
      } else {
        return (
          <XFlex {...this.props} inited={(e) => this.flex = e}>{node}</XFlex>
        );
      }

  }

}
