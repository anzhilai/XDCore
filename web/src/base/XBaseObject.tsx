import React from 'react';
import request from "umi-request";
import XMessage from "../display/XMessage";
import XTools from "../toolkit/XTools"
import XString from "../toolkit/XString";
/**
 * 基础组件属性
 */
export interface XBaseObjectProps {
  /**
   * 组件id
   */
  id?: string,
  /**
   * 名称
   */
  name?: string,
  /**
   * 说明
   */
  desc?: string,
  /**
   * 初始化回调函数，一般用来获取组件对象
   */
  inited?: (e: any) => void,
  /**
   * 设置父级节点，可以为对象或者一个函数
   * @defaultValue ''
   */
  parent?: (() => {}) | {},
  pureRender?: boolean,
  /**
   * 后端的数据源Url
   * @defaultValue ''
   */
  dataSourceUrl?: string,
  /**
   * 访问数据Url时，添加的条件参数
   * @defaultValue {}
   */
  filterData?: object,
  /**
   * 访问数据是是否必须携带参数，如果没有参数则不去访问
   * @defaultValue false
   */
  mustHasFilter?: boolean,
  /**
   * 访问数据源后的回调函数，可以对返回数据进行再次处理
   */
  onServerResult?: (result: {}, url: string, data: {}) => {},
  /**
   * 组件加载完成后回调
   */
  onDidMount?: (e: any) => void,
  /**
   * 组件更新回调
   */
  onDidUpdate?: (e: any) => void,
}

/**
 * 基础组件
 * 基础组件是前端所有组件的基类，提供了组件的基本属性和与服务端交互的相关属性和方法。
 * @name 基础组件
 * @groupName 基础
 */
export default class XBaseObject< P = {}, S = {}> extends React.Component< XBaseObjectProps&P, any> {

