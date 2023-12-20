import React, { useState } from "react";
import XBaseDisplay from "../base/XBaseDisplay";
import XDate from "../toolkit/XDate";
import XModal from "../layout/XModal";
import XCard from "../layout/XCard";
import './gantt/index.css';
import styled from 'styled-components';

// extends XBaseDisplayProps
export interface XGanttProps {
  /**
   * 显示字段
   */
  visibleColumns?: XGanttColumns[],
  /**
   * 名称字段
   */
  nameField?: string,
  /**
   * 开始时间字段
   */
  startField?: string,
  /**
   * 结束时间字段
   */
  endField?: string,
  /**
   * 进度字段
   */
  progressField?: string,
  /**
   * 类型字段
   */
  typeField?: string,
  /**
   * 关系字段
   */
  relationField?: string,
  /**
   *父关系字段
   */
  parentField?: string,
  /**
   * 排序字段
   */
  orderField?: string
}

interface XGanttColumns {
  field: string,
  render: Function
}

const ViewMode = {
  Hour: "Hour",
  QuarterDay: "Quarter Day",
  HalfDay: "Half Day",
  Day: "Day",
  Week: "Week",
  Month: "Month",
  QuarterYear: "QuarterYear",
  Year: "Year",
}
/**
 * 功能完善的甘特图组件
 * @name 甘特图
 * @groupName
 */
export default class XGantt extends XBaseDisplay<XGanttProps,any> {
  static ComponentName = "甘特图";
  static defaultProps = {
    ...super.defaultProps,
    nameField: 'name',
    startField: 'start',
    endField: 'end',
    progressField: 'progress',
    typeField: 'type',
    relationField: 'dependencies',
    parentField: 'project',
    orderField: 'displayOrder',
  }

  constructor(props){
    super(props);
    this.state.data = this.dataFormat( props.data )
  }

  dataFormat = ( originalData ) => {
    const { nameField, startField, endField, progressField, typeField, relationField, parentField, orderField } = this.props
    const newData = originalData.map( item => {
      return {
        ...item,
        name:  item[nameField],
        start: XDate.ToDate(item[startField]),
        end:   XDate.ToDate(item[endField]),
        type:  item[typeField],
        progress:     item[progressField],
        dependencies: item[relationField],
        project:      item[parentField],
        displayOrder: item[orderField],
      }
    } )
    return newData
  }

  updateTask = ( task ) => {
    const {data} = this.state
    this.SetData(data.map(t => (t.id === task.id ? task : t)))
  }

  handleTaskDateChange = (task) => {
    const {data} = this.state
    let newData = data.map(t => (t.id === task.id ? task : t));
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newData, task.project);
      const project = newData[newData.findIndex(t => t.id === task.project)];
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newData = newData.map(t =>
          t.id === task.project ? changedProject : t
        );
      }
    }
    this.SetData(newData)
  };

  handleDeleteArrow = (arrow) => {
    if(arrow){
      const { taskFrom, taskTo } = arrow
      if(taskFrom && taskTo){
        XModal.Confirm(`您确定断开“${taskFrom.name}”与“${taskTo.name}”的连接吗？`,()=>{
          const {data} = this.state
          let newData = data.map(t => {
            if(t.id == taskTo.id && t.dependencies){
              t.dependencies.splice( t.dependencies.findIndex(dep=>dep==taskFrom.id),1)
            }
            return t;
          });
          this.SetData(newData)
        })
      }
    }
  }

  handleAddArrow = ( taskFrom, taskTo ) => {
    if(taskFrom && taskTo){
      const {data} = this.state
      let newData = data.map(t => {
        if(t.id == taskTo.id && t.dependencies){
          if(!t.dependencies.includes(taskFrom.id)){
            t.dependencies.push(taskFrom.id)
          }
        }
        return t;
      });
      this.SetData(newData)
    }
  }

  handleDeleteTask = ( task ) => {
    XModal.Confirm("你确定删除"+task.name+"吗？",()=>{
      const {data} = this.state
      this.SetData( data.filter(t => t.id !== task.id) )
    })
  };

  async componentDidMount() {
    super.componentDidMount();
    const Gantt = await import(/* webpackChunkName: "tGantt" */ './gantt');// @ts-ignore
    this.setState({Gantt: Gantt.Gantt})
  }

  render() {
    if (!this.state.Gantt) {
      return <div></div>
    }
    let Gantt = this.state.Gantt;
    const {data} = this.state
    return <XCard overflow={"initial"}>
      <ViewSwitcher onViewModeChange={(viewMode, columnWidth) => this.setState({viewMode, columnWidth})}/>
      <GanttStyle>
        <Gantt locale="zh" viewMode={this.state.viewMode || ViewMode.Day}
               TaskListHeader={TaskListHeader}
               TaskListTable={TaskListTable}
               onDeleteArrow={this.handleDeleteArrow}
               onDelete={this.handleDeleteTask}
               onAddArrow={this.handleAddArrow}
               onDateChange={this.handleTaskDateChange}
               onProgressChange={this.updateTask}
               onExpanderClick={this.updateTask}
               columnWidth={this.state.columnWidth || 65}
               tasks={data}{...this.props}/>
      </GanttStyle>
    </XCard>
  }
}

const getStartEndDateForProject = (data, projectId) => {
  const projectTasks = data.filter(t => t.project === projectId);
  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
}

