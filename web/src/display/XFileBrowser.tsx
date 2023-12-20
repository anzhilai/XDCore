import React from "react";
import PropTypes from 'prop-types';
import {Tag, Upload} from "antd";
import  {XBaseDisplay,XBaseDisplayProps,XModal,XMessage,XVideo,XDate, XIcon,XGrid,XDnd} from "xdcoreweb";

import TargetBox from "./chonky/TargetBox";
import SelectableBox from "./chonky/SelectableBox";
import {GetList, HiddenContainer, TargetGuide} from "./chonky/actions";
import GetzhI18n from "./chonky/XFileBrowser.zh";

let init = false;
function setChonkyDefaults(chonky, chonkyIconFontawesome) {
  if (!init) {
    init = true;
    let {setChonkyDefaults} = chonky;
    let {ChonkyIconFA} = chonkyIconFontawesome;
    setChonkyDefaults({
      iconComponent: ChonkyIconFA,//设置默认图标
    });
  }
}

export interface XFileBrowserProps extends XBaseDisplayProps {
  /**
   * 服务器保存地址
   */
  saveUrl?: string,
  /**
   * 服务器上传地址
   */
  uploadUrl?: string,
  /**
   * 服务器下载地址
   */
  downloadUrl?: string,
  /**
   * 服务器移动地址
   */
  moveUrl?: string,
  /**
   * 服务器删除地址
   */
  deleteUrl?: string,
  /**
   * 服务器预览地址
   */
  previewUrl?: string,

  /**
   * 字段定义
   */
  fields?: {
    idField?: string,
    parentidField?: string,
    nameField?: string,
    pathField?: string,
    createUserField?: string,
    updateTimeField?: string,
    sizeField?: string,
    lockField?: string,
    orderField?: string,
    typeField?: string,
  },

  /**
   * 编辑文件夹事件
   */
  editFoldEvent?: (file?: {}) => void,
  /**
   * 编辑文件事件
   */
  editFileEvent?: (file?: {}, isDocument?: boolean) => void,
  /**
   * 编辑文件权限事件
   */
  editShareEvent?: (file: {}) => void,
  /**
   * 删除文件事件
   */
  deleteFileEvent?: (files: []) => void,
  /**
   * 打开文件夹事件
   */
  openFileEvent?: (file: {}) => Promise<boolean>,
  /**
   * 移动文件事件
   */
  moveFileEvent?: (ids: [], targetId: string) => void,
  /**
   * 下载文件事件
   */
  downloadFilesEvent?: (files: []) => void,
  /**
   * 文件地址集
   */
  folderChain?: any[],
  /**
   * 可选择
   */
  selectable?: boolean,
  /**
   * 可拖拽
   */
  draggable?: boolean,
  /**
   * 可删除
   */
  droppable?: boolean,
  /**
   * 只读
   */
  readOnly?: boolean,
  /**
   * 是否存在右键菜单
   */
  hasFileContextMenu?: boolean,
  /**
   * 右上角扩展按钮
   */
  extraButtons: undefined,
}

/**
 * 仿Windows文件管理器
 * @name 文件浏览
 * @groupName
 */
export default class XFileBrowser extends XBaseDisplay<XFileBrowserProps, any> {
  static ComponentName = "文件浏览";
  static ItemType = {文件: "文件", 文件夹: "文件夹"}

  static defaultProps = {
    ...XBaseDisplay.defaultProps,
    fields: {
      idField: "id",
      parentidField: "Parentid",
    },
    selectable: true,
    draggable: true,
    droppable: true,
    readOnly: false,
    hasFileContextMenu: true,
    folderChain: [{id: "0", _id: "", name: '首页', isDir: true}],
  };

  storageFileViewActionId: string;
  selectedFiles: any;

  constructor(props) {
    super(props);
    this.state.folderChain = this.props.folderChain;
    this.storageFileViewActionId = localStorage.getItem("file-view-action-id")
    if (this.storageFileViewActionId && this.storageFileViewActionId == "grid_view") {
      this.state.gridView = true;
    } else {
      this.state.gridView = false;
    }
    this.state.saveUrl = this.props.saveUrl;
    this.state.uploadUrl = this.props.uploadUrl;
    this.state.downloadUrl = this.props.downloadUrl;
    this.state.moveUrl = this.props.moveUrl;
    this.state.deleteUrl = this.props.deleteUrl;
    this.state.previewUrl = this.props.previewUrl;
    if (this.props.dataSourceUrl) {
      const pre = this.props.dataSourceUrl.split("/")[0];
      if (!this.state.saveUrl) {
        this.state.saveUrl = pre + "/save"
      }
      if (!this.state.uploadUrl) {
        this.state.uploadUrl = pre + "/upload";
      }
      if (!this.state.downloadUrl) {
        this.state.downloadUrl = pre + "/download";
      }
      if (!this.state.moveUrl) {
        this.state.moveUrl = pre + "/move";
      }
      if (!this.state.deleteUrl) {
        this.state.deleteUrl = pre + "/delete";
      }
      if (!this.state.previewUrl) {
        this.state.previewUrl = pre + "/preview";
      }
    }
  }

