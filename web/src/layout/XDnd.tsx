import React from 'react';

/**
 * 经典的拖拽组件
 * @name 拖拽
 * @groupName
 */
export default class XDnd {
  static async GetReactDnd(): Promise<any> {
    return await import(/* webpackChunkName: "tReactDnd" */ 'react-dnd');
  }

  static async GetReactDndHtml5Backend(): Promise<any> {
    return await import(/* webpackChunkName: "tReactDnd" */ 'react-dnd-html5-backend');
  }

}