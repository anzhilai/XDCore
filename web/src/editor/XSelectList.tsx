import React, {Component} from 'react';
import XBaseEditor, {XBaseEditorProps} from '../base/XBaseEditor';
import styled from 'styled-components'
import cloneDeep from "lodash/cloneDeep";
import MSelect from "./select/MSelect";
import XPullList from "../display/XPullList";
import {LIB_NAME} from "./select/constants";
import XArray from "../toolkit/XArray"
import XTools from "../toolkit/XTools"
import XModal from "../layout/XModal"
import XGrid from "../layout/XGrid"
import XInput from "../editor/XInput"
import XButton from "../editor/XButton"
import XFlex from "../layout/XFlex"
import XIcon from "../display/XIcon"
import XString from "../toolkit/XString";
import XLink from './XLink';
import XEditTable from "./XEditTable";
import XBasePage from "../base/XBasePage";

// https://sanusart.github.io/react-dropdown-select/
export interface XSelectListProps extends XBaseEditorProps {
  /**
   * 内容渲染
   */
  itemRender: (checked: boolean, item: {}, index: number, onClick: () => void) => React.ReactNode,
  /**
   * 每个数据项的渲染方式
   */
  itemContentRender?: (label, item: any, checked: boolean,) => React.ReactNode,
  /**
   * 直接赋值items
   */
  items?: any[],
  /**
   * 选择项是否可以多选
   */
  isMultiSelect?: boolean,
  /**
   * value字段
   */
  valueField?: string,
  /**
   * 显示字段
   */
  displayField?: string,
  /**
   * 搜索字段
   */
  searchFields?: string[],
  /**
   * 是否允许添加
   */
  allowAdd?: boolean,
  /**
   * 是否显示搜索
   */
  showSearch?: boolean,
  /**
   * 是否允许空值
   */
  allowNull?: boolean,
  /**
   * 是否允许搜索
   */
  allowSearch?: boolean,
  /**
   * 下拉框最小显示高度
   */
  minDropdownWidth?: string,
  /**
   * 下拉框显示宽度
   */
  dropdownWidth?: string,
  /**
   * 下拉框显示高度
   */
  dropdownHeight?: string,
  /**
   * 下拉框显示位置
   */
  dropdownPosition?: string,
  /**
   * 关闭事件
   */
  onDropdownClose?: () => void,
  settingQueryUrl?: string,
  settingSaveUrl?: string,
  settingDeleteUrl?: string,
  popupClassName?: string,
}

/**
 * 选择下拉列表，可以直接对接数据源
 * @name 列表选择
 * @groupName 选择
 */
export default class XSelectList<P = {}, S = {}> extends XBaseEditor<XSelectListProps & P, any> {
  static ComponentName = "列表选择";
  static StyleType = {picker: 'picker', common: 'common'};

  static defaultProps = {
    ...XBaseEditor.defaultProps,
    itemRender: undefined,
    items: [],
    isMultiSelect: false,
    allowAdd: false,
    allowNull: true,
    showSearch: true,
    allowSearch: true,
    valueField: "id",
    displayField: "label",
    searchFields: [],
    minDropdownWidth: "300px",
    dropdownWidth: "auto",
    dropdownHeight: "200px",
    dropdownPosition: "auto",
    settingQueryUrl: 'xtpz/queryinfo',
    settingSaveUrl: 'xtpz/save',
    settingDeleteUrl: 'xtpz/delete',
  };

  valueField: string;
  showSetting: boolean;
  _items: [];
  rootElement: HTMLElement;

  constructor(props) {
    super(props);
    this.valueField = this.props.valueField;
    this.state.mustHasFilter = this.props.mustHasFilter;
    this.state.filterData = this.props.filterData;
    this.state.value = [];
    this.SetItems(this.props.items, true, false);
    this.showSetting = this.props.id && !this.props.dataSourceUrl;
    this.rootElement = XBasePage.GetApp()?.rootElement ? XBasePage.GetApp()?.rootElement : document.body;
  }

