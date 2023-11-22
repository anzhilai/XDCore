import React from 'react';
import XBaseEditor, {XBaseEditorProps} from '../base/XBaseEditor';
import XTableGrid, {XTableGridProps} from '../display/XTableGrid';
import XFlex from "../layout/XFlex";
import XGrid from "../layout/XGrid";
import XModal from "../layout/XModal";
import XButton from './XButton';


export interface XEditTableProps extends XTableGridProps, XBaseEditorProps {
  /**
   * 新增按钮文字
   */
  addText?: string,
  /**
   * 删除按钮文字
   */
  deleteText?: string,
  /**
   * 新增行时默认数据
   */
  newRowData?: {},
}

/**
 * 录入一个表格信息，大字段属性使用
 * @name 表格编辑
 * @groupName 输入
 */
export default class XEditTable extends XBaseEditor<XEditTableProps, any> {
  static ComponentName = "表格编辑";
  table: XTableGrid;
  data: any[];
  static defaultProps = {
    ...super.defaultProps,
    width: "100%",
    height: "100%",
    showLabel: false,
    tableProps: {},
    addText: "新增",
    deleteText: "删除",
    newRowData: {},
  };

  constructor(props: XEditTableProps) {
    super(props);
    this.data = this.props.data;
  }

  /**
   * 设置值
   * @param value 字符串
   * @param triggerValueChange 是否触发onValueChange
   */
  SetValue(value, triggerValueChange: boolean = true) {
    this.data = [];
    if (value) {
      if (value instanceof Array) {
        this.data = value;
        value = JSON.stringify(value);
      } else {
        try {
          this.data = JSON.parse(value);
          if (this.data === null) {
            this.data = [];
          }
        } catch (e) {
          console.log(e);
          value = undefined;
        }
      }
    }
    this.table?.SetData(this.data);
    super.SetValue(value, triggerValueChange);
  }

  SetData(data) {
    this.table?.SetData(data);
  }

  GetData() {
    return this.table?.GetData();
  }

  /**
   * 获取值
   */
  GetValue(): any {
    if (this.table) {
      let list = [];
      this.table.GetData().forEach(item => {
        item = {...item}
        list.push(item);
        delete item.rowKey;
        delete item.rowSpanMap;
        delete item.uniqueKey;
        for (let key in item) {
          if (key.startsWith("_")) {
            delete item[key];
          }
        }
      });
      this.data = list;
      return JSON.stringify(list);
    }
    return super.GetValue();
  }

  /**
   * 添加一行
   * @param row 一行对象
   */
  AddRow(row = {id: this.CreateUUID(), ...this.props.newRowData}) {
    this.table?.AddRow(row);
  }

  /**
   * 获取表格对象(XTableGrid)
   */
  GetTable() {
    return this.table;
  }

  getReadOnlyNode() {
    return this.renderEditor();
  }

  renderEditor() {// @ts-ignore
    let queryForm = <XGrid columnsTemplate={["1fr", "auto"]}>
      <XFlex flexDirection={"row"} flexWrap={false}>
        {this.props.title}
        <XButton visible={this.props.addText && !this.GetReadOnly()} text={this.props.addText}
                 onClick={() => this.AddRow()}/>
        <XButton visible={this.props.deleteText && !this.GetReadOnly()} text={this.props.deleteText} onClick={() => {
          if (this.table.GetSelectedRows().length > 0) {
            XModal.Confirm("是否确认删除选择数据", () => {
              this.table.RemoveSelectedRows();
            });
          }
        }}/>
      </XFlex>
      <XFlex>
        {this.props.extraButtons}
      </XFlex>
    </XGrid>
    return <XTableGrid showButtons={false} isPagination={false} draggable={true}
                       showSearch={false} {...this.props} title={""} inited={e => this.table = e}
                       queryForm={queryForm} extraButtons={undefined} data={this.data}/>
  }
}