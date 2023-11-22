import Base64 from "./Base64";
import request from "umi-request";
import _ from 'lodash';
const { cloneDeep, merge } = _

/**
 * 工具类
 */
export default class XTools {

  static Lodash = _

  static request = request

  static async RequestUrl(url,method='post') {
    return await request.get(url, {
      method: method,
      headers: {Accept: '*/*',},
    }).then((result) => result).catch((error) => false);
  }

  static isArray = (val: any) => {
    return Object.prototype.toString.call(val) === '[object Array]';
  };

  static isObject = (val: any) => {
    return Object.prototype.toString.call(val) === '[object Object]';
  };

  static isNumber = (val: any) => {
    return Object.prototype.toString.call(val) === '[object Number]';
  };

  static isCascader = ({dataSource}) => {
    return dataSource && dataSource[0] && !XTools.isArray(dataSource[0]);
  };

  static IsMobile() {
    return !!(navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i));
  }

  static IsWeixin() {
    return /micromessenger/.test(navigator.userAgent.toLowerCase());
  }

  static isFunction(v: any): boolean {
    return typeof v === 'function';
  }

  static isString(v) {
    return typeof v === 'string';
  }

  static pick(obj: Record<string, unknown>, keys: string[]): Record<string, unknown> {
    const r = {};
    keys.forEach((key) => {
      r[key] = obj[key];
    });
    return r;
  }

  static getUUID(num = 36) {
    var s = []
    var hexDigits = "0123456789abcdef"
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = "4"
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
    s[8] = s[13] = s[18] = s[23] = "-"

    var uuid = s.join("")
    return uuid.substr(0, num).replace("-", "") + Date.now();
  }

  static GetGUID() {
    function S4() {
      // eslint-disable-next-line no-bitwise
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return `${new Date().getTime()}${S4() + S4() + S4() + S4() + S4()}`;
  }

  static isNotEmptyObject(e) {
    return !isEmptyObject(e);
  }

  static isEmptyObject(e) {
    if (e) {
      for (const t in e) {
        if (e[t]) {
          return false;
        }
      }
      return true;
    }
    return true;
  };

  static deepMerge(object, ...otherArgs) {
    return merge(object,...otherArgs);
  }

  static deepClone(d) {
    return cloneDeep(d);
  }

  static cloneDeep(d) {
    return cloneDeep(d);
  }

  static CopyToObject(source, target) {
    if (source && target) {
      Object.assign(target, source);
      // for(const i in source){
      //   target[i] = source[i];
      // }
    }
  }

  // 跳转到指定路径
  static GotoUrl(url: string, param?: string) {
    let path = window.location.origin + window.location.pathname;
    if (param) {
      url += "?" + param;
    }
    window.location.href = path + "#" + url;
  }


  static async sleep(time: number) {//模仿java里的sleep方法
    return new Promise((resolve: Function, reject: Function) => {
      window.setTimeout(() => {
        resolve();
      }, time);
    });
  }

  static ToTree(data) {
    const deleterows = [];
    for (let i = 0; i < data.length; i += 1) {
      const r = data[i];
      for (let j = 0; j < data.length; j += 1) {
        const p = data[j];
        if (p.id === r.Parentid) {
          r.parent = p;
          if (!p.children) {
            p.children = [];
          }
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
    return data;
  }


  static CreateScript(url, callback = undefined) {
    return new Promise((resolve, reject) => {
      let scriptTags = window.document.querySelectorAll("script")
      let _url = location.origin + url
      for (let i = 0; i < scriptTags.length; i++) {
        let src = scriptTags[i].src
        if (src && src === _url) {// @ts-ignore
          resolve();
          return;
        }
      }
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.onload = resolve;
      script.onerror = reject;
      script.crossOrigin = 'anonymous';
      script.src = url;
      if (document.head.append) {
        document.head.append(script);
      } else {
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    }).then(() => {
      callback && callback();
    });
  }


  /**
   * 加载javascript应用
   */
  static CreateCss(url, callback = undefined) {
    return new Promise((resolve, reject) => {
      let linkTags = window.document.querySelectorAll("link")
      let _url = location.origin + url
      for (let i = 0; i < linkTags.length; i++) {
        let src = linkTags[i].href;
        if (src && src === _url) {// @ts-ignore
          resolve();
          return;
        }
      }
      //<link href="" rel="stylesheet"/>
      let link = document.createElement('link');
      link.rel = "stylesheet";
      link.onload = resolve;
      link.onerror = reject;
      link.crossOrigin = 'anonymous';
      link.href = url;
      if (document.head.append) {
        document.head.append(link);
      } else {
        document.getElementsByTagName('head')[0].appendChild(link);
      }
    }).then(() => {
      callback && callback();
    });
  };

  static GetValueOrFromFunction(value) {
    if (typeof value === "function") {
      return value();
    }
    return value;
  }

  static isEqual(a: any, b: any) {
    if (a === b) {
      return true;
    }

    if (a instanceof Function) {
      return a.toString() === b.toString();
    }

    if (a && b && typeof a === 'object' && typeof b === 'object') {
      let length;

      if (a.constructor !== b.constructor) {
        return false;
      }
      if (Array.isArray(a)) {
        length = a.length;
        if (length !== b.length) {
          return false;
        }
        for (let i = 0; i < length; i += 1) {
          // eslint-disable-next-line max-depth
          if (!XTools.isEqual(a[i], b[i])) {
            return false;
          }
        }

        return true;
      }
      if (a.valueOf !== Object.prototype.valueOf) {
        return a.valueOf() === b.valueOf();
      }
      if (a.toString !== Object.prototype.toString) {
        return a.toString() === b.toString();
      }
      const keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length) {
        return false;
      }
      for (let i = 0; i < length; i += 1) {
        const key = keys[i];
        if (!Object.prototype.hasOwnProperty.call(b, key) || !XTools.isEqual(a[key], b[key])) {
          return false;
        }
      }

      return true;
    }

    // eslint-disable-next-line no-self-compare
    return a !== a && b !== b;
  }

  static Base64 = Base64;

  static toBodyZoom(num: number) {
    // @ts-ignore
    let zoom = document.body.style.zoom;
    // @ts-ignore
    if (zoom) {
      zoom = parseFloat(zoom);
      num = num * (1 / zoom);
    }
    return num;
  }

  static FindParentExistsClass(target, className) {
    let ret = false;
    if (target) {
      ret = target.getAttribute("class")?.indexOf(className) >= 0;
      if (!ret) {
        if (target.tagName.toLowerCase() !== "body") {
          ret = XTools.FindParentExistsClass(target.parentElement, className);
        }
      }
    }
    return ret;
  }


  //防抖设置
  static debounce(fn, delay) {
    let handle;
    return function (e) {
      // 取消之前的延时调用
      clearTimeout(handle);
      handle = setTimeout(() => {
        fn(e);
      }, delay);
    }
  }

  //节流设置
  static throttle(fn, delay) {
    let runFlag = false;
    return function (e) {
      // 判断之前的调用是否完成
      if (runFlag) {
        return false;
      }
      runFlag = true;
      setTimeout(() => {
        fn(e);
        runFlag = false;
      }, delay)
    }
  }

  static DownloadFile(fileName, content) {
    var aLink = document.createElement('a');
    var blob = new Blob([content]);
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.click()
  }

  static ToTreeData(data){
    if(!data){
      data = [];
    }
    const deleterows = [];
    for (let i = 0; i < data.length; i += 1) {
      const r = data[i];
      if(!r.IsTreeLeaf&&!r._children){
        r._children=[];
        r.children=r._children;
      }
      for (let j = 0; j < data.length; j += 1) {
        const p = data[j];
        if (p.id === r.Parentid) {
          r.parent = p;
          if (!p._children) {
            p._children = [];
            p.children=p._children;
          }
          p.IsTreeLeaf = 0;
          p._children.push(r);
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
    return data
  }

}

export function yuan(val) {
  // @ts-ignore
  return `¥ ${numeral(val).format('0,0')}`;
}

//node:HTMLDivElement
export function getNodeHeight(node) {
  const {style} = node;
  style.height = '100%';
  const totalHeight = parseInt(`${getComputedStyle(node).height}`, 10);
  const padding =
    parseInt(`${getComputedStyle(node).paddingTop}`, 10) +
    parseInt(`${getComputedStyle(node).paddingBottom}`, 10);
  return totalHeight - padding;
}

export function upGo(fieldData, index) {
  if (index != 0) {
    fieldData[index] = fieldData.splice(index - 1, 1, fieldData[index])[0];
  } else {
    fieldData.push(fieldData.shift());
  }
}

export const isNotEmptyObject = (e) => {
  return !isEmptyObject(e);
}

export const isEmptyObject = (e) => {
  if (e) {
    // eslint-disable-next-line no-restricted-syntax
    for (const t in e) {
      if (e[t]) {
        return false;
      }
    }
    return true;
  }
  return true;
};

export function downGo(fieldData, index) {
  if (index != fieldData.length - 1) {
    fieldData[index] = fieldData.splice(index + 1, 1, fieldData[index])[0];
  } else {
    fieldData.unshift(fieldData.splice(index, 1)[0]);
  }
}

export function swapArr(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}

export function toFirst(fieldData, index) {
  if (index != 0) {
    // fieldData[index] = fieldData.splice(0, 1, fieldData[index])[0]; 这种方法是与另一个元素交换了位子，
    fieldData.unshift(fieldData.splice(index, 1)[0]);
  }
}

export function toPoint(percent) {
  var str = percent.replace("%", "");
  str = str / 100;
  return str;
}

export function toPercent(point) {
  var str = Number(point * 100).toFixed(1);
  str += "%";
  return str;
}

export function toNum(value, digits) {
  const d = digits == undefined ? 2 : digits;
  return parseFloat(parseFloat(value).toFixed(d));
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function addClass(classname, newclass) {
  return classname + " " + newclass;
}

export function removeClass(classname, newclass) {
  return classname.replace(newclass, "");
}

export function contains(root, target) {
  // root 节点是否包含 target 节点
  const isElement = Object.prototype.toString.call(root).includes('Element') && Object.prototype.toString.call(target).includes('Element');
  if (!isElement) {
    return false;
  }
  let node = target;
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

export function assert(condition, msg = '') {
  if (!condition) {
    console.error(`[react-area-linkage]: ${msg}`);
  }
}


export function scrollIntoView(container, target) {
  if (!target) {
    container.scrollTop = 0;
    return;
  }

  // refrence: https://github.com/ElemeFE/element/blob/dev/src/utils/scroll-into-view.js
  const top = target.offsetTop;
  const bottom = target.offsetTop + target.offsetHeight;
  const viewRectTop = container.scrollTop;
  const viewRectBottom = viewRectTop + container.clientHeight;

  if (top < viewRectTop) {
    container.scrollTop = top;
  } else if (bottom > viewRectBottom) {
    container.scrollTop = bottom - container.clientHeight;
  }
}

export const CopyToObject = (source, target) => {
  if (source && target) {
    Object.assign(target, source);
    // for(const i in source){
    //   target[i] = source[i];
    // }
  }
}


export function getRouteData(menu, list = [], url = '/') {
  if (menu) {
    for (let i in menu) {
      let item = menu[i];
      if (item.to) {
        item.path = item.to;
        url = '/';
      }
      let path = url + item.path;
      item.key = path; //重新定义key
      if (item.component) {
        if (!item.operations) {
          item.operations = {};
        }
        if (item.operations.编辑 === undefined) {
          item.operations.编辑 = true;
        }
      }
      // console.log(item.name + ":" + item.key);
      if (item.children && item.children.length > 0) {
        if (item.component) {
          list.push({
            path: path,
            component: item.component,
          });
        }
        getRouteData(item.children, list, path + '/');
      } else {
        if (item.component) {
          list.push({
            path: path,
            component: item.component,
          });
        } else {
          list.push({
            path: path,
            component: '@/pages/404',
          });
        }
      }
    }
  }
  return list;
}

//生成uuid
export function getUUID(num = 36) {
  var s = []
  var hexDigits = "0123456789abcdef"
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = "4"
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = "-"

  var uuid = s.join("")
  return uuid.substr(0, num)
}
