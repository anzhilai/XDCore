import React, {CSSProperties} from 'react';
import styled from "styled-components";
import XBaseStyle, {XBaseStyleProps} from './XBaseStyle';
import XCell, {XCellProps} from "../layout/XCell";


/**
 * 编辑组件属性
 */
export interface XBaseEditorProps extends XBaseStyleProps {
  /**
   * 显示名称
   */
  showLabel?: boolean,
  /**
   * cell样式类型
   */
  cellStyleType?: string,
  /**
   * 名称
   */
  label?: any,
  /**
   * 名称宽度
   */
  labelWidth?: string,
  /**
   * 名称位置
   */
  labelMode?: "left" | "top",
  /**
   * 组件最右边扩展节点
   */
  extraButtons?: React.ReactNode,
  /**
   * 帮助信息
   */
  help?: string,
  /**
   * 编辑组件样式
   */
  editorStyle?: CSSProperties,
  /**
   * 名称样式
   */
  labelStyle?: CSSProperties,
  /**
   * 字段名称
   */
  field?: string,
  /**
   * 值
   */
  value?: any,
  /**
   * 默认值
   */
  defaultValue?: any,
  /**
   * 默认的值对象
   */
  record?: object,
  /**
   * 是否必须
   */
  isRequired?: boolean,
  /**
   * 验证正则表达式
   */
  validateRegExp?: RegExp | string,
  /**
   * 验证提醒
   */
  validateText?: string,
  /**
   * 只读时，可点击编辑
   */
  clickEdit?: boolean,
  /**
   * 只读
   */
  readOnly?: boolean,
  /**
   * 使能状态
   */
  disabled?: boolean,
  /**
   * 显示 cell
   */
  showCell?: boolean,
  /**
   * 只读显示函数
   * @param value 值
   * @param record 对象
   * @param sender 当前组件
   */
  onReadOnlyDisplay?: (value?: any, record?: object, sender?: any) => React.ReactNode,
  /**
   * 值改变回调
   * @param value 值
   * @param record 对象
   * @param sender 当前组件
   */
  onValueChange?: (value?: any, record?: object, sender?: any) => void,
}

/**
 * 基础编辑组件
 * 所有编辑类组件的基类，继承于基础样式组件，为编辑类组件提供了统一的属性和方法
 * 对编辑组件的显示方式进行定义，如标题、后缀等显示方式，同时将数据模型统一为值和键值数据类型
 * 一个编辑组件对应于数据库中一条记录的一个字段，用value代表一个组件的值
 * @name 基础编辑组件
 * @groupName 分类
 */
export default class XBaseEditor<P = {}, S = {}> extends XBaseStyle<XBaseEditorProps & P, any> {

  static defaultProps = {
    ...XBaseStyle.defaultProps,
    hasCell: true,
    label: undefined,
    labelWidth: "auto",
    labelMode: "left",
    showCell: undefined,
    showLabel: undefined,
    extraButtons: undefined,
    field: undefined,
    value: undefined,
    defaultValue: undefined,
    record: undefined,
    isRequired: false,
    validateText: '字段不能为空!',
    validateRegExp: '',
    readOnly: false,
    disabled: false,
    clickEdit: false,
    onPressEnter: undefined,
    onValueChange: undefined,
    width: 'auto',
    height: 'auto',
  };

  constructor(props) {
    super(props);
    this.state.showLabel = this.props.showLabel;
    let label = props.label;
    if(label&&this.props.showLabel===undefined){
      this.state.showLabel = true;
    }
    if (!props.label && props.field) {
      label = props.field;
      if(this.props.showLabel === undefined){
        this.state.showLabel = true;
      }
    }

    this.state = {
      ...this.state,
      readOnly: props.readOnly,
      label: label,
      value:props.value,
      record: props.record,
      showValidateText: false,
    }
    if(this.state.value===undefined&&this.props.defaultValue){
      this.useStateValue =true;
      this.state.value=this.props.defaultValue;
    }
  }


  onBodyClickSelf: boolean;
  onBodyClick: any;

