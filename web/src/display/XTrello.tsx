import React from 'react';
import  {XBaseDisplay,XBaseDisplayProps} from 'xdcoreweb';
import styled from "styled-components";

const XTrelloStyle = styled.div`&>div{height: 100%;background-color: #fff;}overflow: auto;*::-webkit-scrollbar {height: 12px;-webkit-border-radius: 0px;}*::-webkit-scrollbar-track {-webkit-border-radius: 0px;}*::-webkit-scrollbar-track-piece {background-color: transparent;-webkit-border-radius: 0px;}*::-webkit-scrollbar-thumb:vertical {background-color: #BDBDBD;-webkit-border-radius: 0px;}*::-webkit-scrollbar-thumb:horizontal {background-color: #BDBDBD;-webkit-border-radius: 0px;}*::-webkit-scrollbar-thumb:vertical:hover,*::-webkit-scrollbar-thumb:horizontal:hover{background-color: #808080;}`

export interface XTrelloProps extends XBaseDisplayProps {
  /**
   * 字段对象
   */
  fields?: {
    idField?: string,
    titleField?: string,
    labelField?: string,
    descriptionField?: string,
    draggableField?: string,
    groupIdField?: string,
    groupNameField?: string,
  },
  /**
   * 隐藏卡片删除图标
   */
  hideCardDeleteIcon?: boolean,
  /**
   * 卡片样式
   */
  laneDragClass?: string,
  /**
   * 可拖拽
   */
  draggable?: boolean,
  /**
   * 数据修改回调
   */
  onDataChange?: (lane: {}, card: {}) => void,
  /**
   * 格式化回调
   */
  formatLanesFun?: (lanes: any[], map: {}) => [],
  /**
   * 看板颜色
   */
  groupColors: string[],
}

const DefaultFields = {
  idField: "id",
  titleField: "title",
  labelField: "label",
  descriptionField: "description",
  draggableField: "draggable",
  groupIdField: "group",
  groupNameField: "group",
}
/**
 * 功能强大的看板组件，支持自定义拖拽
 * @name 看板
 * @groupName
 */
export default class XTrello extends XBaseDisplay<XTrelloProps, any> {
  static ComponentName = "看板";
  static defaultProps = {
    ...super.defaultProps,
    hideCardDeleteIcon: true,
    laneDragClass: "draggingLane",
    draggable: false,
    onDataChange: undefined,
    formatLanesFun: undefined,
    fields: DefaultFields,
    groupColors: ["", "#13AEFF", "#F58D35", "#008000"],
  }

  constructor(props: XTrelloProps) {
    super(props);
    this.state.data = this.formatData(this.props.data);
  }

  SetData(data: any) {
    super.SetData(this.formatData(data));
  }

  formatData(data: []) {
    if (data) {
      let lanes = [];
      let map = {};
      let fields = {...DefaultFields, ...this.props.fields};
      data.forEach(item => {
        for (let key in fields) {
          if (key != "groupIdField" && key != "groupNameField") {
            item[key.substring(0, key.lastIndexOf("Field"))] = item[fields[key]];
          }
        }
        let groupId = item[fields.groupIdField];
        let groupName = item[fields.groupNameField];
        if (map[groupId] == undefined) {// @ts-ignore
          map[groupId] = {
            id: groupId,
            title: groupName,
            label: '1/1000',
            cards: [item],
            style: {
              backgroundColor: this.props.groupColors[lanes.length],
              color: this.props.groupColors[lanes.length] ? '#fff' : "",
              boxShadow: '2px 2px 4px 0px rgba(0,0,0,0.75)',
            },
            droppable: true
          };
          lanes.push(map[groupId]);
        } else {// @ts-ignore
          map[groupId].cards.push(item);
        }// @ts-ignore
        map[groupId].label = map[groupId].cards.length + '/1000';
      });
      if (this.props.formatLanesFun) {
        lanes = this.props.formatLanesFun(lanes, map);
      }
      return {lanes};
    }
    return {lanes: []};
  }

  async componentDidMount() {
    super.componentDidMount();
    const Trello = await import(/* webpackChunkName: "tTrello" */ 'react-trello');
    this.setState({Trello: Trello.default})
  }

  render(): JSX.Element {
    let Trello = this.state.Trello;
    if (!Trello) {
      return <div></div>
    }
    return <XTrelloStyle>
      <Trello hideCardDeleteIcon={this.props.hideCardDeleteIcon} laneDragClass={this.props.laneDragClass}
              draggable={this.props.draggable} data={this.state.data}
              onDataChange={(data) => {
                let fields = {...DefaultFields, ...this.props.fields};
                data.lanes?.forEach(lane => {
                  lane.cards.forEach(async card => {
                    if (lane.id != card[fields.groupIdField]) {
                      this.props.onDataChange && this.props.onDataChange(lane, card);
                    }
                  })
                })
              }}/>
    </XTrelloStyle>
  }
}
