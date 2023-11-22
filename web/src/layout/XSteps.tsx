import React from 'react';
import XBaseLayout from "../base/XBaseLayout";
import {XBaseLayoutProps} from "../base/XBaseLayout";
import {Steps} from 'antd';

const {Step} = Steps;

export interface XStepsProps extends XBaseLayoutProps {
  /**
   * 指定当前步骤，从 0 开始记数
   */
  current?: number;
  /**
   * 指定步骤条方向
   */
  direction?: "horizontal" | "vertical"
  /**
   * 点击切换步骤时触发
   * @param current
   */
  onChange?: (current: number) => void
}

export interface XStepItemProps {
  title?: string
}

/**
 * 一组页面按步骤显示
 * @name 步骤
 * @groupName 折叠显示
 */
export default class XSteps extends XBaseLayout<XStepsProps, any> {
  static ComponentName = "步骤";
  static Steps: typeof Steps = Steps;
  static defaultProps = {
    ...XBaseLayout.defaultProps,
  };

  constructor(props: XSteps) {
    super(props);
  }

  renderLayout() {

    let children: any = this.props.children;

    return (<Steps>
        {this.props.children}
      </Steps>
    );

  }

}
