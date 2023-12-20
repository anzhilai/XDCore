import React from 'react';
import cloneDeep from "lodash/cloneDeep";
import XForm from "../editor/XForm"
import XInput from "../editor/XInput"
import XRadioGroup from "../editor/XRadioGroup"
import XSelectList from "../editor/XSelectList"
import XSelectTree from "../editor/XSelectTree"
import XModal from "../layout/XModal"
import XCard from "../layout/XCard"
import XFlex from "../layout/XFlex"
import XGrid from "../layout/XGrid"
import XBaseObject, {XBaseObjectProps} from "./XBaseObject";
import XBaseApp from './XBaseApp';
/**
 * 页面组件属性
 */
export interface XBasePageProps extends XBaseObjectProps {
  children?: React.ReactNode,
  /**
   * 是否验证用户是否登录
   */
  valiateUser?: boolean,
  /**
   * 登录用户对当前菜单的权限信息
   */
  operations?: any,
  /**
   * 显示默认视图
   */
  view?: string,
  /**
   * 页面右上角视图列表
   */
  views?: string[],
  /**
   * 是否显示多视图
   */
  showFilterView?: boolean,
}

let app: XBaseApp;

/**
 * 基础页面组件
 * 是业务系统中所有页面的基类，直接继承于基础组件，
 * 包含了整个系统的目录结构，为页面提供统一的权限管理和视图管理。还提供了各种常用的表格和表单操作，方便业务系统的实现。
 * @name 基础页面组件
 * @groupName 应用
 */
export default class XBasePage<P = {}, S = {}> extends XBaseObject<XBasePageProps & P, any> {

  static GetApp = () => app;
  static SetApp = (_app: XBaseApp) => {
    app = _app;
  };
  static defaultProps = {
    ...XBaseObject.defaultProps,
    operations: undefined,
    valiateUser: true,
    showFilterView: false,
    views: ["列表", "详情"],
    view: "详情",
  };
  static propTypes = {};
  menu: any
  operations: any
  state: any = {...this.state}

  constructor(props) {
    super(props);

    this.state.valiateUser = this.props.valiateUser;
    const gatherdata = this.GetGatherData();
    if (this.state.valiateUser && (!gatherdata || !gatherdata.gatheruser)) {
      //@ts-ignore
      this.GotoUrl(window.config.loginUrl);
      return;
    }
    this.state.user = gatherdata.gatheruser;
    this.state.menu = this.GetCurrentMenuItem(this.GetCurrentMenuKey(), this.props.valiateUser ? this.GetCurrentUserMenus() : this.GetAllMenuData());
    if (this.state.menu) {
      this.operations = this.state.menu.userOperations;//用户权限信息
    }
    if (this.props.operations !== undefined) {
      this.operations = this.props.operations;
    }
    this.state.operations = this.operations;
    this.state.view = this.props.view;
    this.state.views = this.props.views;
    this.state.showFilterView = this.props.showFilterView;
    this.userDataFilter = undefined;
    this.dataRightFilter = {UserID: "", UserTreePath: ""};
    if (this.state.user) {
      if (this.state.user.数据权限 == "全部数据") {
      } else if (this.state.user.数据权限 == "所属部门") {
        let TreePath = this.state.user.组织部门?.TreePath || this.state.user.组织机构?.TreePath;
        this.dataRightFilter.UserTreePath = TreePath;//默认查看所属部门
        this.userDataFilter = {UserTreePath: TreePath};
      } else {//个人
        this.dataRightFilter.UserID = this.state.user.id;//默认查看自己的数据
        this.userDataFilter = {UserID: this.state.user.id};
      }
    }
  }

  /**
   * 获取当前url hash
   */
  GetCurrentMenuKey() {
    return window.location.hash.split('?')[0].replace("#", "");
  }

  /**
   *  获取菜单组件
   * @param path 菜单path
   */
  GetMenuComponent(path: string) {
    return app ? app.componentMap[path] : undefined;
  }

