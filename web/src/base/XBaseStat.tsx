import React from "react";
import XGrid from "../layout/XGrid";
import XBasePage, {XBasePageProps} from "./XBasePage";
import XBaseStyle from "./XBaseStyle";
import XChart from "../display/XChart";
import XTableGrid from "../display/XTableGrid";
import XFlex from "../layout/XFlex";
import XDateTime from "../editor/XDateTime";
import XDate from "../toolkit/XDate";
import XForm from "../editor/XForm";
import XButton from "../editor/XButton";
import {XModal} from "../index";

/**
 * 页面组件属性
 */
export interface XBaseStatProps extends XBasePageProps {
  children?: React.ReactNode,
  /**
   * 是否显示多视图
   */
  showFilterView?: boolean,
  /**
   * 统计请求地址
   */
  dataSourceUrl?: string,
  /**
   * 是否树形显示
   */
  isTree?: boolean,
  /**
   * 通过时间过滤
   */
  useFilterDate?: boolean,
  /**
   * 图显示方式
   */
  chartStyleType?: "line" | "bar" | "pie1" | "pie2" | "pie3",
  /**
   * 图表参数
   */
  chartParams?: ChartParams,
}

class ChartParams {
  /**
   * 显示层级，树根节点为：0
   */
  level?: undefined | number;
  /**
   * 行维度字段(x轴)
   */
  rowDimensionField?: string;
  /**
   * 显示第几个指标(y轴)
   */
  indicatorIndex?: undefined | number;
}

export default class XBaseStat<P = {}, S = {}> extends XBasePage<XBaseStatProps & P, any> {

  static defaultProps = {
    ...XBasePage.defaultProps,
    showFilterView: true,
    views: ["图表", "图", "表格"],
    view: "图表",
    isTree: false,
    useFilterDate: false,
    chartStyleType: "bar",
    chartParams: {level: 0},
  };

  userFilterData?: any;

  constructor(props) {
    super(props)
    let lastToday = new Date();
    lastToday.setMonth(lastToday.getMonth() - 6);
    this.state.xField = undefined;
    this.state.yFields = [];
    this.userFilterData = {
      ...this.dataRightFilter,
      ...this.props.useFilterDate ? {
        开始时间: XDate.DateToString(new Date(lastToday.getTime()), "YYYY-MM-DD 00:00:00"),
        结束时间: XDate.DateToString(new Date(), "YYYY-MM-DD 23:59:59"),
      } : {}
    };
  }

  onDataRightChangeEvent(dataRightFilter, oldDataRightFilter) {
    this.table?.Refresh(dataRightFilter);
  }

  SearchData(data) {
    if (!data.开始时间) {
      data.开始时间 = this.userFilterData.开始时间;
      this.searchForm?.SetValues({开始时间: data.开始时间}, false)
    }
    if (!data.结束时间) {
      data.结束时间 = this.userFilterData.结束时间;
      this.searchForm?.SetValues({结束时间: data.结束时间}, false)
    }
    data.开始时间 = data.开始时间.substring(0, 10) + " 00:00:00";
    data.结束时间 = data.结束时间.substring(0, 10) + " 23:59:59";
    this.table?.Refresh(data);
  }

  table?: any;
  searchForm?: any;
  xchart?: any;

  renderFilter() {
    let useFilterDate = this.props.useFilterDate;
    return <XFlex contentHAlign={XBaseStyle.Align.start}>
      <XForm inited={e => this.searchForm = e} infoData={this.userFilterData}
             onValueChange={v => this.SearchData(this.searchForm.GetValues())}/>
      {useFilterDate && <XDateTime field={"开始时间"} type={"date"} parent={() => this.searchForm}/>}
      {useFilterDate && <XDateTime field={"结束时间"} type={"date"} parent={() => this.searchForm}/>}
    </XFlex>
  }

  /**
   * 创建行或列维度
   * @param Fields
   */
  createDimensionList(Fields: [], DateTypes?: []) {
    let list = [];
    for (let i = 0; i < Fields?.length; i++) {
      if (i < DateTypes?.length) {
        list.push(this.createDimension(Fields[i], Fields[i], DateTypes[i]));
      } else {
        list.push(this.createDimension(Fields[i], Fields[i]));
      }
    }
    return list;
  }

  /**
   * 创建行或列维度
   * @param Field
   * @param DisplayName
   * @param DateType
   * @param Order
   */
  createDimension(Field: string, DisplayName?: string, DateType?: undefined | "" | "Year" | "Quarter" | "Month" | "Day" | "Week", Order?: string) {
    return {
      Field: Field,
      DisplayName: DisplayName ? DisplayName : Field,
      DateType: DateType,
      Order: Order,
    }
  }

  /**
   * 创建统计指标
   * @param Fields
   * @param StatTypes
   */
  createIndicatorList(Fields: [], StatTypes?: []) {
    let list = [];
    for (let i = 0; i < Fields?.length; i++) {
      if (i < StatTypes?.length) {
        list.push(this.createIndicator(Fields[i], Fields[i], StatTypes[i]));
      } else {
        list.push(this.createIndicator(Fields[i], Fields[i]));
      }
    }
    return list;
  }

  /**
   * 创建统计指标
   * @param Field
   * @param DisplayName
   * @param StatType
   * @param Order
   */
  createIndicator(Field: string, DisplayName?: string, StatType?: "Value" | "Count" | "Sum" | "Avg" | "Max" | "Min", Order?: string) {
    return {
      Field: Field,
      DisplayName: DisplayName ? DisplayName : Field,
      StatType: StatType ? StatType : "Count",
      Order: Order,
    }
  }

