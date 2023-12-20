import React from "react";
import XBaseDisplay, {XBaseDisplayProps} from "../base/XBaseDisplay";
import "video-react/dist/video-react.css";

export interface XVideoProps extends XBaseDisplayProps {
  /**
   * 视频url列表
   */
  urlList?: Array<any>,
  fluid?: boolean,
  /**
   *自动播放
   */
  autoPlay?: boolean,
  /**
   * 视频宽度
   */
  videoWidth?: string | number,
  /**
   * 视频高度
   */
  videoHeight?: string | number,
  /**
   * 纵横比
   */
  aspectRatio?: string,
  muted?: boolean,
  /**
   * 播放时间
   */
  startTime?: number,
  /**
   * 预加载
   */
  preload?: any,
  /**
   * 默认显示
   */
  poster?: any,
}

/**
 * 控制并播放各种视频
 * @name 视频
 * @groupName 图像
 */
export default class XVideo extends XBaseDisplay<XVideoProps, any> {
  static ComponentName = "视频";
  static defaultProps = {
    ...XBaseDisplay.defaultProps,
    urlList: [],
    fluid: true,
    autoPlay: true,
    videoWidth: "100%",
    videoHeight: "100%",
    aspectRatio: "auto",
    muted: false,
    startTime: 0,
  };
  player: any;

  constructor(props) {
    super(props);
    this.state.index = 0;
    this.state.urlList = this.props.urlList;
    this.state.播放设置 = "按顺序播放";
  }

  /**
   * echarts library entry
   */
  protected video: any;

  async componentDidMount() {
    super.componentDidMount();// @ts-ignore
    this.video = await import(/* webpackChunkName: "tvideo" */ 'video-react');
    this.setState({loadLib: true})
  }

  init() {
    this.player?.subscribeToStateChange((state, prevState) => {
      if (state.hasStarted && state.ended) {
        if (this.state.播放设置 === '按顺序播放') {
          this.PlayNext();
        } else if (this.state.播放设置 === '循环播放') {
          this.Play();
        } else if (this.state.播放设置 === '播完后暂停') {
          this.Pause()
        } else if (this.state.播放设置 === '随机播放') {
          this.PlayRandom()
        } else {
          this.PlayNext()
        }
      }
    })
  }


  /**
   * 播放
   */
  Play() {
    this.player?.load();
  }

  /**
   * 暂停
   */
  Pause() {
    this.player?.pause()
  }

  /**
   * 随机播放
   */
  PlayRandom() {
    // @ts-ignore
    this.setState({index: parseInt(Math.random() * 10 + 1)});
    this.player?.load();
  }

  /**
   * 播放下一个
   */
  PlayNext() {
    this.setState({index: this.state.index + 1});
    this.player?.load();
  }

  renderDisplay() {
    if (!this.state.loadLib) {
      return <div></div>;
    }
    let {
      Player, ControlBar, ReplayControl, ForwardControl, CurrentTimeDisplay, TimeDivider, VolumeMenuButton
    } = this.video;
    let index = this.state.index;
    let urlList = this.state.urlList;
    return <Player ref={e => {
      this.player = e;
      this.init();
    }} playsInline autoPlay={this.props.autoPlay}
                   src={urlList[index % urlList.length]}
                   aspectRatio={this.props.aspectRatio} width={this.props.videoWidth} height={this.props.videoHeight}
                   fluid={this.props.fluid} preload={this.props.preload}
                   muted={this.props.muted} startTime={this.props.startTime} poster={this.props.poster}
    >
      <ControlBar autoHide={false} disableDefaultControls={false}>
        <ReplayControl seconds={10} order={1.1}/>
        <ForwardControl seconds={30} order={1.2}/>
        {/* <PlayToggle /> */}
        <CurrentTimeDisplay order={4.1}/>
        <TimeDivider order={4.2}/>
        <VolumeMenuButton order={7.2}/>
      </ControlBar>
    </Player>;
  }
}
