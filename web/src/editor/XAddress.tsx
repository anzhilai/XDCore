
import React from "react";
import {XBaseEditor, XBaseEditorProps} from "xdcoreweb";

export interface XAddressProps extends XBaseEditorProps {
  /**
   * 省市区数据集
   */
  data?: any[]
}

/**
 * 省市区地址组件
 */
export default class XAddress extends XBaseEditor<XAddressProps, any> {

  static defaultProps = {
    ...XBaseEditor.defaultProps,
  };

  constructor(props) {
    super(props)
  }

  iterate(obj) {
    const temp = [];
    for (const key in obj) {
      temp.push({
        label: obj[key],
        value: key
      });
    }
    return temp;
  }

  iterateCities() {
    const temp = [];
    const provinces = this.iterate(this.props.data['86']);

    for (let i = 0, l = provinces.length; i < l; i++) {
      const item = {};
      item['label'] = provinces[i].label;
      item['value'] = provinces[i].value;

      item['children'] = this.iterate(this.props.data[provinces[i].value]);
      temp.push(item);
    }
    return temp;
  }

  iterateAreas() {
    const temp = [];
    const cities = this.iterateCities();

    for (let i = 0, c = cities.length; i < c; i++) {
      const city = cities[i];
      for (let j = 0, l = city.children.length; j < l; j++) {
        const item = city.children[j];
        const areas = this.iterate(this.props.data[city.children[j].value]);
        // fix: https://github.com/dwqs/vue-area-linkage/issues/7
        if (areas.length) {
          item['children'] = areas;
        } else {
          item['children'] = [{
            label: item.label,
            value: item.value
          }];
        }
      }
      temp.push(city);
    }

    return temp;
  }

  renderEditor() {
    return (<div/>);
  }
}
