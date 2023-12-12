import React from 'react';
import {createHashRouter, createRoutesFromElements, HashRouter, Route, RouterProvider, Routes,} from "react-router-dom";
import XBasePage from "./XBasePage";
import XBaseObject, {XBaseObjectProps} from "./XBaseObject";
import request from "umi-request";
import XTools from '../toolkit/XTools';
import XForm from "../editor/XForm";
import XGrid from "../layout/XGrid";
import XHtml2canvas from "../module/XHtml2canvas";
import XInputNum from "../editor/XInputNum";
import XMessage from "../display/XMessage";
import XModal from "../layout/XModal";
import XString from "../toolkit/XString";
import XInput from "../editor/XInput";

export interface XBaseAppProps extends XBaseObjectProps {
  /**
   * 应用菜单列表
   */
  menus?: any[],
  /**
   * 获取应用路由
   */
  getRoutes?: (app: XBaseApp) => any[],
}

/**
 * 系统启动实例，提供路由管理和全局数据管理
 * @name 基础应用实例
 * @groupName 应用
 */
export default class XBaseApp<P = {}, S = {}> extends XBaseObject<XBaseAppProps, any> {
  MenuData = [];
  MenuAllRoutes = [];
  MenuRoutes = [];
  page: any;
  apps = {};
  componentMap = {};
  rootElement: HTMLElement;

  /**
   * 下载设计元模型
   * MenuData: 菜单数据，不为空对象时，则直接下载
   */
  static DownloadDomainModel = DownloadDomainModel;

  constructor(props: XBaseAppProps) {
    super(props);
    XBasePage.SetApp(this);
    if (this.props.menus) {
      this.MenuData = this.props.menus;
      this.MenuAllRoutes = this.FormatMenus(this.props.menus);
      this.MenuRoutes = this.MenuAllRoutes;
      this.state.routes = this.props.getRoutes ? this.props.getRoutes(this) : [];
    }
  }

  //返回新的MenuRoutes对象
  GetMenuRoutes() {
    let loadData = (routes: any[], _list = [], parent = null) => {
      routes?.forEach((item: { path: string, component: any, _operations: {}, operations: {}, children: [], _children: [] }) => {
        let _item = {
          ...item,
          parent: parent,
          _operations: {...item._operations},
          operations: {...item.operations},
        };
        if (item.component) {
          this.componentMap[item.path] = item.component;
          _item.component = "组件";
        }
        if (item.children) {
          _item.children = [];
          _item._children = _item.children;
          loadData(item.children, _item.children, _item);
        }
        _list.push(_item);
      });
      return _list;
    }
    return loadData(this.MenuRoutes);
  }

  ReSetUserMenus() {
    this.MenuRoutes = this.MenuAllRoutes;
    this.state.routes = this.props.getRoutes ? this.props.getRoutes(this) : [];
    this.setState({routes: this.state.routes})
  }

  //更新用户菜单
  SetUserMenus(userMenus: []) {
    let mergeUserMenu = (allmenus, userMenus) => {
      let list = [];
      if (!allmenus) {
        return list;
      }
      allmenus.forEach(item => {
        item = {...item};
        let exists = false;
        for (const index in userMenus) {
          let userKey = userMenus[index].key;
          if (userKey && userKey.startsWith(item.key)) {
            if (item.operations) {//初始化权限为false
              let operations = {};
              for (let key in item.operations) {
                operations[key] = false;
              }
              item.operations = operations;
            }
            if (userKey === item.key) {
              if (item.operations && userMenus[index].operations) {
                item.operations = userMenus[index].operations;
              }
            }
            exists = true;
            break;
          }
        }
        if (exists) {
          if (item.children && item.children.length > 0) {
            item.children = mergeUserMenu(item.children, userMenus);
          }
          list.push(item);
        }
      });
      return list;
    }
    this.MenuRoutes = mergeUserMenu(this.MenuAllRoutes, userMenus);
    this.state.routes = this.props.getRoutes ? this.props.getRoutes(this) : [];
    this.setState({routes: this.state.routes})
  }

  /**
   * 重新设置菜单
   * @param menuData 菜单列表
   */
  RefreshMenu(menuData) {
    if (menuData) {
      this.MenuData = menuData;
      this.MenuAllRoutes = this.FormatMenus(menuData);
      this.MenuRoutes = this.MenuAllRoutes;
      this.state.routes = this.props.getRoutes ? this.props.getRoutes(this) : [];
      this.setState({routes: this.state.routes})
    }
  }

