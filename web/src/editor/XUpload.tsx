import React, {CSSProperties} from 'react';
import {Button, Upload} from 'antd';
import XBaseEditor, {XBaseEditorProps} from "../base/XBaseEditor";
import XMessage from '../display/XMessage';
import FileUpload, {FileUploadProps} from "./upload/FileUpload";
import XIcon from '../display/XIcon';
import XButton from './XButton';
import XFlex from "../layout/XFlex";
import XGrid from "../layout/XGrid";
import XProgress from "./XProgress";
import XLink from './XLink';
import XNumber from "../toolkit/XNumber"
import CopyFile from "../toolkit/CopyFile";
import XModal from "../layout/XModal";

export interface XUploadProps extends XBaseEditorProps, FileUploadProps {
  /**
   * 显示的文本信息
   */
  text?: string,
  /**
   * 上传url
   */
  uploadUrl?: string,
  /**
   * 下载预览Url
   */
  downloadUrl?: string,
  /**
   * 上传文件类型
   */
  fileType?: 'all' | 'image' | 'excel' | 'pdf' | 'zip' | 'media' | string,
  /**
   * 值是否为base64
   */
  valueIsBase64?: boolean,
  /**
   * 是否可有多选
   */
  isMulti?: boolean,
  /**
   * 是否允许文件夹
   */
  isFolder?: boolean,
  /**
   * 最大文件数量
   */
  maxFileNum?: number,
  /**
   * 最大文件大小
   */
  maxFileSize?: number,
  /**
   * 是否显示上传列表
   */
  showUploadList?: any | boolean,
  /**
   * 上传状态变化的事件
   * @param file
   */
  onChange?: (file?: object | object[]) => void
}

/**
 * 上传图片或文件
 * @name 上传
 * @groupName 输入
 */
export default class XUpload extends XBaseEditor<XUploadProps, any> {
  static ComponentName = "上传";
  static Upload: typeof Upload = Upload;
  static StyleType = {web: 'web', common: 'common'};

  static FileType = {
    all: "",
    image: "image/jpg,image/jpeg,image/png,image/bmp",
    excel: ".xlsm, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    pdf: "text/plain,.pdf",
    zip: ".zip",
    media: "video/*,audio/*",
  }

