import React from 'react';
import ReactDOMClient, {Root} from 'react-dom/client';
import XFlex from "../layout/XFlex";
import XDateTime from "../editor/XDateTime";
import XInput from "../editor/XInput";
import XInputNum from "../editor/XInputNum";
import XFilterView from "./table/XFilterView";
import XMessage from "./XMessage";
import TuiGrid from "./table/TuiGrid";
import XTableBase, {VisibleColumn} from "./table/XTableBase";
import XTableColumn, {XTableColumnProps} from "./table/XTableColumn";
import XTools from "../toolkit/XTools";
import XArray from "../toolkit/XArray";
import XString from "../toolkit/XString";
import XGrid from '../layout/XGrid';
import XCheckGroup from "../editor/XCheckGroup";
import XRadioGroup from "../editor/XRadioGroup";
import XSelectList from "../editor/XSelectList";
import XSelectTree from "../editor/XSelectTree";
import XSwitch from "../editor/XSwitch";
import XText from "../editor/XText";
import cloneDeep from "lodash/cloneDeep";

let hasInitGridStyle = false;

export interface XTableGridProps extends XTableColumnProps {
  /**
   * 多选选中事件
   * id为undefined时，是全选或反选操作
   */
  onCheckChange?: (id: string | undefined, checked: boolean) => void,
  /**
   * 拖拽结束回调
   */
  onDragEnd?: () => void,
  /**
   * 双击事件
   */
  onClick?: (row: object, ev: object, table: XTableGrid) => void,
  /**
   * 双击事件
   */
  onDoubleClick?: (row: object, ev: object, table: XTableGrid) => void,
  /**
   * 合并列
   */
  rowSpanColumns?: string[],
  /**
   * 是否允许拖拽
   */
  draggable?: boolean,
  /**
   * 表格汇总对象
   */
  summary?: object,
  /**
   * 标题合并对象
   */
  header?: object,
  /**
   * 自动保存到服务器
   */
  autoSave?: boolean,
  /**
   * 显示排序
   */
  showOrder?: boolean,
  /**
   * 是否多选
   */
  isCheck?: boolean,
  /**
   * 是否启用表格编辑
   */
  enableEdit?: boolean,
  /**
   * 是否允许拖拽选择
   */
  useDragSelect?: boolean,
  /**
   * 显示树图标
   */
  useTreeIcon?: boolean,
  /**
   * 最小列宽度
   */
  minColumnWidth?: number,
  /**
   * 最小行高度
   */
  minRowHeight?: number,
  /**
   * 是否自动聚焦
   */
  autoFocus?: boolean,
  /**
   * 设置表的可见列
   */
  visibleColumns?: VisibleColumn[] | string[],
  /**
   * 表格右键菜单
   */
  contextMenu?: (params: { rowKey: string; columnName: string }) => MenuItem[][],
  /**
   * 单元格编辑时，事件响应方式
   */
  editingEvent?: "click" | "dblclick"
}

export interface MenuItem {
  name: string | "separator" | "copy" | "copyColumns" | "copyRows" | "export" | "csvExport" | "excelExport",
  label?: string,
  action?: (() => void) | "copy" | "copyColumns" | "copyRows" | "export" | "csvExport" | "excelExport",
}

/**
 * 通过一个URL接口，可以实现一个数据库表的增删改查，仿Excel操作的功能强大的表格组件
 * @name 表格
 * @groupName 列表
 */
export default class XTableGrid extends XTableColumn<XTableGridProps, any> {
  static ComponentName = "表格";
  static defaultContextMenu: MenuItem[] = [{name: 'copy', label: "复制", action: 'copy',},
    {name: 'copyColumns', label: "复制列", action: 'copyColumns',},
    {name: 'copyRows', label: "复制行", action: 'copyRows',},];

  static defaultProps = {
    ...XTableColumn.defaultProps,
    extraButtons: undefined,
    extraMessage: undefined,
    showButtons: true,
    showSearch: true,
    showOrder: undefined,
    showTotal: false,
    visibleColumns: [],
    isTree: false,
    isCheck: false,
    autoSave: true,
    onEditValueChange: undefined,
    exportName: undefined,
    autoWidth: true,
    columnsAutoFit: true,
    onCheckChange: undefined,
    onDragEnd: undefined,
    rowSpanColumns: [],
    draggable: false,
    summary: undefined,
    header: undefined,
    enableEdit: true,
    useTreeIcon: true,
    minColumnWidth: 100,
    minRowHeight: 40,
    autoFocus: true,
    useDragSelect: true,
    contextMenu: undefined,
    editingEvent: "dblclick",
    treeColumnName: "",
  }
  grid: any;

  constructor(props) {
    super(props)
    this.state.filterConds = [];
    this.state.showOrder = this.props.showOrder;
    if (this.props.isTree) {
      if (this.props.treeColumnName) {
        this.state.treeColumnName = this.props.treeColumnName;
      } else {
        if (this.state.columns && this.state.columns.length > 0) {
          this.state.treeColumnName = this.state.columns[0].field;
        }
      }

      if (this.state.showOrder === undefined) {
        this.state.showOrder = false;
      }
    } else {
      if (this.state.showOrder === undefined) {
        this.state.showOrder = true;
      }
    }
  }

  onWindowResize: any;
  onModalColse: any;

  componentWillUnmount() {
    super.componentWillUnmount();
    window.removeEventListener('resize', this.onWindowResize)
    window.removeEventListener('modalColse', this.onModalColse)
  }

  saveAndFinishEditing: any;

  /**
   * 保存编辑框
   */
  async FinishEditing(event) {
    if (this.saveAndFinishEditing) {
      let callback = undefined;
      if (event && event.detail) {
        event.detail.save = true;
        callback = event.detail.callback;
      }
      await this.saveAndFinishEditing();
      callback && callback();
    }
  }

  Resize() {
    if (this.parentDiv) {
      function isParentVisible(div: HTMLElement) {
        let ret = true;
        if (div) {
          if (div.nodeName == "BODY") {
            return true;
          } else if (div.style.display == "none") {
            ret = false;
          } else {
            return isParentVisible(div.parentElement);
          }
        } else {
          ret = false;
        }
        return ret;
      }

      let visible = isParentVisible(this.parentDiv);
      if (!visible) {
        this.setState({tableHeight: undefined});
        return;
      }
      let {offsetWidth} = this.parentDiv;
      let {offsetHeight} = this.parentDiv;
      if (this.parentDiv.children.length > 0) {
        this.parentDiv.children[0].style.display = '';
      }
      if (this.grid && offsetWidth > 0 && offsetHeight > 0) {
        this.grid.gridInst.setHeight(offsetHeight - 2);
        this.grid.gridInst.setWidth(offsetWidth - 2);
        this.setState({tableHeight: offsetWidth - 2, tableWidth: offsetHeight - 2}, () => {
          if (this.grid) {
            let ids = this.GetCheckedRowKeys();
            let focusedCell = this.grid.gridInst.getFocusedCell();
            this.grid.gridInst.resetData(this.state.data, this.getGridOption());
            if (focusedCell && focusedCell.rowKey) {
              let row = this.GetRow(focusedCell.rowKey);
              if (row) {
                this.grid.gridInst.off('focusChange', this.onFocusChange);
                this.focus(focusedCell.rowKey, focusedCell.columnName, false);
                this.grid.gridInst.on('focusChange', this.onFocusChange);
                this.onFocusChange({prevRowKey: focusedCell.rowKey, rowKey: focusedCell.rowKey,});
              }
            }
            this.SetCheckStateRowKeys(ids, true);
          }
        });
      }
    }
  }