  /**
   * 获取菜单
   * @param path hash值
   * @menus 菜单列表
   */
  GetCurrentMenuItem(path = this.GetCurrentMenuKey(), menus = this.GetCurrentUserMenus()) {
    let GetMenu = (path, menus) => {
      let ret = undefined;
      if (menus) {
        for (let i = 0; i < menus.length; i++) {
          let menu = menus[i];
          if (menu.path == path) {
            ret = menu;
          } else if (menu.children) {
            ret = GetMenu(path, menu.children);
          }
          if (ret) {
            break;
          }
        }
      }
      return ret;
    }
    let item = GetMenu(path, menus);
    if (item && item.operations && item._operations && !item.userOperations) {
      item.userOperations = {...item.operations};
      let allList = [];
      let map = {};
      let formatOperations = (_operations, parentName = "", operations = {}, root, validate = true) => {
        let ret = false;
        if (_operations) {
          if (validate && allList.indexOf(_operations) >= 0) {//相同的对象处理
            return ret;
          }
          allList.push(_operations);
          let list = [];//当前行信息
          for (let key in _operations) {
            let value = _operations[key];
            if (typeof value == "function") {
              operations[key] = {};
              let v = value();
              let ret = formatOperations(v, parentName + key + "_", operations[key], root, list.indexOf(v) == -1)
              if (ret) {
                map[v] = operations[key];
              } else {
                operations[key] = map[v];
              }
              v && list.push(v);
            } else {
              if (parentName) {
                operations[key] = root[parentName + key] === undefined ? false : root[parentName + key];
              }
            }
          }
          ret = true;
        }
        return ret;
      }
      formatOperations(item._operations, "", item.userOperations, item.userOperations);
    }
    return item;
  }

  /**
   * 获取所有菜单
   * @param menus
   */
  GetAllMenuData() {
    return app ? app.GetMenuRoutes() : [];
  }

  /**
   * 获取当前用户菜单
   * @param reload 是否重新计算用户菜单
   */
  GetCurrentUserMenus(reload = false) {
    const gatherdata = this.GetGatherData();
    if (!gatherdata.CurrentUserMenus || reload) {
      if (gatherdata.gatheruser && (gatherdata.gatheruser.id === "admin")) {
        app?.ReSetUserMenus();
        gatherdata.CurrentUserMenus = this.GetAllMenuData();
      } else {
        app?.SetUserMenus(gatherdata.gathermenus);
        gatherdata.CurrentUserMenus = this.GetAllMenuData();
      }
    }
    return gatherdata.CurrentUserMenus;
  }

  /**
   * 验证hash是否有权限
   * @param path
   */
  CheckPath(path) {
    let ret = false;
    const gatherdata = this.GetGatherData();
    if (gatherdata.gatheruser && (gatherdata.gatheruser.id === "admin")) {
      ret = true;
    } else {
      for (let i in gatherdata.gathermenus) {
        const item = gatherdata.gathermenus[i];
        if (item.key.startsWith(path)) {
          ret = true;
          break;
        }
      }
    }
    return ret;
  }

  /**
   * 验证操作权限
   * @param name 操作名称
   */
  CheckOperation(name) {
    const gatherdata = this.GetGatherData();
    if (gatherdata.gatheruser && (gatherdata.gatheruser.id === "admin")) {
      return true;
    }
    if (this.operations === false) {
      return false;
    }
    if (this.operations === true) {
      return true;
    }
    if (name && this.operations) {
      if (this.operations[name] === undefined) {
        return false;
      }
      return this.operations[name];
    }
    return false;
  }

  Resize() {

  }

  /**
   * 获取当前是否为iframe
   */
  IsIframe() {
    return window.self != window.top;
  }

  /**
   * 保存单一字段的值
   * @param url 请求地址
   * @param id id
   * @param filed 字段
   * @param value 值
   * @param params 其他参数
   * @constructor
   */
  async SaveFiledValue(url: string, id: string, filed: string, value: string, params: any = {}) {
    params.id = id;
    params[filed] = value;
    const r = await this.RequestServer(url, params);
    return r.Success;
  }