  /**
   * 加载javascript应用
   * @param src js路径
   * @param rootPath 异步加载库根目录
   */
  LoadScript = async (src: string, rootPath: string) => {
    return request.get(src, {method: 'get', headers: {Accept: '*/*',},}).then((result) => {
      // eval(result.replaceAll("____publicPath____", rootPath));
      let content = result.replaceAll("____publicPath____", rootPath);
      let script = document.createElement("script");
      script.innerHTML = content;
      document.head.append(script)
    });
  };


  /**
   * 加载APP插件
   * @param menuPath 菜单path
   * @param requireName 编译时模块名称
   * @param jsPath app.js网络地址
   * @param version app.js版本号
   * @param rootPath app.js相对路径
   * @param formatMenu 格式化菜单
   * @param callback 加载app插件回调
   * @constructor
   */
  async LoadApp(menuPath, requireName: string, jsPath: string, version: string, rootPath: string, formatMenu: (app: {}) => {}, callback: (firstLoad: boolean, app: {}) => void) {
    let _loadApp = (app) => {
      if (!app) {
        delete this.apps[jsPath];
        delete this.apps[jsPath + menuPath];
        return;
      }
      if (this.apps[jsPath + menuPath]) {
        callback && callback(false, app);
      } else {
        app.SetRootPath && app.SetRootPath(rootPath);
        this.MenuData.push(formatMenu(app));
        this.RefreshMenu(this.MenuData);
        this.apps[jsPath] = true;
        this.apps[jsPath + menuPath] = true;
        callback && callback(true, app);
      }
    }
    if (this.apps[jsPath] == undefined && requireName && formatMenu) {
      this.apps[jsPath] = false;
      version = "?version=" + version;
      XTools.CreateCss(jsPath.substring(0, jsPath.length - 3) + ".css" + version);
      await this.LoadScript(jsPath + version, rootPath).then(() => {
        try {// @ts-ignore
          let app = eval("__webpack_require__('" + requireName + "')");
          _loadApp(app);
        } catch (e) {
          console.log(e);
        }
      }).catch((e) => {
        delete this.apps[jsPath];
        delete this.apps[jsPath + menuPath];
      });
    } else if (this.apps[jsPath] == true) {// @ts-ignore
      let app = eval("__webpack_require__('" + requireName + "')");
      _loadApp(app);
    }
  }

  /**
   * 格式化处理memnus
   * @param menus 菜单列表
   * @param parent 父对象
   * @param parentPath 父path
   * @constructor
   */
  FormatMenus(menus = [], parent = null, parentPath = "/") {
    let list = [];
    for (let i in menus) {
      let menu = {...menus[i]};
      list.push(menu);
      if (!menu.path) {
        menu.path = "";
      }
      if (parent) {
        menu.path = parent.path + "/" + menu.path;
      } else {
        menu.path = parentPath + menu.path;
      }
      menu.parent = parent;
      menu.key = menu.path;
      if (menu.component && !menu.operations) {
        if (typeof (menu.component) == "object") {
          menu.operations = menu.component.type?.operations
        }
        if (!menu.operations) {
          menu.operations = {编辑: true,};
        }
      }
      menu._operations = menu.operations;
      menu.operations = this.formatOperations(menu.operations);//全部展开菜单
      //console.log(m.operations);
      if (menu.children) {
        menu.children = this.FormatMenus(menu.children, menu);
      }
      menu._children = menu.children;
    }
    return list;
  }

  //全部展开菜单
  formatOperations(_operations, parentName = "", operations = {}, allList = [], validate = true) {
    if (_operations) {
      if (validate && allList.indexOf(_operations) >= 0) {
        return operations;
      }
      allList.push(_operations);
      let list = [];//当前行信息
      for (let key in _operations) {
        let value = _operations[key];
        if (typeof value == "function") {
          let v = value();
          this.formatOperations(v, parentName + key + "_", operations, allList, list.indexOf(v) == -1);
          v && list.push(v);
        } else {
          // operations[parentName + key] = value;
          operations[parentName + key] = true;//全部设置为可见
        }
      }
    }
    return operations;
  }

  private renderRoute = (route, index) => {
    let element = route.component
    if (element && !element.props.ref) {
      element = React.cloneElement(element, {...element.props, ref: (e) => this.page = e}, element.children);
      route.component = element;
    }
    return element ?
      <>
        {route.index && <Route key={route.id || XTools.getUUID()} id={route.id || XTools.getUUID()} index element={element}/>}
        <Route  key={route.id || XTools.getUUID()} id={route.id || XTools.getUUID()} path={route.path || '/*'} element={element}>
          {route.children?.map(this.renderRoute)}
        </Route>
      </> : route.children?.map(this.renderRoute)
  }

