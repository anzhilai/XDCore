import React, {Component} from 'react';
import {Breadcrumb, message, Popover} from "antd";
import XBaseEditor, {XBaseEditorProps} from '../base/XBaseEditor';
import XMessage from "../display/XMessage";
import XTableGrid from "../display/XTableGrid";
import XPullList from "../display/XPullList";
import XFlex from "../layout/XFlex";
import XGrid from "../layout/XGrid";
import XButton from "./XButton";
import XTools from "../toolkit/XTools";
import XModal from '../layout/XModal';
import XTabs from "../layout/XTabs";
import XCell from "../layout/XCell";
import XArray from "../toolkit/XArray";
import XIcon from "../display/XIcon";
import Dropdown from "./select/components/Dropdown";
import ClickOutside from "./select/components/ClickOutside";
import ReactDOM from "react-dom";
import XBasePage from "../base/XBasePage";

export interface XSelectTreeProps extends XBaseEditorProps {
  /**
   * 分隔符
   * @defaultValue /
   */
  separator?: string,
  /**
   * 显示文本信息
   */
  text?: string,
  /**
   * 服务端树路径的访问URL
   */
  treePathInfoUrl?: string,
  /**
   * 树的根节点
   */
  treeRoot?: string,
  /**
   * 选择项的显示字段
   */
  displayField?: string,
  /**
   * 值的显示方式，字符串还是树路径
   */
  valueIsTreePath?: boolean,
  /**
   * 是否多选
   */
  isMultiSelect?: boolean,
  /**
   * 表格显示列表
   */
  visibleColumns?: any[],
  isTree?: boolean,
  /**
   * 是否按层级显示
   */
  isTreeShow?: boolean,
  /**
   * 严格检查
   */
  checkStrictly?: boolean,
  /**
   * 显示树名称
   */
  showTreeName?: boolean,
  /**
   * 点击确认事件
   */
  onOK?: (e: XSelectTree) => void,
}

/**
 * 选择一个层次树结构
 * @name 树选择
 * @groupName 选择
 */
export default class XSelectTree extends XBaseEditor<XSelectTreeProps, any> {
  static ComponentName = "树选择";
  static StyleType = {web: 'web', common: 'common'};

  static defaultProps = {
    ...XBaseEditor.defaultProps,
    separator: "/",
    text: '选择',
    treePathInfoUrl: undefined,
    treeRoot: "0",
    displayField: undefined,
    valueIsTreePath: false,
    isMultiSelect: false,
    isTree: true,
    isTreeShow: true,// 是否按层级显示
    checkStrictly: false,
    showTreeName: false,
    onOK: undefined,
  };


  rootElement: HTMLElement;
  constructor(props: any) {
    super(props);
    this.state = {
      ...this.state,
      popVisibles: [],
      breads: [{
        id: this.props.treeRoot,
        [this.props.displayField]: this.props.text,
      }],
      treeSelectValue: {},
      treeSelectRows: [],
      value: this.props.value,
      treeRoot: this.props.treeRoot,
    }
    this.dropdownRoot = typeof document !== 'undefined' && document.createElement('div');
    this.rootElement = XBasePage.GetApp()?.rootElement ? XBasePage.GetApp()?.rootElement : document.body;
  }

  dropdownRoot: HTMLElement;
  componentDidMount() {
    super.componentDidMount();
    this.rootElement.appendChild(this.dropdownRoot);
    if (this.state.value) {
      this.SetValue(this.state.value);
      // } else {
      //   this.SetValue();
    }
  }

  componentWillUnmount() {// @ts-ignore
    super.componentWillUnmount();
    this.rootElement.removeChild(this.dropdownRoot);
  }

  GetValue() {
    let value = super.GetValue();
    if (this.props.isMultiSelect) {
      if (value) {
        value = value.join();
      }
    }
    return value;
  }

