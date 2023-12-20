import React from 'react';
import styled from 'styled-components';

import './final/toastui-editor.css';


export default class TUIEditor extends React.Component {

  rootEl = React.createRef<HTMLDivElement>();

  // @ts-ignore
  editorInst:any;

  getRootElement() {
    return this.rootEl.current;
  }

  getInstance() {
    return this.editorInst;
  }

  wait = ( time ) => new Promise( res => setTimeout( res, time) )

  getBindingEventNames() {
    return Object.keys(this.props)
      .filter((key) => /^on[A-Z][a-zA-Z]+/.test(key) && key != 'onEditorInstance')
      .filter((key) => this.props[key]);
  }

  bindEventHandlers(props: any) {
    this.getBindingEventNames().forEach( (key) => {
      const eventName = key[2].toLowerCase() + key.slice(3);
      const inst = this.getInstance()
      inst.off(eventName);
      inst.on(eventName, props[key]!);
    });
  }

  getInitEvents() {
    return this.getBindingEventNames().reduce(
      (acc:any, key) => {
        const eventName = (key[2].toLowerCase() + key.slice(3));

        // @ts-ignore
        acc[eventName] = this.props[key];

        return acc;
      },
      {}
    );
  }

  componentDidMount() {
      // @ts-ignore
    const { Editor, serverUrl } = this.props
    this.editorInst = new Editor({
      el: this.rootEl.current!,
      ...this.props,
      // @ts-ignore
      initialValue: this.props.value,
      events: this.getInitEvents(),
      // language:'cn',
      language: 'zh-CN',
      usageStatistics:false,
      plugins: [videoPlugin],
      customHTMLRenderer: {
        htmlBlock: {
          iframe(node) {
            return [
              { type: 'openTag', tagName: 'iframe', outerNewLine: true, attributes: node.attrs},
              { type: 'html', content: node.childrenHTML },
              { type: 'closeTag', tagName: 'iframe', outerNewLine: true },
            ];
          }
        },
        image(node, context) {
          const src = node.destination
          const alt = node.firstChild?.literal
          const flag = src.startsWith("data:image/png;base64,") || src.startsWith("http") || src.startsWith("//")
          return {
            type: context.entering ? 'openTag' : 'closeTag',
            tagName: 'img',
            attributes: {
              src: flag? src: ((serverUrl || '') + src),
              alt
            }
          };
        },
        text(node, context) {
          if(node.parent?.type == 'image'){
            return null
          }
          const strongContent = node.parent.type === 'strong';
          return {
            type: 'text',
            content: strongContent ? node.literal.toUpperCase() : node.literal
          };
        },
      },
    });

    Editor.setLanguage('zh-CN', {
      Markdown: 'Markdown',
      WYSIWYG: '所见即所得',
      Write: '编辑',
      Preview: '预览',
      Headings: '标题',
      Paragraph: '文本',
      Bold: '加粗',
      Italic: '斜体字',
      Strike: '删除线',
      Code: '内嵌代码',
      Line: '水平线',
      Blockquote: '引用块',
      'Unordered list': '无序列表',
      'Ordered list': '有序列表',
      Task: '任务',
      Indent: '缩进',
      Outdent: '减少缩进',
      'Insert link': '插入链接',
      'Insert CodeBlock': '插入代码块',
      'Insert table': '插入表格',
      'Insert image': '插入图片',
      Heading: '标题',
      'Image URL': '图片网址',
      'Select image file': '选择图片文件',
      'Choose a file': '选择一个文件',
      'No file': '没有文件',
      Description: '说明',
      OK: '确认',
      More: '更多',
      Cancel: '取消',
      File: '文件',
      URL: 'URL',
      'Link text': '链接文本',
      'Add row to up': '向上添加行',
      'Add row to down': '在下方添加行',
      'Add column to left': '在左侧添加列',
      'Add column to right': '在右侧添加列',
      'Remove row': '删除行',
      'Remove column': '删除列',
      'Align column to left': '左对齐',
      'Align column to center': '居中对齐',
      'Align column to right': '右对齐',
      'Remove table': '删除表格',
      'Would you like to paste as table?': '需要粘贴为表格吗?',
      'Text color': '文字颜色',
      'Auto scroll enabled': '自动滚动已启用',
      'Auto scroll disabled': '自动滚动已禁用',
      'Choose language': '选择语言',
    });
    // @ts-ignore
    this.props?.onEditorInstance?.(this.editorInst)
  }

