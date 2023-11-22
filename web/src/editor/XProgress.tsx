import React from 'react';
import { Progress } from "antd";
import styled from "styled-components";
import XBaseEditor, { XBaseEditorProps } from '../base/XBaseEditor';
import MProgress from "../display/progress/Progress"
import ProgressProps from "../display/progress/PropsType";

export interface XProgressProps extends XBaseEditorProps,ProgressProps {
  /**
   * 进度条颜色
   */
  progressColor?: "green" | "red" | "orange" | "blue",
  /**
   * 进度条步骤
   */
  steps?:number
}

/**
 * 显示一个进度图标，清晰直观
 * @name 进度显示
 * @groupName 图表
 */
export default class XProgress extends XBaseEditor<XProgressProps, any> {
  static ComponentName = "进度显示";
  static Progress: typeof Progress = Progress;
  static StyleType = {web: 'web',common: 'common'};

  static defaultProps = {
    ...XBaseEditor.defaultProps,
    progressColor: "green"
  };

  constructor(props) {
    super(props);

  }

  renderEditor = () => {
    if (this.GetStyleType() === XProgress.StyleType.common) {
      return <MProgress {...this.props}/>
    }
    let percent = 0;
    let value = this.GetValue();
    if (value) {
      percent = parseFloat(value);
    }
    return <Progress steps={this.props.steps} strokeColor={this.props.progressColor} percent={percent}/>
  };

}

const Div = styled.div`
.ant-progress-show-info .ant-progress-outer{
    margin-right: calc(-3.4em - 8px);
    padding-right: calc(3.4em + 8px);
}
.ant-progress-text{
    width: 3.4em;
    font-size: var(--font-size);
}
`;
