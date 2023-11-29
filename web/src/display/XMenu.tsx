import React, {ReactNode} from 'react';
import {Menu, SubMenuProps} from "antd";
import XBaseDisplay, {XBaseDisplayProps} from "../base/XBaseDisplay";
import XIcon from "./XIcon";

const {SubMenu} = Menu;

export interface XMenuProps extends XBaseDisplayProps {
  /**
   * 菜单显示模式
   */
  mode?: 'vertical' | 'horizontal' | 'inline'
  /**
   * 点击菜单项事件
   */
  onMenuItemClick?: (item: object, menu: XMenu) => void,
  /**
   * 菜单项打开闭关事件
   */
  onOpenChange?: (openKeys: [], lastOpenKeys: [], addKeys: any[], deleteKeys: any[], menu: XMenu) => void,
  /**
   * 默认打开的菜单项
   */
  openKeys?: string[],
  /**
   * 菜单项的唯一键对应字段
   */
  keyField?: string,
  /**
   * 菜单项的路径对应字段
   */
  pathField?: string,
  /**
   * 菜单项的名称对应字段
   */
  nameField?: string,
  /**
   * 默认选中的菜单项
   */
  selectedKeys?: string[],
  /**
   * 内联折叠
   */
  inlineCollapsed?: boolean,
  allowSubMenuClick?: boolean,
  expandIcon: ReactNode | ((props: SubMenuProps & { isSubMenu: boolean }) => ReactNode),
  onMenuItemsRender?: (data:[])=>ReactNode,
  inlineIndent: number
}

/**
 * 层次式显示导航组件
 * @name 菜单
 * @groupName 列表
 */
export default class XMenu extends XBaseDisplay<XMenuProps, any> {
  static ComponentName = "菜单";
  static Mode = {
    vertical: "vertical", horizontal: "horizontal", inline: "inline"
  }

  static Menu: any = Menu;

  static defaultProps = {
    ...XBaseDisplay.defaultProps,
    mode: XMenu.Mode.inline,
    selectPathItems: [],
    openKeys: [],
    selectedKeys: [],
    maxLevel: -1,
    onMenuItemClick: undefined,
    selectedFontColor: '',
    selectedBackgroundColor: '',
    inlineCollapsed: false,
    allowSubMenuClick: false,
    overflow: "auto",
    keyField: "id",
    nameField: "",
    pathField: "",
    inlineIndent: 24
  };


  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      data: this.formatData(this.props.data),
      keyItems: {},
      openKeys: this.props.openKeys,
      inlineCollapsed: this.props.inlineCollapsed,
    }
  }

  componentDidMount() {
    if (this.props.dataSourceUrl) {
      this.Refresh();
    }
  }

  formatData(data) {
    let items = [];
    if (!data) {
      return items;
    }
    data.forEach((d) => {
      if (typeof d === "string") {
        items.push({name: d, path: d, key: d,});
      } else {
        if (!d.name) {
          d.name = d[this.props.nameField];
        }
        if (!d.path) {
          d.path = d[this.props.pathField];
        }
        if (!d.key) {
          d.key = d[this.props.keyField];
        }
        items.push(d);
      }
    });
    return items;
  }

  GetData() {
    if (this.useStateData) {
      if (this.state.data) {
        return this.state.data;
      }
    } else if (this.props.data) {
      return this.formatData(this.props.data);
    }
    return [];
  }

  /**
   * 通过key获取menu
   * @param key
   */
  GetMenuItem(key) {
    return this.state.keyItems[key];
  }

  /**
   * 设置打开的菜单
   */
  SetOpenKeys(openKeys){
    this.setState({openKeys})
  }

  /**
   * 获取打开的菜单
   */
  GetOpenKeys(){
    return this.state.openKeys;
  }

  onOpenChange = (openKeys) => {
    // console.log(openKeys)
    let lastOpenKeys = this.state.openKeys;
    let addKeys = [];
    let deleteKeys = [];
    openKeys?.forEach(key => {
      if (lastOpenKeys?.indexOf(key) == -1) {
        addKeys.push(key);
      }
    });
    lastOpenKeys?.forEach(key => {
      if (openKeys?.indexOf(key) == -1) {
        deleteKeys.push(key);
      }
    });
    this.state.openKeys = openKeys;
    this.setState({openKeys: [...openKeys],});
    this.props.onOpenChange && this.props.onOpenChange(openKeys, lastOpenKeys, addKeys, deleteKeys, this);
  }

  onMenuItemClickEvent(menuItem, key) {
    let item = this.GetMenuItem(key);
    if (!item) {
      item = menuItem;
    }
    if (!item.name) {
      item.name = item.key;
    }
    this.props.onMenuItemClick && this.props.onMenuItemClick(item, this);
  }


  getMenuItems(data, parent = null, parentKey = "key") {
    return data.map((item, indexKey) => {
      indexKey = parentKey + "_" + indexKey;
      if (!item.name) {
        return <Menu.Divider key={indexKey}/>;
      }
      let Icon = undefined
      if (typeof item.icon == 'string') {
        // Icon = AntdIcon[item.icon]
        // Icon =<Icon fontSize={18}/>;
        Icon = <XIcon.Computer/>;
      } else if (typeof item.icon == 'object') {
        Icon = item.icon
      } else {
        Icon = undefined;
      }
      let title = <>
        <span>{item.name}</span>{item.count > 0 && <>(<span style={{color: "red"}}>{item.count}</span>)</>}
      </>;
      if (item.children && item.children.length > 0) {
        if (!item.key) {
          item.key = parent ? (parent.key || parent.name) + "/" + item.name : item.name;
        }
        return <SubMenu icon={Icon} title={title}
                        onTitleClick={({ key, domEvent })=>this.props.allowSubMenuClick && this.onMenuItemClickEvent(item, key)} key={item.key}>
          {this.getMenuItems(item.children, item, indexKey)}
        </SubMenu>;
      }
      if (item.name) {
        if (!item.key) {
          item.key = parent ? (parent.key || parent.name) + "/" + item.name : item.name;
        }
        this.state.keyItems[item.key] = item;
        return <Menu.Item key={item.key} icon={Icon}>{title}</Menu.Item>
      } else {
        return <Menu.Divider key={indexKey}/>;
      }
    });
  }

  /**
   * 获取内联折叠
   */
  GetInlineCollapsed() {
    if (this.state.useStateInlineCollapsed) {
      return this.state.inlineCollapsed;
    }
    return this.props.inlineCollapsed;
  }

  /**
   * 设置内联折叠
   * @param inlineCollapsed
   */
  SetInlineCollapsed(inlineCollapsed: boolean) {
    this.state.useStateInlineCollapsed = true;
    this.setState({inlineCollapsed});
  }

  renderDisplay() {
    return <Menu
      openKeys={this.state.openKeys}
      selectedKeys={this.props.selectedKeys}
      mode={this.props.mode}
      inlineIndent={this.props.inlineIndent}
      expandIcon={this.props.expandIcon}
      inlineCollapsed={this.GetInlineCollapsed()}
      style={{overflowY: "auto", overflowX: "hidden"}}
      onOpenChange={this.onOpenChange}
      onClick={({item, key, keyPath}) => this.onMenuItemClickEvent(item, key)}>
      { this.props.onMenuItemsRender?this.props.onMenuItemsRender(this.GetData()):this.getMenuItems(this.GetData())}
    </Menu>;
  }

}
