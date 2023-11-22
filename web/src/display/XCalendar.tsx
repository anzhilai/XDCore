import React, {ChangeEvent, MouseEvent} from 'react';
import XBaseDisplay, {XBaseDisplayProps} from "../base/XBaseDisplay";

// @ts-ignore
import {theme} from "./calendar/test/theme";
// @ts-ignore
import {addDate, addHours, subtractDate} from "./calendar/test/utils";
import TUICalendar from "./calendar/TUICalendar";
import XCard from "../layout/XCard";
import XGrid from "../layout/XGrid";
import XFlex from "../layout/XFlex";
import XButton from "../editor/XButton";
import XSelectList from "../editor/XSelectList";
import {XDate} from "..";

export interface XCalendarProps extends XBaseDisplayProps {
  /**
   * 字段对象
   */
  fields?: {
    idField?: string,
    eventTypeField?: string,
    titleField?: string,
    eventCategoryField?: string,
    startField?: string,
    endField?: string,
    filterStartField?: string,
    filterEndField?: string,
  },
  calendars?: any[],
  /**
   * 日历组件模型对象
   */
  template?: object,
  /**
   * 格式化方法
   */
  formatDataFun?: (list: object[]) => object[],
  /**
   * 点击事件
   */
  onClick?: (event: object) => void,
  /**
   * 视图类型
   */
  view?: 'month' | 'week' | 'day',
}

/**
 * 显示一个日历，可以设置任务列表
 * @name 日历
 * @groupName 图表
 */
export default class XCalendar extends XBaseDisplay<XCalendarProps, any> {
  static ComponentName = "日历";
  static EventType = {一般: "一般", 紧急: "紧急", 非常紧急: "非常紧急"}
  static EventCategory = {time: "time", milestone: "milestone", allday: "allday"}

  static defaultProps = {
    ...XBaseDisplay.defaultProps,
    view: "month",
    fields: {
      idField: "id",
      eventTypeField: "事件类型",
      filterStartField: "开始时间",
      filterEndField: "结束时间",
    },
    calendars: [{
      id: XCalendar.EventType.一般,
      name: XCalendar.EventType.一般,
      bgColor: '#03bd9e',
      dragColor: '#03bd9e',
      borderColor: '#03bd9e'
    }, {
      id: XCalendar.EventType.紧急,
      name: XCalendar.EventType.紧急,
      bgColor: '#ffbb3b',
      dragColor: '#ffbb3b',
      borderColor: '#ffbb3b'
    }, {
      id: XCalendar.EventType.非常紧急,
      name: XCalendar.EventType.非常紧急,
      bgColor: '#ff4040',
      dragColor: '#ff4040',
      borderColor: '#ff4040'
    },],
    template: {
      milestone(event) {
        return `<span style="color: #fff; background-color: ${event.backgroundColor};">${event.title}</span>`;
      },
      allday(event) {
        return `[全天] ${event.title}`;
      },
    },
    formatDataFun: undefined,
  };

  constructor(props) {
    super(props);
    this.state.data = this.formatData(props.data);
    this.state.view = this.props.view;
    this.state.calendars = this.props.calendars;
  }

  componentDidMount() {
  }

  async Refresh(filter?: object, isnew?: boolean): Promise<void> {
    let instance = this.getCalInstance();
    if (this.props.dataSourceUrl) {
      let _filter = {...filter};
      _filter[this.props.fields.filterStartField] = XDate.DateToString(instance?.renderRange.start.toDate(), "YYYY-MM-DD 00:00:00");
      _filter[this.props.fields.filterEndField] = XDate.DateToString(instance?.renderRange.end.toDate(), "YYYY-MM-DD 23:59:59");
      super.Refresh(_filter, isnew);
    }
    this.updateText();
  }

  formatData(data) {
    if (data) {
      if (this.props.formatDataFun) {
        return this.props.formatDataFun(data);
      }
      data.forEach(d => {
        if (!d.id) {
          d.id = d[this.props.fields.idField];
        }
        if (!d.calendarId) {
          d.calendarId = d[this.props.fields.eventTypeField];
        }
        if (!d.category) {
          d.category = d[this.props.fields.eventCategoryField];
        }
        if (!d.end) {
          let date = XDate.ToDate(d[this.props.fields.endField]);
          if (date) {
            d.end = this.calendar.GetTZDate(date);
          }
        }
        if (!d.start) {
          let date = XDate.ToDate(d[this.props.fields.startField]);
          if (date) {
            d.start = this.calendar.GetTZDate(date);
          }
        }
        if (!d.title) {
          d.title = d[this.props.fields.titleField];
        }
        d.isReadOnly = true;
      });
    }
    return data;
  }

  SetData(data) {
    super.SetData(this.formatData(data));
  }


  onAfterRenderEvent = (res) => {
    console.group('onAfterRenderEvent');
    console.log('Event Info : ', res.title);
    console.groupEnd();
  };
  onBeforeDeleteEvent = (res) => {
    console.group('onBeforeDeleteEvent');
    console.log('Event Info : ', res.title);
    console.groupEnd();

    const {id, calendarId} = res;

    this.getCalInstance().deleteEvent(id, calendarId);
  };
  onClickDayName = (res) => {
    console.group('onClickDayName');
    console.log('Date : ', res.date);
    console.groupEnd();
  };
  onClickEvent = (res) => {
    console.group('onClickEvent');
    console.log('MouseEvent : ', res.nativeEvent);
    console.log('Event Info : ', res.event);
    console.groupEnd();
    this.props.onClick && this.props.onClick(res.event);
  };
  onClickMoreEventsBtn = (res) => {
    console.group('onClickMoreEventsBtn');
    console.log(res.date, res.target);
    // res.target.style.width = "600px";
    console.groupEnd();
  }
  onClickTimezonesCollapseBtn = (timezoneCollapsed) => {
    console.group('onClickTimezonesCollapseBtn');
    console.log('Is Timezone Collapsed?: ', timezoneCollapsed);
    console.groupEnd();

    // const newTheme = {
    //   'week.daygridLeft.width': '100px',
    //   'week.timegridLeft.width': '100px',
    // };
    //
    // this.getCalInstance().setTheme(newTheme);
  };