  /**
   * 设置下拉框列表
   * @param items 选择列表
   * @param triggerValueChange 是否触发onValueChange
   */
  SetItems(items, triggerValueChange = true, setState = true, saveItems = true) {
    if (saveItems) {
      this._items = items;
    }
    let value = this.GetValue();
    this.state.items = this.formatData(cloneDeep(items));
    this.state.valueItems = [];
    if (value) {
      if (this.props.isMultiSelect) {
        if (typeof value === "string") {
          value = XString.split(value);
        }
        if (value.length > 0) {
          for (let i = 0; i < this.state.items.length; i++) {
            let item = this.state.items[i];
            if (value.indexOf(item[this.valueField]) >= 0) {
              this.state.valueItems.push(item);
            }
          }
        }
      } else {
        for (let i = 0; i < this.state.items.length; i++) {
          let item = this.state.items[i];
          if (item[this.valueField] === value) {
            this.state.valueItems.push(item);
            break;
          }
        }
      }
      this.validateItems(value);
    }
    if (!this.props.allowNull && this.state.items.length > 0 && this.state.valueItems.length == 0) {
      this.useStateValue = true;
      this.state.valueItems.push(this.state.items[0]);
      this.state.value = this.GetValue();
      triggerValueChange && this.onValueChangeEvent();
    }
    if (setState) {
      this.setState({items: this.state.items, valueItems: this.state.valueItems});
    }
  }

  Focus() {
    this.select?.Focus();
  }

  /**
   * 获取下拉框列表
   */
  GetItems() {
    return this.state.items;
  }

  formatData(data) {
    let items = [];
    if (!data) {
      return items;
    }
    data.forEach((d) => {
      if (typeof d === "string") {
        let item: any = {};
        item[this.props.displayField] = d;
        item[this.valueField] = d;
        items.push(item);
      } else {
        items.push(d);
      }
    });
    return items;
  }

  async componentDidMount() {
    super.componentDidMount();
    await this.initSetting();
    if (this.props.value) {
      this.SetValue(this.props.value, false);
    } else if (!this.props.allowNull && this.props.dataSourceUrl) {//不可为空时，默认赋值第一个
      const r = await this.RequestServerPost(this.props.dataSourceUrl, {
        ...this.props.filterData, pageSize: 1, pageIndex: 0,
      }, true, true);
      if (r.Success && r.Value && r.Value.rows.length > 0) {
        this.useStateValue = true;
        this.state.valueItems = r.Value.rows;
        this.state.value = this.GetValue();
        this.setState({valueItems: this.state.valueItems, value: this.state.value, record: this.state.record});
        this.onValueChangeEvent()
      }
    }
  }

  async initSetting() {
    if (!this.showSetting) {
      return;
    }
    let r = await this.RequestServerPost(this.props.settingQueryUrl, {id: "select_" + this.props.id}, undefined, true, false);
    if (r.Success && r.Value) {
      let 配置值 = undefined;
      if (typeof r.Value === "string") {
        配置值 = r.Value;
      } else {
        配置值 = r.Value?.配置值;
      }
      if (配置值) {
        try {
          let items = JSON.parse(配置值);// @ts-ignore
          if (items instanceof Array) {
            this.SetItems(items, undefined, undefined, false);
          }
        } catch (e) {
        }
      }
    }
  }

  table设置: XEditTable;

  getVisibleColumns() {
    return [];
  }

  async ShowSettingModal(methods) {
    methods.dropDown('close');
    let visibleColumns = [...this.getVisibleColumns()];
    let data = this.state.items;
    if (visibleColumns.length == 0) {
      visibleColumns.push(this.props.displayField);
    }
    if (this.valueField != "id") {
      visibleColumns.splice(0, 0, this.valueField);
    } else {
      data.forEach(item => {
        if (!item.id) {
          item.id = this.CreateUUID();
        }
      });
    }
    let modal = await XModal.ModalShow("设置", async () => {
      let items = [];
      this.table设置.GetData().forEach(_item => {
        let item = {..._item};
        delete item._attributes;
        delete item.rowSpanMap;
        if (this.valueField == "id") {
          item.id = item[this.props.displayField];
        }
        items.push(item);
      });
      let ret = await this.saveSetting(items);
      if (ret) {
        this.SetItems(items, undefined, undefined, false);
        methods.dropDown('open');
      }
      return ret;
    }, <XEditTable ref={e => this.table设置 = e} height={"300px"} data={data}
                   extraButtons={<XButton onClick={() => {
                     XModal.Confirm("是否恢复选择框默认设置", async () => {
                       await this.deleteSetting();
                       this.SetItems(this._items);
                       methods.dropDown('open');// @ts-ignore
                       modal?.handleCancel();
                       return true;
                     });
                   }} text={"恢复默认"}/>}
                   visibleColumns={visibleColumns}/>)
  }

