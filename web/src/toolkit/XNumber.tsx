/**
 * 数字相关工具
 */
export default class XNumber {
  /**
   * 保留几位小数
   * @param num 数字
   * @param d 几位小数
   */
  static toFixed(num, d) {
    let s = num + "";
    if (!d) d = 0;
    if (s.indexOf(".") == -1) s += ".";
    s += new Array(d + 1).join("0");
    let ret = num + ""
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
      let s = "0" + RegExp.$2, pm = RegExp.$1, a = RegExp.$3.length, b = true;
      if (a == d + 2) {
        // @ts-ignore
        a = s.match(/\d/g);
        // @ts-ignore
        if (parseInt(a[a.length - 1]) > 4) {
          // @ts-ignore
          for (let i = a.length - 2; i >= 0; i--) {
            a[i] = parseInt(a[i]) + 1;
            if (a[i] == 10) {
              a[i] = 0;
              b = i != 1;
            } else break;
          }
        }
        // @ts-ignore
        s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");
      }
      if (b) s = s.substr(1);
      ret = (pm + s).replace(/\.$/, "");
    }
    return XNumber.parseFloat(ret);
  }

  /**
   * 转int
   * @param value
   */
  static parseInt(value) {
    if (value === undefined || value === "" || value === null) {
      return 0;
    }
    value = parseInt(value);
    if (isNaN(value)) {
      value = 0;
    }
    return value;
  }

  /**
   * 转float
   * @param value
   */
  static parseFloat(value) {
    if (value === undefined || value === "" || value === null) {
      return 0;
    }
    value = parseFloat(value);
    if (isNaN(value)) {
      value = 0;
    }
    return value;
  }

  /**
   * 加法
   * @param arg1 加数
   * @param arg2 加数
   */
  static accAdd(arg1, arg2) {
    let r1, r2, m;
    try {
      r1 = arg1.toString().split(".")[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split(".")[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
  }

  /**
   * 减法
   * @param arg2 被减数
   * @param arg1 减数
   */
  static accSub(arg2, arg1) {
    let r1, r2, m, n;
    try {
      r1 = arg1.toString().split(".")[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split(".")[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return XNumber.toFixed((arg2 * m - arg1 * m) / m, n);
  }

  /**
   * 除法
   * @param arg1 被除数
   * @param arg2 除数
   * @param num 保留几位小数
   */
  static accDiv (arg1, arg2, num) {
    let t1 = 0, t2 = 0, r1, r2;
    try {
      t1 = arg1.toString().split(".")[1].length
    } catch (e) {
    }
    try {
      t2 = arg2.toString().split(".")[1].length
    } catch (e) {
    }
    r1 = Number(arg1.toString().replace(".", ""))
    r2 = Number(arg2.toString().replace(".", ""))
    let ret = (r1 / r2) * Math.pow(10, t2 - t1);
    if (num != undefined) {
      ret = XNumber.toFixed(ret, num);
    }
    return ret;
  }

  /**
   * 乘法
   * @param list
   */
  static accMulList(list = []) {
    if (list.length < 2) {
      return 0;
    }
    let ret = list[0];
    for (let i = 1; i < list.length; i++) {
      ret = XNumber.accMul(ret, XNumber.parseFloat(list[i]));
    }
    return ret;
  }

  /**
   * 乘法
   * @param arg1 乘数
   * @param arg2 乘数
   */
  static accMul (arg1, arg2) {
    let m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length
    } catch (e) {
    }
    try {
      m += s2.split(".")[1].length
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
  }

  /**
   * 随机数
   * @param min
   * @param max
   */
  static getRandomNum(min, max){
    const Range = max - min;
    const Rand = Math.random();
    return min + Math.round(Rand * Range);
  };
}
