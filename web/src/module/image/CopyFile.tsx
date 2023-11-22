import React, {Component, CSSProperties} from "react";

export interface CopyFileState {
}

export interface CopyFileProps {
  children?: React.ReactNode,
  readOnly?: boolean,
  onlyCopyImage?: boolean;
  onFile: (file: File, src: string) => void;
}

export default class CopyFile extends Component<CopyFileProps, CopyFileState> {
  static defaultProps = {
    onlyCopyImage: true,
    readOnly: false,
  };

  container: Element;
  declare state: any;

  constructor(props: CopyFileProps) {
    super(props);
    this.state = {focus: false};
  }

  pasteHandler = (e: ClipboardEvent) => {
    let data = e.clipboardData;
    data && this.handlerFiles(data.items);
  }

  dropHandler = (e) => {
    const dt = e.dataTransfer;
    const files = [];
    for (let i = 0; i < dt.files.length; i++) {
      let file = dt.files[i];
      files.push({type: file.type, file: file});
    }
    files.length > 0 && this.handlerFiles(files, true);
    this.dragOver(e);
  }

  dragOver(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  async handlerFiles(items, isDrop = false) {
    if (this.props.readOnly || (!isDrop && this.state.focus === false)) {
      return;
    }
    let acceptedFiles = ["image/gif", "image/png", "image/jpeg", "image/bmp"];
    for (let i = 0; i < items.length; i++) {
      if (!this.props.onlyCopyImage || acceptedFiles.includes(items[i].type)) {
        let file = items[i].file ? items[i].file : items[i].getAsFile();
        if (file && this.props.onFile) {
          await this.props.onFile(file, window.URL.createObjectURL(file));
        }
      }
    }
  }

  clickBody = () => {
    if (!this.props.readOnly) {
      this.setState({focus: false})
    }
  }

  componentDidMount() {
    this.container.addEventListener("drop", this.dropHandler, false);
    this.container.addEventListener("dragenter", this.dragOver, false);
    this.container.addEventListener("dragover", this.dragOver, false);
    window.addEventListener("paste", this.pasteHandler);
    window.addEventListener("click", this.clickBody);
  }

  componentWillUnmount() {
    this.container.removeEventListener("drop", this.dropHandler);
    this.container.removeEventListener("dragenter", this.dragOver);
    this.container.removeEventListener("dragover", this.dragOver);
    window.removeEventListener("paste", this.pasteHandler);
    window.removeEventListener("click", this.clickBody);
  }

  render() {
    let style = {border: "1px solid transparent",display:"flex",alignItems:"center", width: "100%", height: "100%", cursor: "pointer"};
    if (this.state.focus) {
      style.border = "1px solid #0586FD";
    }
    let title = this.props.readOnly ? "" : ("点击后可(ctrl+v)复制" + (this.props.onlyCopyImage ? "图片" : "文件"));
    return <div ref={e => this.container = e} style={style} title={title} onClick={e => {
      if (!this.props.readOnly) {
        e.stopPropagation();
        this.setState({focus: true})
      }
    }}>
      {this.props.children}
    </div>;
  }
}
