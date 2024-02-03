import {Button, Collapse, Divider, Input, Select, Tabs, Tooltip} from 'antd';
import React, {CSSProperties} from "react";
import XBaseDisplay, {XBaseDisplayProps} from "../../base/XBaseDisplay";
import XArray from "../../toolkit/XArray";
import XString from "../../toolkit/XString";
import XDateTime from "../../editor/XDateTime";
import XInput from "../../editor/XInput";
import XInputNum from "../../editor/XInputNum";
import XSelectList from "../../editor/XSelectList";
import XFlex from "../../layout/XFlex";
import XGrid from "../../layout/XGrid";
import XForm from '../../editor/XForm';
import XIcon from '../XIcon';


export interface XFilterViewProps extends XBaseDisplayProps {
  onFilterChange?: (filterConds: object[]) => void,
  columns: any[],
  filterGroups?: any[], // [{id:'',items:[{columnName:'',relationValue:'',resultValue:''},{columnName:'',relationValue:'',resultValue:''}]}]
}

export default class XFilterView extends XBaseDisplay<XFilterViewProps, any> {
  static StyleType = {web: 'web', common: 'common', search: "search"};

  static RelationType = {
    包含: "包含",
    不包含: "不包含",
    为空: "为空",
    不为空: "不为空",
    等于: "等于",
    不等于: "不等于",
    大于: "大于",
    小于: "小于",
    大于等于: "大于等于",
    小于等于: "小于等于"
  }

  static defaultProps = {
    ...XBaseDisplay.defaultProps,
    onFilterChange: undefined,
    columns: [],
  };

  constructor(props) {
    super(props);
    this.SetFilterGroups(this.props.filterGroups, false);
  }

  static GetFilterConds(filterGroups) {
    let filterConds = [];
    filterGroups?.forEach((group) => {
      let has = false;
      let groupCond = {id: group.id, items: []};
      group.items.forEach((filter) => {
        if (filter.columnName && filter.relationValue && ((filter.resultValue != undefined && filter.resultValue != "") || ['为空', '不为空'].includes(filter.relationValue))) {
          has = true;
          groupCond.items.push(filter);
        }
      })
      if (has) {
        filterConds.push(groupCond);
      }
    })
    return filterConds;
  }

  static ToSqlString(filterGroups) {
    let str = '';
    //把filterGroup拆分为sql
    filterGroups.forEach((group, index) => {
      let has = false;
      if (index > 0 && str) {
        str += ' 或 ';
      }
      group.items.forEach((filter, index2) => {
        if (filter.columnName && filter.relationValue) {
          if (filter.resultValue != undefined && filter.resultValue != "") {
            if (index2 > 0 && str) {
              str += " 且 ";
            }
            str += " " + filter.columnName + "  " + filter.relationValue + "  '" + filter.resultValue + "'";
            has = true;
          } else if (['为空', '不为空'].includes(filter.relationValue)) {
            if (index2 > 0 && str) {
              str += " 且 ";
            }
            str += " " + filter.columnName + "  " + filter.relationValue;
            has = true;
          }
        }
      })
      if (has) {
        str += "  "
      }
    })
    return str
  }

  SetFilterGroups(filterGroups, update = true) {
    if (XArray.isEmpty(filterGroups)) {
      let items = [];
      if (this.props.columns.length > 0) {// @ts-ignore
        items.push({columnName: this.props.columns[0].field});
      }
      if (this.props.columns.length > 1) {// @ts-ignore
        items.push({columnName: this.props.columns[1].field});
      }
      if (this.props.columns.length > 2) {// @ts-ignore
        items.push({columnName: this.props.columns[2].field});
      }
      filterGroups = [{id: "first", items: items}];
    }
    if (update) {
      if (JSON.stringify(filterGroups) != JSON.stringify(this.state.filterGroups)) {
        this.setState({filterGroups})
      }
    } else {
      this.state.filterGroups = filterGroups;
    }
  }

