import React from 'react';
import XBaseEditor, {XBaseEditorProps} from '../base/XBaseEditor';

export interface XLinkProps extends XBaseEditorProps {
  children?: React.ReactNode,
  /**
   * 背景颜色
   */
  backgroundColor?: string,
  /**
   * 图标
   */
  icon?: any,
  /**
   * 跳转的链接
   */
  href?: string,
  /**
   * 打开链接的方式
   */
  target?: string,
  /**
   * 点击事件
   */
  onClick?: (item?: any) => void,
}

/**
 * 链接文本，同样具有多种样式
 * @name 链接
 * @groupName 导航显示
 */
export default class XLink extends XBaseEditor<XLinkProps, any> {
  static ComponentName = "链接";
  static StyleType = {style1:"style1",style2:"style2",style3:"style3",style4:"style4"};

  static defaultProps = {
    ...XBaseEditor.defaultProps,
  };

  constructor(props) {
    super(props);
  }

  clickEvent = (e) => {
    e.stopPropagation();
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  GetValue() {
    if (this.useStateValue) {
      return this.state.value;
    }
    return this.props.value;
  }

  a: HTMLElement;
  GetText(): any {
    return this.a ? this.a.innerText : "";
  }

  renderEditor() {
    let color = this.props.color ? this.props.color : "#0586FD";
    let style: any = {color, cursor: "pointer",};
    if (this.props.grid[0] > 0) {
      style.height = "100%";
      style.width = "100%";
    }
    let styleType = this.GetStyleType();
    if (styleType == "style1") {
      style = {
        height: 40,
        lineHeight: 40,
        padding: "0px 20px",
        display: "flex",
        textAlign: "center",
        cursor: "pointer",
        justifyContent: "left",
        alignItems: "center",
        backgroundColor: color,
        color: "white",
      };
    } else if (styleType == "style2") {
      style = {
        height: 40,
        lineHeight: 40,
        padding: "0px 20px",
        display: "flex",
        textAlign: "center",
        cursor: "pointer",
        justifyContent: "left",
        alignItems: "center",
        backgroundColor: "white",
        color: color,
      };
    } else if (styleType == "style3") {
      style = {
        display: "inline-grid",
        verticalAlign: "middle",
        color: color,
        cursor: "pointer",
      };
    }
    return <a ref={e => this.a = e} style={style} href={this.props.href} onClick={this.clickEvent}
              target={this.props.target}>
      {this.props.icon}
      {this.props.icon && <span style={{width: "4px"}}/>}
      <span>{this.GetValue()}</span>
      {this.props.children}
    </a>;
  }

}