const GanttStyle = styled.div`overflow: auto;*::-webkit-scrollbar {height: 12px;-webkit-border-radius: 0px;}*::-webkit-scrollbar-track {-webkit-border-radius: 0px;}*::-webkit-scrollbar-track-piece {background-color: transparent;-webkit-border-radius: 0px;}*::-webkit-scrollbar-thumb:vertical {background-color: #BDBDBD;-webkit-border-radius: 0px;}*::-webkit-scrollbar-thumb:horizontal {background-color: #BDBDBD;-webkit-border-radius: 0px;}*::-webkit-scrollbar-thumb:vertical:hover,*::-webkit-scrollbar-thumb:horizontal:hover{background-color: #808080;}&>div>div:first-child>div:first-child{box-shadow: 5px 0px 8px 1px rgb(96 96 96 / 10%);z-index: 999;}`

// ViewSwitcher
type ViewSwitcherProps = { onViewModeChange: (viewMode: string, columnWidth: Number) => void; };
const ViewSwitcherContainer = styled.div`.Button {background: #fff;border: 1px solid #BDBDBD;border-radius: 0px;margin: 1px;width: 60px;}.Selected {background: #f1f1f1;}`
const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ onViewModeChange = () => {} }) => {
  const [selected, setSelected] = useState('day');
  const select = (viewMode: string, columnWidth: Number) => {
    setSelected(viewMode);
    onViewModeChange(viewMode, columnWidth);
  }
  const isSelected = (viewMode: string) => selected == viewMode && 'Selected'
  return <ViewSwitcherContainer>
    <button className={`Button ${isSelected(ViewMode.QuarterDay)}`}
            onClick={() => select(ViewMode.QuarterDay,65)}>6小时
    </button>
    <button className={`Button ${isSelected(ViewMode.HalfDay)}`}
            onClick={() => select(ViewMode.HalfDay,65)}>半天
    </button>
    <button className={`Button ${isSelected(ViewMode.Day)}`}
            onClick={() => select(ViewMode.Day,65)}>天
    </button>
    <button className={`Button ${isSelected(ViewMode.Week)}`}
            onClick={() => select(ViewMode.Week,250)}>周
    </button>
    <button className={`Button ${isSelected(ViewMode.Month)}`}
            onClick={() => select(ViewMode.Month,300)}>月
    </button>
  </ViewSwitcherContainer>
};

// TaskListHeader
const TaskListHeaderStyle = styled.div`&,.ganttTable {display: table;border-bottom: #e6e4e4 1px solid;border-top: #e6e4e4 1px solid;border-left: #e6e4e4 1px solid;}.ganttTable_Header {display: table-row;list-style: none;}.ganttTable_HeaderSeparator {border-right: 1px solid rgb(196, 196, 196);opacity: 1;margin-left: -2px;}.ganttTable_HeaderItem {display: table-cell;vertical-align: -webkit-baseline-middle;vertical-align: middle;}`
const TaskListHeader = ({ headerHeight, fontFamily, fontSize, rowWidth, visibleColumns }) => {
  const Sep = ()=> <div className={"ganttTable_HeaderSeparator"} style={{ height: headerHeight * 0.5, marginTop: headerHeight * 0.2 }}/>
  const Col = ({children,width=rowWidth}) => (
    <div className={"ganttTable_HeaderItem"} style={{ minWidth: width }}>
      &nbsp;{children}
    </div>
  )
  return (
    <TaskListHeaderStyle className={"ganttTable"}>
      <div className={"ganttTable_Header"} style={{  height: headerHeight - 2}}>
        {
          visibleColumns.map( (column, index) => {
            return <>
              { index !== 0 && <Sep/> }
              <Col width={column.width || rowWidth}>{column.title || column.field || ""}</Col>
            </>
          })
        }
      </div>
    </TaskListHeaderStyle>
  );
};

// TaskListTable
const TaskListTableStyle = styled.div`&,.taskListWrapper {display: table;border-bottom: #e6e4e4 1px solid;border-left: #e6e4e4 1px solid;}.taskListTableRow {display: table-row;text-overflow: ellipsis;}.taskListTableRow:nth-of-type(even) {background-color: #f1f1f157;}.taskListCell {display: table-cell;vertical-align: middle;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}.taskListNameWrapper {display: flex;}.taskListExpander {color: rgb(86 86 86);font-size: 0.6rem;padding: 0.15rem 0.2rem 0rem 0.2rem;user-select: none;cursor: pointer;}.taskListEmptyExpander {font-size: 0.6rem;padding-left: 1rem;user-select: none;}`

export const TaskListTable = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  locale,
  visibleColumns,
  onExpanderClick,
}) => {
  return (
    <TaskListTableStyle className={"taskListWrapper"} style={{ fontFamily: fontFamily, fontSize: fontSize }} >
      {tasks.map(t => {
        let expanderSymbol = "";
        if (t.hideChildren === false) {
          expanderSymbol = "▼";
        } else if (t.hideChildren === true) {
          expanderSymbol = "▶";
        }
        return (
          <div className={"taskListTableRow"} style={{ height: rowHeight }} key={`${t.id}row`}>
            {
              visibleColumns.map( ( column, index ) => {
                return (
                  <div className={"taskListCell"} style={{ minWidth: column.width || rowWidth, maxWidth: column.width || rowWidth }} title={t.name}>
                    {
                      index == 0?
                      <div className={"taskListNameWrapper"}>
                        <div className={ expanderSymbol ? "taskListExpander" : "taskListEmptyExpander" } onClick={() => onExpanderClick(t)}>
                          {expanderSymbol}
                        </div>
                        <div>{t[column.field]}</div>
                      </div>:
                      column.render && column.render instanceof Function? column.render(t[column.field],t):t[column.field]
                    }
                  </div>
                )
              })
            }
          </div>
        );
      })}
    </TaskListTableStyle>
  );
};
