import React from "react";
import XGrid from "../layout/XGrid";
import XBasePage, {XBasePageProps} from "./XBasePage";
import XBaseStyle from "./XBaseStyle";
import XChart from "../display/XChart";
import XTableGrid from "../display/XTableGrid";
import XFlex from "../layout/XFlex";
import XSelectList from "../editor/XSelectList";
import XDateTime from "../editor/XDateTime";
import XDate from "../toolkit/XDate";
import XForm from "../editor/XForm";

/**
 * 页面组件属性
 */
export interface XBaseStatProps extends XBasePageProps {
  children?: React.ReactNode,
  /**
   * 是否显示多视图
   */
  showFilterView?: boolean,
  dataSourceUrl?: string,
  isTree?: boolean,
}

export default class XBaseStat<P = {}, S = {}> extends XBasePage<XBaseStatProps & P, any> {

  static defaultProps = {
    ...XBasePage.defaultProps,
    showFilterView: true,
    views: ["图表", "数据"],
    view: "数据",
    isTree: false,
  };

  userFilterData?: any;

  constructor(props) {
    super(props)
    let lastToday = new Date();
    lastToday.setMonth(lastToday.getMonth() - 6);
    this.userFilterData = {
      ...this.dataRightFilter,
      统计方式: "月",
      统计维度: "个人",
      开始时间: XDate.DateToString(new Date(lastToday.getTime()), "YYYY-MM-DD 00:00:00"),
      结束时间: XDate.DateToString(new Date(), "YYYY-MM-DD 23:59:59"),
    };
  }

  onDataRightChangeEvent(dataRightFilter, oldDataRightFilter) {
    this.table?.Refresh(dataRightFilter);
  }

  SearchData(data) {
    if (!data.开始时间) {
      data.开始时间 = this.userFilterData.开始时间;
      this.searchForm.SetValues({开始时间: data.开始时间}, false)
    }
    if (!data.结束时间) {
      data.结束时间 = this.userFilterData.结束时间;
      this.searchForm.SetValues({结束时间: data.结束时间}, false)
    }
    data.开始时间 = data.开始时间.substring(0, 10) + " 00:00:00";
    data.结束时间 = data.结束时间.substring(0, 10) + " 23:59:59";
    this.table?.Refresh(data);
  }

  table?: any;
  searchForm?: any;
  xchart?: any;

  renderFilter() {
    return <XFlex contentHAlign={XBaseStyle.Align.start}>
      <XForm inited={e => this.searchForm = e} infoData={this.userFilterData}
             onValueChange={v => this.SearchData(this.searchForm.GetValues())}/>
      <XSelectList field={"统计方式"} boxStyle={{marginLeft: 5}} items={["月", "周", "日",]}
                   parent={() => this.searchForm}/>
      <XSelectList field={"统计维度"} boxStyle={{marginLeft: 5}} items={["个人", "团队"]} visible={false}
                   parent={() => this.searchForm}/>
      <XDateTime field={"开始时间"} type={"date"} parent={() => this.searchForm}/>
      <XDateTime field={"结束时间"} type={"date"} parent={() => this.searchForm}/>
    </XFlex>
  }

  createDimension(Field: string, DisplayName?: string, DateType?: undefined | "" | "Year" | "Quarter" | "Month" | "Day" | "Week", Order?: string) {
    return {
      Field: Field,
      DisplayName: DisplayName,
      DateType: DateType,
      Order: Order,
    }
  }

  createIndicator(Field: string, DisplayName?: string, StatType?: "Value" | "Count" | "Sum" | "Avg" | "Max" | "Min", Order?: string) {
    return {
      Field: Field,
      DisplayName: DisplayName,
      StatType: StatType,
      Order: Order,
    }
  }

  renderView(view) {
    return <XGrid rowsTemplate={["auto", "1fr"]} rowGap={"10px"}>
      {this.renderFilter()}
      <XGrid columnsTemplate={view === "数据" ? ["1fr", "1fr"] : ["1fr"]} columnGap={"10px"}>
        <XChart styleType={"bar"} xField={"名称"} yFields={["次数"]} textColor={"#000"} splitLine={false}
                parent={() => this} ref={(e) => this.xchart = e}/>
        <XTableGrid visible={view === "数据"} ref={(e) => this.table = e} enableEdit={false}
                    dataSourceUrl={this.props.dataSourceUrl} parent={() => this} filterData={this.userFilterData}
                    useServerColumn={true} showSearch={false} isPagination={false}// isTree={true}
                    showButtons={[XTableGrid.TableButtons.refresh]}
                    onServerResult={(result: any) => {
                      if (result.Success) {
                        this.xchart?.SetData(result.Value.rows.filter(item => item.DimLevelID == 0));
                      }
                      return result;
                    }}/>
      </XGrid>
    </XGrid>
  }
}
