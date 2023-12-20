import React from 'react';
import  {XBaseLayout,XBaseLayoutProps} from 'xdcoreweb';

export interface XCodeLiveProps extends XBaseLayoutProps {
  /**
   * 预览类型
   */
  liveType?: string | "LiveEditor" | "LiveError" | "LivePreview" | "LiveProvider" | "Editor";
}

/**
 * 简单的编辑JS代码并可以执行代码结果
 * @name 代码可视
 * @groupName
 */
export default class XCodeLive extends XBaseLayout<XCodeLiveProps, any> {
  static ComponentName = "代码可视";
  static LiveType = {
    LiveEditor: "LiveEditor",
    LiveError: "LiveError",
    LivePreview: "LivePreview",
    LiveProvider: "LiveProvider",
    Editor: "Editor",
  };
  static LiveEditor = (props?: XCodeLiveProps) => <XCodeLive {...props} liveType={"LiveEditor"}/>;
  static LiveError = (props?: XCodeLiveProps) => <XCodeLive {...props} liveType={"LiveError"}/>;
  static LivePreview = (props?: XCodeLiveProps) => <XCodeLive {...props} liveType={"LivePreview"}/>;
  static LiveProvider = (props?: XCodeLiveProps) => <XCodeLive {...props} liveType={"LiveProvider"}/>;
  static Editor = (props?: XCodeLiveProps) => <XCodeLive {...props} liveType={"Editor"}/>;

  static defaultProps = {
    ...super.defaultProps,
  }

  async componentDidMount() {
    // @ts-ignore
    const ReactLive = await import(/* webpackChunkName: "tReactLive" */ 'react-live');
    this.setState({ReactLive})
  }

  instance: any;

  render() {
    let ReactLive = this.state.ReactLive;
    if (!ReactLive) {
      return <div></div>
    }
    let liveType = this.props.liveType;
    const {LiveEditor, LiveError, LivePreview, LiveProvider, Editor} = ReactLive;
    if (liveType == XCodeLive.LiveType.LiveEditor) {
      return <LiveEditor {...this.props} ref={e => this.instance = e}>{this.props.children}</LiveEditor>
    } else if (liveType == XCodeLive.LiveType.LiveError) {
      return <LiveError {...this.props} ref={e => this.instance = e}>{this.props.children}</LiveError>
    } else if (liveType == XCodeLive.LiveType.LivePreview) {
      return <LivePreview {...this.props} ref={e => this.instance = e}>{this.props.children}</LivePreview>
    } else if (liveType == XCodeLive.LiveType.LiveProvider) {
      return <LiveProvider {...this.props} ref={e => this.instance = e}>{this.props.children}</LiveProvider>
    } else {
      return <Editor {...this.props} ref={e => this.instance = e}>{this.props.children}</Editor>
    }
  }
}
