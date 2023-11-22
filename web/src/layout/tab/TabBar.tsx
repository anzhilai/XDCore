import React, { PureComponent, cloneElement } from 'react';
import classnames from 'classnames';
import type { BaseTabBarProps } from './TabBarPropsType';
import type TabBarItem from './TabBarItem';
import "./tabbar.css"
export interface TabBarProps extends BaseTabBarProps {
  prefixCls?: string;
  className?: string;
  children?:React.ReactNode;
}

export default class TabBar extends PureComponent<TabBarProps, any> {
  static Item: typeof TabBarItem;

  static defaultProps: TabBarProps = {
    prefixCls: 'za-tab-bar',
    visible: true,
  };

  onChildChange = (value: string | number) => {
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange(value);
    }
  };

  getSelected = (index: number, itemKey: string | number) => {
    const { activeKey, defaultActiveKey } = this.props;
    if (!activeKey) {
      if (!defaultActiveKey && index === 0) {
        return true;
      }
      return defaultActiveKey === itemKey;
    }
    return activeKey === itemKey;
  };

  render() {
    const { visible, prefixCls, className, children, style } = this.props;
    const cls = classnames(prefixCls, className, {
      [`${prefixCls}--hidden`]: !visible,
    });
    const items = React.Children.map(children, (element, index) => {
      if (!React.isValidElement(element)) return null;
      const p:any = element.props;
      const itemKey= p.itemKey || p.title ||index;
      return cloneElement(element, {
        key: index,
        // @ts-ignore
        badge: p.badge,
        title: p.title,
        disabled: p.disabled,
        icon: p.icon,
        itemKey,
        style: p.style,
        onChange: () => this.onChildChange(itemKey),
        selected: this.getSelected(index, itemKey),
      });
    });
    return (
      <div className={cls} style={style}>
        {items}
      </div>
    );
  }
}

