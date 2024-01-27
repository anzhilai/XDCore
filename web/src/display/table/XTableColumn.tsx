import React from 'react';
import {Pagination, Popover} from 'antd';
import XBaseStyle from "../../base/XBaseStyle";
import XButton from '../../editor/XButton';
import XArray from '../../toolkit/XArray';
import XString from '../../toolkit/XString';
import XTools from '../../toolkit/XTools';
import XForm from "../../editor/XForm";
import XInput from '../../editor/XInput';
import XInputNum from "../../editor/XInputNum";
import XCard from "../../layout/XCard";
import XFlex from "../../layout/XFlex";
import XGrid from "../../layout/XGrid";
import XModal from "../../layout/XModal";
import XExport from "../../display/XExport";
import XList from "../XList";
import XMessage from "../XMessage";
import XTableBase, {XTableBaseProps} from "./XTableBase";
import XTableGrid from "../XTableGrid";
import XIcon from '../XIcon';

export interface XTableColumnProps extends XTableBaseProps {
  checkStrictly?: boolean,
  checkedStrategy?: 'all' | 'parent' | 'child'
  autoWidth?: boolean,
  allowCellEdit?: boolean,
  searchText?: string,
  showType?: 'table' | 'grid' | 'list' | 'custom',
  itemRender?: (item: any, index: number, list: object[]) => React.ReactNode,
  customRender?: (list: object[]) => React.ReactNode,
  settingQueryUrl?: string,
  settingSaveUrl?: string,
  settingDeleteUrl?: string,
  onDefaultSettingResult?: (setting: object) => object,
}

export default class XTableColumn<P = {}, S = {}> extends XTableBase<XTableColumnProps & P, any> {


  static defaultProps = {
    ...XTableBase.defaultProps,
    extraButtons: undefined,
    extraFooterButtons: undefined,
    showButtons: true,
    showSearch: true,
    showTotal: false,
    rowOperate: undefined,
    searchText: undefined,
    visibleColumns: [],
    isTree: false,
    settingQueryUrl: 'xtpz/queryinfo',
    settingSaveUrl: 'xtpz/save',
    settingDeleteUrl: 'xtpz/delete',
    checkStrictly: false,
    onEditValueChange: undefined,
    exportName: undefined,
    autoWidth: true,
    columnsAutoFit: true,
    allowCellEdit: false,
    showType: 'table'
  }

  constructor(props) {
    super(props)
    this.rowFilterInput = {};
    this.editModeDiv = [];
    this.state.filterHeight = "0px";
    this.state.filterCondHeight = "0px";
    this.setting = {
      单页最大行数: 30,
      显示风格: '默认',
      columns: [],
    };
  }

  async componentDidMount() {
    super.componentDidMount();
    this.initSetting();
  }

  setting: object;
  rowFilterInput: any;
  editModeDiv: any[];
  table列设置: XTableGrid;
  export导出: any;

  ExportData() {
    const url = this.props.dataSourceUrl;
    if (!url) {
      XMessage.ShowError("请设置数据源");
      return;
    }
    const fields = [];
    // let cols = this.state.columns; //this.allColumns
    let cols = this.allColumns;
    for (let i = 0; i < cols.length; i += 1) {
      if (cols[i].field !== "操作" && !XString.contains(cols[i].field, "id")) {
        fields.push(cols[i].field);
      }
    }
    // return fields;
    const purl = url.split("/")[0];
    XModal.ModalShow("导出数据", async () => {
      await this.export导出.Export({
        ...this.props.filterData,
        ...this.state.filterData,
        ...this.export导出.GetDownloadPrams(),
        exportName: this.props.exportName,
      });
      return true;
    }, <XExport ref={(e) => this.export导出 = e} exportUrl={`${purl}/export_excel`} exportName={this.props.exportName}
                columnFields={fields}/>, '750px',);
  }

  updateSetting() {
    if (this.setting) {// @ts-ignore
      let columns = this.setting.columns;
      if (columns?.length > 0) {
        let colMap = {};
        let colNum = {};

        function formatColumns(list) {
          list.forEach((item, index) => {
            colMap[item.field] = item;
            if (item.children && item.children.length > 0) {
              formatColumns(item.children);
            }
          });
        }

        formatColumns(this.allColumns);
        columns.forEach((item, index) => {
          colNum[item.field] = index;
          if (colMap[item.field]) {
            let _item = colMap[item.field];
            for (let key in item) {
              _item[key] = item[key];
            }
          }
        });
        let lastIndex = 0;

        function formatColumnsNum(list) {
          list.forEach((item, index) => {
            if (colNum[item.field] == undefined) {
              colNum[item.field] = lastIndex;
            }
            lastIndex = colNum[item.field];
            if (item.children && item.children.length > 0) {
              formatColumns(item.children);
              item.children.sort(function (item1, item2) {
                return colNum[item1.field] - colNum[item2.field];
              });
            }
          });
        }

        formatColumnsNum(this.allColumns);
        this.allColumns.sort(function (item1, item2) {
          return colNum[item1.field] - colNum[item2.field];
        });
        const cols = this.SetVisibleColumns(this.allColumns);
        let pagination = this.state.pagination;
        if (pagination) {// @ts-ignore
          pagination.pageSize = this.setting.单页最大行数;
        }
        this.setState({columns: cols, pagination: pagination,});
      }
    }
  }