  onBeforeUpdateEvent = (updateData) => {
    console.group('onBeforeUpdateEvent');
    console.log(updateData);
    console.groupEnd();

    const targetEvent = updateData.event;
    const changes = {...updateData.changes};

    this.getCalInstance().updateEvent(targetEvent.id, targetEvent.calendarId, changes);
  };

  onBeforeCreateEvent = (eventData) => {
    const event = {
      calendarId: eventData.calendarId || '',
      id: String(Math.random()),
      title: eventData.title,
      isAllday: eventData.isAllday,
      start: eventData.start,
      end: eventData.end,
      category: eventData.isAllday ? 'allday' : 'time',
      dueDateClass: '',
      location: eventData.location,
      state: eventData.state,
      isPrivate: eventData.isPrivate,
    };
    this.getCalInstance().createEvents([event]);
  };
  calendar: any;

  getCalInstance() {
    return this.calendar?.getInstance();
  }

  viewModeOptions = [
    {title: '月', id: 'month',},
    {title: '周', id: 'week',},
    {title: '天', id: 'day',},
  ];
  onClickNavi = (action) => {
    this.getCalInstance()[action]();
    this.Refresh();
  };

  updateText() {
    let instance = this.getCalInstance();
    if (instance) {
      let text = XDate.DateToString(instance?.renderRange.start.toDate(), "YYYY-MM-DD");
      if (this.state.view == "month") {
        let start = instance?.renderRange.start.toDate();
        text = XDate.DateToString(new Date(start.getTime() + 1000 * 60 * 60 * 24 * 15), "YYYY-MM月");
      } else if (this.state.view == "week") {
        function getYearWeek(endDate) {
          let beginDate = new Date(endDate.getFullYear(), 0, 1);//本年的第一天
          //星期从0-6,0代表星期天，6代表星期六
          let endWeek = endDate.getDay();
          if (endWeek == 0) {
            endWeek = 7;
          }
          let beginWeek = beginDate.getDay();
          if (beginWeek == 0) {
            beginWeek = 7;
          }
          let millisDiff = endDate.getTime() - beginDate.getTime();
          let dayDiff = Math.floor((millisDiff + (beginWeek - endWeek) * (24 * 60 * 60 * 1000)) / 86400000);
          return Math.ceil(dayDiff / 7) + 1;
        }

        let start = instance?.renderRange.start.toDate();
        let week = getYearWeek(start);
        text = XDate.DateToString(start, "YYYY-") + (week < 10 ? "0" + week : week) + "周";
      }
      if (this.txtTime) {
        this.txtTime.innerText = text;
      }
    }
  }

  txtTime: HTMLElement

  render() {
    let prev = "上一天";
    let next = "下一天";
    if (this.state.view == "month") {
      prev = "上一月";
      next = "下一月";
    } else if (this.state.view == "week") {
      prev = "上一周";
      next = "下一周";
    }
    return <XGrid rowsTemplate={["auto", "1fr"]}>
      <XFlex horizontalAlign={"start"}>
        <XSelectList field={"日历"} items={this.viewModeOptions} value={this.state.view}
                     displayField={"title"} boxStyle={{width: 200}}
                     onValueChange={v => this.setState({view: v}, () => this.Refresh())}/>
        <XButton text={"今天"} onClick={() => this.onClickNavi("today")}/>
        <XButton text={prev} onClick={() => this.onClickNavi("prev")}/>
        <XButton text={next} onClick={() => this.onClickNavi("next")}/>
        <div ref={e => this.txtTime = e}
             style={{border: "1px solid #DDDDDD", marginLeft: "auto", borderRadius: 6, padding: "2px 5px"}}></div>
      </XFlex>
      <XCard boxClassName={"unzoom"}>
        <TUICalendar
          height="100%"
          calendars={this.state.calendars}
          isReadOnly={true}
          month={{
            startDayOfWeek: 1,
            dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
          }}
          events={this.state.data}
          template={this.props.template}
          theme={theme}
          useDetailPopup={true}
          useFormPopup={true}
          usageStatistics={false}
          view={this.state.view}
          week={{
            startDayOfWeek: 1,
            showTimezoneCollapseButton: true,
            timezonesCollapsed: false,
            eventView: true,
            taskView: true,
            dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六",],
          }}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ref={(e) => this.calendar = e}
          onAfterRenderEvent={this.onAfterRenderEvent}
          onBeforeDeleteEvent={this.onBeforeDeleteEvent}
          onClickDayname={this.onClickDayName}
          onClickEvent={this.onClickEvent}
          onClickMoreEventsBtn={this.onClickMoreEventsBtn}
          onClickTimezonesCollapseBtn={this.onClickTimezonesCollapseBtn}
          onBeforeUpdateEvent={this.onBeforeUpdateEvent}
          onBeforeCreateEvent={this.onBeforeCreateEvent}
          onComponentDidMount={() => this.Refresh()}
        />
      </XCard>
    </XGrid>
  }
}