  componentDidMount() {
    super.componentDidMount();
    if (this.props.clickEdit) {
      this.onBodyClick = (e) => {
        if (this.props.clickEdit && !this.onBodyClickSelf) {
          if (this.validateReadOnlyEditClickTarget(e.target)) {
            this.SetReadOnly(true);
          }
        }
        this.onBodyClickSelf = false;
      }
      document.body.addEventListener("click", this.onBodyClick);
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.onBodyClick) {
      window.removeEventListener('click', this.onBodyClick)
    }
  }


  validateReadOnlyEditClickTarget(target) {
    return true;
  }


  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (this.useStateValue && nextProps.value) {
      if (this.state.value !== nextProps.value) {
        this.state.value = nextProps.value;
      }
    }
    if (this.useStateLabel && nextProps.label) {
      if (this.state.label !== nextProps.label) {
        this.state.label = nextProps.label;
      }
    }
    return super.shouldComponentUpdate(nextProps, nextState, nextContext);
  }

  /**
   * 刷新当前组件
   * @param filter 过滤参数, 当isnew为false时，刷新参数和历史参数合并
   * @param isnew 是否为新的参数
   * @constructor
   */
  async Refresh(filter?: object, isnew?: boolean) {
    let value = await this.RefreshServer(filter, isnew);
    if (value != undefined) {
      this.SetValue(value);
    }
  }

  /**
   * 获取组件名称
   */
  GetField() {
    return this.props.field;
  }

  /**
   * 组件获取光标
   */
  Focus() {
  }

  useStateValue = false;
  useStateLabel = false;

  /**
   * 获取值
   */
  GetValue() {
    if (this.useStateValue) {
      return this.state.value;
    }
    return this.props.value;
  }

  /**
   * 获取显示文本
   */
  GetText() {
    return this.GetValue();
  }

  /**
   * 设置显示文本
   * @param label
   */
  SetLabel(label: string | React.ReactNode) {
    this.useStateLabel = true;
    this.setState({label});
  }

  /**
   * 获取值
   */
  GetLabel() {
    if (this.useStateLabel) {
      return this.state.label;
    }
    let label = this.props.label;
    if (!label) {
      label = this.props.field;
    }
    return label;
  }

  /**
   * 设置值
   * @param value 字符串
   * @param triggerValueChange 是否触发onValueChange
   */
  SetValue(value, triggerValueChange = true) {
    this.useStateValue = true;
    this.state.value = value;
    this.setState({
      value: this.state.value,
    });
    if (triggerValueChange) {
      this.onValueChangeEvent();
    }
  }

  /**
   * 清除数据
   */
  ClearValue() {
    this.SetValue(undefined);
    // @ts-ignore
    this.state.showValidateText = false;
  }


  private handle1?: any;
  private handle2?: any;

  getValueChangeSleep() {
    return 1;
  }

  onValueChangeEvent() {
    let onValueChangeSleep = this.getValueChangeSleep();
    if (onValueChangeSleep <= 0) {
      // @ts-ignore
      onValueChangeSleep = 1;
    }
    if (this.props.onValueChange) {
      clearTimeout(this.handle1);
      this.handle1 = setTimeout(() => {
        this.props.onValueChange(this.state.value, this.state.record, this);
      }, onValueChangeSleep);
    }
    const p = this.GetParent();
    if (p && p.props && p.props.onValueChange) {
      // 取消之前的延时调用
      clearTimeout(this.handle2);
      this.handle2 = setTimeout(() => {
        p.props.onValueChange(this.state.value, this.state.record, this);
      }, onValueChangeSleep);
    }
  }

  useStateReadOnly = false;

  GetReadOnly() {
    if (this.useStateReadOnly) {
      return this.state.readOnly;
    }
    return this.props.readOnly;
  }

  /**
   * 设置是否只读
   * @param readOnly 是否只读
   * @constructor
   */
  SetReadOnly(readOnly) {
    this.useStateReadOnly = true;
    // @ts-ignore
    this.state.readOnly = readOnly;
    this.setState({
      readOnly: readOnly,
    });
  }

  useStateDisabled: boolean;
  /**
   * 获取禁用状态
   */
  GetDisabled() {
    if (this.useStateDisabled) {
      return this.state.disabled;
    }
    return this.props.disabled;
  }

  /**
   * 设置禁用状态
   * @param disabled
   */
  SetDisabled(disabled: boolean) {
    this.useStateDisabled = true;
    this.state.disabled = disabled;
    this.setState({disabled: this.state.disabled});
  }

  /**
   * 验证组件
   */
  ValidateValue() {
    let t: any = '';
    let v = this.GetValue();
    if (v instanceof Array) {
      v = v.join();
    }
    if (this.props.isRequired) {
      if (v === '' || v === undefined || v === null) {
        t = this.props.validateText;
      }
    }
    if (this.props.validateRegExp) {
      let regex: RegExp = new RegExp(this.props.validateRegExp);
      if (!regex.test(v)) {
        t = this.props.validateText;
      }
    }
    this.setState({
      showValidateText: t ? true : false,
    })
    return t;
  }


  getCellStyleType() {
    let parent = this.GetParent();
    if (!this.props.cellStyleType && parent?.getCellStyleType && parent?.getCellStyleType instanceof Function) {
      return parent.getCellStyleType();
    }
    return this.props.cellStyleType;
  }

  GetStyleType() {
    if (this.useStateStyleType) {
      return this.state.styleType;
    }
    let styleType = this.props.styleType;
    if (!styleType && this.getCellStyleType() === "mobile") {// @ts-ignore
      styleType = "common";
    }
    return styleType;
  }

  getLabelWidth() {
    let parent = this.GetParent();
    if (this.props.labelWidth === "auto" && parent?.getLabelWidth) {
      return parent.getLabelWidth();
    }
    return this.props.labelWidth;
  }

  getLabelStyle() {
    let parent = this.GetParent();
    if (!this.props.labelStyle && parent?.getLabelStyle) {
      return parent.getLabelStyle();
    }
    return this.props.labelStyle;
  }

  getEditorStyle() {
    let parent = this.GetParent();
    if (!this.props.editorStyle && parent?.getEditorStyle) {
      return parent.getEditorStyle();
    }
    return this.props.editorStyle;
  }

  editorWrap = (node) => {
    let showCell = this.state.showLabel ? true : false;
    if (this.props.showCell != undefined) {
      showCell = this.props.showCell;
    }
    if (showCell) {
      return this.styleWrap(<XCell labelMode={this.props.labelMode}
                                   extraButtons={this.props.extraButtons}
                                   description={this.props.extraButtons}
                                   help={this.props.help}
                                   isRequired={this.props.isRequired}
                                   validateText={this.props.validateText}
                                   label={this.state.showLabel ? this.GetLabel() : undefined}
                                   showValidateText={this.state.showValidateText}
                                   editorStyle={this.getEditorStyle()}
                                   labelStyle={this.getLabelStyle()}
                                   labelWidth={this.getLabelWidth()}
                                   styleType={this.getCellStyleType()}>{node}</XCell>)
    }
    return this.styleWrap(node);
  };


  getReadOnlyNode() {
    let n = this.GetText();
    return n;
  }

  renderReadOnly() {
    let n = undefined;
    if (this.props.onReadOnlyDisplay) {
      n = this.props.onReadOnlyDisplay(this.GetValue(), this.state.record, this);
    } else {
      n = this.getReadOnlyNode();
    }
    if (this.props.clickEdit) {
      return <ReadOnlyEditStyle onClick={(e) => {
        this.onBodyClickSelf = true;
        this.SetReadOnly(false);
      }}>{n}</ReadOnlyEditStyle>;
    } else {
      return <div style={{whiteSpace: "pre-line", width: "100%"}}>{n}</div>;
    }
  }

  renderEditor() {
    return (<></>);
  }

  render() {
    if (this.GetReadOnly()) {
      return this.editorWrap(this.renderReadOnly());
    } else {
      return this.editorWrap(this.renderEditor());
    }
  }
}
// @ts-ignore
export const ReadOnlyEditStyle = styled.div`
  min-height: 28px;
  cursor: pointer;
  padding: 2px 15px;
  border: 1px solid transparent;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
  :hover {
    border: 1px solid #40a9ff;
  }
`;
