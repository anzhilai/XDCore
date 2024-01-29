import React from 'react';
import XBaseEditor, {XBaseEditorProps} from '../base/XBaseEditor';
import TUIEditor, {TUIViewer} from "./teditor/TUIEditor";
import {XForm, XGrid, XInput, XMessage, XTabs, XUpload} from "../index";
import {createRoot} from 'react-dom/client'

export interface XTEditorProps extends XBaseEditorProps {
  /**
   * 编辑器高度
   */
  editorHeight?: string,
  /**
   * 编辑器类型
   */
  initialEditType?: "markdown" | "wysiwyg",
  /**
   * 预览样式
   */
  previewStyle?: "tab" | "vertical",
  /**
   * 图片上传地址
   */
  uploadUrl?: string,
  /**
   * 图片前缀路径
   */
  serverUrl?: string,
}

/**
 * 编写MD文件，并保存到后端
 * @name MD文档编辑
 * @groupName 输入
 */
export default class XTEditor extends XBaseEditor<XTEditorProps, any> {
  static ComponentName = "MD文档编辑";
  static defaultProps = {
    ...XBaseEditor.defaultProps,
    previewStyle: "vertical",
    initialEditType: "wysiwyg",
    editorHeight: "100%",
    height: "100%",
  };

  onChange() {
    this.state.value = this.teditor.getInstance().getMarkdown();
    this.useStateValue = true;
    this.onValueChangeEvent();
  }

  async componentDidMount() {
    const Editor = (await import(/* webpackChunkName: "teditor" */'./teditor/final/toastui-editor')).default;
    this.setState({Editor})
  }

  onEditorInstance(editor) {
    if (editor) {
      const createImageModal = () => {
        var div = document.createElement('div');
        const root = createRoot(div)
        // @ts-ignore
        root.render(<UploadModal editor={editor} uploadUrl={this.props.uploadUrl}/>)
        return div
      }
      // const createVideoModal = ()=>{
      //   var div = document.createElement('div');
      //   const root = createRoot(div)
      //   // @ts-ignore
      //   root.render( <VideoModal editor={editor}/> )
      //   return div
      // }
      editor.removeToolbarItem('image') //删除原来的上传图片组件
      editor.insertToolbarItem({groupIndex: 3, itemIndex: 1}, {
        name: '插入图片',
        tooltip: '插入图片',
        // command: 'uploadImage',
        className: 'toastui-editor-toolbar-icons image',
        popup: {
          body: createImageModal(),
          style: {width: 'auto'}
        }
      });
      // editor.insertToolbarItem({ groupIndex: 3, itemIndex: 2 }, {
      //   name: '嵌入视频',
      //   tooltip: '嵌入视频',
      //   className: 'toastui-editor-toolbar-icons image',
      //   popup: {
      //     body: createVideoModal(),
      //     style: {width: 'auto'}
      //   }
      // });
      editor.addCommand('wysiwyg', 'uploadServerImage', (payload, {schema, tr}, dispatch) => {
        const {imageUrl, altText} = payload;
        if (!imageUrl) {
          return false;
        }
        console.log(schema.nodes.image)
        const node = schema.nodes.image.createAndFill({
          imageUrl,
          ...(altText && {altText}),
        });

        dispatch(tr.replaceSelectionWith(node).scrollIntoView());

        return true;
      })
      editor.addCommand('markdown', 'uploadServerImage', (payload, {selection, tr, schema}, dispatch) => {
        const {from, to} = selection;
        const {altText, imageUrl} = payload;
        let text = altText;
        let url = imageUrl;
        let syntax = '!';

        text = escapeTextForLink(text);
        syntax += `[${text}](${url})`;

        dispatch(tr.replaceWith(from, to, schema.text(syntax)));

        return true;
      })
      editor.addCommand('fullScreen', 'fullScreen', () => this.xGrid?.ToggleFullScreen())
      editor.insertToolbarItem({groupIndex: -1, itemIndex: -1}, {
        name: 'fullScreen',
        tooltip: '全屏',
        command: 'fullScreen',
        style: {
          backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAM5JREFUOE/NlGEOgyAMhVuOMzjO4nXU67gdp+w4dKmxpGFgsg2N/pX3lde+gtD5w848yMAQwmThzLzEGF+1gt77GyIO9h8RrfoSOCJiTCkNLZhCBOqcW5jZA8BcBSLivTzQasnmaL0AMz+rQLG5WRlt1RKqMDmjmg+gWFCbRjAR0WyBFqYQq21OWYTSAttP07dssbz9bmxsZTuMvYEdl8NeAT/P8t9DacQmb4C2pBapamzk4A/BFs1DluGc1QOAro+D7G+e+pfPF+uKXj/Yb74G1RXZq/qLAAAAAElFTkSuQmCC)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: 'transparent'
        }
      });
      // editor.addCommand('markdown','insertVideo',(payload,{ selection, tr, schema }, dispatch) => {
      //   const { from, to } = selection;
      //   const { url } = payload;

      //   const syntax = [
      //     '$$video',
      //     url,
      //     '$$'
      //   ].join('\n');

      //   dispatch(tr.replaceWith(from, to, schema.text(syntax)));

      //   return true;
      // })
    }
  }

  getServerUrl = () => this.props.serverUrl || this.GetServerRootUrl()

  xGrid: XGrid;
  teditor: TUIEditor;
  renderEditor = () => {
    if (!this.state.Editor) {
      return <div/>
    }
    return <XGrid columnsTemplate={['100%']} ref={e => this.xGrid = e}>{/*@ts-ignore*/}
      <TUIEditor ref={(e) => this.teditor = e} height={this.props.editorHeight} serverUrl={this.getServerUrl()}
                 previewStyle={this.props.previewStyle} Editor={this.state.Editor}
                 onEditorInstance={this.onEditorInstance.bind(this)}
                 initialEditType={this.props.initialEditType}
                 value={this.GetValue()} onChange={() => this.onChange()}/>
    </XGrid>;
  };

  getReadOnlyNode() {
    if (!this.state.Editor) {
      return <div/>
    }// @ts-ignore
    return <TUIViewer Editor={this.state.Editor} serverUrl={this.getServerUrl()} value={this.GetValue()}/>;
  }
}

