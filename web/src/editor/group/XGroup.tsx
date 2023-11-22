import cloneDeep from "lodash/cloneDeep";
import React from 'react';
import XBaseEditor, {XBaseEditorProps} from '../../base/XBaseEditor';
import XFlex, {XFlexProps} from "../../layout/XFlex";
import XArray from "../../toolkit/XArray";
import XTools from "../../toolkit/XTools";

export interface XGroupProps extends XBaseEditorProps {
  /**
   * 选项列表
   */
  items?: any[],
  /**
   * 选择服务URL
   */
  itemsUrl?: string,
  /**
   * 显示字段
   */
  displayField?: string,
  /**
   * 值字段
   */
  valueField?: string,
  /**
   * 自定义render
   */
  itemRender?: (item: {}, isSelected: boolean, group: XGroup) => React.ReactNode,
  /**
   * 是否多选
   */
  isMultiSelect?: boolean,
  /**
   * 空内容
   */
  emptyContent?: string,
  /**
   * 显示方向
   */
  direction?: 'horizontal' | 'vertical';
  /**
   * Flex属性
   */
  flexProps?: XFlexProps,
}

/**
 * checkbox组和radio按钮组基类
 * @name 选项组
 * @groupName 选择
 */
export default class XGroup<P = {}, S = {}> extends XBaseEditor<XGroupProps & P, any> {
  static ComponentName = "选项组";
  static defaultProps = {
    ...XBaseEditor.defaultProps,
    itemsUrl: "",
    items: [],
    displayField: "text",
    valueField: "id",
    itemRender: undefined,
    isMultiSelect: false,
    direction: 'horizontal',
  };

  constructor(props) {
    super(props);
    this.state.items = this.formatData(cloneDeep(this.props.items));
  }

  /**
   * 设置选择列表
   * @param items
   */
  SetItems(items: []) {
    this.setState({items: this.formatData(cloneDeep(items))});
  }

  /**
   * 获取选择列表
   */
  GetItems() {
    return this.state.items;
  }

  getRequestUrl() {
    if (this.props.dataSourceUrl) {
      return this.props.dataSourceUrl;
    } else if (this.props.itemsUrl) {
      return this.props.itemsUrl;
    }
    return undefined;
  }

  formatData(data) {
    let items = [];
    if (!data) {
      return items;
    }
    data.forEach((d) => {
      if (typeof d === "string") {
        let item: any = {};
        item[this.props.displayField] = d;
        item[this.props.valueField] = d;
        items.push(item);
      } else {
        items.push(d);
      }
    });
    return items;
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.getRequestUrl()) {
      this.Refresh();
    }
    if (this.state.value) {
      this.SetValue(this.state.value, false);
    }
  }

  async Refresh(filter?: object, isnew?: boolean) {
    if (!this.getRequestUrl()) {
      return;
    }
    if (isnew) {
      this.state.filterData = filter;
    } else {
      this.state.filterData = {
        ...this.state.filterData,
        ...filter,
      };
    }
    if (this.props.mustHasFilter && XTools.isEmptyObject(this.props.filterData) && XTools.isEmptyObject(this.state.filterData)) {
      return;
    }
    const postData = {
      ...this.props.filterData,
      ...this.state.filterData,
    };
    this.setState({
      items: [],
      fetching: true,
    });

    let url = this.getRequestUrl();
    const ret = await this.RequestServerPost(url, postData, false);
    if (ret.Success) {
      this.state.items = ret.Value.rows;
      // if (!this.state.value && this.state.items && this.state.items.length > 0) {
      //   this.state.value = this.state.items[0];
      // }
      this.setState({
        items: this.state.items,
        fetching: false
      });
    }
  }

  onItemClick(item, index) {
    if (this.state.lastClickIndex != index) {
      this.state.lastClickIndex = index;
      let value = item[this.props.valueField];
      if (this.props.isMultiSelect) {
        if (!this.state.value) {
          this.state.value = [];
        }
        if (XArray.arrayGetKey(this.state.value, value)) {
          XArray.arrayDeleteKey(this.state.value, value);
        } else {
          XArray.arrayAddKey(this.state.value, value);
        }
        value = this.state.value;
      }
      this.SetValue(value, item);
    }
  }

  renderEditor() {
    const node = this.state.items.map((item, index) => {
      let itemnode = item[this.props.displayField];
      let v = item[this.props.valueField];
      let isSelected = v === this.GetValue();
      if (this.props.isMultiSelect) {
        isSelected = XArray.arrayGetKey(this.GetValue(), v);
      }
      if (this.props.itemRender) {
        itemnode = this.props.itemRender(item, isSelected, this);
      }
      if (isSelected) {
        return (<div key={index} style={{cursor: "pointer", border: "solid 1px black"}} onClick={() => {
          this.onItemClick(item, index)
        }}>
          {itemnode}
        </div>);
      } else {
        return (<div key={index} style={{cursor: "pointer"}} onClick={() => {
          this.onItemClick(item, index)
        }}>
          {itemnode}
        </div>);
      }
    });
    return (
      <XFlex {...this.props.flexProps}>
        {node}
      </XFlex>
    );
  }
}