  async initSetting() {
    if (!this.props.id) {
      return;
    }
    let r = await this.RequestServerPost(this.props.settingQueryUrl, {id: "table_" + this.props.id}, undefined, true, false);
    if (r.Success && r.Value) {
      let 配置值 = undefined;
      if (typeof r.Value === "string") {
        配置值 = r.Value;
      } else {
        配置值 = r.Value?.配置值;
      }
      if (配置值) {
        try {
          this.setting = JSON.parse(配置值);// @ts-ignore
          if (this.props.onDefaultSettingResult) {
            this.setting = this.props.onDefaultSettingResult(this.setting);
          }
          this.updateSetting();
        } catch (e) {
        }
      }
    }
  }

  async deleteSetting() {
    if (!this.props.id) {
      return;
    }
    let r = await this.RequestServerPost(this.props.settingDeleteUrl, {id: "table_" + this.props.id,}, false, true, false);
    if (r.Success) {
    }
  }

  async saveSetting() {
    if (!this.props.id) {
      return;
    }
    let columns = [];

    function formatColumns(list) {
      list?.forEach(item => {
        columns.push({
          field: item.field,
          width: item.width,
          visible: item.visible,
          lock: item.lock,
        });
        if (item.children && item.children.length > 0) {
          formatColumns(item.children);
        }
      });
      return columns;
    }// @ts-ignore
    this.setting.columns = formatColumns(this.allColumns);
    let setting = JSON.stringify(this.setting);
    let p = {
      id: "table_" + this.props.id,
      name: this.props.id,
      setting: setting,
      配置项: this.props.id,
      配置类型: "组件配置",
      配置值: setting,
    }
    let r = await this.RequestServerPost(this.props.settingSaveUrl, p, undefined, true, false);
    if (r.Success) {
    }
  }

  settingForm: any;
  serverColumns: any[];