  async componentDidMount() {
    super.componentDidMount();
    const chonky = await import(/* webpackChunkName: "tChonky" */ 'chonky');
    const chonkyIconFontawesome = await import(/* webpackChunkName: "tChonky" */ 'chonky-icon-fontawesome');
    setChonkyDefaults(chonky, chonkyIconFontawesome);//设置图标
    const ReactDnd = await XDnd.GetReactDnd();
    const ReactDndHtml5Backend = await XDnd.GetReactDndHtml5Backend();
    this.setState({chonky, chonkyIconFontawesome, ReactDnd, ReactDndHtml5Backend})
    if (this.state.data > 0) {
      this.SetData(this.state.data);
    } else if (this.props.dataSourceUrl) {
      this.Refresh();
    }
  }

  formatData(data) {
    let {ChonkyIconName} = this.state.chonky;
    let files = [];
    if (data) {
      data.forEach(item => {
        let _item = {
          id: item[this.props.fields.idField],
          name: item[this.props.fields.nameField],
          modDate: XDate.ToDate(item[this.props.fields.updateTimeField]),
          size: item[this.props.fields.sizeField] || null,
          isDir: item[this.props.fields.typeField] === "文件夹",
          isFile: item[this.props.fields.typeField] === "文件",
          selectable: this.props.selectable,
          draggable: this.props.draggable && (item[this.props.fields.lockField] !== "是"),
          droppable: this.props.droppable && item[this.props.fields.typeField] === "文件夹",
          color: item[this.props.fields.nameField] == "回收站" && item.Parentid == "0" ? "rgb(205,201,201)" : item[this.props.fields.lockField] == "是" ? "rgb(5,134,253)" : "rgb(238,173,14)",
          isEncrypted: item[this.props.fields.lockField] == "是",
          // ext?: string;
          // isHidden?: boolean;
          // isSymlink?: boolean;
          // openable?: boolean;
          // dndOpenable?: boolean;
          // childrenCount?: number;
          // icon?: ChonkyIconName | string | any;
          // thumbnailUrl?: string;
          // folderChainIcon?: Nullable<ChonkyIconName | string | any>;
          ...item,
        };
        if (!_item.isDir && !_item.isFile) {
          _item.icon = ChonkyIconName.excel;
        }
        files.push(_item);
      });
    }
    return files;
  }


  //行为列表
  getFileActions(): any {
    let {
      ListView,
      SortFilesByNumber,
      GridView,
      DocumentCreate,
      UploadFile,
      EditItem,
      FolderCreate,
      FileShare,
      Refresh,
    } = GetList(this.state.chonky);
    let {ChonkyActions,} = this.state.chonky;
    let 编辑权限 = !this.props.readOnly;
    let c = [DocumentCreate, UploadFile, FolderCreate]
    let e = [EditItem, ChonkyActions.DeleteFiles,]
    if (this.props.editShareEvent) {// @ts-ignore
      c.push(FileShare);
    }
    return [
      GridView,
      ListView,
      ...(编辑权限 ? c : []),
      ...(编辑权限 ? e : []),
      ChonkyActions.OpenSelection,
      ChonkyActions.DownloadFiles,
      SortFilesByNumber,
      Refresh
    ]
  }

  //排除默认行为列表
  getDisableDefaultFileActions() {
    let {ChonkyActions,} = this.state.chonky;
    return [
      ChonkyActions.EnableListView.id,
      ChonkyActions.EnableGridView.id,
      ChonkyActions.OpenSelection.id,
    ]
  }

  //已打开的文件夹路径
  folderChainHandler = (data, callback) => {
    if (data) {
      let folderChain = [...this.state.folderChain];
      const index = folderChain.findIndex(item => item.id == data.id)
      if (index < 0) {
        folderChain.push(data)
      } else {
        folderChain.length = index + 1;
      }
      this.setState({folderChain}, () => {
        callback && callback()
      })
    }
  }

