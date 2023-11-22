import React from 'react';

/**
 * 截图组件
 * @name 截图
 * @groupName
 */
export default class XHtml2canvas {
  static async GetHtml2canvas(): Promise<any> {
    let ret = await import(/* webpackChunkName: "tHtml2canvas" */ 'html2canvas');
    return ret.default;
  }

  static async GetImageBase64(element: HTMLElement, maxSizeKB = 200, maxWidth = 0, maxHeight: 0): Promise<string> {
    let ret = "";
    if (element) {
      let html2canvas = await XHtml2canvas.GetHtml2canvas();
      let canvas = await html2canvas(element);
      if (maxWidth > 0 || maxHeight > 0) {
        return await XHtml2canvas.compressImage(canvas.toDataURL(), maxSizeKB, maxWidth, maxHeight);
      } else {
        return XHtml2canvas.compressCanvas(canvas, maxSizeKB);
      }
    }
    return ret;
  }

  static compressImage(src, maxSizeKB = 200, maxWidth = 0, maxHeight = 0): Promise<string> {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onerror = () => resolve("");
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (maxWidth > 0 && w > maxWidth) {
          h = maxWidth * h / w;
          w = maxWidth;
        }
        if (maxHeight > 0 && h > maxHeight) {
          w = maxHeight * w / h;
          h = maxHeight;
        }
        let canvas = document.createElement("canvas");
        canvas.width = w; // 实际渲染像素
        canvas.height = h; // 实际渲染像素
        canvas.style.width = `${img.width}px`; // 控制显示大小
        canvas.style.height = `${img.height}px`; // 控制显示大小
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(XHtml2canvas.compressCanvas(canvas, maxSizeKB));
      };
      img.src = src;
    });
  }

  static compressCanvas(canvas, maxSizeKB = 200, quality = 1) {
    let ret = "";
    while (true) {
      let base64 = canvas.toDataURL("image/jpeg", quality);
      if ((XHtml2canvas.getBase64ImageSize(base64) / 1024) < maxSizeKB || quality <= 0.1) {
        ret = base64;
        break;
      } else {
        quality -= 0.05;
      }
    }
    return ret;
  }

  static base64toFile(base64, filename) {
    return XHtml2canvas.blobToFile(XHtml2canvas.base64toBlob(base64), filename);
  }

  static strtoFile(str, filename) {
    return XHtml2canvas.blobToFile(new Blob([str], {type: "text/plain"}), filename);
  }

  static base64toBlob(base64) {
    let arr = base64.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let str = atob(arr[1]);
    let n = str.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = str.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
  }

  static blobToFile(theBlob, fileName) {
    theBlob.lastModifiedDate = new Date();  // 文件最后的修改日期
    theBlob.name = fileName;                // 文件名
    return new File([theBlob], fileName, {type: theBlob.type, lastModified: Date.now()});
  }

  static getBase64ImageSize(base64): number {
    if (base64) {
      let key = "base64,";
      let indexBase64 = base64.indexOf(key);
      if (indexBase64 >= 0) {
        let str = base64.substring(indexBase64 + key.length);
        return str.length * 0.75;
      }
    }
    return -1;
  }
}