  async ShowColumnSetting() {// @ts-ignore
    let isTree = false;
    this.allColumns.forEach((item, index) => {
      item.id = "column" + index;
      if (item.children && item.children.length > 0) {
        isTree = true;
      }
    });
    let pageSize = this.state.pagination?.pageSize;
    const Ele = <XGrid columnGap="10px" rowGap="10px">
      <XForm inited={(e) => this.settingForm = e} infoData={this.setting}/>
      <XGrid columnsTemplate={["1fr", "auto"]}>
        {this.state.pagination ? <XInputNum value={pageSize} field="单页最大行数" onValueChange={(v) => pageSize = v}
                                            parent={() => this.settingForm}/> : <div></div>}
        <XButton boxStyle={{display: "inline", margin: "0px 10px"}} text={"恢复默认"} onClick={async () => {
          XModal.Confirm("是否恢复表格默认设置", () => {
            let list = [];
            let map = {};
            this.props.visibleColumns?.forEach((col) => {
              if (typeof col == "string") {
                list.push(col);// @ts-ignore
                map[col] = {visible: true, lock: false};
              } else {
                list.push(col.field);
                map[col.field] = {visible: true, lock: false, ...col};
              }
            });
            if (this.serverColumns) {
              this.serverColumns.forEach(col => {
                if (list.indexOf(col.field) == -1) {
                  list.push(col.field)
                  map[col.field] = col;
                }
              });
            }
            let allColumns = this.table列设置.GetData();
            allColumns.sort((a, b) => list.indexOf(a.field) - list.indexOf(b.field))
            allColumns.forEach(col => {
              let _col = map[col.field];
              if (_col) {
                for (let key in _col) {
                  col[key] = _col[key];
                }
              }
            });
            // this.settingForm.SetValues({单页最大行数: 30});
            // this.table列设置.SetData(allColumns);
            // saveSetting = false;
            // modal.handleOk();
            pageSize = 30;
            let pagination = this.state.pagination;
            let refreshPage = false;
            if (pagination) {
              if (pageSize != pagination.pageSize) {
                pagination.pageSize = pageSize;
                refreshPage = true;
              }
            }
            this.allColumns = allColumns;// @ts-ignore
            const cols = this.SetVisibleColumns(this.allColumns);
            this.setState({columns: cols, pagination: pagination,}, () => {
              refreshPage && this.Refresh();
            });
            this.deleteSetting();// @ts-ignore
            modal?.handleCancel();
            return true;
          });
        }}/>
      </XGrid>
      <XTableGrid height="400px" isPagination={false} data={this.allColumns} isTree={isTree} draggable={true}
                  showSearch={false} showButtons={false} ref={(e) => this.table列设置 = e} enableEdit={false}
                  visibleColumns={[
                    {title: "列名", field: "title"},
                    {
                      title: "宽度", field: "width",
                      mode: XTableGrid.EditMode.show, type: XTableGrid.ColumnType.number,
                    },
                    // {
                    //   title: "对齐方式", field: "align",
                    //   mode: XTableGrid.EditMode.show, type: XTableGrid.ColumnType.select, getEditProps: (col) => {
                    //     let items = [{id: "left", label: "左对齐"},
                    //       {id: "center", label: "居中"},
                    //       {id: "right", label: "右对齐"}];
                    //     return {items, displayField: "label"}
                    //   }
                    // },
                    {
                      title: "自动换行", field: "autoWrap",
                      mode: XTableGrid.EditMode.show, type: XTableGrid.ColumnType.switch,
                    },
                    {
                      title: "是否可见", field: "visible",
                      mode: XTableGrid.EditMode.show, type: XTableGrid.ColumnType.switch,
                    },
                    {
                      title: "是否锁定", field: "lock",
                      mode: XTableGrid.EditMode.show, type: XTableGrid.ColumnType.switch,
                    },
                  ]}/>
    </XGrid>;
    let modal = await XModal.ModalShow("设置", async () => {
      let values = this.settingForm.GetValues();
      for (let key in values) {
        this.setting[key] = values[key];
      }
      let pagination = this.state.pagination;
      let refreshPage = false;
      if (pagination) {
        if (pageSize != pagination.pageSize) {
          pagination.pageSize = pageSize;
          refreshPage = true;
        }
      }
      this.allColumns = this.table列设置.GetData();// @ts-ignore
      const cols = this.SetVisibleColumns(this.allColumns);
      this.setState({columns: cols, pagination: pagination,}, () => {
        refreshPage && this.Refresh();
      });
      this.saveSetting();
      return true;
    }, Ele, '45%');
  }

  /**
   * 设置列统计值
   * @param field
   * @param value
   * @constructor
   */
  SetTotalValue(field: string, value: number) {
    const col = this.GetColumn(field);
    if (col?.totalContentRef) {
      col.totalContentRef.SetValue(value);
    }
  }

  /**
   * 获取列统计值
   * @param field
   * @constructor
   */
  GetTotalValue(field: string) {
    const col = this.GetColumn(field);
    if (col?.totalContentRef) {
      return col.totalContentRef.GetValue();
    }
    return 0;
  }

  SetFilterData(col?: any, value?: any, range?: any) {
    if (!this.state.showSearch) {
      return;
    }
    if (range) {
      let great = this.rowFilterInput[`${col.field}Great`].GetValue();
      let less = this.rowFilterInput[`${col.field}Less`].GetValue();
      if (!great && !less && great !== 0 && less !== 0) {
        this.rowFilterInput[col.field].SetValue("范围设置");
      } else {
        great = great || great === 0 ? great : "";
        less = less || less === 0 ? less : "";
        this.rowFilterInput[col.field].SetValue(`${great}|${less}`);
      }

    }
    const f: any = {};
    const filterKey = "filter";
    for (const i in this.rowFilterInput) {
      f[filterKey + i] = undefined;
      if (this.rowFilterInput[i]) {
        const v = this.rowFilterInput[i].GetValue();
        if (v && v !== "范围设置") {
          f[filterKey + i] = v;
        }
      }
    }
    if (XTools.isEmptyObject(f)) {
      f.IsSearch = false;
    } else {
      f.IsSearch = true;
    }
    f.Parentids = undefined;
    this.Refresh(f);
  }

  columnIsRequired(column, record) {
    if (typeof column.isRequired === "function") {
      return column.isRequired(column, record);
    }
    return column.isRequired;
  }

  getColumnModeStyle(record, column, text, index) {
    if (this.editModeDiv[index] === undefined) {
      this.editModeDiv[index] = {};
    }
    let ret: any = {};
    if (this.columnIsRequired(column, record)) {
      if (text === undefined || text === "") {
        ret.border = "red 1px solid";
      }
    }
    return ret;
  }

