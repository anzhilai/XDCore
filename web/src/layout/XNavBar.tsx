import React, {ReactNode} from 'react';
import XBaseLayout, {XBaseLayoutProps} from "../base/XBaseLayout";
import NavBar,{NavBarProps} from "./nav/NavBar";

export interface XNavBarProps extends XBaseLayoutProps,NavBarProps {
}

/**
 * 包含返回的导航栏，一般在手机页面的最上面
 * @name 导航栏
 * @groupName 折叠显示
 */
export default class XNavBar extends XBaseLayout<XNavBarProps,any> {
    static ComponentName = "导航栏";
    static defaultProps = {
        ...XBaseLayout.defaultProps,

    };


    constructor(props:XNavBarProps) {
        super(props);
    }

    render() {
        return (<NavBar {...this.props}/>);
    }

}