  async componentDidMount() {
    await super.componentDidMount();
    this.onWindowResize = this.Resize.bind(this);// resize事件
    window.addEventListener('resize', this.onWindowResize);
    this.onModalColse = this.FinishEditing.bind(this);
    window.addEventListener('modalColse', this.onModalColse);

    if (this.state.data.length > 0) {
      this.SetData(this.state.data);
    } else if (this.props.dataSourceUrl) {
      this.Refresh();
    }
  }


  GetRealRecord(id?: string, record?: object) {
    if (id) {
      if (this.grid?.gridInst) {
        const obj = this.grid?.gridInst?.getRow(id)
        if (obj) {
          return obj;
        }
      } else {
        for (let i = 0; i < this.state.data.length; i++) {
          if (this.state.data[i].id == id) {
            return this.state.data;
          }
        }
      }
    }
    return record;
  }

  onSelection = (ev) => {
    if (this.props.useDragSelect) {
      let ids = [];// @ts-ignore
      if (window.event && window.event.ctrlKey) {
        ids = this.GetCheckedRowKeys();
      }
      for (let i = ev.range.row[0]; i <= ev.range.row[1]; i++) {
        let rs = this.grid.gridInst.getRowAt(i);
        if (rs&&ids.indexOf(rs.id) == -1) {
          ids.push(rs.id);
        }
      }
      this.SetCheckStateRowKeys(ids, true, true);
    }
  }

  onFocusChange = (ev) => {
    let pre = this.grid.gridInst.getRow(ev.prevRowKey);
    let r = this.grid.gridInst.getRow(ev.rowKey);
    if (r && ev.prevRowKey != ev.rowKey) {
      this.props.onSelectChange && this.props.onSelectChange(r, pre, r.id);
    }
    if (this.props.useDragSelect) {// @ts-ignore
      let ctrlKey = window.event && window.event.ctrlKey;
      let ids = [];
      if (ctrlKey) {
        ids = this.GetCheckedRowKeys();
      }
      let index = ids.indexOf(r.id);
      if (index == -1) {
        ids.push(r.id);
      } else if (ctrlKey) {
        ids.splice(index, 1);
      }
      this.SetCheckStateRowKeys(ids, true, true);
    }
    let col = this.grid.gridInst.getColumn(ev.columnName);
    if (col && !col.enableFocus) {
      ev.stop();
    }
  }

  onBeforeChange = async ev => {
    if (ev.origin == "paste") {//复制
      for (let i = 0; i < ev.changes.length; i++) {
        let item = ev.changes[i];
        let column = this.GetColumn(item.columnName, this.state.columns);
        if (column) {
          if (!column.enableEdit || !column.enableCopy) {
            ev.stop();
            // XMessage.ShowError(<>{column.header}不能修改</>);
            return;
          }
          let row = this.grid.gridInst.getRow(item.rowKey);
          if (column.enableEditFun && !column.enableEditFun(row)) {
            ev.stop();
            return;
          }
        }
      }
    }
    let url = this.props.dataSourceUrl;
    const preurl = XString.split(url, "/")[0];
    if (ev.changes && ev.changes.length > 0) {
      if (ev.origin === "cell" || ev.origin === "paste" || ev.origin === "delete") {
        let p = [];
        for (const i in ev.changes) {
          let c = ev.changes[i];
          let row = this.grid.gridInst.getRow(c.rowKey);
          let pr: any = {id: row.id};
          pr[c.columnName] = c.nextValue;
          pr.columnField = c.columnName;
          let column = this.GetColumn(c.columnName, this.state.columns);
          if (!column) {
            continue;
          }
          if (XString.endsWith(column.name, "id") || XString.endsWith(column.name, "ids")) {
            continue;
          }
          if (!column.enableEdit) {
            continue;
          }
          if (column.enableEditFun && !column.enableEditFun(row)) {
            continue;
          }
          if (column.customSave) {
            let ret = await column.customSave(column, c.nextValue, row);
            if (ret === false) {
              ev.stop();
            }
            continue;
          }
          if (column.foreignKey) {
            let fk = column.foreignKey;
            pr[fk] = row[fk];
            pr.foreignKey = fk;
            pr.originField = column.originField;
          }
          p.push(pr);
        }
        if (XArray.isEmpty(p)) {
          return;
        }
        if (this.props.autoSave && preurl) {
          const saveurl = preurl + "/savevalues";
          const r = await this.RequestServerPost(saveurl, {values: JSON.stringify(p)});
          if (!r.Success) {
            ev.stop();
          } else {
            for (const i in r.Value) {
              let cr = r.Value[i];
              let row = this.grid.gridInst.getRow(cr.id);
              let column = this.GetColumn(cr.columnField, this.state.columns);
              if (column && column.foreignKey && row) {
                row[column.foreignKey] = cr[column.foreignKey];
                this.grid.gridInst.setValue(cr.id, column.foreignKey, cr[column.foreignKey]);
              }
            }
          }
        }
      }
    }
  }

  enableCheckChange = true;