  GetText() {
    if (this.state.breads && this.state.breads.length > 0) {
      if (this.state.breads.length == 1) {
        return "";
      }
      if (this.props.showTreeName) {
        let str = "";
        this.state.breads.forEach((item, index) => {
          if (index > 0) {
            if (str) {
              str += "/";
            }
            str += item[this.props.displayField];
          }
        })
        return str;
      } else {
        return this.state.breads[this.state.breads.length - 1][this.props.displayField];
      }
    }
    return this.GetValue();
  }

  async SetValue(value?: any, triggerValueChange = true) {
    if (this.props.isMultiSelect) {
      if (typeof value === "string") {
        value = value.split(",");
      }
    }
    this.useStateValue = true;
    this.state.value = value;
    this.state.record = null;
    const root = {id: this.state.treeRoot};
    root[this.props.displayField] = this.props.text;
    // @ts-ignore
    if (this.props.data) { // @ts-ignore
      root.children = this.props.data;
    }
    this.state.breads = [];
    this.state.breads.push(root);
    if (value) {
      if (this.props.dataSourceUrl) {
        let postData: any = {};
        let url = this.props.treePathInfoUrl;
        if (!url && this.props.dataSourceUrl) {
          url = this.props.dataSourceUrl.split("/")[0] + "/treeinfo";
        }
        if (this.props.isMultiSelect) {
          postData = {...this.props.filterData}
          url = this.props.dataSourceUrl;
          postData.ids = this.getSelectIds(value);
        } else {
          postData.id = value;
          if (this.props.valueIsTreePath) {
            const vs = value.split('/');
            postData.id = vs[vs.length - 1];
          }
        }
        const retData: any = await this.RequestServerPost(url, postData);
        this.state.value = value;
        if (retData.Success) {
          this.state.breads = [];
          this.state.breads.push(root);
          if (this.props.isMultiSelect) {
            this.state.record = retData.Value.rows;
          } else {
            this.state.record = retData.Value.rows[retData.Value.rows.length - 1];
          }
          for (let i = 0; i < retData.Value.rows.length; i += 1) {
            const row = retData.Value.rows[i];
            // if(row.Parentid===this.state.treeRoot||row.TreePath.indexOf(this.state.treeRoot)>-1){
            this.state.breads.push(row);
            // }
          }
        } else {
          XMessage.ShowError(retData.Message);
        }
      } else {
        this.state.breads = [];
        this.state.breads.push(root);
        // @ts-ignore
        if (this.props.data) { // @ts-ignore
          let list = this.initBreads(root.children, value)
          if (list.length > 0) {
            list.reverse();//倒序
            this.state.breads = [...this.state.breads, ...list];
          }
        }
      }
    }
    this.setState({breads: this.state.breads, value: this.state.value, record: this.state.record});
    if (triggerValueChange) {
      this.onValueChangeEvent();
    }
  }

