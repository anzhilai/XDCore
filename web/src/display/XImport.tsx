import React from 'react';
import XBaseDisplay, { XBaseDisplayProps } from "../base/XBaseDisplay";
import XButton from "../editor/XButton";
import XCheckGroup from "../editor/XCheckGroup";
import XForm from "../editor/XForm";
import XInput from "../editor/XInput";
import XInputNum from "../editor/XInputNum";
import XText from "../editor/XText";
import XUpload from "../editor/XUpload";
import XFlex from "../layout/XFlex";
import XGrid from "../layout/XGrid";
import XMessage from "../display/XMessage";
import XTableGrid from "../display/XTableGrid";

export interface XImportProps extends XBaseDisplayProps {
  /**
   * 导入数据URL
   */
  importUrl: string,
  /**
   * 上传文件URL
   */
  uploadUrl?: string,
  /**
   * 下载模板URL
   */
  templateUrl?: string,
  /**
   * id字段
   */
  uniqueField: string,
  /**
   *标题行
   */
  titleRowNo?: number,
  /**
   * 第几个sheet
   */
  sheetNo?: number,
  /**
   * 导入参数
   */
  postData?: object,
  /**
   * 附加操作按钮
   */
  extraButtons?: React.ReactNode,
  /**
   * 扩展导出form
   */
  extraImportForm?: (parent: () => {}) => React.ReactNode,
  /**
   * 文件修改事件
   */
  onUploadChange?: (files: [], table: XTableGrid, importUrl: string, postData: {}) => void,
}

/**
 * 与数据列表结合，导入Excel
 * @name 数据导入
 * @groupName
 */
export default class XImport extends XBaseDisplay<XImportProps, any> {
  static ComponentName = "数据导入";
  static defaultProps = {
    ...XBaseDisplay.defaultProps,
    importUrl: "",
    uploadUrl: undefined,
    templateUrl: undefined,
    uniqueField: "",
    titleRowNo: 1,
    sheetNo: 1,
    postData: undefined,
    extraButtons: undefined,
    extraImportForm: undefined,
    onUploadChange: undefined,
  };


  constructor(props) {
    super(props);
    // @ts-ignore
    this.state.postData = this.props.postData;
    this.验证状态 = "错误";
    this.state.importUrl = this.props.importUrl;
    let purl = this.state.importUrl.split("/")[0];
    this.state.uploadUrl = this.props.uploadUrl ? this.props.uploadUrl : purl + "/upload";
    this.state.templateUrl = this.props.templateUrl ? this.props.templateUrl : purl + "/export_excel";
  }

  componentDidMount() {
    super.componentDidMount();
    this.table.Resize(undefined, "300px");
  }

  /**
   * 下载模板文件
   */
  DownloadTemplate() {
    this.DownloadFile(this.state.templateUrl, {
      ...this.importForm.GetEditorValues(), ...this.state.postData,
      template: true
    });
  }

  验证状态: string;
  xtext错误信息: any;

  /**
   * 导入数据
   */
  async Import() {
    const postData = {
      ...this.importForm.GetEditorValues(),
      ...this.props.postData,
    };
    if (!postData.上传文件列表) {
      XMessage.ShowError("请选择上传文件");
      return false;
    }
    const retData = await this.RequestServerPost(this.state.importUrl, postData);
    if (retData.Success) {
      return true;
    }
    this.xtext错误信息.SetValue(retData.Message)
    return false;
  }

  async onUploadChange(files, change = true) {
    const postData = {
      ...this.importForm.GetEditorValues(),
      ...this.props.postData,
      预览模式: true,
    };
    if (postData.上传文件列表) {
      if (this.props.onUploadChange && change) {
        await this.props.onUploadChange(files, this.table, this.state.importUrl, postData);
      }
      await this.table.Refresh(postData, true);
    }
  }

  importForm: any;
  table: any;
  checkGroup仅显示错误数据: any;

  render() {
    const labelWidth = "100px";
    return <XGrid rowsTemplate={["auto", "500px"]}>
        <XForm infoData={this.props.postData} inited={(e) => this.importForm = e}/>
        <XGrid columnsTemplate={["1fr", "1fr"]} columnGap="10px" rowGap="1px">
          <XUpload grid={[1, 1]} gridSpan={[1, 2]} labelWidth={labelWidth}
                   onChange={(files) => this.onUploadChange(files)}
                   fileType={"excel"} label={"上传文件"} field="上传文件列表" parent={() => this.importForm}
                   uploadUrl={this.state.uploadUrl}/>
          <XInputNum labelWidth={labelWidth} field="标题行" value={this.props.titleRowNo} parent={() => this.importForm}
                     help="导入Excel表中标题所在的行号,从1开始"/>
          <XInputNum labelWidth={labelWidth} field="页数" value={this.props.sheetNo} parent={() => this.importForm}
                     help="导入Excel表中sheet页,从1开始"/>
          <XInput labelWidth={labelWidth} parent={() => this.importForm} value={this.props.uniqueField} field="唯一列"
                  isRequired validateText="请输入唯一标识列"
                  help="导入Excel表中能够唯一标识数据的列"/>
          {this.props.extraImportForm && this.props.extraImportForm(() => this.importForm)}
        </XGrid>
        <XTableGrid ref={(e) => this.table = e} showSearch={false} showButtons={false}
                dataSourceUrl={this.state.importUrl} mustHasFilter={true}
                extraMessage={<XText ref={e => this.xtext错误信息 = e}/>}
                extraButtons={<XFlex>
                  <XCheckGroup ref={e => this.checkGroup仅显示错误数据 = e} boxStyle={{marginLeft: 5}}
                               items={["仅显示错误数据"]} onValueChange={(v) => {
                    this.验证状态 = v.length > 0 ? "错误" : "";
                    this.table.Refresh({KeywordFields: "验证状态", KeywordValue: this.验证状态});
                  }}/>
                  <XButton text={"刷新数据"} onClick={() => this.onUploadChange(undefined, false)}/>
                  {this.props.extraButtons}
                </XFlex>}
                rightExtraButtons={<XFlex horizontalAlign={"end"}>
                  <XButton text="模板下载" visible={this.state.templateUrl !== undefined}
                           onClick={() => this.DownloadTemplate()}/>
                </XFlex>}/>
      </XGrid>;
  }

}