  SetGridEvent() {
    if (!this.grid.gridInst) {
      return;
    }

    this.grid.gridInst.on('focusChange', this.onFocusChange);

    this.grid.gridInst.on('selection', this.onSelection);

    this.grid.gridInst.on('editingStart', async ev => {
      let column = this.GetColumn(ev.columnName, this.state.columns);
      if (column) {
        if (!column.enableEdit) {
          ev.stop();
        }
        let row = this.grid.gridInst.getRow(ev.rowKey);
        if (column.enableEditFun && !column.enableEditFun(row)) {
          ev.stop();
        }
      }
    });

    this.grid.gridInst.on('click', ev => {
      this.props.onClick && this.props.onClick(this.grid.gridInst.getRow(ev.rowKey), ev, this);
    });

    this.grid.gridInst.on('dblclick', ev => {
      this.props.onDoubleClick && this.props.onDoubleClick(this.grid.gridInst.getRow(ev.rowKey), ev, this);
    });

    this.grid.gridInst.on('check', async ev => {
      this.enableCheckChange && this.props.onCheckChange?.(ev.rowKey, true);
    });
    this.grid.gridInst.on('uncheck', async ev => {
      this.enableCheckChange && this.props.onCheckChange?.(ev.rowKey, false);
    });

    this.grid.gridInst.on('checkAll', async ev => {
      this.enableCheckChange && this.props.onCheckChange?.(undefined, true);
    });

    this.grid.gridInst.on('uncheckAll', async ev => {
      this.enableCheckChange && this.props.onCheckChange?.(undefined, false);
    });

    this.grid.gridInst.on('beforeSort', ev => {
      this.state.sorts = [];
      if (ev.ascending) {
        this.state.sorts.push({code: ev.columnName, order: "asc"});
      } else {
        this.state.sorts.push({code: ev.columnName, order: "desc"});
      }
      this.Refresh();
    });
    this.grid.gridInst.on('beforeUnsort', async ev => {
      if (this.state.sorts?.length > 0) {
        this.state.sorts = [];
        this.Refresh();
      }
    });

    this.grid.gridInst.on('beforeChange', this.onBeforeChange);

    this.grid.gridInst.on('afterChange', async ev => {
      if (this.props.onEditValueChange) {
        let keys = [];
        let list = [];
        ev.changes?.forEach(item => {
          if (keys.indexOf(item.rowKey) == -1) {
            keys.push(item.rowKey)
            list.push(this.grid.gridInst.getRow(item.rowKey));
          }
        });
        await this.props.onEditValueChange(list, ev.changes);
      }
    });

    this.grid.gridInst.on('expand', ev => {
      let r = this.grid.gridInst.getRow(ev.rowKey);
      const {expandedRowKeys} = this.state;
      const key = ev.rowKey;
      const index = expandedRowKeys.indexOf(key);
      if (index === -1) {
        expandedRowKeys.push(key);
      }
      if (r._children && r._children.length == 0 && this.props.dataSourceUrl) {
        this.Refresh({Parentids: [r.id]});
      }
    });

    this.grid.gridInst.on('collapse', ev => {
      let r = this.grid.gridInst.getRow(ev.rowKey);
      const {expandedRowKeys} = this.state;
      const key = ev.rowKey;
      const index = expandedRowKeys.indexOf(key);
      if (index !== -1) {
        expandedRowKeys.splice(index, 1);
      }
    });

    this.grid.gridInst.on('drag', async ev => {

    });
    this.grid.gridInst.on('drop', async ev => {
      // console.log(ev);
      let url = this.props.dataSourceUrl;
      const preurl = XString.split(url, "/")[0];
      if (ev.rowKey !== ev.targetRowKey) {
        if (preurl) {
          const changeurl = preurl + "/moverows";
          const row = this.grid.gridInst.getRow(ev.rowKey);
          const trow = this.grid.gridInst.getRow(ev.targetRowKey);
          let filterData = {...this.props.filterData, ...this.state.filterData,};
          delete filterData.id;
          delete filterData.Parentids;
          const p = {
            isTree: this.props.isTree,
            id: ev.rowKey,
            targetId: ev.targetRowKey,
            appended: ev.appended,
            ...filterData,
          }
          const r = await this.RequestServerPost(changeurl, p);
          if (r.Success) {
            this.props.onDragEnd && this.props.onDragEnd();
            if (this.props.isTree) {
              let pids = [];
              if (ev.appended) {
                XArray.arrayAddKey(this.state.expandedRowKeys, row.Parentid);
                XArray.arrayAddKey(pids, row.Parentid);
                XArray.arrayAddKey(this.state.expandedRowKeys, trow.id);
                XArray.arrayAddKey(pids, trow.id);
                await super.Refresh({Parentids: pids});
              } else {
                XArray.arrayAddKey(this.state.expandedRowKeys, row.Parentid);
                XArray.arrayAddKey(pids, row.Parentid);
                XArray.arrayAddKey(this.state.expandedRowKeys, trow.Parentid);
                XArray.arrayAddKey(pids, trow.Parentid);
                await super.Refresh({Parentids: pids});
              }
            } else {
              super.Refresh();
            }
          } else {
            ev.stop();
          }
        } else {//客户端拖拽
          let data = this.GetData();
          let startIndex = this.grid.gridInst.getIndexOfRow(ev.rowKey);
          let endIndex = this.grid.gridInst.getIndexOfRow(ev.targetRowKey);
          if (startIndex >= 0 && endIndex >= 0 && startIndex != endIndex) {
            let row = data[startIndex];
            if (startIndex < endIndex) {
              endIndex--;
            }
            data.splice(startIndex, 1);//删除
            data.splice(endIndex, 0, row);//追加
            let position = this.grid?.gridInst?.getScrollPosition();
            this.SetData(data);
            position && this.grid?.gridInst?.setScrollPosition(position.scrollLeft, position.scrollTop);
            this.props.onDragEnd && this.props.onDragEnd();
          }
        }
      }
    });
  }

  getGridOption() {
    var options: any = {};
    if (this.state.sorts && this.state.sorts.length > 0) {
      let sortColumn = this.state.sorts[0].code;
      let sortType = this.state.sorts[0].order;
      if (sortColumn !== 'sortKey') {
        options.sortState = {columnName: sortColumn, ascending: sortType === "asc", multiple: false};
      }
    }
    return options;
  }

  /**
   * 添加行
   * @param row
   */
  AddRow(row) {
    this.grid?.gridInst?.appendRow(row);
  }

  /**
   * 删除行
   * @param id
   */
  RemoveRow(id) {
    this.grid?.gridInst?.removeRow(id);
  }

  /**
   * 删除多行
   * @param ids
   */
  RemoveRows(ids) {
    this.grid?.gridInst?.removeRows(ids);
  }

  /**
   * 删除选中行
   */
  RemoveSelectedRows() {
    this.RemoveRows(this.GetSelectedRowKeys());
  }

  /**
   * 获取数据集
   */
  GetData(): any {
    if (this.props.showType == "table") {
      return this.grid?.gridInst?.getData();
    }
    return this.state.data;
  }

  /**
   * 获取数据集
   */
  SetData(data: any[]) {
    data?.forEach(item => {// @ts-ignore
      delete item._attributes;
      delete item.rowSpanMap;
    });
    this.useStateData = true;
    this.state.data = this.validateData(data);
    this.grid?.gridInst?.resetData(this.state.data, this.getGridOption());
  }

  validateData(data = []) {
    data?.forEach((item, index) => {
      if (item.id == undefined) {
        item.id = "id" + index + 1;
      }
    });
    return data;
  }

  /**
   * 设置行属性
   * @param id id
   * @param field 字段
   * @param value 值
   */
  async SetValue(id, field, value) {
    if (this.grid?.gridInst) {
      this.grid?.gridInst?.off('beforeChange', this.onBeforeChange);
      await this.grid?.gridInst?.setValue(id, field, value);
      this.grid?.gridInst?.on('beforeChange', this.onBeforeChange);
    } else {
      if (this.state.data) {
        for (let i = 0; i < this.state.data.length; i++) {
          let item = this.state.data[i];
          if (item.id == id) {
            item[field] = value;
            break;
          }
        }
      }
    }
  }

