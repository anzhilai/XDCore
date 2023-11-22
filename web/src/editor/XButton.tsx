import React from 'react';
import { Button, Dropdown, Menu, Tooltip } from 'antd';
import XBaseEditor, { XBaseEditorProps } from '../base/XBaseEditor';
import MButton, {ButtonProps} from "./button/Button";
import XIcon from '../display/XIcon';

export interface XButtonProps extends XBaseEditorProps {

  children?: React.ReactNode,
  /**
   * 背景颜色
   */
  backgroundColor?: string,
  /**
   * 按钮文本
   */
  text?: string,
  /**
   * 提示文字
   */
  tooltip?: React.ReactNode,
  /**
   * 按钮图标
   */
  icon?: any,
  /**
   * 是否为a标签
   */
  isA?: boolean,
  /**
   * 是否显示文本
   */
  showText?: boolean,
  /**
   * 禁用
   */
  disabled?: boolean,
  /**
   * 是否为块
   */
  block?: boolean;
  /**
   * 按钮组列表
   */
  dropdownItems?:[],
  /**
   * 点击事件
   * @param item 按钮文字
   * @param sender 当前button
   */
  onClick?: (item: any, sender: XButton) => void,
  /**
   *  显示样式
   *  web : 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text
   *  mobile : 'default' | 'primary'  | 'info' | 'success'  | 'warning' | 'danger' | 'dashed'
   */
  type?: string | 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'info' | 'success' | 'warning' | 'danger' | 'dashed',
  /**
   * 大小
   */
  size?: 'lg' | 'md' | 'sm' | 'xs'|'large' | 'normal' | 'small',
}

/**
 * 按钮组件，具有多种样式
 * @name 按钮
 * @groupName 导航显示
 */
export default class XButton extends XBaseEditor<XButtonProps,any> {
  static ComponentName = "按钮";
  static Button: typeof Button = Button;
  static StyleType = {web: 'web',common: 'common',style1:"style1",style2:"style2",style3:"style3",style4:"style4"};

  static defaultProps = {
    ...XBaseEditor.defaultProps,
    text: '',
    icon: undefined,
    isA: false,
    showText: true,
    onClick: undefined,
    disabled: false,
    dropdownItems: [],
    type: "primary",
  };

  useStateType: boolean

  constructor(props) {
    super(props);
    let isDropdown = false;
    if(this.props.dropdownItems.length>0){
      isDropdown=true;
    }
    this.state = {
      ...this.state,
      text:this.props.text,
      isDropdown:isDropdown,
      showLabel:false,
    }
  }

  clickEvent = (e) => {
    e.stopPropagation();
    if (this.props.onClick) {
      this.props.onClick(this.GetText(),this);
    }
  }

  onDropdownClick = ({key}) => {
    if (this.props.onClick) {
      this.props.onClick(key,this);
    }
  };

  useStateText:boolean;
  GetText(){
    if(this.useStateText){
      return this.state.text;
    }
    return this.props.text;
  }
  SetText(t){
    this.useStateText=true;
    this.state.text=t;
    this.setState({text:this.state.text});
  }

  useStateDisabled:boolean;
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



  getMenu(){
    return <Menu onClick={this.onDropdownClick}>
      {
        this.props.dropdownItems.map(((item, index) => {
          if (item) {
            return <Menu.Item key={item}>{item}</Menu.Item>
          }
        }))
      }
    </Menu>;
  }


  renderEditor() {
    let style: any = {backgroundColor: this.props.backgroundColor};
    if (this.props.grid[0] > 0) {
      style.height = "100%";
      style.width = "100%";
    }
    if (!this.props.showText) {
      style.padding = "4px 8px";
    }
    let button = undefined;
    if (this.props.isA) {
      let color = this.props.color ? this.props.color : "#0586FD";
      return <a style={{cursor: "pointer", color, ...style}} onClick={this.clickEvent}>{this.GetText()}</a>;
    }
    if (this.GetStyleType() === XButton.StyleType.common) {// @ts-ignore
      button = <MButton style={style} type={this.props.type} block={this.props.block} icon={this.props.icon}
                        size={this.props.size} shape={"round"} onClick={this.clickEvent} disabled={this.GetDisabled()}>
        {this.props.showText ? this.GetText() : undefined}
        {this.props.children}
      </MButton>
    } else {
      if (this.state.isDropdown) {
        button = (<Dropdown.Button disabled={this.GetDisabled()}
                                   style={style}
                                   onClick={this.clickEvent}
                                   overlay={this.getMenu()}// @ts-ignore
                                   type={this.props.type}
                                   icon={XIcon.DownOutlined()}>
          {this.props.showText ? this.GetText() : undefined}
          {this.props.children}
        </Dropdown.Button>);

      } else {// @ts-ignore
        button = <Button style={style} size={this.props.size} type={this.props.type} icon={this.props.icon}
                         block={this.props.block} onClick={this.clickEvent} disabled={this.GetDisabled()}>
          {this.props.showText ? this.GetText() : undefined}
          {this.props.children}
        </Button>;
      }
    }

    if (!this.props.showText && this.GetText()) {
      button = <Tooltip title={this.GetText()}>{button}</Tooltip>;
    }
    return button;
  }
}
