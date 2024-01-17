import React, {Component} from 'react';
import styled from "styled-components";
import XTableGrid from '../display/XTableGrid';
import {LIB_NAME} from "./select/constants";
import XSelectList, {Button, SearchAndToggle, XSelectListProps} from "./XSelectList";
import MSelect from "./select/MSelect";
import XLink from "./XLink";
import XGrid from "../layout/XGrid";

export interface XSelectTableProps extends XSelectListProps {
  /**
   * 下位框显示列表
   */
  visibleColumns?: any[],
}

/**
 * 下拉选择一个表格
 * @name 表格选择
 * @groupName 选择
 */
export default class XSelectTable extends XSelectList<XSelectTableProps,any> {
  static ComponentName = "表格选择";
  static defaultProps = {
    ...super.defaultProps,
    dropdownWidth: "auto",
    dropdownHeight: "500px",
    visibleColumns:[],
  };

  constructor(props) {
    super(props);
    if(this.props.visibleColumns.length>0){
      this.state.columns=this.formatColumn(this.props.visibleColumns);
    }else{
      this.state.columns=this.formatColumn([this.props.displayField]);
    }
  }

  formatColumn(cols) {
    return cols.map((col) => {
      let c: any = {};
      if (typeof col === "string") {
        c.field = col;
      } else {
        c = col;
      }
      if (!c.title) {
        c.title = c.field;
      }
      return c;
    });
  }

  async Refresh(filter?: object, isnew?: boolean) {
    super.Refresh(filter, isnew);
  }

  GetSearchFields() {
    let list = [];
    this.state.columns.forEach(item => {
      if (item.keyword && this.props.searchFields.indexOf(item.field) == -1) {
        list.push(item.field);
      }
    })
    return [...list, ...this.props.searchFields];
  }

  getVisibleColumns() {
    return this.props.visibleColumns;
  }

  customDropdownRenderer = ({ props, state, methods }) => {
    let visibleColumns = [...this.props.visibleColumns];
    if (this.props.searchFields) {
      for (let i = 0; i < visibleColumns.length; i++) {
        let item = visibleColumns[i];
        if (typeof (item) == "string") {
          item = {field: item};
          visibleColumns[i] = item;
        }
        if (this.props.searchFields.indexOf(item.field) >= 0) {
          item.keyword = true;
        }
      }
    }
    let searchFields = this.GetSearchFields();
    return <div className={this.props.popupClassName}>
      {this.props.showSearch &&
        <SearchAndToggle color={this.props.color}>
          {this.props.allowAdd ?
            <div style={{display: "flex", justifyContent: "center"}}>
              <Button className={`${LIB_NAME}-dropdown-add-new`} onClick={() => {
                state.search && methods.createNew(state.search)
              }}>
                {"直接添加:" + state.search}
              </Button>
            </div> : <></>
          }
          <XGrid columnsTemplate={["1fr", "auto"]} columnGap={"5px"} boxStyle={{padding: "10px 10px 0"}}
                 alignItems={"center"}>
            <input type="text" readOnly={true} value={state.search ? "查找：" + state.search : ""}
                   placeholder={this.getPlaceholder(searchFields)}/>
            {this.showSetting && <XLink onClick={() => this.ShowSettingModal(methods)}>设置</XLink>}
          </XGrid>
        </SearchAndToggle>}
      <XTableGrid boxClassName={"react-dropdown-select-dropdown"} boxStyle={{marginTop: 5}} height={"300px"}
                  ref={(e) => this.pulllist = e}
                  // pageSize={2}
                  dataSourceUrl={this.props.dataSourceUrl} data={this.state.items} showSearch={false} enableEdit={false}
                  isCheck={true} visibleColumns={visibleColumns} showButtons={false}
                  filterData={this.state.filterData} onServerResult={this.props.onServerResult} showColumnFilter={false}
                  onAfterRefresh={() => {
                    let value = this.GetValue();
                    if (value) {
                      if (!this.props.isMultiSelect) {
                        value = [value];
                      }
                      this.pulllist?.SetCheckStateRowKeys(value, true);
                    } else if (!this.props.isMultiSelect) {
                      this.isCodeFocus = true;
                      this.pulllist?.focusAt(0, 0, false);
                    }
                  }}
                  onClick={(item) => {
                    if (!this.props.isMultiSelect && item) {// @ts-ignore
                      this.pulllist.SetCheckStateRowKeys([item.id], true);
                      methods.addItem(item, true);
                    }
                  }}
                  onDoubleClick={() => {
                    if (!this.props.isMultiSelect) {//关闭窗口
                      this.select?.dropDown('close', null);
                    }
                  }}
                  onSelectChange={(item) => {
                    if (!this.props.isMultiSelect && !this.isCodeFocus) {
                      this.pulllist.SetCheckStateRowKeys([item.id], true);
                      methods.addItem(item, true);
                    }
                  }} autoFocus={false}
                  onCheckChange={(key, checked) => {
                    if (this.isCodeFocus) {
                      return;
                    }
                    this.isCodeFocus = false;
                    if (this.props.isMultiSelect) {
                      methods.setItems(this.pulllist.GetCheckedRows());
                    } else {
                      if (key === undefined) {
                        let list = this.pulllist.GetData();
                        if (list.length > 0) {
                          this.pulllist?.SetCheckStateRowKeys(list[0].id, true);
                        }
                      } else {
                        this.pulllist.SetCheckStateRowKeys([key], true);
                        methods.addItem(this.pulllist.GetRow(key), true);
                      }
                    }
                  }}
                  mustHasFilter={this.state.mustHasFilter}/>
    </div>;
  };

