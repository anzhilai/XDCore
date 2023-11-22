import React from "react";
import Icon from './icon/icon';
import {Spin} from "antd";
import type {IconProps} from './icon/icon';
import createFromIconfont from "./icon/IconFont";

export interface XIconProps extends IconProps {
  /**
   * 图标名称
   */
  name?: string,
}

/**
 * 很多svg的小图标
 * @name 图标
 * @groupName 图像
 */
export default class XIcon extends React.Component<XIconProps, any> {
  static ComponentName = "图标";
  static Spin: typeof Spin = Spin;

  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentDidMount() {
    const SvgMap = await import(/* webpackChunkName: "tsvg" */ './icon/svg');

    this.setState({
      SvgMap: SvgMap.default,
    })
  }

  render() {
    if (this.state.SvgMap) {
      return React.createElement(Icon, {
        ...this.props,
        component: this.state.SvgMap[this.props.name],
      });
    }
    return <></>
  }

  static createFromIconfont = createFromIconfont;
  static ArrowDown = (props?: IconProps) => <XIcon name={"ArrowDown"} {...props}/>;
  static ArrowLeft = (props?: IconProps) => <XIcon name={"ArrowLeft"} {...props}/>;
  static ArrowRight = (props?: IconProps) => <XIcon name={"ArrowRight"} {...props}/>;
  static ArrowUp = (props?: IconProps) => <XIcon name={"ArrowUp"} {...props}/>;
  static Close = (props?: IconProps) => <XIcon name={"Close"} {...props}/>;
  static CloseCircle = (props?: IconProps) => <XIcon name={"CloseCircle"} {...props}/>;
  static CloseCircleFill = (props?: IconProps) => <XIcon name={"CloseCircleFill"} {...props}/>;
  static DeleteKey = (props?: IconProps) => <XIcon name={"DeleteKey"} {...props}/>;
  static Empty = (props?: IconProps) => <XIcon name={"Empty"} {...props}/>;
  static Keyboard = (props?: IconProps) => <XIcon name={"Keyboard"} {...props}/>;
  static Minus = (props?: IconProps) => <XIcon name={"Minus"} {...props}/>;
  static Plus = (props?: IconProps) => <XIcon name={"Plus"} {...props}/>;
  static PlusCircle = (props?: IconProps) => <XIcon name={"PlusCircle"} {...props}/>;
  static Search = (props?: IconProps) => <XIcon name={"Search"} {...props}/>;
  static Success = (props?: IconProps) => <XIcon name={"Success"} {...props}/>;
  static SuccessCircle = (props?: IconProps) => <XIcon name={"SuccessCircle"} {...props}/>;
  static Volume = (props?: IconProps) => <XIcon name={"Volume"} {...props}/>;
  static Warning = (props?: IconProps) => <XIcon name={"Warning"} {...props}/>;
  static WarningCircle = (props?: IconProps) => <XIcon name={"WarningCircle"} {...props}/>;
  static Computer = (props?: IconProps) => <XIcon name={"Computer"} {...props}/>;
  static Folder = (props?: IconProps) => <XIcon name={"Folder"} {...props}/>;
  static Paperclip = (props?: IconProps) => <XIcon name={"Paperclip"} {...props}/>;
  static CloseOutlined = (props?: IconProps) => <XIcon name={"CloseOutlined"} {...props}/>;
  static Add = (props?: IconProps) => <XIcon name={"Add"} {...props}/>;
  static Upload = (props?: IconProps) => <XIcon name={"Upload"} {...props}/>;
  static ExclamationCircleOutlined = (props?: IconProps) => <XIcon name={"ExclamationCircleOutlined"} {...props}/>;
  static QuestionCircleOutlined = (props?: IconProps) => <XIcon name={"QuestionCircleOutlined"} {...props}/>;
  static Contacts = (props?: IconProps) => <XIcon name={"Contacts"} {...props}/>;
  static CloseCircleOutlined = (props?: IconProps) => <XIcon name={"CloseCircleOutlined"} {...props}/>;
  static ArrowLeftOutlined = (props?: IconProps) => <XIcon name={"ArrowLeftOutlined"} {...props}/>;
  static ArrowRightOutlined = (props?: IconProps) => <XIcon name={"ArrowRightOutlined"} {...props}/>;
  static LoadingOutlined = (props?: IconProps) => <XIcon name={"LoadingOutlined"} {...props}/>;
  static PlusOutlined = (props?: IconProps) => <XIcon name={"PlusOutlined"} {...props}/>;
  static TagOutlined = (props?: IconProps) => <XIcon name={"TagOutlined"} {...props}/>;
  static AudioOutlined = (props?: IconProps) => <XIcon name={"AudioOutlined"} {...props}/>;
  static DownOutlined = (props?: IconProps) => <XIcon name={"DownOutlined"} {...props}/>;
  static BarsOutlined = (props?: IconProps) => <XIcon name={"BarsOutlined"} {...props}/>;
  static DownloadOutlined = (props?: IconProps) => <XIcon name={"DownloadOutlined"} {...props}/>;
  static FilterOutlined = (props?: IconProps) => <XIcon name={"FilterOutlined"} {...props}/>;
  static FullscreenOutlined = (props?: IconProps) => <XIcon name={"FullscreenOutlined"} {...props}/>;
  static ReloadOutlined = (props?: IconProps) => <XIcon name={"ReloadOutlined"} {...props}/>;
  static MinusOutlined = (props?: IconProps) => <XIcon name={"MinusOutlined"} {...props}/>;
  static PlusCircleOutlined = (props?: IconProps) => <XIcon name={"PlusCircleOutlined"} {...props}/>;
  static PlusSquareOutlined = (props?: IconProps) => <XIcon name={"PlusSquareOutlined"} {...props}/>;
  static Copy = (props?: IconProps) => <XIcon name={"Copy"} {...props}/>;
  static CodePen = (props?: IconProps) => <XIcon name={"CodePen"} {...props}/>;
  static Reload = (props?: IconProps) => <XIcon name={"Reload"} {...props}/>;
  static Book = (props?: IconProps) => <XIcon name={"Book"} {...props}/>;
  static Copyright = (props?: IconProps) => <XIcon name={"Copyright"} {...props}/>;
  static Warn = (props?: IconProps) => <XIcon name={"Warn"} {...props}/>;
  static Home = (props?: IconProps) => <XIcon name={"Home"} {...props}/>;
  static Dashboard = (props?: IconProps) => <XIcon name={"Dashboard"} {...props}/>;
  static Person = (props?: IconProps) => <XIcon name={"Person"} {...props}/>;
  static Columns = (props?: IconProps) => <XIcon name={"Columns"} {...props}/>;
  static PieChart = (props?: IconProps) => <XIcon name={"PieChart"} {...props}/>;
  static Window = (props?: IconProps) => <XIcon name={"Window"} {...props}/>;
  static Setting = (props?: IconProps) => <XIcon name={"Setting"} {...props}/>;
  static More = (props?: IconProps) => <XIcon name={"More"} {...props}/>;
  static Message = (props?: IconProps) => <XIcon name={"Message"} {...props}/>;
  static Check = (props?: IconProps) => <XIcon name={"Check"} {...props}/>;
  static LogIn = (props?: IconProps) => <XIcon name={"LogIn"} {...props}/>;
  static LogOut = (props?: IconProps) => <XIcon name={"LogOut"} {...props}/>;
  static Question = (props?: IconProps) => <XIcon name={"Question"} {...props}/>;
  static Group = (props?: IconProps) => <XIcon name={"Group"} {...props}/>;
  static Time = (props?: IconProps) => <XIcon name={"Time"} {...props}/>;
  static Timer = (props?: IconProps) => <XIcon name={"Timer"} {...props}/>;
  static WinkSmile = (props?: IconProps) => <XIcon name={"WinkSmile"} {...props}/>;
  static Loading = (props?: IconProps) => <XIcon name={"Loading"} {...props}/>;
  static Yen = (props?: IconProps) => <XIcon name={"Yen"} {...props}/>;
  static Grid = (props?: IconProps) => <XIcon name={"Grid"} {...props}/>;
  static List = (props?: IconProps) => <XIcon name={"List"} {...props}/>;
  static Bot = (props?: IconProps) => <XIcon name={"Bot"} {...props}/>;


}
