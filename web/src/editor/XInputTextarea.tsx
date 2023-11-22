import React from 'react';
import { Input } from 'antd';
import XBaseEditor, { XBaseEditorProps } from '../base/XBaseEditor';
import InputTextarea from "./input/InputTextarea";


export interface XInputTextareaProps extends XBaseEditorProps {
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
    rows?:number,
    autoHeight?: boolean;
    showLength?: boolean;
}

/**
 * 录入多行文本
 * @name 文本框
 * @groupName 输入
 */
export default class XInputTextarea extends XBaseEditor<XInputTextareaProps,any> {
    static ComponentName = "文本框";
    static StyleType = {web: 'web',common: 'common'};

    static defaultProps = {
        ...XBaseEditor.defaultProps,
        placeholder: '请输入',
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
    onKeyDownEvent(e:any){
        if(e.code==="Tab"){
            e.preventDefault()
            const insertText = '\t'
            const elInput = e.target
            const startPos = elInput.selectionStart
            const endPos = elInput.selectionEnd
            if (startPos === undefined || endPos === undefined) return
            const txt = elInput.value
            elInput.value = txt.substring(0, startPos) + insertText + txt.substring(endPos)
            elInput.focus()
            elInput.selectionStart = startPos + insertText.length;
            elInput.selectionEnd = startPos + insertText.length;
            this.onChange(elInput.value);
        }
    }
    Focus(){
        this.input.focus && this.input.focus();
    }


    getReadOnlyNode() {
        let n = this.GetText();
        return <div style={{minHeight: 110, height: "100%", overflow: "auto", whiteSpace: "pre-line", paddingTop: 4}}>{n}</div>;
    }

    input:any;
    renderEditor = () => {
        if (this.GetStyleType() === XInputTextarea.StyleType.common) {
            return <InputTextarea {...this.props} onChange={this.onChange} value={this.GetValue()}
                                  ref={(ele) => this.input = ele}/>;
        } else {
            let style: any = {};
            if (this.props.grid[0] > 0) {
                style.height = "100%";
                style.width = "100%";
            }
            if (this.props.height) {
                style.height = this.props.height;
            }
            return <Input.TextArea onClick={e => e.stopPropagation()} onKeyDown={(e) => this.onKeyDownEvent(e)}
                                   onPressEnter={(e) => this.onPressEnter(e)} ref={(e) => this.input = e}
                                   style={style} onChange={this.onChange} placeholder={this.props.placeholder}
                                   rows={4} value={this.GetValue()}/>;
        }
    };
}