  static relationValueMap = {
    "包含": 'in',
    "不包含": 'not in',
    '大于': '>',
    '大于等于': '>=',
    '小于': '<',
    '小于等于': '<=',
    '等于': '=',
    '不等于': '!=',
    '匹配': 'like',
    '不匹配': 'not like',
    '为空': ' is null ',
    '不为空': ' is not null ',
  }

  static ToSql = (filterGroups) => {
    let sql = '';
    //把filterGroup拆分为sql
    filterGroups.forEach((group, index) => {
      index > 0 ? (sql += ' or ') : ''
      sql += "("
      group.items.forEach((filter, index) => {
        if (filter.columnName && filter.relationValue) {
          if (filter.resultValue != undefined && filter.resultValue != "") {
            const brackets = ['in', 'not in'].includes(filter.relationValue)
            const number = ['number'].includes(filter.relationValue)
            sql += `${index > 0 ? 'and' : ''} ${filter.columnName} ${this.relationValueMap[filter.relationValue] || ''} ${filter.resultValue instanceof Array ? filter.resultValue.reduce((all, curr, i) => i == 0 && i == (filter.resultValue.length - 1) ? `( '${curr}' )` : i == 0 ? all + `( '${curr}'` : i == (filter.resultValue.length - 1) ? all + ` ,'${curr}' )` : all + ` , '${curr}'`, "") : brackets ? `('${filter.resultValue}')` : number ? filter.resultValue : `'${filter.resultValue || ''}'`} `
          } else if (['为空', '不为空'].includes(filter.relationValue)) {
            sql += `${index > 0 ? 'and' : ''} ${filter.columnName} ${this.relationValueMap[filter.relationValue] || ''}`;
          }
        }
      })
      sql += ")"
    })
    return sql
  }

  onFilterChangeEvent() {
    this.props.onFilterChange && this.props.onFilterChange(this.state.filterGroups);
  }

  GetFilterGroups() {
    this.state.filterGroups?.forEach((group, groupIndex) => {
      group.items.forEach((item, index) => {
        let filterItem = this.filterMap[groupIndex + "_" + index]
        if (filterItem) {
          group.items[index] = filterItem.GetFilterData();
        }
      })
    });
    return this.state.filterGroups;
  }

  ResetData() {
    this.SetFilterGroups([], false);
    this.setState({filterGroups: this.state.filterGroups}, () => this.form?.ClearValues());
  }

  form: any;
  filterMap = {};

  render() {
    let that = this;
    return (<div style={{width: "100%"}}>
      <XForm inited={e => this.form = e}/>
      {this.state.filterGroups.map((group, groupIndex) => {
        const isLast = (that.state.filterGroups.length - 1) == groupIndex;
        return <>
          {
            groupIndex != 0 && <Divider>或 <Tooltip title="移除该条件组"><Button onClick={() => {
              that.state.filterGroups.splice(groupIndex, 1);
              that.setState({filterGroups: that.state.filterGroups});
              that.onFilterChangeEvent();
            }} size="small" shape="circle" icon={XIcon.CloseCircleOutlined()}/></Tooltip> </Divider>
          }
          <XGrid key={"xgroup" + group.id} rowGap="2px" height={"auto"}>
            {
              group.items.map((item, index) => {
                return <XFilterItem key={"xitem" + item.id + item.columnName}
                                    ref={e => this.filterMap[groupIndex + "_" + index] = e}
                                    columns={that.props.columns} item={item}
                                    parent={() => this.form} styleType={this.GetStyleType()}
                                    onFilterChange={(cond) => {
                                      group.items[index] = cond;
                                      that.onFilterChangeEvent()
                                    }}
                                    onFilterRemove={(id) => {
                                      group.items.splice(index, 1);
                                      that.setState({filterGroups: that.state.filterGroups});
                                      that.onFilterChangeEvent();
                                    }}/>
              })}
            <XGrid boxStyle={{padding: '10px'}} columnGap="10px" columnsTemplate={['100px']}>
              <Button type="link" onClick={() => {
                group.items = ([...group.items, {id: this.CreateUUID()}])
                that.setState({filterGroups: that.state.filterGroups});
              }}><Button size="small" shape="circle" type="link" icon={XIcon.PlusCircleOutlined()}/> 添加条件</Button>
            </XGrid>
          </XGrid>
          {isLast && <Divider>
            <Button onClick={() => {
              that.state.filterGroups = ([...that.state.filterGroups, {id: this.CreateUUID(), items: []}])
              that.setState({filterGroups: that.state.filterGroups});
            }} type="dashed" icon={XIcon.PlusSquareOutlined()} size={'middle'}
                    style={{marginBottom: 10}}>添加条件组</Button>
          </Divider>}
        </>
      })}
    </div>);
  }
}

