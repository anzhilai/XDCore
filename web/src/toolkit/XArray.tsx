/**
 * 数组相关工具
 */
export default class XArray{

  static isArray (param) {
    // Array.isArray(param);
    return Object.prototype.toString.call(param) === '[object Array]';
  }

  static diff(arr1: string[], arr2: Iterable<string>) {
    const set = new Set(arr2)
    return arr1.filter((x) => !set.has(x))
  }

  static merge(arr1: string[], arr2: string[]) {
    const set = new Set(arr1)
    return arr1.concat(arr2.filter((x) => !set.has(x)))
  }

  static insert(arr1: object[], obj: object,index:number) {
    const set = new Set(arr1)
    return arr1.splice(index,0,obj);
  }

  static join(array,c=','){
    if(this.isEmpty(array)){
      return "";
    }
    if(this.isArray(array)) {
      return array.join(c);
    }
    return array;
  }

  static isEqual (a1,a2) {
    if(isArray(a1)&&isArray(a2)&&a1.length==a2.length){
      for(let i=0;i<a1.length;i++){
        if(a1[i]!=a2[i]){
          return false;
        }
      }
      return true;
    }
    return false;
  }

  static isEmpty(a){
    if (a) {
      if (a.length>0) {
        return false;
      }
      return true;
    }
    return true;
  };

  static arrayAddKey(a, item){
    if (a.indexOf(item) >= 0) {
      return;
    }
    a.push(item);
  };

  static arrayDeleteKey(a, item){
    let index = a.indexOf(item);
    if (index >= 0) {
      a.splice(index, 1);
    }
  };

  static deleteKey(a, item){
    let index = a.indexOf(item);
    if (index >= 0) {
      a.splice(index, 1);
    }
  };
  static Contains(a,item){
    if(!a){
      return false;
    }
    if(!isArray(a)){
      return false;
    }
    return a.indexOf(item) >= 0;
  }
  static arrayGetKey(arr, item){
    const index = arr.indexOf(item);
    if (index > -1) {
      return arr[index]
    }
    return undefined;
  };

  static arrayDelete(arr,item){
    const index = arr.indexOf(item);
    if (index > -1) {
      arr.splice(index, 1);
    }
  }
}

export function isArray (param) {
  return Object.prototype.toString.call(param) === '[object Array]';
}

export const XArrayUtil = {
  diff(arr1: string[], arr2: Iterable<string>) {
    const set = new Set(arr2)
    return arr1.filter((x) => !set.has(x))
  },
  merge(arr1: string[], arr2: string[]) {
    const set = new Set(arr1)
    return arr1.concat(arr2.filter((x) => !set.has(x)))
  },
  insert(arr1: object[], obj: object,index:number) {
    const set = new Set(arr1)
    return arr1.splice(index,0,obj);
  },
} as const

export function isArrayEqual (a1,a2) {
  if(isArray(a1)&&isArray(a2)&&a1.length==a2.length){
    for(let i=0;i<a1.length;i++){
      if(a1[i]!=a2[i]){
        return false;
      }
    }
    return true;
  }
  return false;
}


export const arrayGetKeyItem = (arr, field,value) => {
  if(!arr){arr=[];}
  let i = arr.length;
  while (i) {
    i-=1;
    if (arr[i][field] === value) {
      return arr[i] ;
    }
  }
  return undefined;
};


export const arrayAddKey = (a, item) => {
  let i = a.length;
  while (i) {
    i-=1;
    if (a[i] === item) {
      return;
    }
  }
  a.push(item);
};

export const arrayDeleteKey = (a, item) => {
  let i = a.length;
  while (i) {
    i-=1;
    if (a[i] === item) {
      a.splice(i, 1);
      return;
    }
  }
};


