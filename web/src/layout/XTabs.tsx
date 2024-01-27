import React, {ReactNode} from 'react';
import {Tabs} from "antd";
import XBaseLayout, {XBaseLayoutProps} from "../base/XBaseLayout";
import TabPanel from "./tab/TabPanel";
import MTabs from "./tab/Tabs"
import XBadge from './XBadge';


export interface XTabsItem {
  key?: string,
  title: React.ReactNode,
  children?: React.ReactNode,
  forceRender?: boolean;
  closable?: boolean;
  closeIcon?: React.ReactNode;
  badgeCount?: React.ReactNode;
}

export interface XTabsProps extends XBaseLayoutProps {
  /**
   *激活
   */
  activeKey?: number | string,
  /**
   *id字段
   */
  idField: string,
  /**
   *标题字段
   * @defaultValue title
   */
  titleField: string,
  /**
   *标题渲染
   * @param item tab页对象
   */
  titleRender: (item: object) => React.ReactNode;
  /**
   * 页签位置
   */
  tabPosition?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * tab页标题显示样式
   */
  type?: 'line' | 'card' | 'editable-card';
  /**
   * tab页是否可以关闭
   */
  closable?: boolean,
  /**
   * tab页列表
   */
  items: string[] | XTabsItem[],
  /**
   * 扩展操作列
   */
  extraButtons?: React.ReactNode,
  /**
   * 切换面板的回调
   * @param key
   * @param item
   * @param tab
   */
  onTabChange?: (key, item, tab) => void,
  /**
   * 添加事件
   * @param tab
   */
  onAdd?: (tab) => {},
  /**
   * 删除事件
   * @param key
   * @param item
   * @param tab
   */
  onRemove?: (key, item, tab) => void,
  /**
   * 是否可滑动
   */
  swipeable?: boolean,
  /**
   * tab页标题宽度
   */
  titleWidth?: "full" | "auto",
}

/**
 * 一组Tab页，点击切换显示
 * @name 页签
 * @groupName 折叠显示
 */
export default class XTabs extends XBaseLayout<XTabsProps, any> {
  static ComponentName = "Tab页";
  static TabPosition = {top: 'top', right: 'right', bottom: 'bottom', left: 'left'}
  static StyleType = {web: 'web', common: 'common'};

  static Panel: typeof TabPanel = TabPanel;
  static TabPanel: typeof Tabs.TabPane = Tabs.TabPane;
  static Tabs: typeof Tabs = Tabs;

  static defaultProps = {
    ...XBaseLayout.defaultProps,
    idField: "id",
    titleField: "title",
    tabPosition: 'top',
    items: [],
    type: "card",
    onTabChange: undefined,
    titleRender: undefined,
    swipeable: true,
  };

  mapItems = {};

  constructor(props: XTabsProps) {
    super(props);
    this.state.activeKey = this.props.activeKey;
    this.state.items = this.formatItems(this.props.items);
  }

  /**
   * 设置tab页
   * @param items tab页列表
   */
  SetItems(items: any[]) {
    this.setState({items: this.formatItems(items)})
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.items !== nextProps.items) {
      this.setState({items: this.formatItems(nextProps.items)})
    }
    return true;
  }

  formatItems(items: any[]) {
    let list = [];
    this.mapItems = {};
    if (items) {
      items.forEach(item => {
        if (item) {
          if (typeof (item) == 'string') {
            item = {[this.props.idField]: item, [this.props.titleField]: item};
          }
          if (!item.key) {
            item.key = item[this.props.idField];
          }
          if (!item.key) {
            item.key = item[this.props.titleField];
          }
          if (this.props.titleRender) {
            item.label = this.props.titleRender(item);
          } else {
            if (item.badgeCount == undefined) {
              item.badgeCount = 0;
            }
            item.label =
              <XBadge ref={e => item.badge = e} value={item.badgeCount}>{item[this.props.titleField]}</XBadge>;
          }
          list.push(item);
          this.mapItems[item.key] = item;
        }
      });
    }
    return list;
  }

  /**
   * 设置数量
   * @param itemKey
   * @param count
   * @constructor
   */
  SetItemBadgeCount(itemKey: string, count: React.ReactNode) {
    let item = this.mapItems[itemKey];
    if (item && typeof (item) == "object") {
      item.badgeCount = count;
      item.badge?.SetValue(count);
      // this.setState({items: this.state.items});
    }
  }

  /**
   * 添加tab
   * @param key 关键字
   * @param title 标题
   * @param content 内容
   * @param closable 是否可以关闭
   * @param item 对象
   */
  AddPanel(key: string, title: string | ReactNode, content: string | ReactNode, closable: boolean, item: object) {
    let panel = {
      key: key,
      label: title,
      children: content,
      closable,
      item,
    };
    let items = this.state.items;
    items.push(panel);
    this.mapItems[panel.key] = item;
    this.setState({items})
  }

  /**
   * 获取tab页对象
   */
  GetMapItems() {
    return this.mapItems;
  }

  /**
   * 获取激活key
   */
  GetActiveKey() {
    return this.state.activeKey;
  }

  /**
   * 设置激活key
   */
  SetActiveKey(key: string) {
    this.state.activeKey = key;
    this.setState({activeKey: key,});
  }

  onEditEvent = (key, action) => {
    if (action === "add") {
      this.props.onAdd && this.props.onAdd(this);
    } else if (action === "remove") {
      this.props.onRemove && this.props.onRemove(key, this.mapItems[key], this);
    }
  }

  onTabChangeEvent = (key) => {
    this.props.onTabChange && this.props.onTabChange(key, this.mapItems[key], this);
    this.setState({activeKey: key,});
  }

  renderLayout() {
    if (this.props.styleType === XTabs.StyleType.common) {
      let {activeKey = 0} = this.state;
      return <MTabs scrollable={true} swipeable={this.props.swipeable} titleWidth={this.props.titleWidth}
                    value={parseInt(activeKey)} onChange={(index, tab) => {
        this.SetActiveKey(index + "");
        this.props.onTabChange && this.props.onTabChange(index, tab, this)
      }} direction={this.props.tabPosition == "top" || this.props.tabPosition == "bottom" ? 'horizontal' : 'vertical'}>
        {this.props.children}
      </MTabs>;
    } else {
      return <Tabs type={this.props.type} onEdit={this.onEditEvent.bind(this)} activeKey={this.state.activeKey}
                   onChange={this.onTabChangeEvent} tabPosition={this.props.tabPosition} items={this.state.items}
                   tabBarExtraContent={this.props.extraButtons}/>
    }
  }

}
