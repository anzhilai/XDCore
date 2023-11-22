import React from 'react';
import XBaseStyle, { XBaseStyleProps } from './XBaseStyle';


/**
 * 显示组件
 */
export interface XBaseDisplayProps extends XBaseStyleProps {
  /**
   * 显示类组件的数据模型
   */
  data?: any,
}

/**
 * 显示类组件的基类，统一为数组数据类型
 * @name 基础显示组件
 * @groupName 分类
 */
export default class XBaseDisplay< P = {}, S = {}> extends XBaseStyle<XBaseDisplayProps&P,any> {

  static defaultProps = {
    ...XBaseStyle.defaultProps,
  };

  constructor(props:any) {
    super(props);
    this.state={
      ...this.state,
      data : this.props.data,
    }
  }

  useStateData= false;

  /**
   * 获取组件数据集
   */
  GetData() {
    if (this.useStateData) {
      if (this.state.data) {
        return this.state.data;
      }
    } else if (this.props.data) {
      return this.props.data;
    }
    return [];
  }

  /**
   * 设置组件数据集
   * @param data 数据集
   */
  SetData(data: any) {
    this.useStateData = true;
    this.setState({data: data,});
  }

  /**
   * 刷新当前组件
   * @param filter 过滤参数, 当isnew为false时，刷新参数和历史参数合并
   * @param isnew 是否为新的参数
   * @constructor
   */
  async Refresh(filter?:object,isnew?:boolean){
    let value = await this.RefreshServer(filter,isnew);
    if(value){
      this.SetData(value.rows);
    }
  }

  renderDisplay(){
    return (<div/>)
  }

  render() {
    return this.styleWrap(this.renderDisplay());
  }
}