  SetEditField(editField, editKey) {
    this.setState({editField, editKey});
  }

  parentDiv: any;
  xGridTable: XGrid;

  Resize() {

  }

  SetFilterCond(cond) {
  }

  toggleFilter() {
    const showSearch = !this.state.showSearch;
    this.setState({showSearch});
    if (!showSearch) {
      const f: any = {};
      const filterKey = "filter";
      for (const i in this.rowFilterInput) {
        this.rowFilterInput[i] && this.rowFilterInput[i].SetValue(undefined);
        f[filterKey + i] = undefined;
      }
      f.IsSearch = false;
      f.Parentids = undefined;
      this.Refresh(f);
    }
  }

  renderFilter() {
    return undefined;
  }

  renderDisplay() {
    const border = '1px solid #dfe3e8';
    let buttonColumns = ["auto"];
    if (this.props.showButtons) {
      buttonColumns = ["1fr", "auto"];
    }
    let renderSearch = () => {// @ts-ignore
      return <XInput placeholder={this.state.keyword} labelWidth="auto"
                     field={this.props.searchText ? this.props.searchText : "查询"} showLabel={true}
                     onValueChange={async (v) => {
                       if (!v) {
                         this.Refresh({IsSearch: false, Parentids: [], KeywordFields: "", KeywordValue: ""});
                       } else {
                         await this.Refresh({
                           IsSearch: true,
                           Parentids: [],
                           KeywordFields: this.state.KeywordFields,
                           KeywordValue: v
                         });
                         if (this.props.isTree) {
                           this.ExpandedAll();
                         }
                       }
                     }}
                     onPressEnter={async (v) => {
                       if (v) {
                         await this.Refresh({
                           IsSearch: true,
                           Parentids: [],
                           KeywordFields: this.state.KeywordFields,
                           KeywordValue: v
                         });
                         if (this.props.isTree) {
                           this.ExpandedAll();
                         }
                       }
                     }}/>;
    }
    let renderButtons = () => {
      return <XFlex contentHAlign={XBaseStyle.Align.end}>
        {this.props.rightExtraButtons}
        {/*<XButton visible={this.props.showButtons===true||this.props.showButtons.indexOf(XTableBase.TableButtons.export)>=0} backgroundColor="#0099FF" text="网格显示" icon={(<TableOutlined />)} showText={false} onClick={() => {*/}
        {/*}}/>*/}
        {/*<XButton visible={this.props.showButtons===true||this.props.showButtons.indexOf(XTableBase.TableButtons.export)>=0} backgroundColor="#F5C479" text="列表显示" icon={(<OrderedListOutlined />)} showText={false} onClick={() => {*/}
        {/*}}/>*/}
        <XButton
          visible={this.props.showButtons === true || XArray.Contains(this.props.showButtons, XTableBase.TableButtons.filter)}
          backgroundColor="#0099FF" text="过滤" icon={XIcon.FilterOutlined()}
          showText={false} onClick={() => this.toggleFilter()}/>
        <XButton
          visible={this.props.showButtons === true || XArray.Contains(this.props.showButtons, XTableBase.TableButtons.export)}
          backgroundColor="#F5C479" text="导出Excel" icon={XIcon.DownloadOutlined()}
          showText={false} onClick={() => this.ExportData()}/>
        <XButton
          visible={this.props.showButtons === true || XArray.Contains(this.props.showButtons, XTableBase.TableButtons.refresh)}
          backgroundColor="#64B3F0" text="刷新" icon={XIcon.ReloadOutlined()}
          showText={false} onClick={() => this.Refresh()}/>
        <XButton
          visible={this.props.showButtons === true || XArray.Contains(this.props.showButtons, XTableBase.TableButtons.setting)}
          backgroundColor="#F5956C" text="设置" icon={XIcon.BarsOutlined()}
          showText={false} onClick={() => this.ShowColumnSetting()}/>
        <XButton
          visible={this.props.showButtons === true || XArray.Contains(this.props.showButtons, XTableBase.TableButtons.fullScreen)}
          backgroundColor="#4A6069" text="全屏" icon={XIcon.FullscreenOutlined()}
          showText={false} onClick={() => this.xGridTable?.ToggleFullScreen()}/>
      </XFlex>
    }
    return <XGrid ref={e => this.xGridTable = e}
                  rowsTemplate={this.state.showSearch ? ["1fr", "1fr", "auto"] : ["auto", "1fr", "auto"]}
                  rowGap={"5px"}>
      <XGrid rowsTemplate={["auto", this.state.filterCondHeight, this.state.filterHeight]}
             columnsTemplate={buttonColumns} contentVAlign={XBaseStyle.Align.center}>
        {this.props.queryForm ?
          <XGrid rowGap={"5px"} grid={[1, 1]} gridSpan={[1, 2]}>
            <XFlex>
              {this.props.queryForm}
            </XFlex>
            <XGrid columnsTemplate={["1fr", "auto"]}>
              <XFlex grid={[1, 1]} contentHAlign={XBaseStyle.Align.start}>
                {this.props.title}
                {this.props.showSearch && renderSearch()}
                <div>{this.props.extraButtons}</div>
              </XFlex>
              <XFlex grid={[1, 2]} contentHAlign={XBaseStyle.Align.end}>
                {renderButtons()}
              </XFlex>
            </XGrid>
          </XGrid> : <>
            <XFlex grid={[1, 1]} contentHAlign={XBaseStyle.Align.start}>
              {this.props.title}
              {this.props.showSearch && renderSearch()}
              <div>{this.props.extraButtons}</div>
            </XFlex>
            <XFlex grid={[1, 2]} contentHAlign={XBaseStyle.Align.end}>
              {renderButtons()}
            </XFlex>
          </>}
        <XGrid columnsTemplate={["1fr", "auto"]} grid={[2, 1]} gridSpan={[1, 2]}>
          <XCard>{this.state.FilterCondEle}</XCard>
          <XFlex horizontalAlign={"start"}>
            {/* <XButton isA={true} text={"保存视图"}/> */}
            {/* <XDivider/> */}
            <XButton isA={true} text={"清空条件"} onClick={() => this.SetFilterCond([])}/>
          </XFlex>
        </XGrid>
        <XCard overflow={"auto"} grid={[3, 1]} gridSpan={[1, 2]}>{this.state.showSearch && this.renderFilter()}</XCard>
      </XGrid>
      <XCard overflow={"auto"} grid={[2, 1]}>
        <div ref={(e) => {
          this.parentDiv = e;
          if (e && this.state.tableHeight === undefined) {
            window.setTimeout(() => this.Resize(), 20);
          }
        }} style={{
          height: "100%",
          width: '100%',
          overflow: this.props.showType == "table" ? "visible" : "auto",
          borderRight: border,
          borderBottom: border,
          borderLeft: border,
        }}>
          {
            this.props.showType == "table" ?
              this.renderTable() :
              this.props.showType == "list" ?
                this.renderList() :
                this.props.showType == "grid" ?
                  this.renderGrid() :
                  this.props.showType == "custom" ?
                    this.renderCustomRender() :
                    <></>
          }
        </div>
      </XCard>
      <XGrid grid={[3, 1]} columnsTemplate={this.props.extraFooterButtons ? ["1fr", "auto"] : ["1fr"]}>
        {this.props.extraFooterButtons && <XFlex contentHAlign={XFlex.Align.start}>
          {this.props.extraFooterButtons}
        </XFlex>}
        <XFlex contentHAlign={XFlex.Align.end}
               boxStyle={this.props.isPagination && this.state.pagination ? undefined : {height: "0px"}}>
          {this.props.isPagination && this.state.pagination && <Pagination size="small"  {...this.state.pagination}/>}
        </XFlex>
      </XGrid>
    </XGrid>
  }