  initBreads(list, value, ret = []) {
    if (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id == value) {
          ret.push(list[i]);
          break;
        } else {
          this.initBreads(list[i].children, value, ret);
          if (ret.length > 0) {
            ret.push(list[i]);
            break;
          }
        }
      }
    }
    return ret;
  }

  getSelectIds(value: any) {
    if (!value) {
      return [];
    }
    let ids = value;
    if (this.props.valueIsTreePath) {
      ids = [];
      value.forEach((item: any) => {
        const vs = item.split('/');
        ids.push(vs[vs.length - 1]);
      });
    }
    return ids;
  }

  getTreeSelectRows(treeSelects, treeValue) {
    if (treeValue.parent) {
      this.getTreeSelectRows(treeSelects, treeValue.parent);
    }
    treeSelects.push(treeValue);
  }

  onButtonOKClick(item, index) {
    if (this.props.isMultiSelect) {
      if (this.state.treeSelectRows.length == 0) {
        message.info("请选择节点");
        return;
      }
      let newbs = [this.state.breads[0], ...this.state.treeSelectRows];
      this.setBreadValue(newbs, 0);
      return;
    }
    if (XTools.isEmptyObject(this.state.treeSelectValue[item.id])) {
      message.info("请选择节点");
      return;
    }
    const treeSelects = [];
    this.getTreeSelectRows(treeSelects, this.state.treeSelectValue[item.id]);
    const newbs = [];
    for (let i = 0; i < this.state.breads.length; i += 1) {
      newbs.push(this.state.breads[i]);
      if (this.state.breads[i].id === item.id) {
        let add = false;
        for (let t = 0; t < treeSelects.length; t += 1) {
          const tv = treeSelects[t];
          if (item.id === this.state.treeRoot && t == 0) {//处理只有一部分机构的问题
            add = true;
          } else if (tv.Parentid === item.id) {
            tv.parent = item;
            add = true;
          }
          if (add) {
            newbs.push(tv);
            if (t + 1 < treeSelects.length) {
              treeSelects[t + 1].parent = treeSelects[t];
            }
          }
        }
        break;
      }
    }
    this.setBreadValue(newbs, index);
  }

  onButtonClearClick(item, index) {
    const newbs = [];
    for (let i = 0; i < this.state.breads.length; i += 1) {
      newbs.push(this.state.breads[i]);
      if (this.state.breads[i].id === item.id) {
        break;
      }
    }
    this.setBreadValue(newbs, index);
  }

  setBreadValue(newbs, index) {
    this.useStateValue = true;
    let row;
    let value: any = "";
    if (newbs.length > 1) {// 第1级是选择
      if (this.props.isMultiSelect) {
        const ids = [];
        row = [];
        newbs.forEach((item, i) => {
          if (i > 0) {
            row.push(item);
            if (this.props.valueIsTreePath) {
              ids.push(item.TreePath);
            } else {
              ids.push(item.id);
            }
          }
        });
        value = ids;
      } else {
        row = newbs[newbs.length - 1];
        value = row.id;
        if (this.props.valueIsTreePath) {
          value = row.TreePath;
        }
      }
    }
    this.state.value = value;
    this.state.record = row;
    this.onValueChangeEvent();
    this.state.breads = newbs;
    this.state.popVisibles[index] = false;
    this.setState({
      value: this.state.value,
      record: this.state.record,
      popVisibles: this.state.popVisibles,
      breads: this.state.breads,
    }, () => {
      this.props.onOK && this.props.onOK(this);
    });
  }

  onButtonCancelClick(index) {
    this.state.popVisibles[index] = false;
    this.setState({
      popVisibles: this.state.popVisibles,
    });
  }

  onBreadClick(item, index) {
    if (this.GetReadOnly()) {
      return;
    }
    if (!this.props.isTreeShow && index > 0) {
      return;
    }
    const v = this.state.popVisibles[index];
    for (const i in this.state.popVisibles) {
      this.state.popVisibles[i] = false;
    }
    this.state.popVisibles[index] = !v;
    if (item.tree && item.selectChildren) {
      item.tree.SetSelectRow(item.selectChildren);
    }
    this.setState({popVisibles: this.state.popVisibles,});
  }

  modal: XSelectTreeModal;

  showModal() {
    let label = this.GetLabel();
    label = label ? label : "请选择";
    XModal.ModalShowMobile(label, () => {
      let list = this.modal.GetList();
      if (list.length == 0) {
        XMessage.ShowInfo("请选择数据");
        return false;
      }
      this.useStateValue = true;
      this.state.record = list[list.length - 1];
      this.state.value = list[list.length - 1].id;
      this.setState({breads: [this.state.breads[0], ...list], value: this.state.value, record: this.state.record},);
      this.onValueChangeEvent();
      return true;
    }, <XSelectTreeModal ref={e => this.modal = e} dataSourceUrl={this.props.dataSourceUrl}
                         list={this.state.breads.slice(1)}
                         displayField={this.props.displayField} filterData={this.props.filterData}
                         parent={this}/>, undefined, "70vh")
  }

  popupContainer: HTMLElement;
  renderEditor() {
    let isEmpty = true;
    let value = this.GetValue();
    if ((value && !this.props.isMultiSelect) || (this.props.isMultiSelect && value.length > 0)) {
      isEmpty = false;
    }
    if (this.GetStyleType() === XSelectTree.StyleType.common) {
      return <>
        <div onClick={() => this.showModal()}
             style={{width: "100%", height: "100%", display: "flex", alignItems: "center", wordBreak: "break-all"}}>
          {this.GetText()}
        </div>
        {!isEmpty && <XIcon.CloseCircle color={"#BCBCBC"} width={"20px"} style={{marginRight: 5}}
                                        onClick={() => this.SetValue("")}/>}
        <div className={"x-cell__arrow"} style={{transform: "rotate(90deg)"}}/>
      </>
    }
    let showDropDownIndex = -1;
    for (let i = 0; i < this.state.popVisibles?.length; i++) {
      if (this.state.popVisibles[i]) {
        showDropDownIndex = i;
        break;
      }
    }
    return <ClickOutside onClickOutside={(event) => {
      const target = (event && event.target) || (event && event.srcElement);
      if (!ClickOutside.hasClass(target, 'react-dropdown-select-dropdown')) {
        this.state.popVisibles[showDropDownIndex] = false;
        this.setState({popVisibles: this.state.popVisibles})
      }
    }}>
      <div ref={e => this.popupContainer = e} style={{boxSizing: "border-box",position: "relative",display: "flex"}}>
        <Breadcrumb>{this.renderBreadcrumb(this.state.breads)}</Breadcrumb>
        {showDropDownIndex >= 0 && this.renderDropdown(showDropDownIndex)}
      </div>
    </ClickOutside>
  }

  renderDropdown(index) {
    let state = {selectBounds: this.popupContainer?.getBoundingClientRect()};
    let props = {
      dropdownWidth: "300px",
      dropdownHeight: "600px",
      dropdownLeftPosition: "auto",
      dropdownPosition: "auto",
      portal: this.rootElement,
      dropdownGap: 10,
      minDropdownWidth: "300px",
      dropdownRenderer: ({props, state, methods}) => {
        return this.renderTree(this.state.breads[index], index);
      }
    };
    if (this.props.visibleColumns) {
      props.dropdownWidth = "auto";
    }
    let methods = {
      getSelectRef: () => this.popupContainer,
    };
    return this.dropdownRoot ?
      ReactDOM.createPortal(<Dropdown props={props} state={state} methods={methods}/>, this.dropdownRoot) :
      <div></div>
  }

  renderBreadcrumb = (breads) => {
    if (this.props.isMultiSelect) {
      if (breads.length === 0) {
        return;
      }
      const index = 0;
      const bread = breads[index];
      return <div>
        {!this.GetReadOnly() && <Breadcrumb.Item key={bread.id}>
          <a onClick={() => this.onBreadClick(bread, index)}>{bread[this.props.displayField]}</a>
        </Breadcrumb.Item>}
        {breads.map((breaditem, itemIndex) => {
          if (itemIndex > 0) {
            return <span style={{marginRight: 5}}>{breaditem[this.props.displayField]}</span>
          }
          return <></>;
        })}
      </div>
    } else {
      return breads.map((bread, index) => {
        let name = bread[this.props.displayField];
        if (!this.props.isTreeShow) {
          if (index !== 0 && index !== breads.length - 1) {
            return <></>;
          } else {
            if (index > 0) {
              name = "";
              breads.forEach((item, itemIndex) => {
                if (itemIndex > 0) {
                  name += item[this.props.displayField];
                }
              });
            }
          }
        }
        if (this.GetReadOnly() && index === 0) {
          return <></>;
        }
        if (this.GetReadOnly()) {
          return (index > 1 ? "/" : "") + name;
        }
        return <Breadcrumb.Item key={bread.id}>
          <a onClick={() => this.onBreadClick(bread, index)}>{name}</a>
        </Breadcrumb.Item>
      })
    }
  }

  Focus() {
    if (this.state.breads.length > 0) {
      this.onBreadClick(this.state.breads[0], 0)
    }
  }

  renderTree = (item, index) => {
    let columns = [];
    if (this.props.displayField) {
      columns.push({field: this.props.displayField, keyword: true});
    }
    if (this.props.visibleColumns) {
      columns = this.props.visibleColumns;
    }
    return <XGrid height={"500px"} boxStyle={{padding: 5}} rowsTemplate={["1fr", "auto"]}>
      <XTableGrid isMultiSelect={this.props.isMultiSelect} checkStrictly={this.props.checkStrictly} enableEdit={false}
                  ref={e => {
                    if (e && this.props.isMultiSelect) {
                      e.SetSelectedRowKeys(this.getSelectIds(this.state.value));
                    }
                  }}
                  key={`xtable${item.id}`} grid={[1, 1]} data={item.children} mustHasFilter={this.props.mustHasFilter}
                  filterData={{...this.props.filterData, Parentids: item.id == "0" ? undefined : [item.id]}}
                  showButtons={false} isTree dataSourceUrl={this.props.dataSourceUrl} visibleColumns={columns}
                  onSelectChange={(row: any) => {
                    if (this.props.isMultiSelect) {// 多选处理
                      this.state.treeSelectRows = row;
                    } else {
                      this.state.treeSelectValue[item.id] = row;
                    }
                  }}/>
      <XFlex grid={[2, 1]} contentHAlign={XFlex.Align.end}>
        <XButton text="确定" onClick={() => this.onButtonOKClick(item, index)}/>
        <XButton text="清除" onClick={() => this.onButtonClearClick(item, index)}/>
        <XButton text="取消" onClick={() => this.onButtonCancelClick(index)}/>
      </XFlex>
    </XGrid>
  }
}


