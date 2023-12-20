import * as React from 'react';
import {CSSProperties} from "react";
import {XGrid,XTools,XIcon,XModal,XBaseEditor, XBaseEditorProps} from "xdcoreweb";

export interface XVerifySlideProps extends XBaseEditorProps {
  onValidateOK?: (value) => void,
  cutZoom?: number,
}

/**
 * 滑动验证组件
 * @name 滑动验证组件
 * @groupName 输入
 */
export default class XVerifySlide extends XBaseEditor<XVerifySlideProps, any> {
  static ComponentName = "滑动验证组件";
  static defaultProps = {
    ...XBaseEditor.defaultProps,
    showLabel: false,
    isRequired: true,
    width: "20px",
    dataSourceUrl: "verify_code",//图片URL:xxx/verify_code
    cutZoom: 1,
  }

  static async Confirm(title?: string, props?: object, okfun?: (value: string) => void) {
    return new Promise(async (resolve, reject) => {
      let Ele = <XVerifySlide onValidateOK={(value) => {// @ts-ignore
        modal?.handleCancel();
        okfun && okfun(value);
        resolve(value);
      }} {...props}/>;
      let modal = await XModal.ModalShow(title, undefined, Ele, "500px", undefined, () => [])
    });
  }

  constructor(props: XVerifySlideProps) {
    super(props);
    this.state = {
      ...this.state,
      cutUrl: "",
      bgUrl: "",
      originX: 0,
      originY: 0,
      offsetX: 0,
      offsetY: 0,
      imgCutWidth: 0,
      imgCutTop: 0,
      imgRealTop: 0,
      isMoving: false,
      isTouchEndSpan: false,
      validated: "",
    }
  }