  /**
   * 更新行
   * @param id
   * @param row
   */
  SetRow(id: string, row: object) {
    this.grid?.gridInst?.setRow(id, row);
  }

  /**
   * 选中行
   * @param row
   */
  SetSelectedRow(row: any) {
    if (this.props.showType != XTableBase.ShowType.table) {
      super.SetSelectedRow(row);
    } else {
      this.focus(row.id, this.state.columns[0].field, true);
    }
  }

  /**
   * 通过id获取行对象
   * @param id
   */
  GetRow(id) {
    return this.grid?.gridInst?.getRow(id);
  }

  /**
   * 全选/反选
   * @param checked 选中
   */
  SetCheckStateAll(checked) {
    if (checked) {
      this.grid.gridInst.checkAll();
    } else {
      this.grid.gridInst.uncheckAll();
    }
  }

  /**
   * 设置一行选中或未选中
   * @param id
   * @param checked
   */
  SetCheckState(id, checked) {
    if (checked) {
      return this.grid.gridInst.check(id);
    } else {
      return this.grid.gridInst.uncheck(id);
    }
  }

  /**
   * 设置多行选中或未选中
   * @param ids ids
   * @param checked 选中
   * @param triggerCheckChange 触发CheckChange
   */
  SetCheckStateRowKeys(ids: any[], checked = true, triggerCheckChange = false) {
    if (ids) {
      let _ids = this.GetCheckedRowKeys();
      this.enableCheckChange = false;
      this.props.isTree && this.SetCheckStateAll(!checked);
      this.enableCheckChange = true;
      this.grid.gridInst.checkboxRowKeys(ids, checked);
      if (triggerCheckChange) {
        ids.forEach(id => {
          let index = _ids.indexOf(id);
          if (index == -1) {
            this.props.onCheckChange?.(id, checked);
          } else {
            _ids.splice(index, 1);
          }
        });
        _ids.forEach(id => this.props.onCheckChange?.(id, !checked));
      }
    }
  }

  /**
   * 获取选中行ids
   */
  GetCheckedRowKeys() {
    return this.grid?.gridInst?.getCheckedRowKeys() || [];
  }

  /**
   * 获取选择的行对象列表
   */
  GetCheckedRows() {
    return this.grid?.gridInst?.getCheckedRows() || [];
  }

  /**
   * 获取选择的行列表
   */
  GetSelectedRows(): any[] {
    if (this.props.useDragSelect) {
      let list = this.GetCheckedRows();
      if (!list || list.length == 0) {
        let r = this.GetSelectRow();
        if (r) {
          return [r];
        }
      }
      return list;
    }
    let rows = [];
    let rowKeys = this.GetSelectedRowKeys();
    for (let i = 0; i < rowKeys.length; i++) {
      rows.push(this.GetRow(rowKeys[i]));
    }
    return rows;
  }

  /**
   * 获取选择的行id列表
   */
  GetSelectedRowKeys() {
    if (this.props.useDragSelect) {
      let list = this.GetCheckedRowKeys();
      if (!list || list.length == 0) {
        let r = this.GetSelectRow();
        if (r) {
          return [r.id];
        }
      }
      return list;
    }
    let d = this.grid?.gridInst.getSelectionRange();
    if (!d) {
      let r = this.GetSelectRow();// @ts-ignore
      if (r) {// @ts-ignore
        return [r.id];
      } else {
        return [];
      }
    } else {
      let r = [];
      for (let i = d.start[0]; i <= d.end[0]; i++) {
        let rs = this.grid.gridInst.getRowAt(i);
        r.push(rs.id);
      }
      return r;
    }
  }

  /**
   * 获取选中行
   */
  GetSelectedRow() {
    if (this.grid && this.grid.gridInst) {
      let d = this.grid.gridInst.getFocusedCell();
      if (d) {
        return this.grid.gridInst.getRow(d.rowKey);
      }
    } else {
      return this.state.selectedRow;
    }
  }

  /**
   * 刷新当前组件
   * @param filter 过滤参数, 当isnew为false时，刷新参数和历史参数合并
   * @param isnew 是否为新的参数
   * @constructor
   */
  async Refresh(filter?: any, isnew?: boolean) {
    let checkedIds = this.GetCheckedRowKeys();
    let focusedCell = this.grid?.gridInst?.getFocusedCell();
    let position = this.grid?.gridInst?.getScrollPosition();
    await super.Refresh(filter, isnew);
    await this.Sleep(0);
    if (this.props.autoFocus) {
      let exists = false;
      if (focusedCell && focusedCell.rowKey) {
        let row = this.GetRow(focusedCell.rowKey);
        if (row) {
          exists = true;
          this.focus(focusedCell.rowKey, focusedCell.columnName, false);
          if (position) {
            this.grid?.gridInst?.setScrollPosition(position.scrollLeft, position.scrollTop);
          }
        }
      }
      if (!exists) {
        if (this.state.data?.length > 0) {
          this.focusAt(0, 0, true)
        }
      }
    }
    if (checkedIds?.length > 0) {
      let _ids = [];
      checkedIds.forEach(id => {
        if (this.GetRow(id)) {
          _ids.push(id);
        }
      })
      _ids.length > 0 && this.SetCheckStateRowKeys(_ids, true, true);
    }
  }

  totalResult?: object;