  renderTable(): React.ReactNode {
    return <div></div>
  }

  list: any;

  renderList(): React.ReactNode {
    // @ts-ignore
    this.grid = null;
    return <XList isPagination={false} overflow={"auto"} height={"auto"} horizontalAlign={"start"}
                  verticalAlign={"start"} ref={(e) => e ? this.list = e : undefined} data={this.state.data}
                  itemRender={(item, index, data) => {
                    if (this.props.itemRender) {
                      return <div key={item.id} style={{width: "100%"}}>
                        {this.props.itemRender(item, index, data)}
                      </div>
                    }
                  }}/>
  }

  renderGrid(): React.ReactNode {
    // @ts-ignore
    this.grid = null;
    return <XList ref={(e) => e ? this.list = e : undefined} height={"auto"} isPagination={false}
                  horizontalAlign={"start"} verticalAlign={"start"} data={this.state.data}
                  itemRender={(item, index, data) => {
                    if (this.props.itemRender) {
                      return <div key={item.id}>{this.props.itemRender(item, index, data)}</div>
                    }
                  }}/>
  }

  renderCustomRender(): React.ReactNode {
    // @ts-ignore
    this.grid = null;
    if (this.props.customRender) {
      return this.props.customRender(this.state.data)
    }
    return <></>
  }

}



