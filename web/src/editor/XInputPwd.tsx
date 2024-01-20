import React from 'react';
import { Input } from 'antd';
import XBaseEditor, { XBaseEditorProps } from '../base/XBaseEditor';
import InputBase from "./input/InputBase";
import XIcon from '../display/XIcon';


export interface XInputPwdProps extends XBaseEditorProps {
    /**
     * 显示文本
     */
    placeholder?: string,
    /**
     * 回车事件
     * @param value
     * @param record
     * @param e
     */
    onPressEnter?: (value?: any, record?: object, e?: any) => void,
    hasConfirm?:boolean,
    minLength?:number,
    hasLetter?:boolean,
}

/**
 * 录入密码和密码确认信息
 * @name 密码框
 * @groupName 输入
 */
export default class XInputPwd extends XBaseEditor<XInputPwdProps,any> {
    static ComponentName = "密码框";
    static StyleType = {web: 'web',common: 'common'};

    static defaultProps = {
        ...XBaseEditor.defaultProps,
        placeholder: '请输入密码',
    };


    constructor(props) {
        super(props);
    }

    componentDidMount() {
        super.componentDidMount();
        if(this.props.dataSourceUrl){
            this.Refresh();
        }
    }

    getValueChangeSleep(){
        return 500;
    }
    onChange=(value)=>{
        let v = value;
        if (value !== null){
            if(typeof value ==="object"&&value.target){
                v = value.target.value;
            }
        }
        super.SetValue(v);
    }

    onPressEnter(e?:any,v?:any){
        if(this.props.onPressEnter){
            if (v == undefined) {
                v = this.GetValue();
            }
            this.props.onPressEnter(v);
        }
    }

    Focus() {
        this.input?.focus && this.input?.focus();
    }

    input:any;
    renderEditor = () => {
        if (this.GetStyleType() === XInputPwd.StyleType.common) {
            return <InputBase type={"password"} onChange={this.onChange} placeholder={this.props.placeholder} disabled={this.props.disabled}
                              value={this.GetValue()} ref={(ele) => this.input = ele}/>;
        } else {
            let style: any = {};
            if (this.props.grid[0] > 0) {
                style.height = "100%";
                style.width = "100%";
            }
            // @ts-ignore
            const suffix = XIcon.AudioOutlined({width: 30, height: 30, color: '#1890ff',});
            return <Input.Password onClick={e => e.stopPropagation()}
                                   onPressEnter={(e) => this.onPressEnter(e)} ref={(e) => this.input = e}
                                   value={this.GetValue()} suffix={suffix} placeholder={this.props.placeholder} disabled={this.props.disabled}
                                   style={style} onChange={this.onChange}/>;
        }
    };

}