// class VideoModal extends React.Component{

//   close = ()=>{
//     // @ts-ignore
//     this.props.editor?.eventEmitter.emit("closePopup")
//   }
//   form:XForm;
//   render(){
//     // @ts-ignore
//     const { editor } = this.props
//     return (
//         <XGrid rowsTemplate={["auto", '60px']}>
//           <XForm inited={e => this.form = e}/>
//           <XGrid rowsTemplate={['50px']}>
//             <XInput field={"url"} label="嵌入视频地址" labelMode="top" isRequired={true} parent={() => this.form}/>
//           </XGrid>
//           <div className="toastui-editor-button-container">
//             <button type="button" className="toastui-editor-close-button" onClick={this.close}>取消</button>
//             <button type="button" className="toastui-editor-ok-button" onClick={()=>{
//               const e = this.form.ValidateEditorValues()
//               if(e){
//                 XMessage.ShowWarn(e)
//                 return
//               }
//               const values:any = this.form.GetValues()
//               if(values && values.url){
//                 editor.exec( 'insertVideo', values )
//                 this.form.ClearValues()
//                 this.close()
//               }

//             }}>确认</button>
//           </div>
//         </XGrid>
//     )
//   }
// }

class UploadModal extends React.Component {

  state = {
    activeKey: '上传文件'
  }

  close = () => {// @ts-ignore
    this.props.editor?.eventEmitter.emit("closePopup")
  }
  form: XForm;

  render() {
    const {activeKey} = this.state// @ts-ignore
    const {editor, uploadUrl} = this.props
    return (
      <XGrid rowsTemplate={["auto", "1fr", '60px']}>
        <XForm inited={e => this.form = e}/>
        <XTabs onTabChange={activeKey => this.setState({activeKey})} items={["上传文件", "URL"]}/>
        {activeKey === "上传文件" &&
          <XGrid rowsTemplate={['140px', '50px']}>
            <XUpload field={"imageUrl"} label="上传图片" text={"上传图片"} labelMode="top"
                     uploadUrl={uploadUrl || "xtpz/upload"} downloadUrl={"download"}
                     fileType={XUpload.FileType.image} isMulti={false} isRequired={true} maxFileNum={1}
                     parent={() => this.form}/>
            <XInput field="altText" label={"说明"} labelMode="top" parent={() => this.form}/>
          </XGrid>}
        {activeKey === "URL" &&
          <XGrid rowsTemplate={['50px', '50px']}>
            <XInput field={"imageUrl"} label="图片网址" labelMode="top" isRequired={true} parent={() => this.form}/>
            <XInput field="altText" label={"说明"} labelMode="top" parent={() => this.form}/>
          </XGrid>}
        <div className="toastui-editor-button-container">
          <button type="button" className="toastui-editor-close-button" onClick={this.close}>取消</button>
          <button type="button" className="toastui-editor-ok-button" onClick={() => {
            const e = this.form.ValidateEditorValues()
            if (e) {
              XMessage.ShowWarn(e)
              return
            }
            const values: any = this.form.GetValues()
            if (values && values.imageUrl) {
              if (values.imageUrl.indexOf("|") == -1 && values.imageUrl.startsWith("http")) {
                editor.exec('uploadServerImage', values)
              } else {
                editor.exec('uploadServerImage', {
                  ...values,// @ts-ignore
                  imageUrl: window.config.hServer + "/download?filename=" + values.imageUrl.split("|")[1]
                })
              }
              this.form.ClearValues()
              this.close()
            }
          }}>确认
          </button>
        </div>
      </XGrid>
    )
  }
}

function escapeTextForLink(text) {
  const imageSyntaxRanges = [];
  const reMdImageSyntax = /!\[.*\]\(.*\)/g;
  const reEscapedCharInLinkSyntax = /[[\]]/g;
  let result = reMdImageSyntax.exec(text);

  while (result) {
    imageSyntaxRanges.push([result.index, result.index + result[0].length]);
    result = reMdImageSyntax.exec(text);
  }

  return text.replace(reEscapedCharInLinkSyntax, (matched, offset) => {
    const isDelimiter = imageSyntaxRanges.some((range) => offset > range[0] && offset < range[1]);

    return isDelimiter ? matched : `\\${matched}`;
  });
}