  render() {
    return <div ref={e => this.rootElement = e} style={{width: "100%", height: "100%"}}>
      <Router> {this.state.routes.map(this.renderRoute)} </Router>
    </div>;
  }
}

const Router = ({children}) => {
  let router = createHashRouter(createRoutesFromElements(children));
  return <RouterProvider router={router}/>
}

function DownloadDomainModel(MenuData?: any[], systemName?: string, sleepTime = 3000, packageName?: any) {
  let _this = new XBasePage({});
  let showDialog = true;
  if (!MenuData) {
    MenuData = _this.GetAllMenuData();
  } else if (systemName) {
    showDialog = false;
  }
  let rootElement = XBasePage.GetApp().rootElement;
  if (MenuData.length == 0) {
    XMessage.ShowInfo("系统没有菜单");
    return false;
  }
  let startDownload = async (systemName, sleepTime) => {
    let loadMenu = async (menus) => {
      let menuList = [];
      if (menus) {
        for (let i = 0; i < menus.length; i++) {
          let item = menus[i];
          let menu = {
            菜单名称: item.name,
            菜单标识: item.path ? item.path.split("/")[item.path.split("/").length - 1] : "",
            菜单路径: item.path,
            菜单描述: "",
            界面原型图: "",
            子菜单列表: [],
            界面元素列表: [],
          };
          menuList.push(menu);
          if (item.component) {
            _this.GotoUrl(item.path);
            await _this.Sleep(sleepTime);
            let page = XBasePage.GetApp().page;
            menu.界面原型图 = await XHtml2canvas.GetImageBase64(rootElement, 200, 0, 0);//截图
            menu.界面原型图 = XString.substring(menu.界面原型图, "data:image/jpeg;base64,".length);
            if (page) {
              menu.菜单描述 = page.props?.desc;
              page.GetChildren && page.GetChildren()?.forEach(component => {
                if (component) {
                  let 元素类型 = "显示组件";//显示组件|编辑组件
                  let 组件名称 = component._reactInternals?.type.ComponentName;
                  let text = component.GetText ? component.GetText() : "";
                  let name = component.props.name;
                  let url = component.props.dataSourceUrl;
                  if (text) {
                    元素类型 = "编辑组件";
                    name = text;
                  }
                  let 元素名称 = (name ? name : "") + (组件名称 ? 组件名称 : "");
                  let 元素描述 = component.props.desc;
                  menu.界面元素列表.push({元素名称, 元素类型, 元素描述, 服务接口名称: url});
                }
              });
            }
          }
          if (item.children && item.children.length > 0) {
            menu.子菜单列表 = await loadMenu(item.children);
          }
        }
      }
      return menuList;
    };
    let url = _this.GetCurrentMenuKey();
    let _MenuData = await loadMenu(MenuData);
    _this.GotoUrl(url);
    let formData = new FormData();
    formData.append("MenuData", XHtml2canvas.strtoFile(JSON.stringify(_MenuData), "MenuData.dat"));
    let result = await _this.RequestUploadFile("xtpz/upload", formData);
    if (result.Success) {
      let data = {name: systemName, MenuData: result.Value[0], packageName};
      _this.DownloadFile("xtpz/xdevelop", data);//框架下载
      // _this.DownloadFile('http://' + location.hostname + ":9099/xdevelop", data);//框架下载
    }
  }
  if (!showDialog) {
    return startDownload(systemName, sleepTime)
  } else {
    if (!systemName) {
      systemName = document.title ? document.title : "系统"
    }
  }
  let form = undefined;
  const labelWidth = "140px";
  const Ele = <XForm useServerInfo={false} inited={(e) => form = e}>
    <XGrid columnGap={"10px"} rowGap={"10px"} rowsTemplate={["auto"]}>
      <XInput isRequired={true} field={"系统名称"} labelWidth={labelWidth}
              value={systemName} parent={() => form}/>
      <XInputNum isRequired={true} field={"截图等待时间"} label={"截图等待时间(ms)"} labelWidth={labelWidth}
                 value={3000} min={1000} parent={() => form}/>
    </XGrid>
  </XForm>;
  return XModal.ModalShow("下载设计元模型", async () => {
    let m = form.ValidateEditorValues();
    if (m) {
      XMessage.ShowInfo(m);
      return false;
    }
    let values = form.GetValues();
    await startDownload(values.系统名称, values.截图等待时间);
    return true;
  }, Ele, '800px',);
}
