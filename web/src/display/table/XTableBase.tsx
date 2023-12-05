import React from 'react'
import {message} from 'antd'
import XBaseDisplay, {XBaseDisplayProps} from '../../base/XBaseDisplay';
import XMessage from "../XMessage";
import XText from "../../editor/XText";
import XTools from "../../toolkit/XTools";
import XArray from "../../toolkit/XArray";

export interface VisibleColumn {
  /**
   * 字段名称
   */
  field?: string,
  /**
   * 列标题
   */
  title?: string | React.ReactNode,
  /**
   * 是否显示
   */
  visible?: boolean,
  /**
   * 列是否合并
   */
  rowSpan?: boolean,
  /**
   * 列合并比较
   */
  rowSpanCompare?: (mainRow: object, row: object) => boolean,
  /**
   * 对齐方式
   */
  align?: string,
  /**
   * 自动换行
   */
  autoWrap?: boolean,
  /**
   * 是否锁定列
   */
  lock?: boolean,
  /**
   * 是否允许排序
   */
  sorter?: boolean,
  /**
   * 是否显示过滤
   */
  showFilter?:boolean,
  /**
   * 是否启用焦点
   */
  enableFocus?: boolean,
  /**
   * 是否允许复制
   */
  enableCopy?: boolean,
  /**
   * 是否启用表格编辑
   */
  enableEdit?: boolean,
  /**
   * 启用表格编辑函数
   * @param row 行对象
   */
  enableEditFun?: (row: {}) => boolean,
  /**
   * 类型
   */
  type?: string | 'string' | 'number' | 'date' | "switch" | "check" | "radio" | 'select' | 'tree' | 'custom' | 'none',
  /**
   * 编辑模式
   */
  mode?: string | 'none' | 'show',
  /**
   * 获取编辑模式下组件的props
   * @param col
   */
  getEditProps?: (col: VisibleColumn) => object,
  /**
   * 统计方式
   */
  totalMode?: string | "none" | "count" | 'sum' | 'avg' | 'max' | 'min',
  /**
   * 汇总render
   * @param map 汇总对象
   */
  summaryRender?: (map: { avg: number, cnt: number, max: number, min: number, sum: number, }) => React.ReactNode,
  /**
   * 外键id字段
   */
  foreignKey?: string,
  /**
   * 原始字段名称
   */
  originField?: string,
  /**
   * 编辑器
   * @param text
   * @param record
   */
  editorRender?: (text, record, onValueChanged: () => void) => React.ReactNode,
  /**
   * 列统计组件
   */
  totalContentRef?: XText,
  /**
   * 编辑时按回车时是否关闭
   */
  isEnterEditorClose?: () => boolean,
  /**
   * 自定义保存事件
   * @param column 列对象
   * @param value 值
   * @param row 行对象
   */
  customSave?: (column: VisibleColumn, value: any, row: object) => boolean,
  /**
   * 是否树叶子节点
   */
  IsTreeLeaf?: 0 | 1,
  /**
   * 子列集合
   */
  children?: VisibleColumn[],
}
export interface XTableBaseProps extends XBaseDisplayProps {
  /**
   * 标题
   */
  title?: string | React.ReactNode;
  /**
   * 附加操作按钮
   */
  extraButtons?: React.ReactNode,
  /**
   * 查询节点
   */
  queryForm?: any,
  rightExtraButtons?: any,
  extraFooterButtons?: any,
  /**
   * 统一设置显示列上的过滤条件
   */
  showColumnFilter?: boolean,
  /**
   * 是否显示表格操作按钮
   */
  showButtons?: any,
  /**
   * 显示搜索框
   */
  showSearch?: boolean,
  /**
   * 行操作列
   */
  rowOperate?: VisibleColumn,
  /**
   * 设置表的可见列
   */
  visibleColumns?: VisibleColumn[] | string[],
  /**
   * 是否为层次树显示
   */
  isTree?: boolean,
  /**
   * 是否为层次树显示
   */
  treeColumnName?: string,
  /**
   * 是否树的全部数据
   */
  IsTreeAllData?: boolean,
  /**
   * 是否显示分页
   */
  isPagination?: boolean,
  /**
   * 表格为单选时，选择项变化事件
   */
  onSelectChange?: (row: any, preRow: object, id: string) => void,
  /**
   * 表格值修改后事件
   */
  onEditValueChange?: (list: object[], changes: []) => void,
  /**
   *分页事件
   */
  onPageChange?: (page: number, pageSize: number) => void,
  /**
   * 是否多选
   */
  isCheck?: boolean,
  /**
   * id字段
   */
  idField?: string,
  /**
   * 是否使用服务器返回列
   */
  useServerColumn?: boolean,
  /**
   * 处理服务器返回列
   * @param cols
   */
  onServerColumn?: (cols: []) => [],
  /**
   * 允许排序
   */
  allowSort?: boolean,
  /**
   * 刷新后回调
   */
  onAfterRefresh?: () => void,
  /**
   * 导出名称
   */
  exportName?: string,
  /**
   * 默认页数
   */
  page?: number,
  /**
   * 分页面
   */
  pageSize?: number,
  /**
   * 内容自动换行
   */
  autoWrap?: boolean,
  /**
   * 搜索字段列表
   */
  searchFields?: string[],
}
export default class XTableBase<P={},S={}> extends XBaseDisplay<XTableBaseProps&P,any> {