  async RefreshTable() {
    if (this.state.selectedRowKeys && this.state.selectedRowKeys.length > 0) {
      if (this.state.selectedRowKeys.indexOf(this.props.idField) != -1) {//全选时
        this.state.selectedRowKeys = [];           //撤销全选
      }
    }
    this.state.filterData.IsTable = true;
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
      }
      if (this.state.pagination) {
        this.state.pagination.total = retData.Value.total || 0;
      }
      if (retData.Value.columns && retData.Value.columns.length > 0) {
        if (typeof this.props.onServerColumn === "function") {
          let scols = this.props.onServerColumn(retData.Value.columns);
          if (!scols) {
            scols = retData.Value.columns;
          }
          this.serverColumns = [...scols];
          this.SetColumns(scols);
          this.updateSetting();
        } else {
          this.serverColumns = [...retData.Value.columns];
          this.SetColumns(retData.Value.columns);
          this.updateSetting();
        }
      }
      this.setState({pagination: this.state.pagination,});
      this.state.data = this.validateData(rows);
      if (this.grid) {
        this.grid.gridInst.resetData(this.state.data, this.getGridOption());
      } else {
        this.setState({data: this.state.data,})
      }
      this.afterRefresh();
      this.totalResult = retData.Value.totalResult;
    } else {
      XMessage.ShowError(retData.Message);
    }
  }

  async RefreshTree() {
    this.state.filterData.IsTree = true;
    if (this.props.IsTreeAllData) {
      this.state.filterData.Parentids = undefined;
    }
    const postData = {
      ...this.props.filterData,
      ...this.state.filterData,
    };
    if (this.props.IsTreeAllData) {
      postData.IsTreeAllData = true;
    }
    if (!postData.Parentids) {
      this.grid?.gridInst?.resetData([], this.getGridOption());
    }
    const retData = await this.RequestServerPost(this.props.dataSourceUrl, postData, false);
    if (retData.Success && retData.Value) {
      let data = retData.Value.rows;
      if (!data) {
        data = [];
      }
      const deleterows = [];
      for (let i = 0; i < data.length; i += 1) {
        const r = data[i];
        const {expandedRowKeys} = this.state;
        const index = expandedRowKeys.indexOf(r.id);
        if (index > -1) {
          r._attributes = {
            expanded: true,
          }
        }
        if (!r.IsTreeLeaf && !r._children) {
          r._children = [];
          r.children = r._children;
        }
        for (let j = 0; j < data.length; j += 1) {
          const p = data[j];
          if (p.id === r.Parentid) {
            r.parent = p;
            if (!p._children) {
              p._children = [];
              p.children = p._children;
            }
            p.IsTreeLeaf = 0;
            p._children.push(r);
            deleterows.push(r);
            break;
          }
        }
      }
      if (retData.Value.columns && retData.Value.columns.length > 0) {
        if (typeof this.props.onServerColumn === "function") {
          let scols = this.props.onServerColumn(retData.Value.columns);
          if (!scols) {
            scols = retData.Value.columns;
          }
          this.serverColumns = [...scols];
          this.SetColumns(scols);
          this.updateSetting();
        } else {
          this.serverColumns = [...retData.Value.columns];
          this.SetColumns(retData.Value.columns)
          this.updateSetting();
        }
      }
      for (let i = 0; i < deleterows.length; i += 1) {
        const index = data.indexOf(deleterows[i]);
        if (index > -1) {
          data.splice(index, 1);
        }
      }
      if (postData.Parentids && postData.Parentids.length > 0) {
        this.grid.gridInst.off('focusChange', this.onFocusChange);
        for (let i = 0; i < data.length; i += 1) {
          const did = data[i].id;
          let oldRow = this.grid.gridInst.getRow(did);
          if (oldRow) {
            this.grid.gridInst.replaceTreeRow(data[i], did);
          } else {
            this.grid.gridInst.appendTreeRow(data[i], {parentRowKey: data[i].Parentid});
          }
        }
        this.grid.gridInst.on('focusChange', this.onFocusChange);
        let d = this.grid.gridInst.getFocusedCell();
        d && this.onFocusChange({prevRowKey: d.rowKey, rowKey: d.rowKey,});
      } else {
        this.state.data = this.validateData(data);//刷新全部
        if (this.grid) {
          this.grid.gridInst.resetData(this.state.data, this.getGridOption());
        } else {
          this.setState({data: this.state.data,})
        }
      }
      this.afterRefresh();
    } else {
      XMessage.ShowError(retData.Message);
    }
  }

  SetExpandedRowKeys(expandedRowKeys = []) {
    super.SetExpandedRowKeys(expandedRowKeys);
    expandedRowKeys && expandedRowKeys.forEach(item => {
      this.grid?.gridInst.expand(item, false);
    });
  }

  ExpandedAll() {
    super.ExpandedAll();
    this.grid?.gridInst.expandAll();
  }

  UnExpandedAll() {
    super.UnExpandedAll();
    this.grid?.gridInst.collapseAll();
  }

  ClearCell() {
    this.grid?.gridInst.removeContent();
  }

  ClearData() {
    super.ClearData();
    this.grid?.gridInst?.resetData(this.state.data, this.getGridOption());
  }

  FocusToNextRow() {
    let r = this.GetSelectRow();// @ts-ignore
    if (r) {// @ts-ignore
      if (r._children && r._children.length > 0 && !r._attributes.expanded) {// @ts-ignore
        this.grid?.gridInst.expand(r.id, true);
      }// @ts-ignore
      const rowIndex = this.grid?.gridInst.getIndexOfRow(r.id);
      if (rowIndex + 1 >= this.grid?.gridInst.getRowCount()) {
        XMessage.ShowInfo("已经到底了");
        return;
      }
      this.focusAt(rowIndex + 1, 0, true);
    } else {
      this.focusAt(0, 0, true);
    }
  }

  focusAt(rowIndex, columnIndex, setScroll) {
    this.grid?.gridInst.focusAt(rowIndex, columnIndex, setScroll);
  }

  focus(rowKey, columnName, setScroll) {
    this.grid?.gridInst.focus(rowKey, columnName, setScroll);
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
        visible: true,
        IsTreeLeaf: 1,
        lock: false,
        sorter: this.props.allowSort,
        enableFocus: true,
        enableEdit: this.props.enableEdit,
        enableEditFun: undefined,
        enableCopy: this.props.enableEdit,
        summaryRender: undefined,
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
      obj.name = obj.field;
    }
    if (obj.title !== undefined) {
      obj.header = obj.title;
    }
    if (!obj.features) {
      obj.features = {sortable: obj.sorter};// 可以排序
    }
    if (obj.visible || obj.visible === undefined) {
      obj.visible = true;
    }
    obj.IsTreeLeaf = 1;
    if (obj.children && obj.children.length > 0) {
      obj.IsTreeLeaf = 0;
      for (let j = 0; j < obj.children.length; j += 1) {
        obj.children[j] = this.formatColumn(obj.children[j]);
        obj.children[j].parent = obj;
      }
    }
    obj.header = obj.title;
    obj.sortable = obj.sorter;
    if (obj.autoWrap === undefined) {
      obj.autoWrap = this.props.autoWrap;
    }
    if (obj.enableEdit === undefined) {
      obj.enableEdit = this.props.enableEdit;
    }
    if (obj.enableCopy === undefined) {
      obj.enableCopy = this.props.enableEdit;
    }
    if (obj.editor === undefined) {
      obj.editor = {
        type: CustomEditor,
        options: {},
      };
    }
    obj.renderer = {
      type: CustomRenderer,
      showRender: (value, record) => {
        if (obj.render) {
          return obj.render(value, record)
        }
        if (col.mode == XTableGrid.EditMode.show) {
          let props = obj.getEditProps ? obj.getEditProps(obj) : {};
          if (col.type == XTableGrid.ColumnType.string) {
            return <XInput value={value} showLabel={false} {...props}
                           onValueChange={v => this.SetValue(record.id, obj.field, v)}/>
          } else if (col.type == XTableGrid.ColumnType.number) {
            return <XInputNum value={value} showLabel={false} {...props}
                              onValueChange={v => this.SetValue(record.id, obj.field, v)}/>
          } else if (col.type == XTableGrid.ColumnType.switch) {
            return <XSwitch value={value} showLabel={false} {...props}
                            onValueChange={v => this.SetValue(record.id, obj.field, v)}/>
          } else if (col.type == XTableGrid.ColumnType.date) {
            return <XDateTime value={value} showLabel={false} {...props}
                              onValueChange={v => this.SetValue(record.id, obj.field, v)}/>
          } else if (col.type == XTableGrid.ColumnType.check) {
            return <XCheckGroup value={value} showLabel={false} {...props}
                                onValueChange={v => this.SetValue(record.id, obj.field, v)}/>
          } else if (col.type == XTableGrid.ColumnType.radio) {
            return <XRadioGroup value={value} showLabel={false} {...props}
                                onValueChange={v => this.SetValue(record.id, obj.field, v)}/>
          } else if (col.type == XTableGrid.ColumnType.select) {
            return <XSelectList value={value} showLabel={false} {...props}
                                onValueChange={v => this.SetValue(record.id, obj.field, v)}/>
          } else if (col.type == XTableGrid.ColumnType.tree) {
            return <XSelectTree value={value} showLabel={false} {...props}
                                onValueChange={v => this.SetValue(record.id, obj.field, v)}/>
          }
        }
        return value;
      },
    }
    obj.tableGrid = this;
    if (obj.showFilter == undefined) {
      obj.showFilter = this.props.showColumnFilter;
    }
    if (obj.showFilter && this.props.dataSourceUrl && (this.props.showButtons === true || XArray.Contains(this.props.showButtons, XTableBase.TableButtons.filter))) {
      if (obj.filterRenderer == undefined) {
        obj.filter = {};
        obj.filterRenderer = FilterRenderer;
      }
    }
    if (obj.totalMode == undefined) {
      obj.totalMode = XTableBase.TotalMode.none;
    }
    if (obj.totalMode !== XTableBase.TotalMode.none && !obj.summaryRender) {
      obj.summaryRender = (map) => {
        let value = "";
        if (this.totalResult) {
          value = this.totalResult[obj.field];
        } else {
          if (obj.totalMode === XTableBase.TotalMode.count) {
            value = map.cnt;
          } else if (obj.totalMode === XTableBase.TotalMode.sum) {
            value = map.sum;
          } else if (obj.totalMode === XTableBase.TotalMode.avg) {
            value = map.avg;
          } else if (obj.totalMode === XTableBase.TotalMode.max) {
            value = map.max;
          } else if (obj.totalMode === XTableBase.TotalMode.min) {
            value = map.min;
          }
        }
        return <XText ref={(e) => obj.totalContentRef = e} value={value} showLabel={false} textAlign={"center"}/>;
      };
    }
    if (obj.rowSpanCompare || XArray.Contains(this.props.rowSpanColumns, obj.field)) {
      obj.rowSpan = true;
    }
    return obj;
  }

  SetFilterCond(filterConds) {
    if (filterConds?.length == 0) {
      this.filterView?.ResetData();
    }
    filterConds = XFilterView.GetFilterConds(filterConds);
    let filters = [];
    if (filterConds.length > 0) {
      filterConds[0].items.forEach(item => {
        filters.push(item.columnName);
      })
    }
    let sql = XFilterView.ToSqlString(filterConds);
    if (sql) {
      this.state.filterCondHeight = "50px";
      this.state.FilterCondEle = <XFlex horizontalAlign={"start"}>{sql}</XFlex>;
    } else {
      this.state.filterCondHeight = "0px";
      this.state.FilterCondEle = undefined;
    }
    this.Refresh({CustomFilterCond: JSON.stringify(filterConds)});
    this.setState({filters, filterConds, filterCondHeight: this.state.filterCondHeight}, () => this.Resize());
  }

  isActiveFilterFun(columnName) {
    let filters = this.state.filters || [];
    return filters.indexOf(columnName) >= 0;
  }

  filterView: XFilterView;

  renderFilter() {
    let columns = [];
    this.GetColumns().forEach(item => {
      columns.push({
        id: item.field, field: item.field, type: item.type,
        getEditProps: item.getEditProps, name: item.title
      });
    })
    return <XFilterView ref={e => this.filterView = e} filterGroups={this.state.filterConds} columns={columns}
                        onFilterChange={(cond) => this.SetFilterCond(cond)}/>
  }

  toggleFilter() {
    const showSearch = !this.state.showSearch;
    let filterHeight = "0px";
    if (showSearch) {
      filterHeight = "1fr";
    }
    this.setState({showSearch, filterHeight}, () => this.Resize());
  }

  SetTheme(options = undefined) {
    if (!options) {
      options = {
        // selection: {
        //   background: '#4daaf9',
        //   border: '#004082'
        // },
        // scrollbar: {
        //   background: '#f5f5f5',
        //   thumb: '#d9d9d9',
        //   active: '#c1c1c1'
        // },
        row: {
          checked: {background: 'rgba(229,246,255,0.7)'}
          //   even: {
          //     background: '#f3ffe3'
          //   },
          //   hover: {
          //     background: '#ccc'
          //   }
        },
        cell: {
          normal: {
            background: '#fbfbfb',
            border: '#e0e0e0',
            showVerticalBorder: true
          },
          header: {
            background: '#fbfbfb',
            border: '#ccc',
            showVerticalBorder: true
          },
          rowHeader: {
            background: '#fbfbfb',
            border: '#ccc',
            showVerticalBorder: true
          },
          // editable: {
          //   background: '#fbfbfb'
          // },
          // selectedHeader: {
          //   background: '#d8d8d8'
          // },
          // focused: {
          //   border: '#418ed4'
          // },
          // disabled: {
          //   text: '#b0b0b0'
          // }
        }
      };
    }
    this.grid?.SetTheme(options);
  }

  refFun = (e) => {
    this.grid = e;
    e.gridInst.resetData(this.state.data, this.getGridOption());
    // this.Resize();
    this.SetGridEvent();
    if (!hasInitGridStyle) {
      hasInitGridStyle = true;
      this.SetTheme();
    }
  }

  GetSummary(columns) {
    let summary = this.props.summary;
    if (summary == undefined) {
      let exists = false;
      let columnContent = {};
      columns?.forEach(item => {
        if (item.summaryRender) {
          exists = true;
          columnContent[item.name] = {template: item.summaryRender};
        }
      });
      if (exists) {
        summary = {
          height: 40,
          position: 'bottom', // or 'top'
          columnContent
        }
      }
      if (summary) {// @ts-ignore
        for (let key in summary.columnContent) {// @ts-ignore
          let _template = summary.columnContent[key].template;
          if (_template) {// @ts-ignore
            summary.columnContent[key].template = function () {//重写template函数
              let el = document.createElement('div');
              let root = ReactDOMClient.createRoot(el);
              root.render(_template.apply(this, arguments));
              return el;
            }
          }
        }
      }
    }
    return summary;
  }

  SetVisibleColumns(columns: any[]) {
    super.SetVisibleColumns(columns);
    return this.SetRenderColumns();
  }

  ResetColumns(cols?: []) {
    if (cols) {
      this.SetColumns(cols, true);
    }
    this.setState({
      columns: this.state.columns,
      header: this.state.header,
      columnOptions: this.state.columnOptions,
      tableKey: this.state.tableKey,
    })
  }

  SetRenderColumns(columns = this.state.columns, header = this.props.header, _columns: any[] = [], parent = undefined) {
    if (this.props.header == undefined) {
      columns?.forEach((col, index) => {
        if (parent) {
          parent.childNames.push(col.field);
        }
        if (col.children?.length > 0) {
          if (header == undefined) {
            header = {height: 160, complexColumns: []};
          }
          let complex = {
            header: col.field,
            name: (parent ? parent.name + '_' : "mergeColumn_") + index,
            childNames: [],
          }// @ts-ignore
          header.complexColumns?.push(complex);// @ts-ignore
          this.SetRenderColumns(col.children, header, _columns, complex);
        } else {
          _columns.push(col);
        }
      });
      columns = _columns;
    }
    if (parent == undefined) {
      let columnOptions = {resizable: true, minWidth: this.props.minColumnWidth,};
      let frozenCount = 0;
      for (let i = 0; i < columns?.length; i++) {
        if (columns[i].lock) {
          frozenCount++
        } else {
          break;
        }
      }
      if (frozenCount > 0) {// @ts-ignore
        columnOptions = {...columnOptions, frozenCount, frozenBorderWidth: 1};
      }
      let tableKey = undefined;// @ts-ignore
      if (this.lastColumnOptions) {// @ts-ignore
        if (this.lastColumnOptions != JSON.stringify(columnOptions)) {
          tableKey = new Date().getTime();
        }
      }// @ts-ignore
      this.lastColumnOptions = JSON.stringify(columnOptions);
      this.state.columns = columns;
      this.state.header = header;
      this.state.columnOptions = columnOptions;
      this.state.tableKey = tableKey;
    }
    return columns;
  }

  renderTable() {
    let rowheaders = [];
    if (this.state.showOrder) {
      rowheaders.push('rowNum');
    }
    if (this.props.isCheck) {
      rowheaders.push('checkbox');
    }// @ts-ignore
    let {columns, header, columnOptions, tableKey} = this.state;
    if (this.props.isTree) {
      return <TuiGrid key={tableKey} onDidMount={e => this.refFun(e)} columns={columns} header={header}
                      minRowHeight={this.props.minRowHeight} editingEvent={this.props.editingEvent}
                      useTreeIcon={this.props.useTreeIcon} columnOptions={columnOptions}
                      isActiveFilterFun={v => this.isActiveFilterFun(v)} contextMenu={this.props.contextMenu}
                      rowHeight={25} bodyHeight={'fitToParent'} treeColumnName={this.state.treeColumnName}
                      rowHeaders={rowheaders} draggable={this.props.draggable} summary={this.GetSummary(columns)}/>;
    } else {
      return <TuiGrid key={tableKey} onDidMount={e => this.refFun(e)} columns={columns} header={header}
                      minRowHeight={this.props.minRowHeight} editingEvent={this.props.editingEvent}
                      isActiveFilterFun={v => this.isActiveFilterFun(v)} contextMenu={this.props.contextMenu}
                      rowHeight={25} bodyHeight={'fitToParent'} columnOptions={columnOptions}
                      rowHeaders={rowheaders} draggable={this.props.draggable} summary={this.GetSummary(columns)}/>;
    }
  }
}

