import React from 'react';

import ImageEditor from "./image/ImageEditor";
import 'tui-image-editor/dist/tui-image-editor.css';
import {whiteTheme} from "./image/js/theme/white-theme.js"
import CopyFile from "./image/CopyFile";
import XBaseEditor, {XBaseEditorProps} from '../base/XBaseEditor';
import XModal from "../layout/XModal";
import XButton from "./XButton";
import XFlex from "../layout/XFlex";
import XGrid from "../layout/XGrid";

const empty_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=";

export interface XImageEditorProps extends XBaseEditorProps {
  /**
   * 默认图片地址
   */
  src?: string,
  /**
   * 显示保存按钮，点击事件
   * @param imgBase64
   */
  onSaveFun: (imgBase64: string) => void,
  /**
   * 显示按钮
   */
  showButtons?: boolean,
}

/**
 * 图片编辑
 * @name 图片编辑器
 * @groupName 输入
 */
export default class XImageEditor extends XBaseEditor<XImageEditorProps, any> {
  static ComponentName = "图片编辑器";
  static defaultProps = {
    ...XBaseEditor.defaultProps,
    src: undefined,
    onSaveFun: undefined,
    showButtons: true,
    height: "100%",
  };
  uploadFile: any;

  constructor(props: XImageEditorProps) {
    super(props);
    this.state.src = this.props.src;
  }

  async componentDidMount() {
    super.componentDidMount();// @ts-ignore
    const TuiImageEditor = await import(/* webpackChunkName: "tTuiImageEditor" */ 'tui-image-editor');
    this.setState({TuiImageEditor: TuiImageEditor.default})

    // if (this.refImageEditor) {
    //   this.refImageEditor.getInstance().on("mousedown", function (props: any) {
    //     //console.log(props);
    //   });
    // }
  }

  SetValue(value, triggerValueChange: boolean = true) {
    super.SetValue(value, triggerValueChange);
    this.LoadImage(value, this.props.field ? this.props.field : this.CreateUUID());
  }

  GetValue(): any {
    let value = super.GetValue();
    if (this.refImageEditor) {
      value = this.refImageEditor.getInstance().toDataURL();
      if (empty_img == value) {
        value = "";
      }
    }
    return value;
  }

  ClearImage() {
    this.LoadImage("", "empty_img");
  }

  LoadImage(url: string, name: string) {
    url = url ? url : empty_img;
    this.refImageEditor?.getInstance().loadImageFromURL(url, name).then((result: any) => {
      this.refImageEditor.getInstance().clearUndoStack();
      this.refImageEditor.getInstance().ui.activeMenuEvent();
    });
  }

  LoadImageFile(file: File, name: string) {
    this.refImageEditor?.getInstance().loadImageFromFile(file, name).then((result: any) => {
      this.refImageEditor.getInstance().clearUndoStack();
      this.refImageEditor.getInstance().ui.activeMenuEvent();
    });
  }

  GetImageURL() {
    return this.refImageEditor?.getInstance().toDataURL();
  }

  refImageEditor: any;

  renderEditor() {
    if (!this.state.TuiImageEditor) {
      return <div></div>
    }
    return <XGrid boxStyle={{position: 'relative'}} rowsTemplate={["1fr"]}>
      <XFlex boxStyle={{
        width: "auto",
        position: 'absolute',
        right: '1px',
        top: '1px',
        height: '50px',
        zIndex: 99,
        borderBottomLeftRadius: '20%'
      }} flexDirection={"row"}>
        <div style={{display: "none"}}>
          <input ref={e => this.uploadFile = e} type="file" accept="image/*" id="input-image-file"
                 onChange={(event: any) => {
                   let supportingFileAPI = !!(window.File && window.FileList && window.FileReader);
                   let file;
                   if (!supportingFileAPI) {
                     alert('浏览器不支持文件上传');
                   }
                   file = event.target.files[0];
                   this.refImageEditor.getInstance().loadImageFromFile(file).then((result: any) => {
                     // console.log(result);
                     this.refImageEditor.getInstance().clearUndoStack();
                     this.refImageEditor.getInstance().ui.activeMenuEvent();
                   });
                 }}/>
        </div>
        <XButton visible={this.props.showButtons} text={"打开本地图片"} onClick={() => this.uploadFile.click()}/>
        <XButton visible={this.props.showButtons} text={"清空"} onClick={() => {
          XModal.Confirm("是否确认清空图片", () => this.ClearImage())
        }}/>
        {/* <XButton visible={this.props.showButtons} text={"打开"} onClick={() => {
            // @ts-ignore
            this.props.onOpenFun && this.props.onOpenFun();
          }}/> */}
        <XButton visible={this.props.onSaveFun != undefined && this.props.showButtons} text={"保存"} onClick={() => {
          let imgBase64 = this.refImageEditor.getInstance().toDataURL();
          // @ts-ignore
          this.props.onSaveFun && this.props.onSaveFun(imgBase64);
        }}/>
      </XFlex>
      <CopyFile onFile={(file, src) => this.LoadImageFile(file, "")}>
        {this.renderImageEditor()}
      </CopyFile>
    </XGrid>;
  }

  renderImageEditor() {
    return <ImageEditor ref={(e) => this.refImageEditor = e}
                        TuiImageEditor={this.state.TuiImageEditor}
                        includeUI={{
                          loadImage: {
                            // @ts-ignore
                            path: this.state.src,
                            name: "xd",
                          },
                          theme: whiteTheme,
                          menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'mask', 'filter'],
                          initMenu: '',
                          uiSize: {
                            width: '100%',
                            height: '100%',
                          },
                          menuBarPosition: 'bottom',
                        }}
                        cssMaxHeight={1000}
                        cssMaxWidth={1200}
                        selectionStyle={{
                          cornerSize: 20,
                          rotatingPointOffset: 70,
                        }}
                        usageStatistics={false}/>;
  }
}