  async deleteSetting() {
    if (!this.showSetting) {
      return;
    }
    let r = await this.RequestServerPost(this.props.settingDeleteUrl, {id: "select_" + this.props.id,}, false, true, false);
    if (r.Success) {
    }
  }

  async saveSetting(items) {
    if (!this.showSetting) {
      return;
    }
    let setting = JSON.stringify(items);
    let p = {
      id: "select_" + this.props.id,
      name: this.props.id,
      setting: setting,
      配置项: this.props.id,
      配置类型: "组件配置",
      配置值: setting,
    }
    let r = await this.RequestServerPost(this.props.settingSaveUrl, p, undefined, true, false);
    return r.Success;
  }


  GetValue() {
    if (this.useStateValue) {
      let values = this.state.valueItems;
      if (this.props.isMultiSelect) {
        this.state.value = [];
        this.state.record = values;
        for (let i = 0; i < values.length; i++) {
          this.state.value.push(values[i][this.valueField]);
        }
      } else {
        this.state.value = undefined;
        this.state.record = undefined;
        for (let i = 0; i < values.length; i++) {
          this.state.value = values[i][this.valueField];
          this.state.record = values[i];
        }
      }
      return this.state.value;
    } else {
      if (this.props.isMultiSelect) {
        if (!this.props.value) {
          return [];
        }
      }
    }
    return this.props.value;
  }

  validateItems(v) {
    if (this.props.isMultiSelect) {
      let map = {};
      this.state.valueItems.forEach(item => {
        map[item[this.valueField]] = item;
      });
      v.forEach(_v => {
        if (!map[_v]) {
          this.state.valueItems.push({
            isNew: true,// @ts-ignore
            [this.props.displayField]: _v,// @ts-ignore
            [this.valueField]: _v
          });
        }
      });
    } else {
      if (this.state.valueItems.length == 0 && v) {
        this.state.valueItems = [{
          isNew: true,// @ts-ignore
          [this.props.displayField]: v,// @ts-ignore
          [this.valueField]: v
        }];
      }
    }
  }

  async SetValue(value, triggerValueChange = true) {
    if(value==this.state.value){
      return;
    }
    if (this.props.isMultiSelect && typeof value === "string") {
      value = XString.split(value);
    }

    this.useStateValue = true;
    let v = value;
    this.state.valueItems = [];
    this.state.value = "";
    this.state.record = undefined;
    if ((!this.props.isMultiSelect && v) || (this.props.isMultiSelect && v instanceof Array && v.length > 0)) {
      if (this.state.items && this.state.items.length > 0) {
        if (this.props.isMultiSelect) {
          this.state.valueItems = this.state.items.filter((item) => {
            if (XArray.Contains(v, item[this.valueField])) {
              return item;
            }
          });
        } else {
          this.state.valueItems = this.state.items.filter((item) => {
            if (v === item[this.valueField]) {
              return item;
            }
          });
        }
      } else if (this.props.dataSourceUrl) {
        let pageIndex = 0;
        let pageSize = this.props.isMultiSelect ? v.length : 1;
        let valueField = this.valueField === "id" ? "ids" : this.valueField;
        const r = await this.RequestServerPost(this.props.dataSourceUrl, {
          [valueField]: v, pageIndex, pageSize,
        }, true, true);
        if (r.Success && r.Value) {
          this.state.valueItems = r.Value.rows;
        }
      }
    }
    if (v) {
      this.validateItems(v);
      this.state.value = this.GetValue();
    }
    this.setState({
      value: this.state.value,
      record: this.state.record,
      valueItems: this.state.valueItems,
    });
    if (triggerValueChange) {
      this.onValueChangeEvent();
    }
  }