class FilterRenderer {
  el: any;
  props: any;
  table: XTableGrid;
  column: any;
  option: "";
  value: "";
  root: Root;

  constructor(props) {
    this.el = document.createElement('div');
    this.root = ReactDOMClient.createRoot(this.el);
    this.init(props)
  }

  init(props) {
    this.props = props;
    let column = props.columnInfo;
    this.table = column.tableGrid;
    this.column = this.table.GetColumn(column.name, this.table.state.columns);
    let filterConds = this.table.state.filterConds;
    if (filterConds && filterConds.length > 0) {
      filterConds[0].items.forEach(item => {
        if (item.columnName == this.column.field) {
          this.option = item.relationValue;
          this.value = item.resultValue;
        }
      });
    }
    this.update()
  }

  getElement() {
    return this.el;
  }

  onValueChange(name, value) {
    this[name] = value;
    if (name == "option") {
      let isHide = (value == "为空" || value == "不为空");
      if (this.input) {
        this.input.style.display = isHide ? "none" : "block";
      }
      if (this.datetime) {
        this.datetime.SetVisible(!isHide);
      }
    }
  }

  apply() {
    let item = {
      columnName: this.column.field,
      id: this.table.CreateUUID(),
      relationValue: this.option,
      resultType: this.column.type,
      resultValue: this.value,
    };
    let filterConds = cloneDeep(this.table.state.filterConds);
    if (filterConds && filterConds.length > 0) {
      let exists = false;
      filterConds[0].items.forEach(item => {
        if (item.columnName == this.column.field) {
          exists = true;
          item.relationValue = this.option;
          item.resultValue = this.value;
        }
      });
      if (!exists) {
        filterConds[0].items.push(item);
      }
    } else {
      filterConds = [{id: "first", items: [item]}];
    }
    this.table?.SetFilterCond(filterConds);
    this.table?.filterView?.SetFilterGroups(filterConds);
  }