  folderChainRemove = (id, callback) => {
    if (id) {
      let folderChain = [...this.state.folderChain];
      const index = folderChain.findIndex(item => item.id == id)
      if (index >= 0) {
        folderChain.splice(index, 1)
      }
      this.setState({folderChain}, () => {
        callback && callback()
      })
    }
  }

  /**
   * 设置显示路径
   * @param folderChain
   */
  SetFolderChain(folderChain:[]) {
    this.setState({folderChain: folderChain})
  }

  /**
   * 重置文件路径
   */
  ResetFolderChain() {
    this.setState({folderChain: [this.state.folderChain[0]]})
  }

  //处理行为事件
  handleFileAction = async (data) => {
    let {
      ListView, GridView, DocumentCreate, UploadFile, EditItem, FolderCreate, FileShare, Refresh,
    } = GetList(this.state.chonky);
    let {ChonkyActions,} = this.state.chonky;
    if (data.id === ChonkyActions.OpenFiles.id) { //打开文件
      if (data?.payload?.targetFile || data?.payload?.files?.length > 0) {
        const file = data.payload.targetFile || data.payload.files[0];
        if (file.isDir) {
          this.folderChainHandler(file, undefined);
          this.Refresh({Parentid: file._id != undefined ? file._id : file.id});
        } else {
          let isOpen = false;
          if (this.props.openFileEvent) {
            isOpen = await this.props.openFileEvent(file);
          }
          if (!isOpen) {
            if (file.name && file.name.split(".").pop?.()) {
              const type = file.name.split(".").pop()
              //如果是视频格式
              if (type == "mp4" || type == "rmvb" || type == "wmv" || type == "mkv" || type == "mov" || type == "3gp" || type == "mpg" || type == "mpeg" || type == "webm" || type == "ogv") {
                // @ts-ignore
                let url = this.GetServerRootUrl() + "/" + this.state.previewUrl + "/" + file[this.props.fields.pathField].split('|')[1];
                XModal.ModalShow("视频播放", async () => true,
                  <XVideo urlList={[url]}/>, '800px', null, (f) => f[1], true);
              }
              //如果是图片格式
              else if (type == "jpg" || type == "png" || type == "jpeg" || type == "bmp" || type == "gif") {
                // @ts-ignore
                let url = `${window.config.hServer}/download_file?filename=${file[this.props.fields.pathField].split('|')[1]}&isImage=true`;
                XModal.ModalShow("图片查看", async () => true, <img style={{maxWidth: "100%"}}
                                                                    src={url}/>, '400px', null, (f) => f[1], true);
              } else {
                let baseUrl = this.GetServerRootUrl();
                if (!baseUrl) {
                  baseUrl = window.location.origin;
                } else if (!baseUrl.toLowerCase().startsWith("http://") && !baseUrl.toLowerCase().startsWith("https://")) {
                  baseUrl = window.location.origin + baseUrl;
                }
                window.open(baseUrl + "/" + this.state.previewUrl + "/" + file[this.props.fields.pathField].split("|")[1]);
              }
            }
          }
        }
      }
    } else if (data.id === ChonkyActions.ChangeSelection.id) {//选择文件
      let selectedFiles = [];
      if (data?.state?.selectedFiles?.length > 0) {
        selectedFiles = data.state.selectedFiles
      }
      this.selectedFiles = selectedFiles;
    } else if (data.id === FolderCreate.id) {  //新建文件夹
      if (this.props.editFoldEvent) {
        this.props.editFoldEvent();
      }
    } else if (data.id === FileShare.id) {  //文件权限
      if (data?.state?.selectedFiles?.length > 0) {
        const file = data.state.selectedFiles[0]
        if (!file.isEncrypted) {
          if (this.props.editShareEvent) {
            this.props.editShareEvent(file);
          }
        } else {
          XMessage.ShowWarn("不可编辑!")
        }
      }
    } else if (data.id === UploadFile.id) { //上传文件
      if (this.props.editFileEvent) {
        this.props.editFileEvent(null, true);
      }
    } else if (data.id === DocumentCreate.id) { //上传文件
      if (this.props.editFileEvent) {
        this.props.editFileEvent(null, false);
      }
    } else if (data.id === ChonkyActions.DeleteFiles.id) { //删除文件
      if (data?.state?.selectedFiles?.length > 0) {
        const files = data.state.selectedFiles
        if (this.props.deleteFileEvent) {
          this.props.deleteFileEvent(files);
        } else {
          const unlockfiles = files.filter(item => !item.isEncrypted);
          const lockfiles = files.filter(item => item.isEncrypted);
          if (unlockfiles.length > 0) {
            XModal.Confirm("是否确认删除以下项?", () => {
                this.deleteItems(unlockfiles.map(item => item.id));
                return true
              },
              <div>
                <div style={{color: 'green'}}> 将删除:</div>
                <i>{unlockfiles.map(item => item.name).join(",")}</i><br/>
                {lockfiles.length > 0 && <>
                  <div style={{color: 'red'}}>
                    无法删除(内置):
                  </div>
                  {lockfiles.map(item => item.name).join(",")}
                </>}
              </div>)
          } else {
            XMessage.ShowWarn("锁定文件不可删除!")
          }
        }
      }
    } else if (data.id === EditItem.id) { //编辑文件
      if (data?.state?.selectedFiles?.length > 0) {
        const file = data.state.selectedFiles[0]
        if (!file.isEncrypted) {
          if (file.isDir) {
            if (this.props.editFoldEvent) {
              this.props.editFoldEvent(file);
            }
          } else {
            if (this.props.editFileEvent) {
              this.props.editFileEvent(file);
            }
          }
        } else {
          XMessage.ShowWarn("不可编辑!")
        }
      }
    } else if (data.id === ChonkyActions.DownloadFiles.id) { //下载文件
      if (data?.state?.selectedFiles?.length > 0) {
        const files = data.state.selectedFiles
        if (this.props.downloadFilesEvent) {
          this.props.downloadFilesEvent(files);
        } else {
          const 文件或文件夹 = files.filter(item => item.isFile || item.isDir);
          const 非文件 = files.filter(item => !item.isFile && !item.isDir);
          if (文件或文件夹.length > 0) {
            XModal.Confirm("将下载以下项?", () => {
                this.downloadItems(文件或文件夹.map(item => item.id));
                return true
              },
              <div>
                <div style={{color: 'green'}}> 将{文件或文件夹.length > 1 && "打包"}下载:</div>
                <i>{文件或文件夹.map(item => <Tag>{item.name}</Tag>)}</i><br/>
                {非文件.length > 0 && <>
                  <div style={{color: 'red'}}>
                    无法下载(不是文件或文件夹):
                  </div>
                  {非文件.map(item => <Tag>{item.name}</Tag>)}
                </>}
              </div>)
          } else {
            XMessage.ShowWarn("无选中可下载文件!")
          }
        }
      }
    } else if (data.id === ChonkyActions.MoveFiles.id) {
      if (data?.payload?.destination && data?.payload?.files?.length > 0) {
        const files = data.payload.files;
        const targetFile = data.payload.destination;
        if (this.props.moveFileEvent) {
          this.props.moveFileEvent(files.map(file => file.id), targetFile.id);
        } else {
          this.moveItems(files.map(file => file.id), targetFile.id);
        }
      }
    } else if (data.id === Refresh.id) {
      this.Refresh();
    } else if (data.id === GridView.id) {
      this.setState({gridView: true})
      localStorage.setItem("file-view-action-id", GridView.id);
    } else if (data.id === ListView.id) {
      this.setState({gridView: false})
      localStorage.setItem("file-view-action-id", ListView.id);
    }
  }