  static defaultProps = {
    ...XBaseEditor.defaultProps,
    text: "选择文件或ctrl+v粘贴",
    uploadUrl: "",
    downloadUrl: "",
    fileType: XUpload.FileType.all,
    valueIsBase64: false,
    isMulti: true,
    isFolder: false,
    maxFileNum: -1,
    maxFileSize: -1,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      fileList: [],
      fileValues: [],
      value: this.props.value,
    }
    this.state.downloadUrl = this.props.downloadUrl;
    if (!this.state.downloadUrl) {
      let purl = this.props.uploadUrl.split("/")[0];
      this.state.downloadUrl = purl + "/download"
    }
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.state.value) {
      this.SetValue(this.state.value);
    }
  }

  SetValue(value, triggerValueChange = true) {
    if (value == undefined) {
      value = "";
    }
    this.state.fileList = [];
    this.useStateValue = true;
    let fs = this.state.fileValues.join("^_^");
    if (fs != value) {
      // @ts-ignore
      this.state.value = value;
      // @ts-ignore
      this.state.fileValues = value ? value.split('^_^') : [];
      if (this.getFileType() === XUpload.FileType.image && this.state.downloadUrl && this.state.fileValues.length > 0) {
        for (const i in this.state.fileValues) {
          let fileName = this.state.fileValues[i];
          let name = fileName;
          if (fileName.indexOf("|") >= 0) {
            let obj = fileName.split("|");
            name = obj[0];
            fileName = obj[1];
            let f = {
              uid: i,
              name: name,
              fileName: fileName,
              status: 'done',
              url: this.GetServerRootUrl() + "/" + this.state.downloadUrl + "?filename=" + encodeURIComponent(fileName) + "&name=" + encodeURIComponent(name) + "&r=" + new Date().getTime(),
            }
            this.state.fileList.push(f);
          } else if (fileName.startsWith("data:image/png;base64")) {
            let f = {
              uid: i,
              name: "xd",
              fileName: "xd",
              status: 'done',
              thumbUrl: fileName,
            }
            this.state.fileList.push(f);
          }
        }
        this.setState({value: this.state.value, fileList: this.state.fileList, fileValues: this.state.fileValues});
      } else {
        for (const i in this.state.fileValues) {
          let fileName = this.state.fileValues[i];
          let name = fileName;
          if (fileName.indexOf("|") >= 0) {
            let obj = fileName.split("|");
            name = obj[0];
            fileName = obj[1];
            let f = {
              uid: i,
              name: name,
              fileName: fileName,
              status: 'done',
              url: this.GetServerRootUrl() + "/" + this.state.downloadUrl + "?filename=" + encodeURIComponent(fileName) + "&name=" + encodeURIComponent(name) + "&r=" + new Date().getTime(),
            }
            this.state.fileList.push(f);
          }
        }
        this.setState({value: this.state.value, fileList: this.state.fileList, fileValues: this.state.fileValues});
      }
      if (triggerValueChange) {
        this.onValueChangeEvent();
      }
    }
  }

  /**
   * 获取上传文件地址
   */
  GetFileUrl() {
    if (this.state.fileList.length > 0) {
      return this.state.fileList[0].url;
    }
    return undefined;
  }

  handleChange = (info) => {
    this.useStateValue = true;
    let filechanged = false;
    let fileList = info.fileList;
    if (info.file.status == 'uploading') {
    }
    if (info.file.status === 'done') {
      if (fileList.indexOf(info.file) >= 0) {
        XMessage.ShowInfo(`${info.file.name} 文件上传成功`);
      }
      filechanged = true;
    } else if (info.file.status === 'error') {
      XMessage.ShowError(`${info.file.name} 文件上传失败.`);
    } else if (info.file.status === 'removed') {
      if (!this.GetReadOnly()) {
        filechanged = true;
      }
    }
    if (filechanged) {
      let files = [];
      for (const i in fileList) {
        let fs = fileList[i];
        if (fs.response) {
          let vs = fs.response.Value;
          if (vs) {
            for (const j in vs) {
              files.push(fs.name + "|" + vs[j]);
              fs.url = this.GetServerRootUrl() + "/" + this.state.downloadUrl + "?filename=" + encodeURIComponent(vs[j]) + "&name=" + encodeURIComponent(fs.name) + "&r=" + new Date().getTime();
            }
          }
        } else {
          if (fs.fileName) {
            files.push(fs.name + "|" + fs.fileName);
          } else {
            files.push(fs.name);
          }
        }
      }
      this.state.fileValues = files;
      this.state.value = files.join("^_^");
      this.props.onChange && this.props.onChange(files);
      this.onValueChangeEvent();
    }
    this.setState({fileList, fileValues: this.state.fileValues, value: this.state.value});
  }

  beforeUpload(file, sizeFile = "size", isCopy = false) {
    if (this.props.maxFileNum > 0) {
      if (this.props.maxFileNum == 1 && isCopy) {
      } else if (this.state.fileValues.length + 1 > this.props.maxFileNum) {
        XMessage.ShowError('文件数量不能多于' + this.props.maxFileNum + '个');
        return false;
      }
    }
    if (this.props.maxFileSize > 0) {
      const isLt2M = file[sizeFile] / 1024 / 1024 < this.props.maxFileSize;
      if (!isLt2M) {
        XMessage.ShowError('文件大小必须小于' + this.props.maxFileSize + 'MB!');
      }
      return isLt2M;
    }
    return true;
  }

  getButton(uprops) {
    let button = <Button>{XIcon.Upload()} {this.props.text}</Button>;
    if (uprops.listType === 'picture-card') {
      button = (
        <div>
          {XIcon.Add()}
          <div className="ant-upload-text">{this.props.text}</div>
        </div>
      );
    }
    if (this.props.maxFileNum > 0 && this.state.fileList.length >= this.props.maxFileNum) {
      button = null;
    }
    return button;
  }


  getReadOnlyNode() {
    return this.renderEditor();
  }

  getEditorStyle() {
    let style = super.getEditorStyle();
    if (!this.props.editorStyle) {
      style = {...style, overflow: "auto"}
    }
    if (this.state.fileList.length > 0) {
      style = {...style, display: "block"}
    }
    return style;
  }

  async upLoadFiles(files: object[], isCopy = false) {// fileName,fileSize,fileType,thumbnail,file
    this.useStateValue = true;
    let newFiles = [];
    files.forEach(item => {
      if (this.beforeUpload(item, "fileSize", isCopy)) {// @ts-ignore
        newFiles.push({...item, status: "uploading", name: item.fileName});
      }
    });
    if (newFiles.length > 0) {
      this.setState({fileList: [...this.state.fileList, ...newFiles]});
      for (let i = 0; i < newFiles.length; i++) {
        let item = newFiles[i];
        let data = new FormData();
        data.append("file", item.file);
        let result = await this.RequestUploadFile(this.props.uploadUrl, data, true, (e) => {// @ts-ignore
          item.percent = XNumber.accDiv(XNumber.accMul(e.loaded, 100), e.total, 2);
          this.setState({fileList: this.state.fileList});
        });
        if (result?.Success) {// @ts-ignore
          item.status = "done";
          item.fileName = result.Value[0];
          item.url = this.GetServerRootUrl() + "/" + this.state.downloadUrl + "?filename=" + encodeURIComponent(item.fileName) + "&name=" + encodeURIComponent(item.name) + "&r=" + new Date().getTime();
          if (isCopy && this.props.maxFileNum == 1) {
            this.state.fileList = [item];
          }
          let fileValues = [];
          this.state.fileList.forEach(item => {
            if (item.status == "done") {
              fileValues.push(item.name + "|" + item.fileName);
            }
          })
          this.state.fileValues = fileValues;
          this.state.value = fileValues.join("^_^");
          this.props.onChange && this.props.onChange(files);
          this.onValueChangeEvent();
          this.setState({fileList: this.state.fileList, fileValues: this.state.fileValues, value: this.state.value});
        } else {
          item.status = "error";
          this.setState({fileList: this.state.fileList});
        }
      }
    }
  }

  getFileType() {
    let fileType = this.props.fileType;
    if (XUpload.FileType[fileType]) {
      fileType = XUpload.FileType[fileType];
    }
    return fileType;
  }

  deleteFile(index) {
    let fileList = this.state.fileList;
    let fileValues = this.state.fileValues;
    fileList.splice(index, 1);
    fileValues.splice(index, 1);
    this.setState({fileList, fileValues})
  }

  renderMobileImage(fileType) {
    let width = 80;
    let style: CSSProperties = {
      width: width, height: width, display: 'flex', position: "relative",
      border: '1px dashed #DCDCDC', justifyContent: 'center', alignItems: 'center'
    };
    return <XGrid columnsTemplate={["1fr", "1fr", "1fr"]} columnGap={"5px"} rowGap={"5px"} paddingTRBL={"5px 0px"}>
      {this.state.fileList.map((item, index) => {
        if (item.status == "uploading" && item.percent != 100) {
          return <div style={style}>
            <XProgress boxStyle={{width: width, height: 15, marginTop: -15}} percent={item.percent ? item.percent : 0}
                       cellStyleType={"mobile"} styleType={"common"} text={() => ""}/>
          </div>
        }
        let url = this.GetServerRootUrl() + "/" + this.state.downloadUrl + "?filename=" + encodeURIComponent(item.fileName) + "&name=" + encodeURIComponent(item.name);
        return <div style={style}>
          <img src={url} style={{maxWidth: width - 5, maxHeight: width - 5,}}/>
          <XIcon.Close style={{position: "absolute", right: 0, top: 0}} color={"red"} width={18}
                       onClick={() => this.deleteFile(index)}/>
        </div>
      })}
      <FileUpload multiple={this.props.isMulti} accept={fileType}
                  {...this.props} onChange={(files) => {
        this.upLoadFiles((files instanceof Array) ? files : [files]);
      }}>
        <div style={style}><XIcon.Plus/></div>
      </FileUpload>
    </XGrid>
  }

  renderMobileFile(fileType) {
    return <XFlex flexDirection={"row"} alignItems={"center"} justifyContent={"left"}>
      <FileUpload multiple={this.props.isMulti} accept={fileType}
                  {...this.props} onChange={(files) => {
        this.upLoadFiles((files instanceof Array) ? files : [files]);
      }}>
        <XButton icon={<XIcon.Upload/>} text={"选择上传文件"}/>
      </FileUpload>
      {this.state.fileList.map((item, index) => {
        let style = {color: item.status === "error" ? "red" : undefined}
        return <XGrid rowsTemplate={["30px", "5px"]} height={"auto"}>
          <XGrid columnsTemplate={["1fr", "auto"]}>
            <XLink boxStyle={style} icon={item.status == "uploading" ? <XIcon.LoadingOutlined/> :
              <XIcon.TagOutlined {...style}/>} onClick={() => {
              if (item.status != "uploading") {
                let url = this.GetServerRootUrl() + "/" + this.state.downloadUrl + "?filename=" + encodeURIComponent(item.fileName) + "&name=" + encodeURIComponent(item.name) + "&r=" + new Date().getTime();
                window.open(url)
              }
            }}>{item.name}</XLink>
            <XIcon.Close {...style} width={18} onClick={() => this.deleteFile(index)}/>
          </XGrid>
          {item.status == "uploading" && item.percent != 100 &&
            <XProgress boxStyle={{height: 15, marginTop: -15}} percent={item.percent ? item.percent : 0}
                       cellStyleType={"mobile"} styleType={"common"} text={() => ""}/>}
        </XGrid>
      })}
    </XFlex>;
  }

  async copyFile(file, src) {
    await this.upLoadFiles([{file: file, fileName: file.name, fileSize: file.size, size: file.size}], true);
  }

  renderEditor() {
    let fileType = this.getFileType();
    let isImg = fileType == XUpload.FileType.image;
    if (this.GetStyleType() === XUpload.StyleType.common) {
      if (isImg) {
        return this.renderMobileImage(fileType);
      }
      return this.renderMobileFile(fileType);
    }
    let style: any = {};
    const {gathertoken} = this.GetGatherData();
    let showUploadList = this.props.showUploadList;
    if (this.GetReadOnly() && showUploadList !== false) {
      if (showUploadList === undefined) {
        showUploadList = {};
      }
      showUploadList.showRemoveIcon = false;
    }
    let pic: any = {};
    if (isImg) {
      pic.listType = 'picture-card'; //picture
    }
    pic.accept = fileType;
    let uprops = {
      action: this.GetServerRootUrl() + "/" + this.props.uploadUrl,
      data: {
        gathertoken: gathertoken,
      },
      onChange: this.handleChange.bind(this),
      multiple: this.props.isMulti,
      showUploadList: showUploadList,
      onPreview: (file) => {
        if (this.getFileType() === XUpload.FileType.image) {
          let url = file.url || file.thumbUrl;
          if (url && !url.toLowerCase().startsWith("data:image")) {
            url += "&isImage=true";
          }
          let Ele = <img style={{width: "100%", cursor: "pointer"}} src={url} onClick={() => window.open(url)}/>
          XModal.ModalShow("图片预览", undefined, Ele, '520px', null, () => [], true);
        } else {
          window.open(file.url);
        }
      },
      beforeUpload: (file) => this.beforeUpload(file),
      ...pic,
    };
    if (this.props.maxFileNum === 1) {
      uprops.multiple = false;
    }
    return <CopyFile onFile={(file, src) => this.copyFile(file, src)}
                     readOnly={this.GetReadOnly()} onlyCopyImage={isImg}>
      <Upload {...uprops} style={style} fileList={this.state.fileList}>
        {this.GetReadOnly() ? "" : this.getButton(uprops)}
      </Upload>
    </CopyFile>
  }

}

