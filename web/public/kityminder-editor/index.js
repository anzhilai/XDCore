angular.module('kityminderDemo', ['kityminderEditor'])
  .config(["configProvider", function (configProvider) {
    //configProvider.set('imageUpload', '../server/imageUpload.php');//上传功能
  }])
  .run(['$templateCache', function ($templateCache) {
    'use strict';
    //添加按钮
    $templateCache.put('ui/directive/openSave/openSave.html',
      "<div class=\"km-btn-group\" style='border-left: 1px dashed #eee;'>" +
      "<div class=\"km-btn-item\" ng-click=\"downloadImg()\" title=\"下载\">" +
      "<span class=\"km-btn-caption\" style='padding: 12px 10px;'>下载</span>" +
      "</div>" +
      "<div class=\"km-btn-item\" ng-click=\"clickMenu(item)\" title=\"{{item.name}}\" ng-repeat='item in list'>" +
      "<span class=\"km-btn-caption\" style='padding: 12px 10px;'>{{item.name}}</span>" +
      "</div>" +
      "</div>"
    );
    //菜单配置
    $templateCache.put('ui/directive/topTab/topTab.html',
      "<tabset>" +
      (window.location.search.indexOf("?edit=") >= 0 ? ("<tab heading=\"{{ 'idea' | lang: 'ui/tabs'; }}\" ng-click=\"toggleTopTab('idea')\" select=\"setCurTab('idea')\">" +
        "<undo-redo editor=\"editor\"></undo-redo>" +
        "<append-node minder=\"minder\"></append-node>" +
        "<operation minder=\"minder\"></operation>" +
        "<hyper-link minder=\"minder\"></hyper-link>" +
        "<image-btn minder=\"minder\"></image-btn>" +
        "<mathjax-btn minder=\"minder\"></mathjax-btn>" +
        "<open-save minder=\"minder\" readonly='false'></open-save>" +
        "</tab>" +
        "<tab heading=\"{{ 'appearence' | lang: 'ui/tabs'; }}\" ng-click=\"toggleTopTab('appearance')\" select=\"setCurTab('appearance')\">" +
        "<template-list minder=\"minder\" class=\"inline-directive\"></template-list>" +
        "<theme-list minder=\"minder\"></theme-list>" +
        "</tab>") : "") +
      "<tab heading=\"{{ 'view' | lang: 'ui/tabs'; }}\" ng-click=\"toggleTopTab('view')\" select=\"setCurTab('view')\">" +
      "<expand-level minder=\"minder\"></expand-level>" +
      "<select-all minder=\"minder\"></select-all>" +
      "<search-btn minder=\"minder\"></search-btn>" +
      (window.location.search.indexOf("?edit=") >= 0 ? "" : "<open-save minder=\"minder\" readonly='true'></open-save>") +
      "</tab>" +
      "</tabset>"
    );
  }])
  .directive('openSave', ['commandBinder', function (commandBinder) {
    return {
      restrict: 'E',
      templateUrl: 'ui/directive/openSave/openSave.html',
      scope: {
        minder: '=',
        readonly: '='
      },
      replace: true,
      link: function ($scope) {
        window.scopeMenu = $scope;
        $scope.list = [];
        $scope.clickMenu = function (item) {
          if (item && item.click) {
            item.click();
          }
        }
        $scope.downloadImg = function () {
          minder.exportData("png").then(function (content) {
            downloadFile("思维导图" + new Date().getTime() + ".png", content);
          });
        }
      }
    }
  }])
  .controller('MainController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.fileName = "test";
    $scope.initEditor = function (editor, minder) {
      window.editor = editor;
      window.minder = minder;
      if (window.minderData) {
        window.minder.importJson(window.minderData);//导入数据
        window.minderData = undefined;
      }
      if (window.location.search.indexOf("?edit=") == -1) {
        minder.fire('readonly');//只读模式
      }
      if(window.pageInitCallback){
        pageInit(window.pageInitCallback);
      }
      // minder.importJson({});//导入数据
      // minder.fire('readonly');//只读模式
      // minder.on("contentchange", () => {
      //   console.log(minder.exportJson());
      //   // minder.exportData("png").then(function (content) {
      //   //   //base64图片
      //   //   console.log(content);
      //   // });
      // });
    };
  }]);

function pageInit(callback) {
  if(window.editor){
    callback(window.editor, window.minder, UpdateMenu, ImportList);
  }else{
    window.pageInitCallback = callback;
  }
}

function UpdateMenu(list) {
  if (window.scopeMenu) {
    window.scopeMenu.list = list;
    window.scopeMenu.$apply();
  }
}

//导入数据
function ImportList(list, nameKey, title = "组织架构", template = "filetree", idKey = "id", pidKey = "Parentid") {
  let map = {};
  let created = 10000000;
  let newList = [];
  list.forEach((item, index) => {
    let obj = {data: item, children: []};
    map[item[idKey]] = obj;
    item.text = item[nameKey];
    item.created = created + index;
    newList.push(obj);
  });
  for (let i = newList.length - 1; i >= 0; i--) {
    let item = newList[i];
    let parentid = item.data[pidKey];
    if (map[parentid]) {
      map[parentid].children.unshift(item);
      newList.splice(i, 1);//删除
    }
  }
  let root = {data: {id: "root", text: title, created: created}, children: newList};
  if (newList.length === 1) {
    root = newList[0];
  }
  let data = {
    "root": root,
    // "template": "structure",
    // "template": "filetree",
    template: template,
    "theme": "fresh-blue",
    "version": "1.4.43"
  };//树模型
  if (window.minder) {
    window.minder.importJson(data);//导入数据
  } else {
    window.minderData = data;
  }
}

function downloadFile(fileName, content) {
  let aLink = document.createElement('a');
  let blob = this.base64ToBlob(content); //new Blob([content]);
  let evt = document.createEvent("HTMLEvents");
  evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
  aLink.download = fileName;
  aLink.href = URL.createObjectURL(blob);
  // aLink.dispatchEvent(evt);
  aLink.click()
}

//base64转blob
function base64ToBlob(code) {
  let parts = code.split(';base64,');
  let contentType = parts[0].split(':')[1];
  let raw = window.atob(parts[1]);
  let rawLength = raw.length;
  let uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], {type: contentType});
}

function GetTagName(node) {
  let ret = "";
  if (node) {
    ret = node.tagName;
    if (ret.toUpperCase() === "BODY") {
      return "";
    }
    if (node.parentElement) {
      let tagName = GetTagName(node.parentElement);
      if (tagName) {
        ret = tagName + ">" + ret;
      }
    }
  }
  return ret;
}