  static defaultProps = {
    parent: "",
    pureRender: false,
    dataSourceUrl: "",
    filterData: {},
    mustHasFilter: false,
  };
  static OnServerResult: (result: {}, url: string, data: {}) => {}
  declare state: any;
  Children: any[] = [];
  id: string;
  isMobile: boolean
  constructor(props:Readonly<XBaseObjectProps&P>) {
    super(props);
    this.isMobile = !!(navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i));
    if (this.props.inited) {
      this.props.inited(this);
    }
    this.state = {
      pureRender:this.props.pureRender,
      filterData : {},
    };
    this.Children = [];
    const c = this.GetParent();
    if (c&&c.AddChild) {
      c.AddChild(this);
    }
    this.id = this.props.id;
  }

  /**
   * 获取组件过滤参数
   */
  GetFilterData(){
    const postData = {
      ...this.props.filterData,
      ...this.state.filterData,
    };
    return postData;
  }

  /**
   * 清空组件过滤参数
   */
  ClearFilterData() {
    this.setState({filterData: {}})
  }

  componentDidMount(){
    if(this.props.onDidMount!=undefined){
      this.props.onDidMount(this);
    }
  }

  componentDidUpdate(prevProps:Readonly<P>, prevState:Readonly<S>, snapshot:any){
    if(this.props.onDidUpdate!=undefined){
      this.props.onDidUpdate(this);
    }
  }

  shouldComponentUpdate(nextProps:Readonly<P>, nextState:Readonly<S>, nextContext: any) {
    if(this.state.pureRender){
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    const c = this.GetParent();
    if (c && c.RemoveChild) {
      c.RemoveChild(this);
    }
  }

  /**
   * 添加子节点关系
   * @param child
   */
  AddChild(child:any) {
    this.Children.push(child);
  }

  /**
   * 删除子节点关系
   * @param child
   */
  RemoveChild(child:any) {
    const index = this.Children.indexOf(child);
    if (index >= 0) {
      this.Children.splice(index, 1);
    }
  }

  /**
   * 获取子节点
   */
  GetChildren(){
    return this.Children;
  }

  /**
   * 通过id获取子节点
   * @param id
   */
  GetChildById(id:any){
    for(let i=0;i<this.Children.length;i++){
      const c = this.Children[i];
      if(c.id===id){
        return  c;
      }
    }
  }

  /**
   * 获取父节点
   */
  GetParent() {
    if (typeof this.props.parent === "function") {
      return this.props.parent();
    }
    return this.props.parent;
  }

  /**
   * 是否手机模式
   */
  IsMobile() {
    return XTools.IsMobile();
  }

  SetPureRender(b:boolean){
    this.state.pureRender=b;
  }

  /**
   * 从浏览器缓存获取登录信息的数据
   */
  GetGatherData() {
    // @ts-ignore
    if (!window.gatherdata) {
      if (window.sessionStorage.gatherdata && window.sessionStorage.gatherdata !== "{}") {
        // @ts-ignore
        window.gatherdata = JSON.parse(window.sessionStorage.gatherdata);
      } else {
        if (window.localStorage.gatherdata) {
          // @ts-ignore
          window.gatherdata = JSON.parse(window.localStorage.gatherdata);
        } else {// @ts-ignore
          window.gatherdata = {};
        }
      }
      // @ts-ignore
      if (typeof window.gatherdata.gatheruser === 'string') {
        // @ts-ignore
        window.gatherdata.gatheruser = JSON.parse(window.gatherdata.gatheruser);
      }
    }
    // @ts-ignore
    return window.gatherdata;
  }

  /**
   * 设置浏览器缓存信息
   * @param data 数据
   * @param isRemember 是否持久保存
   */
  SaveGatherData(data:object, isRemember:boolean) {
    // @ts-ignore
    window.gatherdata = data;
    let _data = {...data}// @ts-ignore
    delete _data.CurrentUserMenus;
    window.sessionStorage.gatherdata = JSON.stringify(_data);
    if (isRemember) {
      window.localStorage.gatherdata = JSON.stringify(_data);
    } else {
      window.localStorage.gatherdata = '{}';
    }
  }
  // 清空浏览器缓存信息
  ClearGatherData() {
    this.SaveGatherData({}, true);
  }
  // 获取服务根路径
  GetServerRootUrl() {
    // @ts-ignore
    return window.config?.hServer;
  }

  /**
   * 返回上一页
   */
  GotoBack(minHistory = 2) {
    if (window.history.length > minHistory) {
      window.history.back();
    } else {
      this.GotoUrl("");
    }
  }

  /**
   * 跳转到指定路径
   * @param hash hash值
   * @param param 参数
   * @param url 跳转url
   */
  GotoUrl = function (hash: string, param?: string, url?: string) {
    if (hash.toLowerCase().startsWith("http://") || hash.toLowerCase().startsWith("https://")) {
      window.location.href = hash;
      return;
    }
    let path = window.location.origin + window.location.pathname + window.location.search;
    if (param) {
      hash += "?" + param;
    }
    if (!XString.startsWith(hash, "/")) {
      hash = "/" + hash;
    }
    window.setTimeout(() => {
      if (url) {
        window.location.href = url + "#" + hash;
      } else {
        window.location.href = path + "#" + hash;
      }
    }, 0);
  }

  /**
   * 获取页面参数
   * @param name 参数名
   * @param queryStr 参数,默认值:window.location.hash
   */
  GetQueryParam = (name: string, queryStr: string = window.location.hash) => {
    const index = queryStr.indexOf("?");
    if (index >= 0) {
      queryStr = queryStr.substring(index + 1);
    }
    const vars = queryStr.split("&");
    for (let i = 0; i < vars.length; i += 1) {
      const pair = vars[i].split("=");
      if (pair[0] === name) {
        return pair[1];
      }
    }
    return false;
  }

  /**
   * 刷新组件
   * @param filter 过滤参数
   * @param isnew 是否全部更新参数
   * @constructor
   */
  async RefreshServer(filter?:object,isnew?:boolean){
    if(!this.props.dataSourceUrl){
      return ;
    }
    if(isnew) {
      // @ts-ignore
      this.state.filterData = filter;
    }else{
      // @ts-ignore
      this.state.filterData={
        ...this.state.filterData,
        ...filter,
      }
    }
    if(this.props.mustHasFilter && XTools.isEmptyObject(this.props.filterData)&& XTools.isEmptyObject(this.state.filterData)){
      return;
    }

    const postData = {
      ...this.props.filterData,
      ...this.state.filterData,
    };
    const ret = await this.RequestServerPost(this.props.dataSourceUrl, postData);
    if (ret.Success && ret.Value != undefined) {
      return ret.Value;
    }
  }

  async ajax(method?: string, url?: string, params?: any, contentType = 'application/x-www-form-urlencoded') {
    method = method.toLowerCase();
    // @ts-ignore
    return await request[method](url, {
      method: method,
      headers: {
        Accept: '*/*',
        'Content-Type': contentType,
      },
      data: params,
      requestType: "form",
    });
  }

  /**
   * get请求
   * @param url
   */
  async GetUrl(url) {
    return await request.get(url, {
      method: 'get',
      headers: {Accept: '*/*',},
    }).then((result) => result).catch((error) => false);
  }
  RequestServerUploadFile(url: string, data: any, isShowError = true, onProgress?: (e) => void, useToken = true, onServerResult = true) {
    return this.RequestUploadFile(url,data,isShowError,onProgress,useToken,onServerResult);
  }
  RequestUploadFile(url: string, data: any, isShowError = true, onProgress?: (e) => void, useToken = true, onServerResult = true) {
    if (url && !url.toLowerCase().startsWith("http://") && !url.toLowerCase().startsWith("https://")) {
      let baseUrl = this.GetServerRootUrl();
      if (baseUrl && !baseUrl.endsWith("/")) {
        baseUrl += "/";
      }
      url = baseUrl + url;
    }
    return new Promise<{ Success: string, Value?: any, Message?: string }>((resolve, reject) => {
      let headers = {Accept: '*/*'};
      let request = new XMLHttpRequest();
      request.open("post", url, true);
      for (let key in headers) {
        request.setRequestHeader(key, headers[key]);
      }
      if (useToken && this.GetGatherData()) {
        if (data instanceof FormData) {
          data.append("gathertoken", this.GetGatherData()?.gathertoken);
        } else {
          data.gathertoken = this.GetGatherData()?.gathertoken;
        }
      }
      request.upload.onprogress = (e) => {
        onProgress && onProgress(e);
      };
      request.onload = (e) => {
        try {// @ts-ignore
          let result = JSON.parse(e.target.responseText);
          if (!result.Success && isShowError) {
            XMessage.ShowError(result.Message);
          }
          if (onServerResult && this.props.onServerResult) {
            result = this.props.onServerResult(result, url, data);
          }
          resolve(result);
        } catch (e) {// @ts-ignore
          resolve({Success: false, Message: "服务错误"});
        }
      };
      request.onerror = (error) => {
        isShowError && XMessage.ShowError("服务错误！！" + error);
        reject(error);
      };
      if (data instanceof FormData) {
        request.send(data);
      } else {
        let form = new FormData();
        Object.keys(data).forEach(key => {
          form.append(key, data[key]);
        });
        request.send(form);
      }
    });
  }

  /**
   * 对服务端的POST请求函数
   * @param url 请求地址
   * @param params 参数
   * @param isShowError 是否显示错误
   * @param useToken 是否传token
   * @param onServerResult 是否执行onServerResult
   */
  async RequestServerPost(url?: string, params?: any, isShowError: boolean = true, useToken = true, onServerResult = true) {
    if (url && !url.toLowerCase().startsWith("http://") && !url.toLowerCase().startsWith("https://")) {
      // @ts-ignore
      url = `${this.GetServerRootUrl()}/${url}`;
    }
    if (useToken && this.GetGatherData()) {
      if (!params) {
        params = {};
      }
      if (params instanceof FormData) {
        params.append("gathertoken", this.GetGatherData()?.gathertoken);
      } else {
        params.gathertoken = this.GetGatherData()?.gathertoken;
      }
    }
    let _params = params;
    if (_params && typeof _params === "object" && !(_params instanceof FormData)) {
      let hasFile = false;
      let form = new FormData();
      Object.keys(_params).forEach(key => {
        if (_params[key] instanceof File) {
          hasFile = true;
        }
        form.append(key, _params[key]);
      });
      if (hasFile) {
        _params = form;
      }
    }
    return await request
        .post(url, {
          method: 'post',
          headers: {Accept: '*/*',},
          data: _params,
          requestType: 'form',  
          credentials: 'include',
        })
        .then((result) => {
          if (XBaseObject.OnServerResult) {
            result = XBaseObject.OnServerResult(result, url, params);
          }
          if (!result.Success && isShowError) {
            XMessage.ShowError(result.Message);
          }
          if (onServerResult && this.props.onServerResult) {
            result = this.props.onServerResult(result, url, params);
          }
          return result;
        })
        .catch((error) => {
          console.log(error)
          isShowError && XMessage.ShowError("服务错误！！" + error);
          if (error && error.Exception === '用户没有权限,请重新登录') {// @ts-ignore
            this.GotoUrl(window.config.loginUrl);
          }
          return {Success: false, Message: "服务端无法连接！！" + error};
        });
  }

  /**
   * 模仿java里的sleep方法
   * @param time 时间毫秒
   */
  async Sleep(time: number) {
    return new Promise((resolve: Function, reject: Function) => {
      window.setTimeout(() => {
        resolve();
      }, time);
    });
  }

  async RequestDownloadFile(url, params, isNewWindow=false) {
    if(isNewWindow){
      return this.DownloadFile(url,params);
    }
    if (url && !url.toLowerCase().startsWith("http://") && !url.toLowerCase().startsWith("https://")) {
      url = `${this.GetServerRootUrl()}/${url}`;
    }
    if (this.GetGatherData()) {
      if (!params) {
        params = {};
      }
      params.gathertoken = this.GetGatherData()?.gathertoken;
    }
    return await request.post(url, {
      method: 'post',
      headers: {Accept: '*/*',},
      data: params,
      requestType: 'form',
      responseType: 'blob',
      getResponse: true
    }).then((res) => {
      if (!res || !res.data) {
        return
      }
      const _fileName = decodeURIComponent((res.response.headers.get('Content-Disposition') || '; filename="未知文件"').split(';')[1].trim().slice(9));
      let url = window.URL.createObjectURL(new Blob([res.data]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', _fileName)
      document.body.appendChild(link)
      link.click()
      // 释放URL对象所占资源
      window.URL.revokeObjectURL(url)
      // 用完即删
      document.body.removeChild(link)
    });
  }

  /**
   * 下载文件
   * @param url 地址
   * @param datas 参数
   */
  DownloadFile(url:string, datas:any) {
    if (url && !url.toLowerCase().startsWith("http://") && !url.toLowerCase().startsWith("https://")) {
      let baseUrl = this.GetServerRootUrl();
      if (baseUrl && !baseUrl.endsWith("/")) {
        baseUrl += "/";
      }
      url = baseUrl + url;
    }
    if (!datas) {
      datas = {};
    }
    let params:any = {};
    for (const k in datas) {
      if (typeof datas[k] != 'undefined') {
        params[k] = datas[k];
      }
    }
    if (this.GetGatherData()) {
      params.gathertoken = this.GetGatherData()?.gathertoken;
    }
    var id = 'downFileIframe' + new Date().getTime() + '_' + Math.random();
    var formId = 'form_' + id;
    var iframe = document.createElement('iframe');
    iframe.setAttribute('id', id);
    iframe.setAttribute('style', 'display: none');
    var form = document.createElement('form');
    form.setAttribute('id', formId);
    form.setAttribute('target', id);
    // @ts-ignore
    form.setAttribute('action', url);
    form.setAttribute('method', 'post');
    form.setAttribute('style', 'display: none');
    document.body.appendChild(iframe);
    document.body.appendChild(form);
    var html = '';
    Object.keys(params).map(function (key) {
      if (params[key] instanceof Array) {
        params[key].forEach(function (value:any) {
          html += "<textarea name='" + key + "' rows=\"1\" cols=\"1\">" + value + "</textarea>";
        });
      } else {
        html += "<textarea name='" + key + "' rows=\"1\" cols=\"1\">" + params[key] + "</textarea>";
      }
    });
    form.innerHTML = html;
    form.submit();
    document.body.removeChild(form);
    document.body.removeChild(iframe);
  }

  /**
   * 生成uuid
   * @param split 分隔符号
   */
  CreateUUID(split = "") {
    let s = []
    let hexDigits = "0123456789abcdef"
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = "4"
    // @ts-ignore
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
    s[8] = s[13] = s[18] = s[23] = split
    return s.join("");
  }
}