export interface XSelectTreeModalProps {
  list?: [],
  displayField?: string,
  dataSourceUrl?: string,
  filterData?: object,
  parent?: XSelectTree,
}

export class XSelectTreeModal extends Component<XSelectTreeModalProps, any> {
  declare state: any;
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {list: [...this.props.list]};
    this.pullList = {};
  }

  GetList() {
    return this.state.list;
  }

  pullList: {}

  renderList(item, tabIndex) {
    let tabItem = this.state.list[tabIndex];
    let filterData = {...this.props.filterData, IsTree: true, Parentids: item.id == "0" ? undefined : [item.id],};
    return <XPullList ref={e => this.pullList[tabIndex] = e} dataSourceUrl={this.props.dataSourceUrl}
                      filterData={filterData} isPagination={false} onServerResult={result => {// @ts-ignore
      if (result.Success && filterData.Parentids) {// @ts-ignore
        result.Value.rows = result.Value.rows.filter(row => row.id != filterData.Parentids[0])
      }
      return result;
    }} itemRender={(item, index) => {// @ts-ignore
      let check = tabItem?.id == item.id;// @ts-ignore
      return <XCell key={"cell" + item.id + check} styleType={"mobile"}
                    label={item[this.props.displayField]}
                    description={check ? <XIcon.Check color={"#00BC71"}/> : undefined}
                    onClick={() => {
                      let list = this.state.list;
                      for (let i = list.length; i >= 0; i--) {
                        if (i >= tabIndex) {
                          list.splice(i, 1);
                        }
                      }
                      XArray.arrayAddKey(list, item);
                      this.setState({list}, () => {
                        this.pullList[tabIndex]?.RefreshView();
                        this.tabs?.SetActiveKey(tabIndex + 1)
                      })
                    }}/>
    }}/>;
  }

  tabs: XTabs;

  componentDidMount() {
    if (this.state.list.length > 0) {
      this.tabs?.SetActiveKey(this.state.list.length)
    }
  }

  render() {
    let title = (list, index) => {
      let item = list[index];
      return item ? item[this.props.displayField] : "请选择";
    }
    let list = this.state.list;
    return <XGrid>
      <XTabs ref={e => this.tabs = e} styleType={XTabs.StyleType.common} titleWidth={"auto"}>
        <XTabs.Panel key={"tabs_0"} title={title(list, 0)}>
          {this.renderList({id: "0"}, 0)}
        </XTabs.Panel>
        {list.map((item, index) => {
          if (item.IsTreeLeaf == 0) {
            return <XTabs.Panel key={"tabs_" + item.id} title={title(list, index + 1)}>
              {this.renderList(item, index + 1)}
            </XTabs.Panel>
          }
        })}
      </XTabs>
    </XGrid>
  }
}