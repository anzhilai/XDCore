import React from 'react';
import XBaseDisplay, { XBaseDisplayProps } from "../base/XBaseDisplay";
import {Breadcrumb} from "antd"
export interface XBreadcrumbProps extends XBaseDisplayProps {
}

/**
 * 显示当前页面在系统层级结构中的位置，并能向上返回。
 * @name 面包屑
 * @groupName 图像
 */
export default class XBreadcrumb extends XBaseDisplay<XBreadcrumbProps,any> {
    static ComponentName = "面包屑";
    static StyleType = {web: 'web',common: 'common'};
    static Breadcrumb: typeof Breadcrumb = Breadcrumb;
    
    static defaultProps = {
        ...XBaseDisplay.defaultProps,
    };

    renderDisplay() {
        return (<Breadcrumb {...this.props}/>);
    }

}