  static TableButtons = {
    filter: 'filter',
    import: 'import',
    export: 'export',
    refresh: 'refresh',
    setting: 'setting',
    fullScreen: 'fullScreen'
  }
  static TotalMode = {
    none: "none", count: "count", sum: 'sum', avg: 'avg', max: 'max', min: 'min'
  }
  static ShowType = {table: 'table', grid: 'grid', list: 'list', custom: 'custom',};

  static EditMode = {none: "none", show: 'show',}

  static ColumnType = {
    string: 'string', number: 'number', date: 'date', switch:"switch",check:"check",radio:"radio",  select: 'select', tree: 'tree',custom: 'custom', none: 'none',
  }

  static defaultProps = {
    ...XBaseDisplay.defaultProps,
    queryForm: undefined,
    extraButtons: undefined,
    showColumnFilter: true,
    showButtons: true,
    showSearch: true,
    visibleColumns: [],
    isTree: false,
    IsTreeAllData: false,
    isPagination: true,
    onSelectChange: undefined,
    isMultiSelect: false,
    idField: "id",
    useServerColumn: false,
    onServerColumn: false,
    allowSort: true,
    onAfterRefresh: undefined,
    rootValue: "0",
    page: 1,
    pageSize: 30,
    autoWrap: false,
    searchFields: undefined,
  }

  constructor(props) {
    super(props)
    this.useStateData=true;
    let data=[];
    if(this.props.data){
      data = this.props.data;
    }
    let pagination = undefined;
    let allowSort:boolean = this.props.allowSort;
    if(!this.props.isTree){
      pagination = this.initPagination();
    }else{
      allowSort = false;
    }
    this.state = {
      ...this.state,
      data:data,
      fullScreen: false,
      showSearch: false,
      filterData: undefined,
      allKeyRows:{},
      pipelineState: {},
      selectedRowKeys: [],
      expandedRowKeys: [],
      pagination :pagination,
      allowSort:allowSort,
      sorts:[],
      // allowSelect: this.props.onSelectChange ? true : false,
      allowSelect: true,
      columns:[],
    }
    this.allColumns=[];
    this.SetColumns(this.props.visibleColumns, true);
  }

  allColumns:any;
  initPagination() {
    const pagination:any = {};
    pagination.current = this.props.page;
    pagination.pageSize = this.props.pageSize;
    pagination.showTotal = (total) => `共${total}项`;
    pagination.showSizeChanger = false;
    pagination.onChange = (page, pageSize) => {
      this.state.pagination.current = page;
      this.state.pagination.pageSize = pageSize;
      this.Refresh();
      this.props.onPageChange?.(page, pageSize);
    }
    pagination.onShowSizeChange = (current, size) => {
      this.state.pagination.pageSize = size;
      this.Refresh();
    };
    return pagination;
  }