  /**
   * 删除选中的数据
   * @param url 请求URL
   * @param table 表格对象
   * @param selectType 删除类型
   * @param callbackFuc 删除回调
   * @constructor
   */
  DeleteTableSelect(url: string, table: any, selectType?: string, callbackFuc?: any) {
    const rowkeys = table.GetSelectedRowKeys();
    let deleteAll = selectType === "删除全部";
    if (!deleteAll && rowkeys.length === 0) {
      return;
    }
    XModal.Confirm(deleteAll ? "是否确认删除全部数据，数据删除后，不可恢复？" : "是否删除选中项？", async () => {
      let p = {};
      if (deleteAll) {
        p = {
          ...table.GetFilterData(),
          deleteAll: deleteAll
        }
      } else {
        p = {ids: rowkeys};
      }
      const r = await this.RequestServer(url, p);
      callbackFuc && callbackFuc(r.Success)
      if (r.Success) {
        table.SetSelectedRowKeys([]);
        if (table.props.isTree) {
          const pids = [];
          const rows = table.GetSelectedRows();
          for (let i = 0; i < rows.length; i++) {
            pids.push(rows[i].Parentid);
          }
          table.Refresh({Parentids: pids})
        } else {
          table.Refresh();
        }
        return true;
      } else {
        //XMessage.ShowError(r.Message);
        return false;
      }
    })
  }

  /**
   * 删除数据
   * @param url 请求url
   * @param data 参数
   * @param table 刷新表格
   */
  async DeleteTableData(url: string, data: any, table: any) {
    const p = {id: data.id};
    const r = await this.RequestServer(url, p);
    if (r.Success) {
      if (table.props.isTree) {
        table.Refresh({Parentids: [data.Parentid]})
      } else {
        table.Refresh();
      }
      return true;
    } else {
      return false;
    }
  }


  /**
   * 保存数据
   * @param url 请求url
   * @param data 参数
   * @param tableOrFunc 表格对象或回调
   */
  async SaveData(url: any, data: any, tableOrFunc?: any) {
    const r = await this.RequestServer(url, data);
    if (r.Success) {
      if (typeof tableOrFunc === "function") {
        tableOrFunc();
      } else if (tableOrFunc) {
        if (tableOrFunc.props.isTree) {
          tableOrFunc.Refresh({Parentids: [r.Value.Parentid, data.Parentid]})
        } else {
          tableOrFunc.Refresh();
        }
      }
      return true;
    } else {
      return false;
    }
  }

  /**
   * 保存form表单
   * @param form xfrom对象
   * @param url 请求url
   * @param tableOrFunc 表格对象或回调
   * @param data 参数
   */
  async SaveFormData(form: any, url: any, tableOrFunc?: any, data?: any) {
    const e = form.ValidateEditorValues();
    if (e !== '') {
      return false;
    }
    let p = {};
    if (data) {
      for (const d in data) {
        if (typeof data[d] !== "object" || data[d] instanceof File) {
          p[d] = data[d];
        } else if (data[d] instanceof Array) {
          let isObject = false;
          data[d].forEach(item => {
            if (typeof item === "object") {
              isObject = true;
            }
          });
          if (!isObject) {
            p[d] = data[d];
          }
        }
      }
    }
    p = {
      ...p,
      ...form.GetEditorValues(),
    }//处理数组为空的情况
    for (let key in p) {
      if (p[key] instanceof Array && p[key].length == 0) {
        p[key] = "";
      }
    }
    const r = await this.RequestServer(url, p);
    if (r.Success) {
      if (typeof tableOrFunc === "function") {
        tableOrFunc(r.Value);
      } else if (tableOrFunc) {
        if (tableOrFunc.props.isTree) {
          // @ts-ignore
          let Parentids = [p.Parentid ? p.Parentid : "0"];
          if (data && data.Parentid) {
            Parentids.push(data.Parentid);
          }
          let _Parentid = form.props?.infoData?.Parentid;
          if (_Parentid && Parentids.indexOf(_Parentid) == -1) {
            Parentids.push(_Parentid);
          }
          await tableOrFunc.Refresh({Parentids})
        } else {
          await tableOrFunc.Refresh();
        }
        tableOrFunc.SetSelectedRow(p);
      }
      return true;
    } else {
      return false;
    }
  }

  /**
   * POST请求服务器
   * @param url 请求地址
   * @param params 参数
   * @param isShowError 是否显示错误
   */
  async RequestServer(url: any, params: any, isShowError = true) {
    return await this.RequestServerPost(url, params, isShowError);
  }

