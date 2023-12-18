import React from 'react';
import XBaseDisplay, {XBaseDisplayProps} from "../base/XBaseDisplay";

export interface XQRCodeProps extends XBaseDisplayProps {
  /**
   * 二维码的值信息
   */
  value?: string,
  /**
   * 二维码的大小
   * @defaultValue 300
   */
  size?: number,
  /**
   * 二维码的级别，不同的级别代表不同的大小
   * @defaultValue L
   */
  level?: string,
  /**
   * 二维码的背景颜色
   * @defaultValue #FFFFFF
   */
  bgColor?: string,
  /**
   * 二维码的前端颜色
   * @defaultValue #000000
   */
  fgColor?: string,
  /**
   * 是否包括二维码的边框
   * @defaultValue false
   */
  includeMargin?: boolean,
  /**
   * 二维码的图片路径
   */
  imageSrc?: string,
  /**
   * 二维码的图片大小
   * @defaultValue [50,50]
   */
  imageSize?: number[],
}

/**
 * 二维码生成、显示以及扫描
 * @name 二维码
 * @groupName
 */
export default class XQRCode extends XBaseDisplay<XQRCodeProps, any> {
  static ComponentName = "二维码";
  static defaultProps = {
    ...XBaseDisplay.defaultProps,
    value: "",
    size: 300,
    level: 'L',
    bgColor: '#FFFFFF',
    fgColor: '#000000',
    includeMargin: false,
  };
  // src: PropTypes.string.isRequired,
  // height: PropTypes.number.isRequired,
  // width: PropTypes.number.isRequired,
  // excavate: PropTypes.bool,
  // x: PropTypes.number,
  // y: PropTypes.number
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    super.componentDidMount();
    const QRCode = await import(/* webpackChunkName: "tQRCode" */ 'qrcode.react');
    this.setState({QRCode: QRCode.default})
  }

  render() {
    let QRCode = this.state.QRCode;
    if (!QRCode) {
      return <div></div>
    }
    let seting = {
      src: this.props.imageSrc,
      width: this.props.imageSize ? this.props.imageSize[0] : 50,
      height: this.props.imageSize ? this.props.imageSize[1] : 50,
    }
    return <QRCode value={this.props.value}
                   size={this.props.size}
                   level={this.props.level}
                   bgColor={this.props.bgColor}
                   fgColor={this.props.fgColor}
                   includeMargin={this.props.includeMargin}
                   imageSettings={seting}/>
  }
}
