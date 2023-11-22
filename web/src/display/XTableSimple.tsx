import React from 'react'
import styled from 'styled-components'
import XTableColumn, {XTableColumnProps} from "./table/XTableColumn";
import XString from "../toolkit/XString";
import XTools from "../toolkit/XTools"
export interface XTableSimpleProps extends XTableColumnProps {
}

/**
 * 一个简单轻量的表格显示组件
 * @name 简单表格
 * @groupName 列表
 */
export default class XTableSimple extends XTableColumn<XTableSimpleProps,any> {
  static ComponentName = "简单表格";
  static defaultProps = {
    ...XTableColumn.defaultProps,
  }

  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    await super.componentDidMount();
    if (this.state.data.length > 0) {
      this.SetData(this.state.data);
    } else if (this.props.dataSourceUrl) {
      this.Refresh();
    }
  }


  renderDisplay() {


    return <TableDiv ref={(e) => {
      if (e) {
        this.parentDiv = e;
        // if (!this.xTableDrag) {
          // @ts-ignore
          //this.xTableDrag = XTableDrag(e.domHelper.tableBody);
        // }
      }}}>
      <table className="t_table" key={XTools.GetGUID()}>
      <thead>
      <tr>
        {
          this.state.columns.map((col,index) => {
            const style:any={};
            if(col.width){
              style.width=col.width;
            }
            return  <th key={index} style={style}>{col.title}</th>
          })
        }
      </tr>
      </thead>
      <tbody>
      {
        this.state.data.map((item)=>{
          return  <tr key={item.id}>{
            this.state.columns.map((col) => {
              const style:any={};
              if(col.width){
                style.width=col.width;
              }
              if(col.align){
                style.textAlign=col.align;
              }
              let text = item[col.field];
              if(col.render){
                text = col.render(item[col.field],item);
              }
              return  <td style={style}>{text}</td>
            })
          }</tr>
        })
      }
      </tbody>
    </table></TableDiv>
  }

}

const TableDiv= styled.div`
    height: 90%;
    .t_table{

    color: #fff;
    width: 94%;
    height: 100%;
    margin: 0 auto;
    border-spacing: 0;
    text-align: center;
    box-sizing: border-box;
    margin-top: 15px;
    }
    .t_table tr{
      margin: 0;
      padding: 0;
    }
    .t_table thead tr{
      background: #053A98;
    }
    .t_table tbody tr td:first-child{
      border-left: 1px solid #053A98;
    }
    .t_table td{
      color: #000;
      padding: 0px 10px;
      border-bottom: 1px solid #053A98;
      border-right: 1px solid #053A98;
    }`