  SetPagination(page,size){
    if (this.state.pagination) {
      if(page){
        this.state.pagination.current = page;
      }
      if(size){
        this.state.pagination.pageSize=size;
      }
    }
  }

  ClearData() {
    // @ts-ignore
    this.state.filterData = undefined;
    // @ts-ignore
    this.state.data=[];
    this.setState({
      loading: false,
      data: [],
      pagination: {},
      filterData:{},
    });
  }

  setAllKeyRows(data) {
    data && data.map((r, index) => {
      this.state.allKeyRows[r[this.props.idField]] = r;
      if (this.props.isTree) {
        this.setAllKeyRows(r.children);
      }
    });
  }

  GetAllKeyRows() {
    return this.state.allKeyRows;
  }

  GetSelectRow() {
    return this.GetSelectedRow();
  }
  SetSelectRow(row) {
    return this.SetSelectedRow(row);
  }

  GetSelectedRow() {
    return undefined;
  }
  SetSelectedRow(row) {
    this.setState({selectedRow: row})
  }
  GetSelectedRows() {
    return [];
  }
  GetSelectedRowKeys() {
    return [];
  }

  SetExpandedRowKeys(expandedRowKeys = []) {
    return this.setState({expandedRowKeys: expandedRowKeys});
  }

  GetExpandedRowKeys() {
    return this.state.expandedRowKeys ? this.state.expandedRowKeys : [];
  }

  ClearSelectedRowKeys() {
    this.SetSelectedRowKeys([]);
  }

  SetSelectedRowKeys(rowKeys) {
    // @ts-ignore
    this.state.selectedRowKeys = rowKeys;
    this.setState({selectedRowKeys: this.state.selectedRowKeys});
  }

  GetRow(id?: string) {
    return this.state.allKeyRows[id];
  }

  RefreshToFirst(filter?: object) {
    if (this.state.pagination) {
      this.state.pagination.current = 1;
    }
    this.Refresh(filter);
  }

  ClearFilter() {
    this.state.filterData = undefined;
    this.Refresh();
  }

  IsEmpty() {
    return XTools.isEmptyObject(this.state.data);
  }

  GetAllColumns() {
    return this.allColumns;
  }

  GetColumns() {
    return this.state.columns;
  }

  GetColumn(field: string, cols = this.allColumns) {
    for (let j = 0; j < cols.length; j++) {
      let col = cols[j];
      if (col.field === field) {
        return col;
      }
      if (col.children) {
        let ret = this.GetColumn(field, col.children);
        if (ret) {
          return ret;
        }
      }
    }
    return undefined;
  }

  RemoveColumn(field: string) {
    for (let j = this.allColumns.length - 1; j >= 0; j--) {
      let col = this.allColumns[j];
      if (col.field === field) {
        this.allColumns.splice(j, 1);
      }
    }
    this.SetVisibleColumns(this.allColumns);
    this.ResetColumns();
  }

  AddColumn(field, index = undefined) {
    let fieldCol = this.formatColumn(field);
    for (let j = this.allColumns.length - 1; j >= 0; j--) {
      let col = this.allColumns[j];
      if (col.field === fieldCol.field) {
        this.allColumns.splice(j, 1);
      }
    }
    if (index >= 0 && index < this.allColumns.length) {
      this.allColumns.splice(index, 0, fieldCol);
    } else {
      this.allColumns.push(fieldCol);
    }
    this.SetVisibleColumns(this.allColumns);
    this.ResetColumns();
  }

  ResetColumns(cols?:[]){
    if (cols) {
      this.SetColumns(cols, true);
    }
    this.setState({columns: this.state.columns,})
  }