  ClearFilterData() {
    this.setState({filterData: {...this.props.filterData}, mustHasFilter: this.props.mustHasFilter})
  }

  async Refresh(filter?: object, isnew?: boolean) {
    if (isnew) {
      this.state.filterData = {...this.props.filterData, ...filter,};
    } else {
      this.state.filterData = {...this.state.filterData, ...filter,}
    }
    let mustHasFilter = this.props.mustHasFilter && XTools.isEmptyObject(this.state.filterData);
    this.setState({filterData: this.state.filterData, mustHasFilter}, () => {
      this.pulllist?.Refresh(filter, isnew);
    });
  }

  GetText() {
    let t = [];
    let values = this.state.valueItems;
    if (this.props.isMultiSelect) {
      for (let i = 0; i < values.length; i++) {
        t.push(values[i][this.props.displayField]);
      }
    } else {
      for (let i = 0; i < values.length; i++) {
        t = [values[i][this.props.displayField]];
      }
    }
    return t.join(",");
  }

  onSelectChange = (values) => {
    let list2str = (values) => {
      let list = values;
      if (values) {
        list = [];
        values.forEach(item => {
          list.push({[item[this.valueField]]: item[this.props.displayField]})
        })
      }
      return JSON.stringify(list);
    }
    if (list2str(this.state.valueItems) !== list2str(values)) {
      this.useStateValue = true;
      this.state.valueItems = values;
      this.state.value = this.GetValue();
      this.setState({value: this.state.value, record: this.state.record, valueItems: this.state.valueItems,})
      this.onValueChangeEvent();
    }
  };

  /**
   * 获取搜索字段列表
   */
  GetSearchFields() {
    let list = [...this.props.searchFields];
    if (list.length == 0 && this.props.displayField) {// @ts-ignore
      list.push(this.props.displayField);
    }
    return list;
  }


  customDropdownRenderer = ({props, state, methods}) => {
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
      {this.renderList((item) => methods?.addItem(item), this.props.dropdownHeight)}
    </div>
  };

  pulllist: any;

  checkedValue: any;

  renderList(onClick?: (item) => void, maxHeight?: string) {
    let isMobile = onClick == undefined;
    if (!this.checkedValue) {
      this.checkedValue = this.GetValue();
    }
    let isCheck = (item) => {
      return this.props.isMultiSelect ? this.checkedValue.indexOf(item[this.valueField]) !== -1 : this.checkedValue === item[this.valueField];
    };
    if (isMobile) {
      if (this.props.isMultiSelect) {
        this.checkedValue = [...this.checkedValue];
      }
      onClick = (item) => {
        let _value = item[this.valueField];
        if (this.props.isMultiSelect) {
          let index = this.checkedValue.indexOf(_value)
          if (index == -1) {
            this.checkedValue.push(_value);
          } else {
            this.checkedValue.splice(index, 1);
          }
        } else {
          this.checkedValue = _value;
        }
        this.pulllist?.RefreshView();
      }
    }
    return <XPullList ref={(e) => this.pulllist = e} maxHeight={maxHeight}
                      dataSourceUrl={this.props.dataSourceUrl} data={this.state.items}
                      isCheck={this.props.isMultiSelect}
                      filterData={this.state.filterData} onServerResult={this.props.onServerResult}
                      mustHasFilter={this.state.mustHasFilter}
                      displayField={this.props.displayField} valueField={this.valueField}
                      searchFields={this.GetSearchFields()}
                      itemRender={(item, index,list) => {
                        let _onClick = () => onClick && onClick(item);
                        let checked = isCheck(item);
                        if (this.props.itemRender) {
                          return this.props.itemRender(checked, item, index, _onClick);
                        }
                        return <ListItem item={item} key={"item" + index}
                                         itemContentRender={() => {// @ts-ignore
                                           let label = item[this.props.displayField];
                                           if (this.props.itemContentRender) {
                                             return this.props.itemContentRender(label, item, checked);
                                           }
                                           return label;
                                         }}
                                         usePropsChecked={isMobile || !this.props.isMultiSelect} checked={checked}
                                         isMultiSelect={this.props.isMultiSelect} onClick={_onClick}/>
                      }}/>;
  }

