import React from 'react';
import ReactEcharts from './chart/EChartsReact';
import XBaseDisplay, {XBaseDisplayProps} from "../base/XBaseDisplay";
import GetXChartOption from "./chart/XChartOption";

export interface XChartProps extends XBaseDisplayProps {
  /**
   * 图形显示的标题
   */
  title?: string,
  themeName?: string,
  /**
   * 图形数据源的x轴字段
   */
  xField?: string,
  /**
   * 图形数据源的y轴字段，可以为多个
   */
  yFields?: [any],
  /**
   * y轴的serie
   */
  ySeries?: [any],
  /**
   * y轴名称
   */
  yAxisNames?: [any],
  /**
   * 图形样式
   */
  chartStyle?: object,
  /**
   * 兼容百度echart的图形配置
   */
  chartOption?: object | ((data: any, chart: any) => any),
  /**
   * 文字颜色
   */
  textColor?: string,
  /**
   * 是否显示分隔线
   */
  splitLine?: boolean,
  /**
   * 点击事件
   * @param params
   */
  onClick?: (params) => void,
}

/**
 * 对百度echart的二次封装，功能强大，异步加载
 * 快速显示各种统计数据图形，如柱状图，曲线图和饼图等。
 * @name 图表
 * @groupName 图表
 */
export default class XChart extends XBaseDisplay<XChartProps, any> {
  static ComponentName = "图表";
  static StyleType = {line: 'line', bar: 'bar', pie1: "pie1", pie2: "pie2", pie3: "pie3"};
  static defaultProps = {
    ...XBaseDisplay.defaultProps,
    xField: 'x',
    yFields: ["y"],
    ySeries: [],//{type: "line",} bar,line
    yAxisNames: [""],
    styleType: "line",
    chartOption: null,
    chartStyle: {},
    textColor: "#fff",
    splitLine: true,
  };

  static async GetEcharts(): Promise<any> {
    return await import(/* webpackChunkName: "techarts" */ 'echarts');
  }


  constructor(props) {
    super(props);
    this.SetFields(this.props.xField, this.props.yFields);
    this.state = {...this.state, filterData: {}, option: {},}
  }

  async componentDidMount() {
    const echarts = await XChart.GetEcharts();
    this.setState({echarts});
    if (echarts) {
      if (this.state.data) {
        this.SetData(this.state.data);
      } else if (this.props.dataSourceUrl) {
        this.Refresh();
      }
    }
  }

  /**
   * 关闭点击事件
   */
  OffClick() {
    this.ele?.off("click");
  }

  /**
   * 设置echart标准的option
   * @param op:option
   */
  public SetOption(op: object) {
    this.state.option = op;
    this.setState({
      option: this.state.option,
    });
  }


  /**
   * 设置x轴的y轴
   * @param xField
   * @param yFields
   */
  SetFields(xField: any, yFields: any[]) {
    this.state.xField = xField;
    this.state.yFields = yFields;
  }

  SetData(data) {
    this.useStateData = true;
    if (this.props.chartOption) {
      if (this.props.chartOption instanceof Function) {
        let funcChartOption: any = this.props.chartOption;
        this.SetOption(funcChartOption(data, this));
      } else if (this.props.chartOption instanceof Object) {
        this.SetOption(this.props.chartOption);
      }
    } else {
      this.SetOption(this.getOption(data));
    }
  }

  onClickEvents(param) {
    this.props.onClick?.(param);
  }

  getOption(data) {
    return GetXChartOption(this, data);
  }

  ele: ReactEcharts;

  renderDisplay() {
    if (!this.state.echarts) {
      return <div/>
    }
    const style: any = {
      ...this.props.chartStyle,
      ...this.props.style,
    }
    style.height = "inherit";
    const onEvents = {
      // 'mouseover': this.onChartover.bind(this),
      // 'mouseout': this.onChartout.bind(this)
      'click': (param) => this.onClickEvents(param),
    }
    return (
      <ReactEcharts
        ref={(e) => this.ele = e} echarts={this.state.echarts}
        theme={this.props.themeName}
        option={this.state.option}
        onEvents={onEvents}
        style={style}
        className="react_for_echarts"
      />
    );
  }
}