  // 设置Table列，isnew为false是，合并列
  SetColumns(cols?: any[], isnew?: boolean) {
    if (isnew === undefined) {
      isnew = this.props.useServerColumn;
    }
    let allcolumns = [];
    let haschange = false;
    if (isnew && cols) {
      allcolumns = cols;
      haschange = true;
    } else if (cols) {   //合并到原来的列中
      allcolumns = allcolumns.concat(this.allColumns);
      for (let j = 0; j < cols.length; j++) {
        let col = cols[j];
        let field = col;
        if (typeof col === "object" && col.field) {
          field = col.field;
        }
        if (col.enableEdit == undefined) {
          col.enableEdit = false;
        }
        let precol = this.GetColumn(field);
        if (typeof field === "string") {
          if (precol) {
            if (![XTableBase.ColumnType.switch, XTableBase.ColumnType.check, XTableBase.ColumnType.radio,
              XTableBase.ColumnType.select, XTableBase.ColumnType.tree].includes(precol.type)) {
              precol.type = col.type ? col.type : precol.type;
            }
            precol.foreignKey = col.foreignKey ? col.foreignKey : precol.foreignKey;
          } else {
            allcolumns.push(col);
            if (typeof col === "object" && typeof col.visible === "undefined") {
              col.visible = false;
            }
            haschange = true;
          }
        }
      }
    }
    if (!haschange) {
      return;
    }
    this.allColumns = [];
    this.state.keyword = "";
    if (this.props.searchFields?.length > 0) {
      this.state.KeywordFields = this.props.searchFields;
    } else {
      this.state.KeywordFields = [];
    }
    let _colMap = {};
    for (let i = 0; i < allcolumns.length; i += 1) {
      const col = this.formatColumn(allcolumns[i]);
      if (col.keyword && this.state.KeywordFields.indexOf(col.field) == -1) {
        this.state.KeywordFields.push(col.field);
      }
      this.allColumns.push(col);
      _colMap[col.field] = col;
    }
    for (let i = this.state.KeywordFields.length - 1; i >= 0; i--) {
      let field = this.state.KeywordFields[i];
      let col = _colMap[field];
      if (col) {
        if (this.state.keyword) {
          this.state.keyword += " ";
        }
        this.state.keyword += col.title;
      } else {
        this.state.KeywordFields.splice(i, 1);
      }
    }
    if (this.props.rowOperate && !this.GetColumn(this.props.rowOperate.field)) {
      if (this.props.rowOperate.visible === undefined) {
        this.props.rowOperate.visible = true;
        this.props.rowOperate.IsTreeLeaf = 1;
        this.props.rowOperate.lock = true;
        this.props.rowOperate.type = XTableBase.ColumnType.none;
      }
      this.props.rowOperate.sorter = false;
      this.allColumns.push(this.props.rowOperate);
    }
    this.SetVisibleColumns(this.allColumns);
  }

  SetVisibleColumns(columns: any[]) {
    this.state.columns = [];
    for (let i = 0; i < columns.length; i += 1) {
      const column = columns[i];
      column.index = i;
      if (column.visible) {// 深拷贝
        if (column.align === undefined) {// 设置居中显示
          if (this.props.isTree) {
            if (column.index !== 0) {
              column.align = "center";
            } else {
              column.align = "left";
            }
          } else {
            column.align = "center";
          }
        }
        const c: any = {};
        XTools.CopyToObject(column, c);
        if (c.children) {
          c.children = [];
          for (let j = 0; j < column.children.length; j += 1) {
            if (column.children[j].visible) {
              c.children.push(column.children[j]);
            }
          }
        }
        this.state.columns.push(c);
      }
    }
    return this.state.columns;
  }

