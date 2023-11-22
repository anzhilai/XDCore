import React from 'react';
import XBaseEditor, {XBaseEditorProps} from '../base/XBaseEditor';
import MonacoEditor from "./monaco/editor";
import MonacoDiffEditor from "./monaco/diff";

export interface XMonacoEditorProps extends XBaseEditorProps {
  /**
   * 语言
   */
  language?: string,
  /**
   * 样式
   */
  theme?: string,
  /**
   * 参数对象
   */
  options?: object,
  overrideServices?: object,
  editorWillMount?: (monaco: {}) => {},
  editorDidMount?: (editor: {}, monaco: {}) => void,
  editorWillUnmount?: (editor: {}, monaco: {}) => void,
  onChangeEvent?: (event: {}) => void,
  original: string,
}

/**
 * 万能的代码编辑器
 * @name 代码编辑
 * @groupName
 */
export default class XMonacoEditor extends XBaseEditor<XMonacoEditorProps, any> {
  static ComponentName = "代码编辑";
  static StyleType = {editor: 'editor', diff: 'diff'};
  static MonacoEditor: typeof MonacoEditor = MonacoEditor;

  static async GetMonaco(): Promise<any> {
    return await import(/* webpackChunkName: "tMonacoEditor" */ 'monaco-editor/esm/vs/editor/editor.api');
  }

  static defaultProps = {
    ...super.defaultProps,
    language: "text",
    theme: "vs",
    options: {
      selectOnLineNumbers: true,
      renderSideBySide: false,
      contextmenu: true,
      fixedOverflowWidgets: true,
      'semanticHighlighting.enabled': true,
      foldingStrategy: 'indentation',
      insertSpaces: false,
      automaticLayout: true,
    },
    height: "100%",
  }

  async componentDidMount() {
    super.componentDidMount();
    const monaco = await XMonacoEditor.GetMonaco();
    this.setState({monaco})
  }

  renderReadOnly() {
    return this.renderEditor();
  }

  onChange(v, event) {
    this.SetValue(v);
    this.props.onChangeEvent?.(event);
    //多人协同编辑处理
    // let changes = event.changes[0];
    // changes["uid"] = "";
    // changes["mes_type"] = 1;
    // changes["body"] = [];
    // for (let i = 1; i <= this.editor.getModel().getLineCount(); i++) {
    //   changes["body"].push(Base64.encode(this.editor.getModel().getLineContent(i)));
    // }
    // var options = {
    //   range: text["range"],
    //   rangeLength: ["range"],
    //   text: text["text"],
    //   rangeOffset: text["rangeOffset"],
    //   forceMoveMarkers: text["forceMoveMarkers"],
    // };
    // this.editor.executeEdits(
    //   this.this.$store.state.g_monaco.root,
    //   [options]
    // );
  }

  editor: object;
  monaco: object;

  onEditorDidMount(editor: {}, monaco: {}) {
    this.editor = editor;
    this.monaco = monaco;
    this.props.editorDidMount?.(editor, monaco);

    // changes
    // this.monacoEditor.onDidCompositionStart((event) => {//中文输入法开始
    //   this.compositonState = "sta";
    // });
    // this.monacoEditor.onDidCompositionEnd((event) => {//中文输入法结束
    //   this.compositonState = "end";
    // });
    // this.monacoEditor.onKeyDown((event) => {//中文输入法下等待空格
    //   if (this.compositonState == "sta" && event.code == "Space") {
    //     this.compositonState = "end";
    //   }
    // });
  }


  renderEditor(): JSX.Element {
    let monaco = this.state.monaco;
    if (!monaco) {
      return <div></div>
    }
    if (this.GetStyleType() == "diff") {
      return <MonacoDiffEditor monaco={monaco} language={this.props.language} value={this.GetValue()}
                               theme={this.props.theme} options={this.props.options}
                               overrideServices={this.props.overrideServices}
                               editorWillMount={this.props.editorWillMount}
                               editorWillUnmount={this.props.editorWillUnmount}
                               editorDidMount={(editor, monaco) => this.onEditorDidMount(editor, monaco)}
                               original={this.props.original}
                               onChange={(v, event) => this.onChange(v, event)}/>
    }
    return <MonacoEditor monaco={monaco} language={this.props.language} value={this.GetValue()}
                         theme={this.props.theme} options={this.props.options}
                         overrideServices={this.props.overrideServices}
                         editorWillMount={this.props.editorWillMount}
                         editorWillUnmount={this.props.editorWillUnmount}
                         editorDidMount={(editor, monaco) => this.onEditorDidMount(editor, monaco)}
                         onChange={(v, event) => this.onChange(v, event)}/>
  }
}