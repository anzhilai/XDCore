import React from 'react';
import XBaseLayout, { XBaseLayoutProps } from "../base/XBaseLayout";
import { XCardStyle1 } from "./card/XCardStyle1";
import { XCardStyle2 } from "./card/XCardStyle2";
import { XCardStyle3 } from "./card/XCardStyle3";
import { XCardStyle4 } from "./card/XCardStyle4";
import { XCardStyle5 } from "./card/XCardStyle5";
import {XCardStyle6} from "./card/XCardStyle6";
import XGrid from "./XGrid";
import Panel from "./card/Panel";
import {Card, Result} from "antd";

export interface XCardProps extends XBaseLayoutProps {
  /**
   * 卡片组件的标题
   */
  title?: string | React.ReactNode;
}

/**
 * 最常用布局，一个div块加标题，有多种酷炫的样式
 * @name 卡片
 * @groupName 网格
 */
export default class XCard extends XBaseLayout<XCardProps, any> {
  static ComponentName = "卡片";
  static Result: typeof Result = Result;
  static StyleType = {web: 'web',common: 'common', style1: 'style1', style2: 'style2', style3: 'style3', style4: 'style4', style5: 'style5', style6: 'style6'};

  static defaultProps = {
    ...XBaseLayout.defaultProps,
    title: "",
    more: "",
    hasBox: true,
  };

  constructor(props: XCardProps) {
    super(props);
  }

  styleWrap = (node?: React.ReactNode) => {
    if (this.props.hasBox) {
      const s = this.getBoxStyle()
      return <div id={this.props.id} style={s} className={this.props.boxClassName}>{node}</div>;
    } else {
      return node;
    }
  };

  renderLayout() {
    if (this.props.styleType === XCard.StyleType.web) {
      return <Card {...this.props}/>
    } else if (this.props.styleType === XCard.StyleType.common) {
      return <Panel {...this.props}/>
    } else if (this.props.styleType === XCard.StyleType.style1) {
      return <XCardStyle1 {...this.props}/>
    } else if (this.props.styleType === XCard.StyleType.style2) {
      return <XCardStyle2 {...this.props}/>
    } else if (this.props.styleType === XCard.StyleType.style3) {
      return <XCardStyle3 {...this.props}/>
    } else if (this.props.styleType === XCard.StyleType.style4) {
      return <XCardStyle4 {...this.props}/>
    } else if (this.props.styleType === XCard.StyleType.style5) {
      return <XCardStyle5 {...this.props}/>
    } else if (this.props.styleType === XCard.StyleType.style6) {
      return <XCardStyle6 {...this.props}/>
    }
    if (this.props.title) {
      return <XGrid rowsTemplate={["auto", "1fr"]}>
        <div style={{fontWeight: "bold"}}>{this.props.title}</div>
        <>{this.props.children}</>
      </XGrid>;
    }
    return <>{this.props.children}</>;
  }
}