  pullSearch(v) {
    if (this.props.mustHasFilter && XTools.isEmptyObject(this.state.filterData)) {
      return;
    }
    let p = {KeywordFields: this.GetSearchFields(), KeywordValue: v,}
    if (this.props.dataSourceUrl) {
      this.pulllist?.Refresh(p, true);
    } else {
      if (p.KeywordFields?.length > 0) {
        let data = [...this.state.items];
        if (v) {
          let values = v.split(" ");
          data = this.state.items.filter((item) => {
            if (p.KeywordFields.length == 1) {
              let value = item[p.KeywordFields[0]];
              value = value ? value.toLowerCase() : "";
              if (value.indexOf(v.toLowerCase().trim()) >= 0) {
                return item;
              }
            } else {
              let validate = true;
              p.KeywordFields.forEach((field, index) => {
                if (values[index]) {
                  if (item[field]) {
                    let text = item[field].toLowerCase();
                    let key = values[index].toLowerCase();
                    if (text.indexOf(key) == -1) {
                      validate = false;
                    }
                  } else {
                    validate = false;
                  }
                }
              });
              if (validate) {
                return item;
              }
            }
          });
        }
        this.pulllist?.SetData(data);
      }
    }
  }

  btnAdd: XButton
  addValue: XInput

  showModal() {
    let fields = this.GetSearchFields();
    let label = this.GetLabel();
    label = label ? label : "请选择";
    let modal = XModal.ModalShowMobile(label, () => {
      this.SetValue(this.checkedValue);
      return true;
    }, <XGrid rowsTemplate={this.props.allowAdd ? ["auto", "auto", "1fr"] : ["auto", "1fr"]}>
      <XGrid columnsTemplate={["1fr", "auto", "auto"]} columnGap={"2px"}>
        <XInput ref={e => this.addValue = e} onValueChange={(value) => {
          this.btnAdd?.SetText("直接添加:" + value);
          this.pullSearch(value);
        }} boxStyle={{marginLeft: 2}} placeholder={this.getPlaceholder(fields)}/>
        <XButton text={"搜索"}/>
      </XGrid>
      {this.props.allowAdd && <XFlex boxStyle={{margin: "5px 0px"}} justifyContent={"center"}>
        <XButton ref={e => this.btnAdd = e} cellStyleType={"mobile"} styleType={XButton.StyleType.common} size="xs"
                 type={"default"} text={"直接添加:"} onClick={() => {
          let value = this.addValue?.GetValue();
          if (value) {
            this.useStateValue = true;
            let item = {
              isNew: true,// @ts-ignore
              [this.props.displayField]: value,// @ts-ignore
              [this.valueField]: value
            };
            if (this.props.isMultiSelect) {
              this.state.valueItems.push(item);
              this.state.value = this.GetValue();
            } else {
              this.state.valueItems = [item];
              this.state.value = this.GetValue();
            }
            this.setState({value: this.state.value, record: this.state.record, valueItems: this.state.valueItems,})
            this.onValueChangeEvent();
            modal.handleCancel();
          }
        }}/>
      </XFlex>}
      {this.renderList()}
    </XGrid>, undefined, "70vh");
  }

  getPlaceholder(searchFields = []) {
    let ret = searchFields.join(' ');
    return "查找：" + (ret == "label" ? "名称" : ret);
  }

  handleKeyDownFn({event, state, props, methods, setState}) {
    if (this.props.isMultiSelect) {
      return;
    }
    const arrowUp = event.key === 'ArrowUp';
    const arrowDown = event.key === 'ArrowDown';
    const enter = event.key === 'Enter';
    if (this.state.valueItems?.length > 0 && this.pulllist && (arrowUp || arrowDown)) {
      let values = this.pulllist.GetData();
      let value = this.checkedValue;
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
      this.checkedValue = values[index][this.valueField];
      this.pulllist?.RefreshView();
    } else if (enter && this.checkedValue) {
      this.SetValue(this.checkedValue);
      methods.dropDown('close');
    }
  }