  formatColumn(col) {
    let obj = col;
    if (typeof (col) === "string") {
      obj = {
        id: col,
        title: col,
        field: col,
        code: col,
        name: col,
        header: col,
        key: col,
        type: XTableBase.ColumnType.string,
        mode: XTableBase.EditMode.none,
        align: undefined,
        getEditProps: undefined,
        totalMode: XTableBase.TotalMode.none,
        visible: true,
        IsTreeLeaf: 1,
        lock: false,
        sorter: this.props.allowSort,
      };
    }
    if (obj.field === undefined && obj.title) {
      obj.field = obj.title;
    } else if (obj.title === undefined && obj.field) {
      obj.title = obj.field;
    }
    if (obj.sorter === undefined && this.props.allowSort) {
      obj.sorter = true;
    }
    obj.id = obj.field;
    if (obj.field !== undefined) {
      obj.code = obj.field;
    }
    if (obj.title !== undefined) {
      obj.name = obj.title;
    }
    if (!obj.features) {
      obj.features = {sortable: obj.sorter};// 可以排序
    }
    if (!obj.type) {
      obj.type = XTableBase.ColumnType.string;
    }
    if (obj.visible || obj.visible === undefined) {
      obj.visible = true;
    }
    if (obj.width === undefined) {
      obj.width = 120;
    }
    if (!obj.totalMode) {
      obj.totalMode = XTableBase.TotalMode.none;
    }
    if (obj.showFilter == undefined) {
      obj.showFilter = this.props.showColumnFilter;
    }
    if (obj.totalMode && obj.totalMode !== XTableBase.TotalMode.none && !obj.summaryRender) {
      obj.summaryRender = (map) => {
        let value = "";
        if (col.totalMode === XTableBase.TotalMode.count) {
          value = map.cnt;
        } else if (col.totalMode === XTableBase.TotalMode.sum) {
          value = map.sum;
        } else if (col.totalMode === XTableBase.TotalMode.avg) {
          value = map.avg;
        } else if (col.totalMode === XTableBase.TotalMode.max) {
          value = map.max;
        } else if (col.totalMode === XTableBase.TotalMode.min) {
          value = map.min;
        }
        return <XText ref={(e) => obj.totalContentRef = e} value={value} showLabel={false} textAlign={"center"}/>;
      };
    }
    obj.IsTreeLeaf = 1;
    if (obj.children && obj.children.length > 0) {
      obj.IsTreeLeaf = 0;
      for (let j = 0; j < obj.children.length; j += 1) {
        obj.children[j] = this.formatColumn(obj.children[j]);
        obj.children[j].parent = obj;
      }
    }
    obj.header=obj.title;
    obj.sortable=obj.sorter;
    obj.editor="text";
    return obj;
  }

  SetTotalValue(field, value) {

  }

  ExpandedAll(){
    // @ts-ignore
    this.state.expandedRowKeys = [];
    for (const i in this.state.allKeyRows) {
      const r = this.state.allKeyRows[i];
      if (!r.IsTreeLeaf) {
        this.state.expandedRowKeys.push(r[this.props.idField]);
      }
    }
    this.setState({expandedRowKeys: this.state.expandedRowKeys,})
  }

  UnExpandedAll(){
    // @ts-ignore
    this.state.expandedRowKeys=[];
    this.setState({expandedRowKeys: this.state.expandedRowKeys,})
  }

  async Refresh(filter?: any, isnew?: boolean) {
    if (!this.props.dataSourceUrl) {
      return;
    }
    if (isnew) {
      this.state.filterData = filter;
      if (this.state.pagination) {
        this.state.pagination.current = 1;
      }
    } else {
      this.state.filterData = {
        ...this.state.filterData,
        ...filter
      };
    }
    // const filterData = (filter && isnew) || (!XTools.isEmptyObject(this.state.filterData) && this.state.filterData) || this.props.filterData
    // if (this.props.mustHasFilter && XTools.isEmptyObject(filterData)) {
    //   return;
    // }
    if (this.props.mustHasFilter && XTools.isEmptyObject(this.props.filterData) && XTools.isEmptyObject(this.state.filterData)) {
      return;
    }

    if (this.props.isTree) {
      this.state.filterData.IsTree = true;

      if (!filter) {
        if (XTools.isEmptyObject(this.state.data)) {
          // @ts-ignore
          this.state.allKeyRows = {};
          // @ts-ignore
          this.state.expandedRowKeys = [];
        }
        if (XTools.isNotEmptyObject(this.state.data) && XTools.isNotEmptyObject(this.state.expandedRowKeys)) {
          this.state.filterData.Parentids = this.state.expandedRowKeys;
          // this.state.filterData.Parentids = ["0", ...this.state.expandedRowKeys];
        }
      } else {
        if (filter.Parentids && filter.Parentids.length > 0) {
          const newParentids = [];
          if (filter.Parentids.length == 1 && filter.Parentids[0] === "0") {
            this.state.expandedRowKeys = [];
          } else {
            for (let i = 0; i < filter.Parentids.length; i += 1) {
              if (filter.Parentids[i]) {
                newParentids.push(filter.Parentids[i]);
                XArray.arrayAddKey(this.state.expandedRowKeys, filter.Parentids[i]);
              }
            }
          }
          this.state.filterData.Parentids = newParentids;
        }
        if (XTools.isEmptyObject(filter.Parentids)||isnew) {  // 代表一颗新树
          this.state.data=[];
          this.state.allKeyRows = {};
          this.state.expandedRowKeys = [];
          // delete this.state.filterData.Parentids;
        }

      }
      let propsFilterData:any =this.props.filterData;
      if (propsFilterData&& propsFilterData.Parentids && propsFilterData.Parentids.length > 0) {
        for (let i = 0; i < propsFilterData.Parentids.length; i += 1) {
          XArray.arrayAddKey(this.state.expandedRowKeys, propsFilterData.Parentids[i]);
        }
      }
      await this.RefreshTree();
    } else {
      this.state.filterData.IsTable = true;
      await this.RefreshTable();
    }
  }

