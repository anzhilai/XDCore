import React, {ReactNode} from "react";
import PropTypes from 'prop-types'
import XBaseDisplay, {XBaseDisplayProps} from "../base/XBaseDisplay";
// react-file-viewer太大且效果一般，暂不使用
// import FileViewer from 'react-file-viewer';

export interface XFileViewerProps extends XBaseDisplayProps {
  /**
   * 文件路径URL
   */
  url?: string,
  /**
   * 显示类型
   */
  type?:'docx'|'pdf',
  /**
   * 内容为空的显示
   */
  emptyContent?: string | ReactNode,
}

/**
 * 预览mp4、mp3、docx文件
 * @name 文件预览
 * @groupName
 */
export default class XFileViewer extends XBaseDisplay<XFileViewerProps,any> {
  static ComponentName = "文件预览";
  static defaultProps = {
    ...XBaseDisplay.defaultProps,
    url:"",
    type:"docx",
    emptyContent:"无文档",
  };

  constructor(props) {
    super(props)
    this.state.url = props.url;
    this.state.type = props.type;
  }

  useStateUrl=false;
  GetUrl(){
    if(this.useStateUrl) {
      return this.state.url;
    }
    return this.props.url;
  }

  /**
   * 设置文件
   * @param url 文件地址
   * @param type 文件类型
   */
  SetFile(url, type) {
    this.state.type = type;
    this.state.url = url;
    this.useStateUrl = true;
    this.setState({type: type, url: url,});
    this.forceUpdate();
  }

  renderDisplay() {
    if(this.GetUrl()){
      let node;
      try {
        // node = <FileViewer key={this.GetUrl()} fileType={this.state.type}
        //                    filePath={this.GetUrl()}
        //   // onError={() => {
        //   //   console.log("出现错误")
        //   // }}
        //   // errorComponent={() => console.log("出现错误")}
        //   // unsupportedComponent={() => console.log("不支持")}
        // />;
      } catch (e) {
        node = <div>"该文件不支持预览"</div>;
      }
      return node;
    }else{
      return <div>{this.props.emptyContent}</div>
    }
  }
}