  shouldComponentUpdate(nextProps: any) {
    const instance = this.getInstance()
    // @ts-ignore
    const { height, previewStyle, value } = nextProps;
    // @ts-ignore
    if (height && this.props.height !== height) {
      instance.setHeight(height);
    }
    // @ts-ignore
    if (previewStyle && this.props.previewStyle !== previewStyle) {
      instance.changePreviewStyle(previewStyle);
    }
    // @ts-ignore
    if (instance.getMarkdown() !== value) {
      if(!value){
        instance.setMarkdown('  ');
      }else{
        instance.setMarkdown(value);
      }
    }
    this.bindEventHandlers(nextProps);
    return false;
  }

  render() {
    return <Style ref={this.rootEl} />;
  }
}

export class TUIViewer extends React.Component {

  rootEl = React.createRef<HTMLDivElement>();
  editorInst:any;
  componentDidMount() {
    // @ts-ignore
    const { Editor, serverUrl } = this.props
    // this.editorInst = new Editor({
    //   el: this.rootEl.current!,
    //   ...this.props,
    //   // @ts-ignore
    //   initialValue: this.props.value,
    //   // language:'cn',
    //   language: 'zh-CN',
    //   viewer: true,
    //   usageStatistics:false,
    // });
    this.editorInst = Editor.factory({
      el: this.rootEl.current!,
      ...this.props,
      // @ts-ignore
      initialValue: this.props.value,
      // language:'cn',
      language: 'zh-CN',
      viewer: true,
      usageStatistics:false,
      plugins: [videoPlugin],
      customHTMLRenderer: {
        htmlBlock: {
          iframe(node) {
            return [
              { type: 'openTag', tagName: 'iframe', outerNewLine: true, attributes: node.attrs },
              { type: 'html', content: node.childrenHTML },
              { type: 'closeTag', tagName: 'iframe', outerNewLine: true },
            ];
          }
        },
        image(node, context) {
          const src = node.destination
          const alt = node.firstChild?.literal
          const flag = src.startsWith("data:image/png;base64,") || src.startsWith("http") || src.startsWith("//")
          return {
            type: context.entering ? 'openTag' : 'closeTag',
            tagName: 'img',
            attributes: {
              src: flag? src: ((serverUrl || '') + src),
              alt
            }
          };
        },
        text(node, context) {
          if(node.parent?.type == 'image'){
            return null
          }
          const strongContent = node.parent.type === 'strong';
          return {
            type: 'text',
            content: strongContent ? node.literal.toUpperCase() : node.literal
          };
        },
      }
    });
    // @ts-ignore
    this.props?.onEditorInstance?.(this.editorInst)
  }

  render() {
    return <Style ref={this.rootEl} />;
  }
}


const Style = styled.div`
  width: 100%;
  .toastui-editor-contents{
    font-family: auto !important;
  }
  .toastui-editor-contents ol li, .toastui-editor-contents ul li {
    display: flex;
  }
`

function videoPlugin() {
  const toHTMLRenderers = {
    video(node) {
      return [
        { type: 'openTag', tagName: 'iframe', outerNewLine: true, attributes: {
          src: node.literal,
          'scrolling': 'no',
          'border': '0',
          'frameborder': 'no',
          'framespacing': '0',
          'height': '400px',
          'width': '600px',
          'allowfullscreen': 'true'
        } },
        { type: 'html', content: "test" },
        { type: 'closeTag', tagName: 'iframe', outerNewLine: true },
        // { type: 'openTag', tagName: 'div' },
        // { type: 'html', content: node.literal },
        // { type: 'closeTag', tagName: 'div' },
      ];
    },
  }

  return { toHTMLRenderers }
}
