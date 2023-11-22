import XChart from "../XChart";

function getPieStyle1(xchart: XChart, data) {
  return {
    title: {
      text: xchart.props.title
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 30,
      data: xchart.state.legendData,
      textStyle: {
        color: xchart.props.textColor,
      }
    },
    series: [{
      type: 'pie',
      color: ['#62c98d', '#205acf', '#c9c862', '#c98b62', '#c962b9', '#7562c9', '#c96262'],
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '40',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: data
    }]
  };
}

function getPieStyle2(xchart: XChart, data) {
  const option = {
    title: {
      text: xchart.props.title
    },
    tooltip: {
      trigger: 'item',
      formatter: "{b} : {c} ({d}%)"
    },
    legend: {
      right: 0,
      top: 30,
      height: 160,
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 10,
      textStyle: {
        color: xchart.props.textColor,
        fontSize: 12
      },
      orient: 'vertical',
      data: xchart.state.legendData
    },
    calculable: true,
    series: [
      {
        name: ' ',
        color: ['#62c98d', '#2f89cf', '#4cb9cf', '#53b666', '#62c98d', '#205acf', '#c9c862', '#c98b62', '#c962b9', '#7562c9', '#c96262', '#c25775', '#00b7be'],
        type: 'pie',
        radius: [30, 70],
        center: ['35%', '50%'],
        roseType: 'radius',
        label: {
          normal: {
            show: true
          },
          emphasis: {
            show: true
          }
        },

        lableLine: {
          normal: {
            show: true
          },
          emphasis: {
            show: true
          }
        },

        data: data,
      },
    ]
  };
  return option;
}

function getPieStyle3(xchart: XChart, data) {
  return {
    title: {
      text: xchart.props.title
    },
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        type: 'pie',
        color: ['#62c98d', '#2f89cf', '#4cb9cf', '#53b666', '#62c98d', '#205acf', '#c9c862', '#c98b62', '#c962b9', '#7562c9', '#c96262', '#c25775', '#00b7be'],
        radius: [40, 110],
        data: data,
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 1
        },
        label: {
          color: xchart.props.textColor,
          alignTo: 'edge',
          formatter: '{name|{b}}\n{value|{c}}',
          minMargin: 5,
          edgeDistance: 10,
          lineHeight: 15,
          rich: {
            time: {
              fontSize: 10,
              color: '#999'
            }
          }
        },
        labelLine: {
          length: 15,
          length2: 0,
          maxSurfaceAngle: 80
        },
        labelLayout: function (params) {
          const isLeft = params.labelRect.x < xchart.ele.getEchartsInstance().getWidth() / 2;
          const points = params.labelLinePoints;
          // Update the end point.
          points[2][0] = isLeft ? params.labelRect.x : params.labelRect.x + params.labelRect.width;
          return {
            labelLinePoints: points
          };
        },
      },
    ]
  }
}

function getLineBarOptin(xchart: XChart, data) {
  const colors = ['#5470C6', '#91CC75', "#73C0DE", "#FAC858", "#EE6666", "#3BA272", "#FC8452", "#9A60B4", "#EA7CCC"];
  const xdata = [];
  for (let i = 0; i < data.length; i += 1) {
    xdata.push(data[i][xchart.state.xField]);
  }
  let ySeries = xchart.props.ySeries;
  let yfields = xchart.state.yFields;
  if (!yfields) {
    yfields = [];
  }
  let series = [];
  let yAxisNames = xchart.props.yAxisNames;
  for (let i = 0; i < yfields.length; i++) {
    let ySerie = ySeries[i];
    let yf = yfields[i];
    let xserie = {
      name: yf,// @ts-ignore
      type: ySerie?.type || xchart.GetStyleType(),
      data: [],
      barWidth: '15', //柱子宽度
      // barGap: 1, //柱子之间间距
      itemStyle: {
        normal: {
          color: colors[i % colors.length],
          opacity: 1,
          barBorderRadius: 5,
        }
      },// @ts-ignore
      ...ySerie,
    }
    for (let j = 0; j < data.length; j += 1) {
      xserie.data.push(data[j][yf]);
    }
    series.push(xserie);
  }
  let yAxis = [];//
  for (let i = 0; i < yAxisNames.length; i++) {
    yAxis.push({
      name: yAxisNames[i],
      type: 'value',
      axisTick: {
        show: false,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: xchart.props.textColor,
          width: 1,
          type: "solid"
        },
      },
      splitLine: {
        show: xchart.props.splitLine,
        lineStyle: {
          color: xchart.props.textColor,
        }
      }
    });
  }
  return {
    title: {
      text: xchart.props.title
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      //orient: 'vertical',
      data: yfields,
      align: 'right',
      right: '5%',
      top: '6%',
      textStyle: {
        color: xchart.props.textColor,
        fontSize: '16',
      },
    },
    grid: {
      left: '0%',
      top: '40px',
      right: '0%',
      bottom: '2%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      data: xdata,
      axisLine: {
        show: true,
        lineStyle: {
          color: xchart.props.textColor,
          width: 1,
          type: "solid"
        },
      },
      splitLine: {show: xchart.props.splitLine},
      axisTick: {
        show: false,
      },
    }],
    yAxis: yAxis,
    series: series,
  }
}

function getPieOptin(xchart: XChart, data) {
  xchart.state.legendData = [];
  data.forEach((item) => {
    item.name = item[xchart.state.xField];
    if (xchart.state.yFields.length > 0) {
      item.value = item[xchart.state.yFields[0]];
    }
    xchart.state.legendData.push(item.name);
  });
  if (xchart.props.styleType === XChart.StyleType.pie1) {
    return getPieStyle1(xchart, data);
  } else if (xchart.props.styleType === XChart.StyleType.pie2) {
    return getPieStyle2(xchart, data);
  } else if (xchart.props.styleType === XChart.StyleType.pie3) {
    return getPieStyle3(xchart, data);
  }
  return getPieStyle1(xchart, data);
}

export default function GetXChartOption(xchart: XChart, data) {
  let styleType = xchart.GetStyleType();
  if (styleType == XChart.StyleType.pie1 || styleType == XChart.StyleType.pie2 || styleType == XChart.StyleType.pie3) {
    return getPieOptin(xchart, data);
  }
  return getLineBarOptin(xchart, data);
}