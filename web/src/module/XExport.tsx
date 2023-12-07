import React from 'react';
import {XString, XFlex, XButton} from '../index';
import XBaseDisplay, {XBaseDisplayProps} from "../base/XBaseDisplay";
import XCheckGroup from "../editor/XCheckGroup";
import XInput from "../editor/XInput";
import XGrid from "../layout/XGrid";

export interface XExportProps extends XBaseDisplayProps {
  /**
   * 导出数据URL
   */
  exportUrl: string,
  /**
   * 导出参数
   */
  postData?: object,
  /**
   * 导出列字段
   */
  columnFields?: any[],
  /**
   * 导出名称
   */
  exportName?: string,
}

/**
 * 与数据列表结合，导出Excel，Word和Pdf
 * @name 数据导出
 * @groupName
 */
export default class XExport extends XBaseDisplay<XExportProps, any> {
  static ComponentName = "数据导出";
  static defaultProps = {
    ...XBaseDisplay.defaultProps,
    exportUrl: undefined,
    columnFields: [],
    postData: undefined,
    exportName: undefined,
  };


  constructor(props: any) {
    super(props);
    this.state.postData = this.props.postData;
    this.state.exportUrl = this.props.exportUrl;
    this.state.exportName = this.props.exportName;
    if (!this.state.exportName) {
      this.state.exportName = "未命名";
    }
    this.state.columnFields = [];
    for (let i = 0; i < this.props.columnFields.length; i++) {
      if (!XString.contains(this.props.columnFields[i], "id")) {
        this.state.columnFields.push(this.props.columnFields[i]);
      }
    }

  }

  componentDidMount() {
    super.componentDidMount();
  }

  /**
   * 导出数据
   * @param data
   */
  async Export(data = this.GetDownloadPrams()) {
    this.DownloadFile(this.props.exportUrl, data);
    return true;
  }

  /**
   * 获取下载参数
   */
  GetDownloadPrams() {
    return {
      下载文件名称: this.xinput.GetValue(),
      选择导出列: this.xCheckGroup.GetValue(),
      columns: this.xCheckGroup.GetValue(),
    }
  }

  ClickAllOrReverse() {
    let values = [];
    let columnFields = this.state.columnFields;
    this.props.columnFields?.forEach(item => {
      if (!(columnFields?.indexOf(item) >= 0)) {
        values.push(item);
      }
    })
    this.setState({columnFields: values});
  }

  xinput: any;
  xCheckGroup: any;

  render() {
    const labelwidth = "130px";
    return <XGrid columnGap="10px" rowGap="10px">
      <XInput ref={e => this.xinput = e} labelWidth={labelwidth} value={this.state.exportName} field="下载文件名称"/>
      <XCheckGroup ref={e => this.xCheckGroup = e} labelWidth={labelwidth} field="选择导出列"
                   editorStyle={{maxHeight: 500, overflow: "auto"}}
                   itemDirection={this.props.columnFields?.length > 8 ? "horizontal" : "vertical"}
                   label={<XFlex>选择导出列
                     <XButton isA={true} onClick={() => this.ClickAllOrReverse()} text={"全选/反选"}/>
                   </XFlex>} items={this.props.columnFields} value={this.state.columnFields}/>
    </XGrid>;
  }
}
