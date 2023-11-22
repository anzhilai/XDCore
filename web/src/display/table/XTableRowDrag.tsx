//表格行拖拽
export default function XTableDrag(el: any) {
  if (!el) {
    return;
  }
  //绑定事件
  let addEvent = document.addEventListener ? function (el, type, callback) {
    //W3C
    //第3个参数用来设置事件是在事件捕获时执行，还是事件冒泡时执行;
    //true=捕获时执行  false=冒泡时执行
    //为了与 IE 统一，都在冒泡时执行
    el.addEventListener(type, callback, false);
  } : function (el, type, callback) {//IE
    el.attachEvent("on" + type, callback);//attachEvent()方法没有相关设置，默认是在事件冒泡时执行的.
  };

  //移除事件
  let removeEvent = document.removeEventListener ? function (el, type, callback) {
    el.removeEventListener(type, callback);//W3C
  } : function (el, type, callback) {
    el.detachEvent("on" + type, callback);//IE
  };

  //精确获取样式
  let getStyle = document.defaultView ? function (el, style) {//W3C
    return document.defaultView.getComputedStyle(el, null).getPropertyValue(style);
  } : function (el, style) {//IE
    style = style.replace(/\-(\w)/g, function ($, $1) {
      return $1.toUpperCase();
    });
    return el.currentStyle[style];
  };

  function GetZoom() {
    // @ts-ignore
    let zoom = document.body.style.zoom;
    if (zoom) {
      return 1 / parseFloat(zoom);
    }
    return 1;
  }

  function setWidth(tr1, tr2) {
    for (let i = 0; i < tr1.children.length; i++) {
      if (tr2.children[i]) {
        tr2.children[i].style.width = tr1.children[i].offsetWidth + "px";
        tr2.children[i].style.height = tr1.children[i].offsetHeight + "px";
        tr2.children[i].style.display = "inline-block"
      }
    }
  }

  //获取行下标
  function GetRowIndex(tr) {
    // return tr.rowIndex;
    let index = -1;
    for (let i = 0; i < dragManager.children.length; i++) {
      if (dragManager.children[i] != dragManager.dragObj2) {
        index++;
        if (dragManager.children[i] == tr) {
          break;
        }
      }
    }
    return index;
  }

  function elementFromPoint(clientX, clientY) {
    let ret = document.elementFromPoint(clientX, clientY);
    function getTr(node) {
      let ret = null;
      while (node) {
        if (node.nodeName == "TR") {
          if (node.parentElement == dragManager.dragTable) {
            ret = node;
          }
          break;
        }
        if (node.nodeName == "BODY") {
          break;
        }
        node = node.parentElement;
      }
      return ret;
    }
    return getTr(ret);
  }

  let dragManager = {
    root: el,
    isTree: false,
    clientY: 0,
    startTr: undefined,
    startIndex: -1,
    endTr: undefined,
    endIndex: -1,
    dragTable: undefined,
    children: undefined,
    defaultBorder: "none",//默认边框
    addTr: undefined,
    dragObj: undefined,
    dragObj2: undefined,
    dragObjLine: undefined,
    onRowDrag: undefined,
    validateFun: undefined,
    draging: function (e) {//mousemove时拖动行
      let dragObj = dragManager.dragObj;
      let dragObj2 = dragManager.dragObj2;
      let dragObjLine = dragManager.dragObjLine;
      if (dragObj) {
        e = e || event;
        if (window.getSelection()) {
          window.getSelection().removeAllRanges();//W3C
          // @ts-ignore
        } else if (document.selection) {
          // @ts-ignore
          document.selection.empty();//IE
        }
        let tr = elementFromPoint(e.clientX, e.clientY);//通过坐标获取节点
        let y = e.clientY;
        let down = y > dragManager.clientY;//是否向下移动
        dragObj2.style.top = (e.clientY - dragObj.offsetHeight / 2) * GetZoom() + "px";
        if (tr) {
          dragManager.clientY = y;
          if (dragObj !== tr) {
            let validate = true;
            if (dragManager.validateFun) {
              // @ts-ignore
              validate = dragManager.validateFun(dragManager.startIndex, GetRowIndex(tr), dragManager.startTr, tr);
            }
            if (validate) {
              dragManager.endTr = tr;
              if (!dragManager.isTree) {
                tr.parentNode.insertBefore(dragObj, down ? tr.nextSibling : tr);//nextSibling,previousSibling
                dragManager.endIndex = GetRowIndex(dragObj);
              } else {
                if (dragManager.addTr) {// @ts-ignore
                  dragManager.addTr.style.borderLeft = "";
                }
                let rect = tr.getBoundingClientRect();
                if (e.clientY - rect.y > rect.height / 2) {
                  dragObjLine.style.display = "none";
                  dragManager.addTr = tr;
                  // @ts-ignore
                  tr.style.borderLeft = "2px #0586FD solid";
                  dragManager.endIndex = GetRowIndex(tr);
                } else {
                  dragManager.addTr = undefined;
                  let lastTr = dragManager.children[dragManager.children.length - 1];
                  let isLastChild = lastTr == tr;
                  dragObjLine != tr && tr.parentNode.insertBefore(dragObjLine, isLastChild ? tr.nextSibling : tr);
                  dragObj != tr && tr.parentNode.insertBefore(dragObj, isLastChild ? tr.nextSibling : tr);
                  dragObjLine.style.display = "";
                  dragManager.endIndex = GetRowIndex(dragObjLine);
                }
              }
              dragObj2.style.border = dragManager.defaultBorder;
            } else {
              // dragObj2.style.border = "2px solid red";
            }
          } else {
            dragObj2.style.border = dragManager.defaultBorder;
          }
        }
      }
    },
    StartRowDrag(e, isTree, onRowDrag, validateFun) {
      dragManager.isTree = isTree;
      // dragManager.isTree = false;//后面处理拖拽到子节点问题
      dragManager.onRowDrag = onRowDrag;
      dragManager.validateFun = validateFun;
      dragManager.dragStart(e);
    },
    findTd(target) {
      if (!target) {
        return target;
      }
      if (target.nodeName == "TD") {
        return target;
      }
      return dragManager.findTd(target.parentNode);
    },
    dragStart: function (e) {
      e = e || event;
      let target = e.target || e.srcElement;
      target = dragManager.findTd(target);//查找td
      if (!target) {
        return;
      }
      if (target.nodeName == "TD") {
        dragManager.dragTable = target.parentElement.parentElement;
        dragManager.children = dragManager.dragTable.children;
        dragManager.startIndex = GetRowIndex(target.parentElement);
        dragManager.startTr = target.parentElement;
        dragManager.endIndex = dragManager.startIndex;
        dragManager.endTr = target.parentElement;
        target = target.parentNode;

        let dragObj2 = document.createElement(target.tagName); //1、创建元素
        dragObj2.innerHTML = target.innerHTML;
        dragObj2.style.height = target.offsetHeight + "px";
        // dragObj2.style.backgroundColor = "white";
        dragObj2.style.position = "fixed";
        dragObj2.style.width = target.offsetWidth + "px";

        dragObj2.style.overflow = "hidden";
        // dragObj2.style.display = "table";
        dragObj2.style.pointerEvents = "none";
        // @ts-ignore
        dragObj2.style.zIndex = 1000;
        dragObj2.style.top = (e.clientY - target.offsetHeight / 2) * GetZoom() + "px";
        dragManager.dragObj2 = dragObj2;
        dragManager.defaultBorder = dragObj2.style.border;
        setWidth(target, dragObj2);
        target.parentNode.appendChild(dragObj2);
        dragManager.dragObj = target;
        if (dragManager.isTree) {
          dragManager.dragObj.style.display = "none";
          let dragObjLine = document.createElement(target.tagName); //1、创建元素
          dragObjLine.innerHTML = "<tr><td colspan='100' style='border-top: #0586FD 2px solid;padding:0;height: 2px'></td></tr>";
          target.parentNode.appendChild(dragObjLine);
          dragManager.dragObjLine = dragObjLine;
          dragManager.dragObjLine.style.display = "none";
        }
        // target.style.cursor = "move";
        dragManager.clientY = e.clientY;
        addEvent(document, "mousemove", dragManager.draging);
        addEvent(document, "mouseup", dragManager.dragEnd);
      }
    },
    dragEnd: function (e) {
      let dragObj = dragManager.dragObj;
      if (dragObj) {
        e = e || event;
        let target = e.target || e.srcElement;
        //console.log(dragManager.startIndex, dragManager.endIndex);
        let addChild = false;
        if (dragManager.addTr) {// @ts-ignore
          dragManager.addTr.style.borderLeft = "";
          addChild = true;
        }
        if (dragManager.startIndex != dragManager.endIndex || dragManager.isTree) {
          dragManager.onRowDrag && dragManager.onRowDrag(dragManager.startIndex, dragManager.endIndex, dragManager.startTr, dragManager.endTr, addChild);
        }
        dragManager.addTr = undefined;
        dragManager.startIndex = -1;
        dragManager.startTr = undefined;
        dragManager.endIndex = -1;
        dragManager.endTr = undefined;
        dragManager.onRowDrag = undefined;
        target = target.parentNode;
        // dragObj.style.cursor = "default";
        dragManager.dragObj2.parentNode.removeChild(dragManager.dragObj2);
        if (dragManager.isTree) {
          dragManager.dragObj.style.display = "";
          dragManager.dragObjLine.parentNode.removeChild(dragManager.dragObjLine);
        }
        dragManager.dragObj = null;
        dragManager.dragObj2 = null;
        dragManager.dragObjLine = null;
        dragManager.defaultBorder = "none";
        removeEvent(target, "mouseover", dragManager.draging);
        removeEvent(target, "mouseup", dragManager.dragEnd);
      }
    },
  };
  // addEvent(el, "mousedown", dragManager.dragStart);
  return dragManager;
}