  async RefreshTable() {
    if(this.state.selectedRowKeys&&this.state.selectedRowKeys.length>0) {
      if (this.state.selectedRowKeys.indexOf(this.props.idField) != -1) {//全选时
        // @ts-ignore
        this.state.selectedRowKeys=[];           //撤销全选
      }
    }
    this.setState({loading: true, data:[]});
    this.state.filterData.IsTable=true;
    const postData = {
      ...this.props.filterData,
      ...this.state.filterData,
    };
    if (this.state.allowSort) {
      let orderby = "";
      for (let i = 0; i < this.state.sorts.length; i += 1) {
        const st = this.state.sorts[i];
        orderby += `${st.code} ${st.order}`
        if (i < this.state.sorts.length - 1) {
          orderby += ",";
        }
      }
      if (orderby) {
        postData.orderBy = orderby;
      }
    }
    if (this.props.isPagination && this.state.pagination) {
      this.state.pagination.current = this.state.pagination.current ? this.state.pagination.current : this.props.page;
      this.state.pagination.pageSize = this.state.pagination.pageSize ? this.state.pagination.pageSize : this.props.pageSize;
      postData.pageSize = this.state.pagination.pageSize;
      postData.pageIndex = (this.state.pagination.current - 1) * this.state.pagination.pageSize;
    }
    let totalMode = {};
    let allColumns = this.GetColumns();
    for (let i = 0; i < allColumns.length; i += 1) {
      const col = allColumns[i];
      if (col.totalMode !== XTableBase.TotalMode.none) {
        totalMode[col.field] = col.totalMode;
      }
    }
    if (XTools.isNotEmptyObject(totalMode)) {
      postData.totalMode = JSON.stringify(totalMode);
    }
    if (this.props.onSelectChange && !this.props.isCheck) {
      if (this.props.onSelectChange) {
        this.props.onSelectChange(undefined, this.state.selectRow, this.state.selectRow?.id);
      }
      // @ts-ignore
      this.state.selectRow = undefined;
    }
    const retData = await this.RequestServerPost(this.props.dataSourceUrl, postData, false);
    if (retData.Success && retData.Value) {
      const {rows} = retData.Value;
      if (rows.length === 0 && this.state.pagination && this.state.pagination.current > 1) {// 大于第1页,且没有数据
        const size = retData.Value.total % postData.pageSize;
        let current = (retData.Value.total - size) / postData.pageSize;
        if (size > 0) {
          current++;
        }
        if (current == 0) {
          current = 1;
        }
        this.state.pagination.current = current;
        await this.RefreshTable();// 重新刷新
        return;
      }
      for (const i in rows) {
        const row = rows[i];
        this.state.allKeyRows[row.id] = row;
      }
      // 界面显示不出来？？
      // if (this.props.onSelectChange && !this.props.isMultiSelect) {
      //   if (rows.length > 0) {
      //     if (this.props.onSelectChange) {
      //       this.props.onSelectChange(rows[0], this.state.selectRow);
      //     }
      //     this.state.selectRow = rows[0];
      //   }
      // }
      if (this.state.pagination) {
        this.state.pagination.total = retData.Value.total || 0;
      }
      if (retData.Value.columns && retData.Value.columns.length > 0) {
        if (typeof this.props.onServerColumn === "function") {
          let scols = this.props.onServerColumn(retData.Value.columns);
          if (!scols) {
            scols = retData.Value.columns;
          }
          this.SetColumns(scols);
          this.updateSetting();
        } else {
          this.SetColumns(retData.Value.columns);
          this.updateSetting();
        }
      }
      this.setState({
        loading: false,
        data: rows,
        pagination: this.state.pagination,
        columns: this.state.columns,
      });

      if (retData.Value.totalResult) {
        for (const f in retData.Value.totalResult) {
          this.SetTotalValue(f, retData.Value.totalResult[f]);
        }
      }
      this.afterRefresh();
    } else {
      this.setState({loading: false,});
      message.error(retData.Message);
    }
  }