export interface XFilterItemProps {
  styleType?: string,
  columns?: any[],
  item: any,
  parent?: () => any,
  onFilterChange?: (cond) => void,
  onFilterRemove?: (id) => void,
}

class XFilterItem extends React.Component<XFilterItemProps, any> {
  declare state: any;

  constructor(props) {
    super(props);
    this.state = {};
    if (this.props.item.columnName) {
      for (const i in this.props.columns) {
        let c: any = this.props.columns[i];
        if (c.field === this.props.item.columnName) {
          this.state.selectColumn = c;
          this.state.selectColumnType = c.type;
          break;
        }
      }
    }
    this.state.selectRelation = this.props.item.relationValue;
  }

  xcolumn: XSelectList;
  xrelation: XSelectList;
  xeditor: any;

  componentDidMount() {
    if (this.props.item.columnName) {
      let relations = this.getRelations(this.state.selectColumnType);
      this.state.selectRelation = relations.length > 0 ? relations[0] : "";
      this.xrelation?.SetItems(relations, false);
    }
  }

  GetResultValue() {
    let v = this.props.item.resultValue;
    if (XString.isJsonString(v)) {
      v = XString.fromJsonString(v)
    }
    return v;
  }

  GetFilterData() {
    let cond: any = {id: this.props.item.id};
    if (this.xcolumn) {
      cond.columnName = this.xcolumn.GetValue();
    }
    if (this.xrelation) {
      cond.relationValue = this.xrelation.GetValue();
    }
    if (this.xeditor) {
      cond.resultValue = this.xeditor.GetValue();
      if (XArray.isArray(cond.resultValue)) {
        cond.resultValue = XString.toJsonString(cond.resultValue);
      }
    }
    return cond;
  }

  triggerFilterChangeEvent() {
    this.props.onFilterChange && this.props.onFilterChange(this.GetFilterData());
  }

  getRelations(type) {
    if (['datetime', 'date',].includes(type)) {
      return ['大于等于', '小于等于', "大于", "小于", '等于', '不等于', '为空', '不为空'];
    } else if (['number', 'float', 'int', 'double'].includes(type)) {
      return ['大于等于', '小于等于', "大于", "小于", '等于', '不等于',];
    } else if (['select'].includes(type)) {
      return ['等于'];
    }
    return ['包含', '不包含', '等于', '不等于', '为空', '不为空'];
  }

  renderInput(type, relation) {
    if (this.state.selectColumn && this.state.selectColumn.filterRender) {
      return this.state.selectColumn.filterRender(this.state.selectColumn, this);
      // } else if (this.state.selectColumn && this.state.selectColumn.filterName) {
      //   let option = {
      //     ...this.state.selectColumn.filterOption,
      //     ref: (e) => this.xeditor = e,
      //     isMultiSelect: true,
      //     showLabel: false,
      //     onValueChange: (v) => this.triggerFilterChangeEvent(),
      //   }
      //return CreateX(this.state.selectColumn.filterName, option);
    } else {
      if (['number', 'float', 'int', 'double'].includes(type)) {
        return <XInputNum ref={(e) => this.xeditor = e} showLabel={false} parent={this.props.parent}
                          value={this.GetResultValue()} styleType={this.props.styleType}
                          onValueChange={(v) => this.triggerFilterChangeEvent()}/>
      }
      if (['date', 'datetime'].includes(type)) {
        return <XDateTime ref={(e) => this.xeditor = e} showLabel={false} parent={this.props.parent}
                          value={this.GetResultValue()} styleType={this.props.styleType}
                          onValueChange={(v) => this.triggerFilterChangeEvent()}/>
      }
      if (['select'].includes(type)) {
        let column = this.state.selectColumn;
        let props = column?.getEditProps ? column?.getEditProps(column) : undefined;
        return <XSelectList ref={(e) => this.xeditor = e} value={this.GetResultValue()} showLabel={false} {...props}
                            onValueChange={v => this.triggerFilterChangeEvent()}/>
      }
      return <XInput ref={(e) => this.xeditor = e} placeholder="请输入"
                     width={this.props.styleType == "common" ? undefined : '300px'} showLabel={false}
                     value={this.GetResultValue()} styleType={this.props.styleType}
                     parent={this.props.parent} onValueChange={(v) => this.triggerFilterChangeEvent()}/>
    }
  }