  isCodeFocus = false;
  handleKeyDownFn({event, state, props, methods, setState}) {
    if (this.props.isMultiSelect) {
      return;
    }
    const arrowUp = event.key === 'ArrowUp';
    const arrowDown = event.key === 'ArrowDown';
    const enter = event.key === 'Enter';
    if (this.pulllist && (arrowUp || arrowDown)) {
      let values = this.pulllist.GetData();
      let row = this.pulllist.GetSelectRow();
      let value = row ? row[this.valueField] : "";
      let index = 0;
      if (value) {
        for (let i = 0; i < values.length; i++) {
          if (values[i][this.valueField] == value) {
            index = i;
            break;
          }
        }
        if (arrowUp) {
          index--;
          if (index < 0) {
            index = values.length - 1;
          }
        } else {
          index++;
          if (index > values.length - 1) {
            index = 0;
          }
        }
      }
      let key = values[index][this.valueField];
      this.pulllist?.SetCheckStateRowKeys([key], true);
      for (let i = 0; i < this.state.columns.length; i++) {
        let item = this.state.columns[i];
        if (item.visible !== false) {
          this.isCodeFocus = true;
          this.pulllist?.focus(key, item.field, true);
          break;
        }
      }
    } else if (enter && this.pulllist) {
      let row = this.pulllist.GetSelectRow();
      if (row && row[this.valueField]) {
        this.SetValue(row[this.valueField]);
        methods.dropDown('close');
      }
    }
  }

  renderEditor() {
    return <StyledSelect
      ref={e => this.select = e}
      placeholder="选择..."
      multi={this.props.isMultiSelect}
      searchable={this.props.showSearch}
      dropdownPosition={this.props.dropdownPosition}
      dropdownHeight={this.props.dropdownHeight}
      dropdownWidth={this.props.dropdownWidth}
      minDropdownWidth={this.props.minDropdownWidth}
      clearable={true}
      allowAdd={this.props.allowAdd}
      dropdownRenderer={this.customDropdownRenderer}
      labelField={this.props.displayField}
      valueField={this.valueField}
      options={this.state.items}
      handleKeyDownFn={(args) => this.handleKeyDownFn(args)}
      clearOnSelect={false}
      values={this.state.valueItems}
      onDropdownClose={this.props.onDropdownClose}
      searchFn={(value) => this.pullSearch(value)}
      onChange={(values) => this.onSelectChange(values)}
      portal={this.rootElement}
    />
  }
}

const StyledSelect = styled(MSelect)`
  .react-dropdown-select-dropdown {
    overflow: initial;
  }
`;