  input: any;
  datetime: XDateTime;

  update() {
    let type = this.column.type;
    let items = ['包含', '不包含', '等于', '不等于', '为空', '不为空'];
    if (['datetime', 'date',].includes(type)) {
      items = ['大于等于', '小于等于', '等于', '不等于', '为空', '不为空'];
    } else if (['datetime', 'date', 'number', 'float', 'int', 'double'].includes(type)) {
      items = ['大于等于', '小于等于', '等于', '不等于',];
    } else if (['select'].includes(type)) {
      items = ['等于'];
    }
    let style = {height: 30, lineHeight: 30};
    if (!this.option) {// @ts-ignore
      this.option = items[0];
    }
    let item = this.option;
    let value = this.value;
    if (['number', 'float', 'int', 'double'].includes(type)) {
      type = "number"
    } else if (!["select", 'date', 'datetime'].includes(type)) {
      type = "text";
    }
    let renderInput = () => {
      if (['date', 'datetime'].includes(type)) {
        return <XDateTime ref={e => this.datetime = e} showLabel={false} value={value}
                          popupClassName={"tui-grid-filter"}
                          onValueChange={v => this.onValueChange("value", v)}/>;
      }
      if (['select'].includes(type)) {
        let props = this.column?.getEditProps ? this.column?.getEditProps(this.column) : undefined;
        return <XSelectList value={value} showLabel={false} {...props} popupClassName={"tui-grid-filter"}
                            onValueChange={v => this.onValueChange("value", v)}/>
      }
      return <input ref={e => this.input = e}// @ts-ignore
                    style={{...style, display: (item === "为空" || item === "不为空") ? "none" : "block"}}
                    defaultValue={value}
                    type={type} onChange={(e) => this.onValueChange("value", e.target.value)}
                    onKeyDown={(e) => e.keyCode == 13 && this.apply()}/>
    }
    this.root.render(<XGrid rowGap={"5px"} key={this.column.field}>
      <select style={style} defaultValue={item}
              onChange={(e) => this.onValueChange("option", e.target.value)}>
        {items.map((name, index) => {
          return <option key={index} style={style}>{name}</option>
        })}
      </select>
      {renderInput()}
      <XFlex horizontalAlign={"end"}>
        <a onClick={() => this.apply()}
           style={{
             color: '#fff',
             borderColor: '#1890ff',
             background: "#40a9ff",
             padding: "5px 10px",
             cursor: "pointer"
           }}>应用</a>
      </XFlex>
    </XGrid>);
  }

