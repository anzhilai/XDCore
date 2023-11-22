import React from 'react';
import XBaseEditor, {XBaseEditorProps} from '../base/XBaseEditor';
import XGrid from '../layout/XGrid';
import SearchBar from "./input/SearchBar";
import XFlex from "../layout/XFlex";

export interface XSearchBarProps extends XBaseEditorProps {
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
  /**
   * 其他图标
   */
  otherIcon?: React.ReactNode;
}

/**
 * 搜索框
 * @name 搜索框
 * @groupName 输入
 */
export default class XSearchBar<P = {}, S = {}> extends XBaseEditor<XSearchBarProps & P, any> {

  static defaultProps = {
    ...XBaseEditor.defaultProps,
    placeholder: '请输入',
  };

  constructor(props: XSearchBarProps) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.props.dataSourceUrl) {
      this.Refresh();
    }
  }

  getValueChangeSleep() {
    return 500;
  }

  onPressEnter(e?: any, v?: any) {
    if (this.props.onPressEnter) {
      if (v == undefined) {
        v = this.GetValue();
      }
      this.props.onPressEnter(v);
    }
  }

  Focus() {
    this.input?.focus && this.input?.focus();
  }

  input: any;
  renderEditor = () => {
    return <XGrid columnsTemplate={["1fr", "auto"]}>
      <SearchBar ref={e => this.input = e} placeholder={this.props.placeholder}
                 value={this.GetValue()} otherIcon={this.props.otherIcon}
                 onChange={(value) => this.SetValue(value)}
                 onSubmit={() => this.onPressEnter()}/>
      <XFlex boxStyle={{marginLeft: -5, marginRight: 5}}>
        {this.props.extraButtons}
      </XFlex>
    </XGrid>
  };

}