  thumbnailGenerator(file: any) {//图片处理
    if (file[this.props.fields.typeField] && file[this.props.fields.typeField] != "文件" && file[this.props.fields.typeField] != "文件夹") {
      return `/image/${file[this.props.fields.typeField]}.png`
    }
    return file.thumbnailUrl ? `https://chonky.io${file.thumbnailUrl}` : null;
  }

  //通过ids执行下载文件
  async downloadItems(ids) {
    this.DownloadFile(this.state.downloadUrl, {
      ids,
      ...this.GetFilterData(),
    });
  }

  //通过ids执行删除文件
  async deleteItems(ids) {
    const result = await this.RequestServerPost(this.state.deleteUrl, {ids})
    if (result.Success) {
      XMessage.ShowInfo("删除成功!");
      this.Refresh();
    }
  }

  //通过ids执行移动文件
  async moveItems(ids, targetId) {
    const result = await this.RequestServerPost(this.state.moveUrl, {ids, targetId})
    if (result.Success) {
      XMessage.ShowInfo("移动成功!");
      this.Refresh();
    }
  }

  uploader: any;
  fileBrowser: any;

  renderDisplay() {
    if (!this.state.ReactDnd) {
      return <div></div>
    }
    let {ListView, SortFilesByNumber,} = GetList(this.state.chonky);
    let {FileBrowser, FileList, FileContextMenu, FileToolbar, FileNavbar,} = this.state.chonky;
    return <HiddenContainer>
      <SelectableBox throttlingTime={100} disabledOnElements openMoveChange
                     container={() => this.state.gridView ?? true ?
                       document.querySelector(`.chonky-gridContainer`) :
                       document.querySelector(`div[class^="listContainer-"]`)
                     } items={() => this.state.gridView ?? true ?
        document.querySelectorAll(`div[class^="gridFileEntry-"]`) :
        document.querySelectorAll(`div[class^="listFileEntry-"]`)
      } dataHook={'data-chonky-file-id'}
                     onSelectionChange={(datas) => {
                       // this.fileBrowser.requestFileAction(ChonkyActions.ClearSelection)
                       this.fileBrowser?.setFileSelection(datas, true)
                     }}>
        <TargetBox ReactDnd={this.state.ReactDnd} ReactDndHtml5Backend={this.state.ReactDndHtml5Backend}
                   onDrop={(item) => {
                     if (!this.props.readOnly) {
                       if (item) {
                         const files = item.files
                         if (files && files.length > 0) {
                           const {gathertoken} = this.GetGatherData();
                           const props = {
                             action: this.GetServerRootUrl() + "/" + this.state.uploadUrl,
                             multiple: true,
                             data: {gathertoken: gathertoken,},
                             showUploadList: {
                               showRemoveIcon: true,
                               removeIcon: XIcon.CloseOutlined({onClick: e => console.log(e, 'custom removeIcon event')}),
                             },
                             onChange: (filedata) => {
                             }
                           }
                           XModal.ModalShow("上传", async () => {
                             const data = {
                               ...this.GetFilterData(),
                               [this.props.fields.typeField]: '文件'
                             };
                             if (this?.uploader?.fileList) {
                               const uploading = this?.uploader?.fileList.some(item => item.status == "uploading")
                               if (uploading) {
                                 XMessage.ShowWarn("文件正在上传中,请等待上传完成...")
                                 return false
                               }
                               for (let item of this?.uploader?.fileList) {
                                 if (item.response && item.response.Success) {
                                   await this.RequestServerPost(this.state.saveUrl, {
                                     ...data,
                                     [this.props.fields.nameField]: item.name,
                                     [this.props.fields.pathField]: item.name + "|" + item.response?.Value[0]
                                   })
                                 }
                               }
                               this.Refresh()
                             }
                             return true
                           }, <Upload ref={e => this.uploader = e} {...props} />, "600px", null)
                           setTimeout(() => {
                             this?.uploader?.upload?.uploader?.uploadFiles?.(files)
                           }, 100);
                         }
                       }
                     }
                   }}>
          {
            this.state.loading && <>
              <div style={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                zIndex: 9998,
                backgroundColor: 'black',
                opacity: 0.5,
                left: '0px',
                top: '0px'
              }}/>
              <div style={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                zIndex: 9999,
                left: '0px',
                top: '0px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                fontSize: '24px'
              }}>
                <div style={{marginBottom: '200px'}}>加载中......</div>
              </div>
            </>
          }

          <FileBrowser
            files={this.formatData(this.state.data)}
            ref={e => this.fileBrowser = e}
            folderChain={this.state.folderChain}// @ts-ignore
            fileActions={this.getFileActions()}
            onFileAction={this.handleFileAction}
            disableDefaultFileActions={this.getDisableDefaultFileActions()}
            defaultFileViewActionId={this.storageFileViewActionId || ListView.id}
            defaultSortActionId={SortFilesByNumber.id}
            thumbnailGenerator={this.thumbnailGenerator}
            // disableDragAndDropProvider
            i18n={GetzhI18n(this.state.chonky)}>
            {!this.state.gridView && <TargetGuide/>}
            <XGrid columnsTemplate={["1fr", "auto"]} height={"auto"}>
              <FileNavbar/>
              <div>{this.props.extraButtons}</div>
            </XGrid>
            <FileToolbar
              // onSearch={value => {
              //   if (this.prevParentid) {
              //     const diff = value != this.prevSearch
              //     this.prevSearch = value
              //     if (diff && value) {
              //       this.searchData(this.prevParentid, value)
              //     } else if (diff) {
              //       this.Refresh({Parentid: this.prevParentid});
              //     }
              //   }
              // }}
            />
            <FileList/>
            <div className={"unzoom"}>
              {this.props.hasFileContextMenu && <FileContextMenu/>}
            </div>
          </FileBrowser>
        </TargetBox>
      </SelectableBox>
    </HiddenContainer>
  }
}