  select: MSelect;

  renderEditor() {
    let isEmpty = true;
    let value = this.GetValue();
    if ((value && !this.props.isMultiSelect) || (this.props.isMultiSelect && value.length > 0)) {
      isEmpty = false;
    }
    if (this.GetStyleType() === XSelectList.StyleType.common) {
      return <>
        <div onClick={() => this.showModal()}
             style={{width: "100%", height: "100%", display: "flex", alignItems: "center", wordBreak: "break-all"}}>
          {this.GetText()}
        </div>
        {!isEmpty && this.props.allowNull &&
          <XIcon.CloseCircle color={"#BCBCBC"} width={"20px"} style={{marginRight: 5}}
                             onClick={() => this.SetValue("")}/>}
        <div className={"x-cell__arrow"} style={{transform: "rotate(90deg)"}}/>
      </>
    }
    return <StyledSelect
      ref={e => this.select = e}
      placeholder="选择..."
      multi={this.props.isMultiSelect}
      searchable={this.props.showSearch}
      dropdownPosition={this.props.dropdownPosition}
      dropdownHeight={"300px"}
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
      itemContentRender={this.props.itemContentRender}
      values={this.state.valueItems}
      onDropdownClose={() => {
        this.checkedValue = undefined;
        this.props.onDropdownClose?.();
      }}
      searchFn={(value) => this.pullSearch(value)}
      onChange={(values) => this.onSelectChange(values)}
      portal={this.rootElement}
    />
  }
}

export interface ListItemProps {
  itemContentRender: () => any,
  item?: object,
  checked?: boolean,
  usePropsChecked?: boolean,
  isMultiSelect?: boolean,
  onClick?: () => void,
}

export class ListItem extends Component<ListItemProps, any> {
  declare state: any;
  static defaultProps = {
    checked: false,
    usePropsChecked: false,
  };

  constructor(props) {
    super(props);
    this.state = {checked: this.props.checked,};
  }

  onCheckEvent() {
    this.props.onClick && this.props.onClick();
    if (!this.props.usePropsChecked) {
      this.state.checked = !this.state.checked;
      this.setState({checked: this.state.checked,})
    }
  }

  render() {
    return <Item className={"react-dropdown-select-dropdown"} style={{minHeight: 30}}>
      <input type={this.props.isMultiSelect ? "checkbox" : "radio"} onChange={() => this.onCheckEvent()}
             checked={this.props.usePropsChecked ? this.props.checked : this.state.checked}/>
      <ItemLabel onClick={() => this.onCheckEvent()}>{this.props.itemContentRender()}</ItemLabel>
    </Item>
  }
}

const StyledSelect = styled(MSelect)`
  .react-dropdown-select-dropdown {
    overflow: initial;
  }
`;

export const SearchAndToggle = styled.div`
  display: flex;
  flex-direction: column;

  input {
    line-height: 30px;
    padding: 0px 20px;
    border: 1px solid #ccc;
    border-radius: 3px;
    :focus {
      outline: none;
      border: 1px solid deepskyblue;
    }
  }
`;


export const Item = styled.div`
  display: flex;
  position: relative;
  padding: 0px 10px 0px 10px;
  align-items: center;
  width:100%
`;

export const ItemLabel = styled.div`
  padding: 5px 10px;
  width:100%;
  :hover {
    border: 1px solid deepskyblue;
    background-color: #bcbcbc;
  }
`;


export const Button = styled.button`
  background: none;
  border: 1px solid #555;
  color: #555;
  border-radius: 3px;
  margin: 10px 10px 0;
  padding: 3px 5px;
  font-size: 10px;
  // text-transform: uppercase;
  cursor: pointer;
  outline: none;

  &.clear {
    color: tomato;
    border: 1px solid tomato;
  }

  :hover {
    border: 1px solid deepskyblue;
    color: deepskyblue;
  }
`;


