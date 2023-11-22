import React from 'react';
import XBaseDisplay, {XBaseDisplayProps} from "../base/XBaseDisplay";

import { Collapse } from 'antd';
import MCollapse, {CollapseProps} from "./collapse/Collapse";
import CollapseItem from "./collapse/CollapseItem";
const { Panel } = Collapse;
export interface XCollapseProps extends CollapseProps {

}

/**
 * 类似手风琴折叠显示
 * @name 折叠
 * @groupName 折叠显示
 */
export default class XCollapse extends XBaseDisplay<XCollapseProps,any> {
  static ComponentName = "折叠";
  static StyleType = {web: 'web',common: 'common'};

  static defaultProps = {
    ...XBaseDisplay.defaultProps,
  };
  static Item: typeof CollapseItem=CollapseItem;
  constructor(props:XCollapseProps) {
    super(props);
  }
  callback=(key)=>{
    console.log(key);
  }

  render() {
    if(this.props.styleType===XCollapse.StyleType.common){
      return <MCollapse {...this.props}>{this.props.children}</MCollapse>
    }
    return (  <Collapse defaultActiveKey={['1']} onChange={this.callback}>
      <Panel header="This is panel header 1" key="1">
        <p>{"text"}</p>
      </Panel>
      <Panel header="This is panel header 2" key="2">
        <p>{"text"}</p>
      </Panel>
      <Panel header="This is panel header 3" key="3">
        <p>{"text"}</p>
      </Panel>
    </Collapse>);
  }

}