  render(data) {
    this.init(data)
    return this.el;
  }

  public beforeDestroy() {
    if (this.el) {// @ts-ignore
      this.el.innerHTML = "";
    }
  }
}

class CustomRenderer {
  el: any;
  root: Root;
  props: any;
  table: XTableGrid;
  column: any;

  constructor(props) {
    this.props = props;
    let column = props.columnInfo;
    this.table = column.tableGrid;
    this.column = this.table.GetColumn(column.name, this.table.state.columns);
    this.el = document.createElement('div');
    this.root = ReactDOMClient.createRoot(this.el);
    this.update(props.value)
  }

  getElement() {
    return this.el;
  }

  calculateRowHeight() {
    this.props?.calculateRowHeight?.()
  }

  update(value) {
    let props = this.props;
    let column = props.columnInfo;
    let row = props.grid.getRow(props.rowKey);
    this.el.style.padding = "0px 1px";
    if (this.column?.autoWrap) {   // 自动换行
      // this.el.style.overflow = "";
      this.el.style.whiteSpace = "pre-wrap";
      this.el.style.textOverflow = "";
      this.el.style.wordBreak = "";
      this.el.style.wordWrap = "break-word";
    } else {
      // this.el.style.overflow = "hidden";
      this.el.style.whiteSpace = "nowrap";
      this.el.style.textOverflow = "ellipsis";
      this.el.style.wordBreak = "break-all";
      this.el.style.wordWrap = "";
    }
    this.el.setAttribute("title", value ? value : "");
    this.el.style.cursor = "default";
    if (!this.column && this.table) {
      this.column = this.table.GetColumn(column.name, this.table.state.columns);
    }
    // if (this.column && this.table.props.enableEdit) {//启用编辑，会显示背景颜色
    //   let enableEdit = this.column.enableEditFun ? this.column.enableEditFun(row) : this.column.enableEdit;
    //   if (props.td) {
    //     props.td.style.background = enableEdit ? "" : "#F2F2F2";
    //   }
    // }
    this.root.render(<XDiv onDidUpdate={() => this.calculateRowHeight()}
                           onDidMount={() => this.calculateRowHeight()}>
      {column.renderer.showRender(value, row)}
    </XDiv>);
  }

  render(data) {
    this.update(data.value)
    return this.el;
  }

  public beforeDestroy() {
    // this.root?.unmount();
    if (this.el) {// @ts-ignore
      this.el.innerHTML = "";
    }
  }
}

interface XDivProps {
  children?: React.ReactNode,
  onDidUpdate?: () => void,
  onDidMount?: () => void,
}

class XDiv extends React.Component<XDivProps, any> {
  componentDidUpdate(prevProps: any, prevState: any, snapshot: any) {
    this.props.onDidUpdate?.();
  }

  componentDidMount() {
    this.props.onDidMount?.();
  }

  render() {
    return <>{this.props.children}</>;
  }
}

class CustomEditor {
  el: any;
  record: any;
  value: any;
  props: any;
  table: XTableGrid;
  column: any;
  root: Root;

  constructor(props) {
    const el = document.createElement('div');
    this.record = props.grid.getRow(props.rowKey);
    this.value = props.value;
    this.props = props;
    let column = props.columnInfo;
    this.table = column.tableGrid;
    this.table.saveAndFinishEditing = props.instantApplyCallback;
    this.column = this.table.GetColumn(column.name, this.table.state.columns);
    this.root = ReactDOMClient.createRoot(el);
    this.root.render(this.createEditor());
    this.el = el;
  }

  isEnterEditorClose() {
    if (this.column?.isEnterEditorClose) {
      return this.column?.isEnterEditorClose();
    }
    return true;
  }

  getElement() {
    return this.el;
  }

  createEditor() {
    if (this.column && this.column.editorRender) {
      this.record.editor = undefined;
      let onValueChange = () => {
        this.table?.FinishEditing(undefined);
        Input.props.onDropdownClose && Input.props.onDropdownClose();
      }
      let Input = this.column.editorRender(this.props.value, this.record, onValueChange);
      if (!this.record.editor && typeof (Input) == "object") {
        return React.cloneElement(Input, {
          ...Input.props, ref: (e) => {
            this.record.editor = e
            Input.props.ref && Input.props.ref(e);
          }, onDropdownClose: onValueChange,
        }, Input.children);
      }
      return Input;
    } else if (this.column.editorName) {
      // let option = {...this.column.editorOption, ref: (e) => this.record.editor = e,}
      // return CreateX(this.column.editorName, option);
    } else {
      let type = this.column.type;
      if (['number', 'float', 'int', 'double'].includes(type)) {
        return <XInputNum ref={(e) => this.record.editor = e} showLabel={false}/>
      }
      if (['date', 'datetime'].includes(type)) {
        return <XDateTime ref={(e) => this.record.editor = e} type={type} showLabel={false}/>
      }
      return <XInput ref={(e) => this.record.editor = e} placeholder="请输入" showLabel={false}/>
    }
  }

  getValue() {
    if (this.record && this.record.editor) {
      let value = this.record.editor.GetValue();
      if (value instanceof Array) {
        value = XArray.join(value);
      }
      let fk = this.column.foreignKey
      if (fk) {
        this.record[fk] = value;
        this.props.grid.off('beforeChange', this.table.onBeforeChange);
        this.props.grid.setValue(this.props.rowKey, fk, this.record[fk]);
        this.props.grid.on('beforeChange', this.table.onBeforeChange);
        return this.record.editor.GetText();
      }
      return value;
    }
    return this.el.value;
  }

  async mounted() {
    if (this.record && this.record.editor) {
      let field = this.column.foreignKey;
      if (field) {
        let v = this.record[field];
        await this.record.editor.SetValue(v);
      } else {
        await this.record.editor.SetValue(this.value);
      }
      this.record.editor.Focus && this.record.editor.Focus();
    }
  }

  public beforeDestroy() {
    if (this.table) {
      this.table.saveAndFinishEditing = undefined;
    }
    if (this.record) {
      this.record.editor = null;
    }
    // this.root?.unmount();
    if (this.el) {// @ts-ignore
      this.el.innerHTML = "";
    }
  }
}
