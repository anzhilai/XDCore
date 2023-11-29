import React from 'react';
import { Statistic } from "antd";
import styled from 'styled-components';
import XBaseDisplay, { XBaseDisplayProps } from "../base/XBaseDisplay";
import XTools from "../toolkit/XTools";
import XIcon from './XIcon';

export interface XStatisticProps extends XBaseDisplayProps {
  /**
   * 点击事件
   */
  onClick?: any,
  /**
   * 标题
   */
  title?: string,
  /**
   * 统计方式
   */
  mode?: 'sum'|'count'|'max'|'min'|'avg',
  /**
   * 统计字段
   */
  statField?: string,
}

/**
 * 显示一个统计结果，配合图标说明
 * @name 统计显示
 * @groupName 图表
 */
export default class XStatistic extends XBaseDisplay<XStatisticProps,any> {
  static ComponentName = "统计显示";
  static Statistic: typeof Statistic = Statistic;
  // sum,count,avg,max,min
  static mode={
    sum:"sum",count: "count",max: "max",min: "min",avg:'avg',
  }

  static defaultProps = {
    ...XBaseDisplay.defaultProps,
    onClick:undefined,
    title: '',
    desc:'',
    mode: XStatistic.mode.count,
    height:"auto",
    statField: 'id',
  };

  constructor(props) {
    super(props)
    if(this.props.data){
      this.state.data = this.props.data;
    }
  }

  componentDidMount() {
    if(this.state.data?.length>0){
      this.SetData(this.state.data);
    }else if(this.props.dataSourceUrl){
      this.Refresh();
    }
  }

  async Refresh(filter?:object){
    if(!this.props.dataSourceUrl||!this.props.statField){
      return;
    }
    // @ts-ignore
    this.state.filterData = filter;
    let f={
      ...this.props.filterData,
    };
    if(filter) {
      f = {
        ...this.props.filterData,
        ...this.state.filterData,
      };
    }
    if (this.props.mustHasFilter && XTools.isEmptyObject(this.props.filterData) && XTools.isEmptyObject(this.state.filterData)) {
      return;
    }
    this.setState({loading: true});
    const postData ={
      ...f,
      StatField:this.props.statField,
      StatType:this.props.mode,
    }
    const retData = await this.RequestServerPost(this.props.dataSourceUrl, postData);
    if (retData.Success ) {
      // @ts-ignore
      this.state.data = retData.Value;
      this.setState({
        data: this.state.data,
      });
    }
  }

  renderDisplay() {
    const style:any={};
    if(this.props.onClick){
      style.cursor = "pointer";
    }
    style.padding="5px";
    style.border = this.props.showBorder?"1px solid #dfe3e8":'none';
    let styleType = this.GetStyleType();
    if (styleType === "style1") {
      return (
        <div style={{
          cursor: "pointer",
          width: this.props.width?this.props.width:"150px",
          backgroundColor: '#ffffff',
          borderRadius: '5px',
          boxShadow: "0 0 3px #ccc"
        }} onClick={() => {
          this.props.onClick && this.props.onClick(this);
        }}>
          <div  style={{textAlign: "center"}}>
            <span style={{fontSize: 40, color: this.props.color?this.props.color:"#50AEFF",}}>{this.state.data}</span>
            <span style={{fontSize: 20, color: this.props.color?this.props.color:"#50AEFF",}}>{this.props.desc}</span>
          </div>
          <div style={{fontSize: 25,color: "grey", textAlign: "center"}}>{this.props.title}</div>
        </div>
      );
    } else if (styleType === "style2") {
      return (
        <ColorDiv style={style} onClick={()=>{
          if(this.props.onClick){
            this.props.onClick(this);
          }
        }}>
          <div style={{color:"white"}}>{this.props.title}</div>
          <div style={{display:"flex"}}>
            <span style={{width:"50px",color:"white",fontSize: '30px',fontFamily: 'fantasy'}}>{this.state.data}</span>
            {/*<ContactsTwoTone style={{fontSize: '50px',}}  />*/}
            {XIcon.Contacts()}
          </div>
        </ColorDiv>
      );
    }else{
      return (
        <div style={style} onClick={() => this.props.onClick?.(this)}>
          <Statistic title={this.props.title} value={this.state.data}
                     valueStyle={{color: this.props.onClick ? "#0586fd" : '#3f8600'}}/>
        </div>);
    }
  }

}

const ColorDiv = styled.div`
        background: -ms-linear-gradient(top, #AC07BD, #f6f6f8);        /* IE 10 */
        background:-moz-linear-gradient(top, #AC07BD, #f6f6f8);/*火狐*/
        background:-webkit-gradient(linear, 0% 0%, 0% 100%, from(#AC07BD), to(#f140f8));/*谷歌*/
        background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#AC07BD), to(#f140f8));      /* Safari 4-5, Chrome 1-9*/
        background: -webkit-linear-gradient(left,#cbd6f4,#0f4bf3);   /*Safari5.1 Chrome 10+*/
        background: -o-linear-gradient(top, #AC07BD, #f140f8);  /*Opera 11.10+*/
    `;
