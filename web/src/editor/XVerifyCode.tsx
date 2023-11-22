import React from 'react';
import XBaseEditor, {XBaseEditorProps} from '../base/XBaseEditor';

export interface XVerifyCodeProps extends XBaseEditorProps {
  /**
   * 服务端的获取验证码的URL
   */
  dataSourceUrl?: string,
  /**
   * 验证码的长度
   */
  codeLength?: number,
  /**
   * 验证码图片的宽度
   */
  imgWidth?: number,
  /**
   * 验证码图片的高度
   */
  imgHeight?: number,
}

/**
 * 服务验证码图片，点击可刷新图片
 * @name 验证码
 * @groupName 图像
 */
export default class XVerifyCode extends XBaseEditor<XVerifyCodeProps, any> {
  static ComponentName = "验证码";
  static defaultProps = {
    ...XBaseEditor.defaultProps,
    showLabel: false,
    dataSourceUrl: "verify_code",
    codeLength: 4,
    imgWidth: 90,
    imgHeight: 30,
  };

  componentDidMount() {
    super.componentDidMount();
    this.Refresh();
  }

  /**
   * 刷新
   */
  async Refresh() {
    let ret = await this.RequestServerPost(this.props.dataSourceUrl, {
      length: this.props.codeLength, w: this.props.imgWidth * 2, h: this.props.imgHeight * 2,
    });
    if (ret.Success) {
      let info = ret.Value;
      this.SetValue(info.key);
      this.setState({img: "data:image/png;base64," + info.img})
    }
  }

  constructor(props) {
    super(props);
  }

  renderEditor() {
    let style: any = {cursor: "pointer", width: this.props.imgWidth, height: this.props.imgHeight};
    if (!this.state.img) {
      return <div>加载中...</div>;
    }
    return <img title={"点击刷新"} onClick={() => this.Refresh()} src={this.state.img}
                style={style}/>
  };
}