  renderColumn() {
    let boxStyle: CSSProperties = {};
    if (this.props.styleType == "common") {
      boxStyle.display = "flex";
      boxStyle.alignItems = "center";
    }
    return <XSelectList ref={(e) => this.xcolumn = e} showLabel={false} items={this.props.columns} height={'30px'}
                        styleType={this.props.styleType} value={this.props.item.columnName} displayField="name"
                        boxStyle={boxStyle} onValueChange={(v, item: any) => {
      if (item) {
        this.state.selectColumn = item;
        this.state.selectColumnType = item.type;
        let relations = this.getRelations(this.state.selectColumnType);
        this.state.selectRelation = relations.length > 0 ? relations[0] : "";
        this.xrelation.SetItems(relations, false);
      }
      this.triggerFilterChangeEvent();
      this.setState({selectColumnType: this.state.selectColumnType,})
    }}/>
  }

  renderRelation() {
    let boxStyle: CSSProperties = {};
    if (this.props.styleType == "common") {
      boxStyle.display = "flex";
      boxStyle.alignItems = "center";
    }
    return <XSelectList ref={(e) => this.xrelation = e} height={'30px'} showLabel={false} allowNull={false}
                        value={this.props.item.relationValue} styleType={this.props.styleType}
                        boxStyle={boxStyle} onValueChange={(v, row) => {
      this.state.selectRelation = v;
      this.triggerFilterChangeEvent();
      this.setState({selectRelation: this.state.selectRelation,})
    }}/>;
  }

  render() {
    let border = '1px dashed rgba(96,96,96,0.1)';
    let hasRelation = !['为空', '不为空'].includes(this.state.selectRelation);
    if (this.props.styleType == "common") {
      return <XGrid boxStyle={{border}}>
        <XGrid columnsTemplate={["auto", "auto", "1fr", "1fr"]} columnGap={"10px"} paddingTRBL={"5px 10px"}
               alignItems={"center"} boxStyle={hasRelation ? {borderBottom: border} : undefined}>
          <Tooltip title="移除">
            <Button size="small" shape="circle" icon={XIcon.MinusOutlined()}
                    onClick={() => this.props.onFilterRemove && this.props.onFilterRemove(this.props.item.id)}/>
          </Tooltip>
          <div style={{color: 'rgba(96,96,96)'}}>且</div>
          {this.renderColumn()}
          {this.renderRelation()}
        </XGrid>
        {hasRelation &&
          <XGrid paddingTRBL={"5px 10px"} alignItems={"center"}>
            {this.renderInput(this.state.selectColumnType, this.state.selectRelation)}
          </XGrid>}
      </XGrid>
    }
    return <XGrid boxStyle={{border, padding: '6px 10px 6px 10px'}}
                  alignItems={"center"} columnGap="10px" columnsTemplate={['40px', '40px', '180px', '140px', 'auto']}>
      <Tooltip title="移除">
        <Button size="small" shape="circle" icon={XIcon.MinusOutlined()}
                onClick={() => this.props.onFilterRemove && this.props.onFilterRemove(this.props.item.id)}/>
      </Tooltip>
      <div style={{color: 'rgba(96,96,96)'}}>且</div>
      {this.renderColumn()}
      {this.renderRelation()}
      {hasRelation && this.renderInput(this.state.selectColumnType, this.state.selectRelation)}
    </XGrid>
  }
}


