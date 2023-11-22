import React from 'react';
import './final/toastui-calendar.css';
import XTools from "../../toolkit/XTools";


const optionsProps= [
  'useFormPopup',
  'useDetailPopup',
  'isReadOnly',
  'week',
  'month',
  'gridSelection',
  'usageStatistics',
  'eventFilter',
  'timezone',
  'template',
];

const reactCalendarEventNames= [
  'onSelectDateTime',
  'onBeforeCreateEvent',
  'onBeforeUpdateEvent',
  'onBeforeDeleteEvent',
  'onAfterRenderEvent',
  'onClickDayName',
  'onClickEvent',
  'onClickMoreEventsBtn',
  'onClickTimezonesCollapseBtn',
];

export default class TUICalendar extends React.Component<any> {
  containerElementRef = React.createRef<HTMLDivElement>();

  // calendarInstance: ToastUICalendar | null = null;
  calendarInstance: any | null = null;

  static defaultProps = {
    height: '800px',
    view: 'week',
  };
  XCalendar:any;
  async componentDidMount() {
    const {height, events = [], view, onComponentDidMount, ...options} = this.props;
    const container = this.containerElementRef.current;
    const XCalendar = await import(/* webpackChunkName: "tcalendar" */ './final/toastui-calendar');
    if (container) {
      // @ts-ignore
      this.calendarInstance = new XCalendar.Calendar(container, { ...options, defaultView: view });

      container.style.height = height;
    }
    this.XCalendar = XCalendar;
    this.setEvents(events);
    this.bindEventHandlers(options);
    onComponentDidMount?.();
  }

  GetTZDate(date){
    const XCalendar = this.XCalendar;
    return new XCalendar.TZDate().setTime(date.getTime());
  }

  shouldComponentUpdate(nextProps) {
    const { calendars, height, events, theme, view } = this.props;
    const {
      calendars: nextCalendars,
      height: nextHeight,
      events: nextEvents,
      theme: nextTheme = {},
      view: nextView = 'week',
    } = nextProps;

    if (!XTools.isEqual(height, nextHeight) && this.containerElementRef.current) {
      this.containerElementRef.current.style.height = nextHeight;
    }

    if (!XTools.isEqual(calendars, nextCalendars)) {
      this.setCalendars(nextCalendars);
    }

    if (!XTools.isEqual(events, nextEvents)) {
      this.calendarInstance?.clear();
      this.setEvents(nextEvents);
    }

    if (!XTools.isEqual(theme, nextTheme)) {
      this.calendarInstance?.setTheme(nextTheme);
    }

    if (!XTools.isEqual(view, nextView)) {
      this.calendarInstance?.changeView(nextView);
    }

    const nextOptions = optionsProps.reduce((acc, key) => {
      if (!XTools.isEqual(this.props[key], nextProps[key])) {
        acc[key] = nextProps[key];
      }

      return acc;
    }, {} );

    this.calendarInstance?.setOptions(nextOptions);

    this.bindEventHandlers(nextProps);

    return false;
  }

  componentWillUnmount() {
    this.calendarInstance?.destroy();
  }

  setCalendars(calendars?:any) {
    if (calendars) {
      this.calendarInstance?.setCalendars(calendars);
    }
  }

  setEvents(events) {
    if (events) {
      this.calendarInstance?.createEvents(events);
    }
  }

  bindEventHandlers(externalEvents) {
    const eventNames = Object.keys(externalEvents).filter((key) =>
      reactCalendarEventNames.includes(key )
    );

    eventNames.forEach((key) => {
      const eventName = key[2].toLowerCase() + key.slice(3);

      if (this.calendarInstance) {
        this.calendarInstance.off(eventName);
        this.calendarInstance.on(eventName, externalEvents[key]);
      }
    });
  }

  getInstance() {
    return this.calendarInstance;
  }

  getRootElement() {
    return this.containerElementRef.current;
  }

  render() {
    return <div className="container" ref={this.containerElementRef} />;
  }
}