  /**
   * 保存数据
   * @param url 请求url
   * @param param 参数
   * @param table 表格对象
   * @constructor
   */
  async SaveNew(url: any, param: any, table = undefined) {
    let v = {
      ...param,
    }
    let ret = await this.RequestServerPost(url, v, true);
    let b = ret.Success;
    if (b) {
      table?.Refresh();
    }
    return b;
  }

  /**
   * 刷新数据权限
   * @param dataRightFilter 新参数
   * @param oldDataRightFilter 旧参数
   * @constructor
   */
  onDataRightChangeEvent(dataRightFilter, oldDataRightFilter) {

  }

  /**
   * 自定义权限视图
   */
  renderDataRightForm() {
    return <div/>
  }

  userDataFilter: any;
  dataRightFilter: any;
  dataRightFilterForm: any;

  render() {
    let 人员信息Url = "ryxx";
    let 组织部门Url = "zzbm";
    let 组织名称 = "组织名称";
    let 组织部门TreePath = "组织部门TreePath";
    return <XCard
      boxStyle={{backgroundColor: '#ffffff', width: '100%', height: "100%", borderRadius: '5px'}}>
      <XGrid rowsTemplate={this.state.showFilterView ? ["auto", "1fr"] : ["1fr"]} rowGap={"5px"}>
        {this.state.showFilterView &&
          <XGrid columnsTemplate={this.state.user?.数据权限 == "个人数据" ? ["1fr"] : ["auto", "250px", "1fr", "auto"]}
                 columnGap={"10px"}>
            <XForm inited={e => this.dataRightFilterForm = e} infoData={this.dataRightFilter} triggerValueChange={false}
                   onValueChange={() => {
                     let data = this.dataRightFilterForm.GetValues();
                     if (!data.UserTreePath && !data.UserID) {
                       if (this.state.user?.数据权限 === "全部数据") {
                       } else if (this.state.user?.数据权限 == "所属部门") {//所属部门
                         data.UserTreePath = this.state.user.组织部门?.TreePath || this.state.user.组织机构?.TreePath;
                       } else {//个人
                         data.UserID = this.state.user?.id;
                         this.dataRightFilterForm?.SetValues({UserID: data.UserID}, false);
                       }
                     }
                     let oldDataRightFilter = this.dataRightFilter;
                     this.dataRightFilter = data;
                     this.onDataRightChangeEvent(data, oldDataRightFilter);
                   }}/>
            {
              this.state.user?.数据权限 == "个人数据" ?
                <>
                  <XInput field={"UserTreePath"} label={组织名称} visible={false}
                          parent={() => this.dataRightFilterForm}/>
                  <XInput field={"UserID"} label={"人员名称"} visible={false} parent={() => this.dataRightFilterForm}/>
                </> :
                <>
                  <XSelectTree field={"UserTreePath"} label={组织名称} treePathInfoUrl={组织部门Url + "/treeinfo"}
                               filterData={this.userDataFilter} valueIsTreePath={true} displayField={组织名称}
                               boxStyle={{minWidth: 250, width: "auto"}} dataSourceUrl={组织部门Url + "/querylist"}
                               onValueChange={(v, row) => {// @ts-ignore
                                 this.dataRightFilterForm?.GetChildById("dataRightFilterUserID")?.Refresh({[组织部门TreePath]: row?.TreePath});
                               }}
                               parent={() => this.dataRightFilterForm}/>
                  <XSelectList field={"UserID"} label={"人员名称"} id={"dataRightFilterUserID"}
                               filterData={this.userDataFilter}
                               displayField={"姓名"} dataSourceUrl={人员信息Url + "/querylist"}
                               parent={() => this.dataRightFilterForm}/>
                </>
            }
            {this.renderDataRightForm()}
            <XFlex justifyContent={"flex-end"}>
              {this.state.views && this.state.views.length > 1 &&
                <XRadioGroup field={"视图"} items={this.state.views} value={this.state.view}
                             onValueChange={(view) => this.setState({view}, () => window.dispatchEvent(new Event('resize')))}/>}
            </XFlex>
          </XGrid>}
        {this.renderView(this.state.view)}
      </XGrid>
    </XCard>
  }

  renderView(view) {
    return (<></>)
  }
}
