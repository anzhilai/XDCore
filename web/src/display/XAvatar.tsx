import React from 'react';
import XBaseDisplay, { XBaseDisplayProps } from "../base/XBaseDisplay";
import {Avatar} from "antd"
export interface XAvatarProps extends XBaseDisplayProps {
    /**
     * 头像地址
     * @defaultValue undefined
     */
    src?: string,
    /**
     * 点击事件
     */
    onClick?:any,
    /**
     * img alt
     */
    alt?: string,
}

/**
 * 显示一个或者一组头像，圆的那种
 * @name 头像
 * @groupName 图像
 */
export default class XAvatar extends XBaseDisplay<XAvatarProps,any> {
    static ComponentName = "头像";
    static StyleType = {web: 'web',common: 'common'};
    static Avatar: typeof Avatar = Avatar;
    static Group: typeof Avatar.Group = Avatar.Group;
    static defaultProps = {
        ...XBaseDisplay.defaultProps,
        isAvatar:false,
        src: undefined,
        imageWidth:"100%",
        imageHeight:"100%",
        preview:false,
        onClick:undefined,
        alt: undefined,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(this.props.dataSourceUrl){
            this.Refresh();
        }
    }

    useStateSRC= false;
    /**
     * 获取src
     */
    GetSrc() {
        if (this.useStateSRC) {
            if (this.state.src) {
                return this.state.src;
            }
        } else if (this.props.src) {
            return this.props.src;
        }
        return "";
    }

    /**
     * 设置 src
     * @param src
     */
    SetSrc(src) {
        this.useStateSRC=true;
        this.setState({
            src: src,
        });
    }

    async Refresh(filter?:object,isnew?:boolean){
        let value = await this.RefreshServer(filter,isnew);
        if(value){
            this.SetSrc(value);
        }
    }


    renderDisplay() {
        return (<Avatar style={this.props.style} src={this.GetSrc()}/>);
    }

}