  showTable(row, col) {
    let RowFilter = row.DimFilterID;
    let ColumnFilter = col.field;
    if (ColumnFilter.startsWith("StatIndicator:")) {
      let index = ColumnFilter.indexOf(",");
      if (index > 0) {
        ColumnFilter = ColumnFilter.substring(index + 1);
      }
    }
    // if (col.field == col.title) {
    if (ColumnFilter.indexOf("=") == -1) {
      ColumnFilter = "";
    }
    let url = this.props.dataSourceUrl.split("/")[0] + "/detailList"
    let filterData = {
      ...this.userFilterData,
      StatResultValue: JSON.stringify({RowFilter, ColumnFilter})
    };
    let Ele = <XTableGrid dataSourceUrl={url} useServerColumn={true} showSearch={false} enableEdit={false}
                          filterData={filterData}/>
    XModal.ModalShow("数据详情-" + col.title, undefined, Ele, '60vw', '60vh');
  }

  onServerColumn(cols) {
    if (this.props.isTree) {
      for (let i = 0; i < cols?.length; i++) {
        if (cols[i].visible) {
          cols[i].align = "left";
          break;
        }
      }
    }
    let handleCol = (cols) => {
      cols?.forEach(col => {
        col.render = (text, row) => <XButton isA={true} text={text} onClick={() => this.showTable(row, col)}/>
        col.children && handleCol(col.children);
      });
    }
    handleCol(cols);
    return cols;
  }

  getLeafColumns(columns) {
    let list = [];
    let _Columns = (columns, parent) => {
      columns?.forEach(col => {
        col.chatName = (parent ? parent.chatName + " && " : "") + (col.title ? col.title : col.field);
        if (col.children && col.children.length > 0) {
          _Columns(col.children, col);
        } else {
          list.push(col);
        }
      });
    }
    _Columns(columns, undefined);
    return list;
  }

  refreshChat(rows, columns) {
    columns = this.getLeafColumns(columns);
    let listRow = this.getStatParam("DimRowJson");//行维度
    if (listRow.length > 0) {
      let indicatorIndex = undefined;
      let rowDimensionField = undefined;
      let chartParams = this.props.chartParams;
      if (chartParams) {
        rowDimensionField = chartParams.rowDimensionField;
        indicatorIndex = chartParams.indicatorIndex;
        if (chartParams.level != undefined) {
          rows = rows.filter(item => item.DimLevelID == chartParams.level);
        }
      }
      let xField = rowDimensionField;
      let yFields = [];
      let yColumns = [];
      columns.forEach(col => {
        if (col.visible) {
          if (!col.lock) {//列维度
            yFields.push(col.chatName);
            yColumns.push(col);
          } else {
            if (!xField) {
              xField = col.field;
            }
          }
        }
      });
      if (indicatorIndex != undefined && indicatorIndex > 0 && indicatorIndex < yFields.length) {
        yFields = [yFields[indicatorIndex]];
        yColumns = [yColumns[indicatorIndex]];
      }
      let _rows = [];
      rows.forEach(row => {
        let _row = {...row};
        for (let i = 0; i < yFields.length; i++) {
          let col = yFields[i];
          _row[col] = _row[yColumns[i].field];
          if (_row[col] == undefined) {
            _row[col] = 0;
          }
        }
        _rows.push(_row);
      })
      this.setState({chatKey: new Date().getTime(), xField, yFields, yColumns, charRows: _rows}, () => {
        this.xchart?.SetData(_rows);
      });
    } else {//文本显示数据

    }
  }

  getStatParam(key: "DimRowJson" | "DimColumnJson" | "IndicatorJson") {
    let list = [];
    if (this.userFilterData && this.userFilterData[key]) {
      try {
        list = JSON.parse(this.userFilterData[key]);
      } catch (e) {
      }
    }
    return list;
  }

  onChartClick(params) {
    let yColumns = this.state.yColumns;
    let charRows = this.state.charRows;
    if (params.dataIndex >= 0 && params.dataIndex < charRows.length &&
      params.seriesIndex >= 0 && params.seriesIndex < yColumns.length) {
      let col = yColumns[params.seriesIndex];
      let row = charRows[params.dataIndex];
      this.showTable(row, col)
    }
  }

  renderView(view) {
    let visibleColumns = [];
    let listRow = this.getStatParam("DimRowJson");
    listRow.length > 0 && visibleColumns.push(listRow[0].Field);
    return <XGrid rowsTemplate={["auto", "1fr"]} rowGap={"10px"}>
      {this.renderFilter()}
      <XGrid columnsTemplate={view === "图表" ? ["1fr", "1fr"] : ["1fr"]} columnGap={"10px"}>
        <XChart key={this.state.chatKey} visible={view === "图表" || view === "图"}
                styleType={this.props.chartStyleType} xField={this.state.xField} yFields={this.state.yFields}
                onClick={(params) => this.onChartClick(params)}
                textColor={"#000"} splitLine={false} parent={() => this} ref={(e) => this.xchart = e}/>
        <XTableGrid visible={view === "图表" || view === "表格"} ref={(e) => this.table = e} enableEdit={false}
                    dataSourceUrl={this.props.dataSourceUrl} parent={() => this} filterData={this.userFilterData}
                    useServerColumn={true} showSearch={false} isPagination={false}
                    isTree={this.props.isTree} IsTreeAllData={this.props.isTree}
                    showButtons={[XTableGrid.TableButtons.refresh]} visibleColumns={visibleColumns}
                    onServerColumn={(cols) => this.onServerColumn(cols)}
                    onServerResult={(result: any) => {
                      if (result.Success) {
                        this.refreshChat(result.Value.rows, result.Value.columns);
                      }
                      return result;
                    }}/>
      </XGrid>
    </XGrid>
  }
}
