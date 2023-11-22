import React from "react";
import XBaseDisplay, {XBaseDisplayProps} from "../base/XBaseDisplay";
import Marquee ,{MarqueeProps}from "./marquee/Marquee"

// @ts-ignore
export interface XMarqueeProps extends MarqueeProps {

}

/**
 * 将一组文字横向或者竖行滚动显示
 * @name 滚动文字
 * @groupName 列表
 */
export default class XMarquee extends XBaseDisplay<XMarqueeProps, any> {
    static ComponentName = "滚动文字";
    static StyleType = {common: 'common'};

    static defaultProps = {
        ...XBaseDisplay.defaultProps,
        title: "",
    };

    constructor(props) {
        super(props);
    }

    renderDisplay() {

        return <Marquee {...this.props}>
            {this.props.children}
        </Marquee>
    }
}