  afterRefresh(){
    if (this.props.onAfterRefresh) {
      this.props.onAfterRefresh();
    }
  }

  deleteAllChildernKeyRow(row){
    if(row.children&&row.children.length>0){
      for(let j=0;j<row.children.length;j+=1){
        delete this.state.allKeyRows[row.children[j][this.props.idField]];
        this.deleteAllChildernKeyRow(row.children[j]);
      }
    }
  }

  async RefreshTree() {
    this.setState({loading: true});
    this.state.filterData.IsTree=true;
    const postData = {
      ...this.props.filterData,
      ...this.state.filterData,
    };
    if(this.props.IsTreeAllData){
      postData.IsTreeAllData=true;
    }
    const retData = await this.RequestServerPost(this.props.dataSourceUrl, postData, false);
    if (retData.Success && retData.Value) {
      const data = retData.Value.rows;
      if(!this.state.data){
        // @ts-ignore
        this.state.data = [];
      }
      let autoExpandId = "";
      if (this.state.data.length === 0 && data.length === 1){
        autoExpandId = data[0][this.props.idField];
        this.state.expandedRowKeys.push(autoExpandId);
      }
      if(postData.Parentids&&postData.Parentids.length>0) {
        for (let i = 0; i < postData.Parentids.length; i += 1) {
          if (this.state.allKeyRows[postData.Parentids[i]]) {
            const pr = this.state.allKeyRows[postData.Parentids[i]];
            this.deleteAllChildernKeyRow(pr);
            pr.children = [];
          }
        }
      }
      if (data.length === 0) {
        if(postData.Parentids&&postData.Parentids.length>0){
          for(let i=0;i<postData.Parentids.length;i+=1){
            const pid = postData.Parentids[i];
            if (this.state.allKeyRows[pid]) {
              this.state.allKeyRows[pid].IsTreeLeaf = 1;
              delete this.state.allKeyRows[pid].children;
            }
          }
        }else{
          // @ts-ignore
          this.state.data = data;
          // @ts-ignore
          this.state.allKeyRows={};
        }
      }else {
        const newkeyrows = {};
        const deleterows = [];
        for (let i = 0; i < data.length; i += 1) {
          const r = data[i];
          if (!this.state.allKeyRows[r[this.props.idField]]) {
            newkeyrows[r[this.props.idField]] = r;
          }
          for (let j = 0; j < data.length; j += 1) {
            const p = data[j];
            if (p.id === r.Parentid) {
              r.parent = p;
              if (!p.children) {
                p.children = [];
              }
              p.IsTreeLeaf = 0;
              p.children.push(r);
              deleterows.push(r);
              break;
            }
          }
        }
        for (let i = 0; i < deleterows.length; i += 1) {
          const index = data.indexOf(deleterows[i]);
          if (index > -1) {
            data.splice(index, 1);
          }
        }

        if (postData.Parentids && postData.Parentids.length > 0) {
          for (let i = 0; i < data.length; i += 1) {
            const did = data[i].id;
            let oldRow = this.state.allKeyRows[did];
            if (oldRow && postData.Parentids.indexOf(oldRow.Parentid) >= 0) {//调整序号
              let list = this.state.data;
              if (oldRow.parent) {
                list = oldRow.parent.children;
              }
              list.splice(0, list.length);//全部清空
            }
          }
          for (let i = 0; i < data.length; i += 1) {
            const did = data[i].id;
            let oldRow = this.state.allKeyRows[did];
            if (oldRow) {
              XTools.CopyToObject(data[i], oldRow);//合并对象
              let deleteKeys = [];
              for(const _key in oldRow){
                if(!(_key in data[i]) && _key !== "children" && _key !== "IsTreeLeaf" && _key !== "parent"){
                  deleteKeys.push(_key);
                }
              }
              deleteKeys.forEach((_key)=>{
                delete oldRow[_key];
              });
              if (oldRow.children === undefined || oldRow.children.length == 0) {
                if (oldRow.Parentid !== "0") {
                  oldRow.IsTreeLeaf = 1;
                }
              } else {
                oldRow.children.forEach((item) => {
                  item.parent = oldRow;
                })
              }
              if (postData.Parentids.indexOf(oldRow.Parentid) >= 0) {//调整序号
                let list = this.state.data;
                if (oldRow.parent) {
                  list = oldRow.parent.children;
                }
                if (list) {
                  list.push(oldRow);
                }
              }
            } else {
              const pid = data[i].Parentid;
              if (this.state.allKeyRows[pid]) {
                const prow = this.state.allKeyRows[pid];
                if (!prow.children) {
                  prow.children = [];
                }
                data[i].parent = prow;
                prow.IsTreeLeaf = 0;
                prow.children.push(data[i]);
                XArray.arrayAddKey(this.state.expandedRowKeys, pid);
              } else {
                this.state.data.push(data[i]);
              }
            }
          }
        } else {
          // @ts-ignore
          this.state.data = data;//刷新全部
          // @ts-ignore
          this.state.allKeyRows = {};
          this.setAllKeyRows(data);
        }

        XTools.CopyToObject(newkeyrows, this.state.allKeyRows);
      }
      if (retData.Value.columns && retData.Value.columns.length > 0) {
        if (typeof this.props.onServerColumn === "function") {
          let scols = this.props.onServerColumn(retData.Value.columns);
          if (!scols) {
            scols = retData.Value.columns;
          }
          this.SetColumns(scols);
          this.updateSetting();
        } else {
          this.SetColumns(retData.Value.columns)
          this.updateSetting();
        }
      }
      this.setState({
        loading: false,
        data: this.state.data,
        columns:this.state.columns,
        pagination: false,
        expandedRowKeys: this.state.expandedRowKeys,
      });
      this.afterRefresh();
      if (autoExpandId){
        this.Refresh({Parentids:[autoExpandId]});
      }
    } else {
      XMessage.ShowError(retData.Message);
    }
  }