  componentDidMount() {
    super.componentDidMount();
    document.addEventListener('mouseup', this.listenMouseUp);
    document.addEventListener('mousemove', this.listenMouseMove);
    if (this.props.dataSourceUrl) {
      this.Refresh();
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    document.removeEventListener('mouseup', this.listenMouseUp);
    document.removeEventListener('mousemove', this.listenMouseMove);
    clearTimeout(this.timeout);
    this.timeout = null;
  }

  private timeout: any;
  private control: HTMLElement;
  private slider: HTMLElement;
  private imgBg: HTMLImageElement;
  private imgCut: HTMLImageElement;

  private getClientX = (e): number => {
    if (e.type.indexOf('mouse') > -1) {
      return XTools.toBodyZoom(e.clientX);
    }
    if (e.type.indexOf('touch') > -1) {
      return XTools.toBodyZoom(e.touches[0].clientX);
    }
  }

  private getClientY = (e): number => {
    if (e.type.indexOf('mouse') > -1) {
      return XTools.toBodyZoom(e.clientY);
    }
    if (e.type.indexOf('touch') > -1) {
      return XTools.toBodyZoom(e.touches[0].clientY);
    }
  }

  private move = (e): void => {
    const clientX = this.getClientX(e);
    const clientY = this.getClientY(e);
    let offsetX = clientX - this.state.originX;
    const offsetY = Math.abs(clientY - this.state.originY);
    const totalY = this.state.totalY + offsetY;
    if (offsetX < 0) {
      offsetX = 0;
    } else {
      let maxWidth = 0;
      if (this.imgBg && this.imgCut) {
        maxWidth = this.imgBg.clientWidth - this.imgCut.clientWidth;
      } else {
        maxWidth = this.control.clientWidth - this.slider.clientWidth;
      }
      if (offsetX > maxWidth) {
        offsetX = maxWidth;
      }
    }
    this.setState({offsetX, totalY});
  };

  public validatedSuccess = (callback?: () => any): void => {
    this.setState({validated: "success",}, () => {
      callback && callback();
      this.props.onValidateOK?.(this.GetValue())
    });
  };

  public validatedFail = (callback?: () => any): any => {
    this.setState({validated: "error",}, () => {
      callback && callback();
      this.timeout = setTimeout(() => this.resetView(), 500);
    });
  };

  private handleTouchStart = (e): void => {
    e.preventDefault();
    if (this.state.isTouchEndSpan) {
      return;
    }
    this.setState({originX: this.getClientX(e), originY: this.getClientY(e),});
  };

  private handleTouchMove = (e): void => {
    e.preventDefault();
    if (this.state.isTouchEndSpan) {
      return;
    }
    this.move(e);
    this.setState({isMoving: true,});
  };

  private handleTouchEnd = (e): void => {
    if (this.state.isTouchEndSpan) {
      return;
    }
    if (this.state.offsetX > 0) {
      if (this.imgBg) {
        const value = this.state.offsetX * this.imgBg.naturalWidth / this.imgBg.width;
        this.setState({isTouchEndSpan: true, isMoving: false,});
        this.Validate(value);
      } else {
        this.setState({isTouchEndSpan: true, isMoving: false,});
        if (Math.abs(this.control.clientWidth - this.slider.clientWidth - this.state.offsetX) <= 5) {
          this.SetValue("ok");
          this.validatedSuccess();
        } else {
          this.validatedFail();
        }
      }
    }
  };

  resetView = () => {
    const targetPercent = 0;
    const speed = (this.control.clientWidth - this.slider.clientWidth) / 30;
    const animate = () => {
      const percent = this.state.offsetX;
      const currentProgress = percent < speed ? 0 : percent - speed;
      if (percent > targetPercent) {
        this.setState({offsetX: currentProgress,}, () => window.requestAnimationFrame(animate));
      } else {
        this.setState({
          originX: 0, originY: 0, offsetX: 0, offsetY: 0,
          isMoving: false, isTouchEndSpan: false, validated: "",
        });
      }
    };
    window.requestAnimationFrame(animate);
  };

  handlerMouseDown = (e) => {
    e.preventDefault();
    if (this.state.isTouchEndSpan) {
      return;
    }
    this.setState({originX: this.getClientX(e), originY: this.getClientY(e), isMoving: true,});
  };

  handlerMouseMove = (e) => {
    e.preventDefault();
    if (this.state.isTouchEndSpan) {
      return;
    }
    this.state.isMoving && this.move(e);
  };

  handlerMouseUp = (e) => {
    e.preventDefault();
    if (this.state.isTouchEndSpan) {
      return;
    }
    this.setState({isMoving: false,});
    this.handleTouchEnd(e);
  };

  listenMouseUp = (e) => {
    this.state.isMoving && this.handlerMouseUp(e);
  };

  listenMouseMove = (e) => {
    this.handlerMouseMove(e);
  };

  imageReSize() {
    if (this.imgBg.naturalWidth > 0 && this.imgCut.naturalWidth > 0) {
      let imgCutWidth = this.imgCut.naturalWidth * this.imgBg.width / this.imgBg.naturalWidth;
      let imgCutTop = this.state.imgRealTop * this.imgBg.width / this.imgBg.naturalWidth;
      this.setState({imgCutWidth, imgCutTop})
    }
  }

  async Validate(value?: number) {
    if (!this.props.dataSourceUrl) {
      return;
    }
    let ret = await this.RequestServerPost(this.props.dataSourceUrl, {
      type: "slide", key: value ? value + "_" + this.state.imgKey : undefined, cutZoom: this.props.cutZoom,
    });
    if (ret?.Success) {
      let info = ret.Value;
      let reset = () => {
        this.setState({
          bgUrl: "data:image/png;base64," + info.bgImg,
          cutUrl: "data:image/png;base64," + info.cutImg,
          imgRealTop: info.top,
          imgKey: info.key,
        })
      }
      if (value) {
        if (info.validate) {
          this.SetValue(value + "_" + this.state.imgKey);
          this.validatedSuccess();
          return;
        } else {
          this.validatedFail(() => reset());
        }
      } else {
        reset();
      }
    }
  }

  async Refresh() {
    if (!this.GetValue()) {
      await this.Validate();
    }
  }

  renderControl() {
    let styleControl: CSSProperties = {
      position: "relative", width: "100%", height: 40, lineHeight: "40px", fontSize: "14px", textAlign: "center",
      backgroundColor: "#f7f9fa", border: "1px solid #e4e7eb",
    };
    let text = "";
    if (this.state.validated == "success") {
      styleControl = {...styleControl, border: "1px solid #389e0d", backgroundColor: "#389e0d"}
      text = "滑块验证成功";
    } else if (this.state.validated == "error") {
      styleControl = {...styleControl, border: "1px solid #ff7875", backgroundColor: "#ff7875"}
      text = "滑块验证失败，请重试.";
    }
    let styleSlider: CSSProperties = {
      width: 40, height: 38, left: this.state.offsetX + "px", top: 0,
      cursor: "pointer", position: "absolute", alignItems: "center",
      backgroundColor: this.state.offsetX > 0 ? "#3f91f7" : "#e9f7fe",
      color: this.state.offsetX > 0 ? "#fff" : "#777",
      border: this.state.offsetX > 0 ? undefined : "1px solid #3f91f7",
      display: this.state.validated ? "none" : "grid",
    }
    if (this.state.imgCutWidth > 0) {
      styleSlider.width = this.state.imgCutWidth;
      styleSlider.height = this.state.imgCutWidth - 2;
      styleControl.height = this.state.imgCutWidth;
      styleControl.lineHeight = this.state.imgCutWidth + "px";
    }
    return <div ref={(el) => this.control = el} style={styleControl}
                onTouchMove={this.handleTouchMove} onTouchEnd={this.handleTouchEnd}
                onMouseMove={this.handlerMouseMove} onMouseUp={this.handlerMouseUp}>
      <span style={{color: "#fff"}}>{text}</span>
      <div ref={(el) => this.slider = el} style={styleSlider}
           onTouchStart={this.handleTouchStart} onMouseDown={this.handlerMouseDown}>
        <XIcon.ArrowRightOutlined/>
      </div>
      {this.state.offsetX == 0 && (this.props.dataSourceUrl ? "按住滑块，拖动完成拼图" : "按住滑块，拖动至最右边，完成验证")}
    </div>
  }

  render() {
    if (!this.props.dataSourceUrl) {
      return this.renderControl()
    }
    return <XGrid rowsTemplate={["auto", "1fr"]}>
      <div style={{position: "relative", height: "100%"}}>
        <img ref={e => this.imgBg = e} src={this.state.bgUrl} style={{width: "100%"}}
             onLoad={(event) => this.imageReSize()}/>
        <img ref={e => this.imgCut = e} src={this.state.cutUrl}
             style={{
               width: this.state.imgCutWidth, left: this.state.offsetX + "px",
               top: this.state.imgCutTop, position: "absolute"
             }}
             onLoad={(event) => this.imageReSize()}/>
        {!this.GetValue() && <div title={"刷新"} onClick={() => this.Refresh()} style={{
          position: "absolute", right: 5, top: 5, color: "#fff",
          cursor: "pointer", background: "#11141833"
        }}>
          <XIcon.Reload width={this.props.width} height={this.props.width}/>
        </div>}
      </div>
      {this.renderControl()}
    </XGrid>;
  }
}