  updateSetting(){
  }

  handleTableExpand (expanded, record) {
    const {expandedRowKeys} = this.state;
    const key = record.id;
    const index = expandedRowKeys.indexOf(key);
    if (expanded) {
      if (index === -1) {
        expandedRowKeys.push(key);
      }
      if (record.children && record.children.length > 0) {
        this.setState({expandedRowKeys});
      } else {

        this.Refresh({Parentids:[record.id]});
      }
    } else {
      if (index !== -1) {
        expandedRowKeys.splice(index, 1);
      }
      this.setState({expandedRowKeys});
    }
  }

  GetTreeDataList(data = this.GetData(), list = []) {
    data?.forEach(item => {
      let _item = {...item};
      // @ts-ignore
      delete _item.parent;
      // @ts-ignore
      delete _item.children;
      // @ts-ignore
      delete _item._children;
      list.push(_item);
      if (item.children) {
        this.GetTreeDataList(item.children, list);
      }
    });
    return list;
  }

  SetTreeDataList(list) {
    let map = {};
    let data = [];
    list.forEach(item => {
      map[item.id] = item;
      item.IsTreeLeaf = 1;
      data.push(item);
    });
    list.forEach(item => {
      if (item.Parentid && map[item.Parentid]) {
        let parent = map[item.Parentid];
        parent.IsTreeLeaf = 0;
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(item);
        item.parent = parent;
        let index = data.indexOf(item);
        data.splice(index, 1);
      }
    });
    this.SetData(data);
  }
}


