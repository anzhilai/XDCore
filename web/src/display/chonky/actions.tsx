//按列表显示 行为组件
import styled from "styled-components";
import {XTools} from "xdcoreweb";

let toBodyZoom = XTools.toBodyZoom;

export function GetList(chonky) {
  let {ChonkyIconName, defineFileAction, FileViewMode} = chonky;
  const ListView = {
    id: "list_view",
    fileViewConfig: {
      mode: FileViewMode.List,
      entryHeight: toBodyZoom(40)
    },
    button: {
      name: "Switch to List view",
      toolbar: true,
      icon: ChonkyIconName.list,
      iconOnly: true
    }
  }

  const GridView = {
    id: "grid_view",
    fileViewConfig: {
      mode: FileViewMode.Grid,
      entryWidth: toBodyZoom(102),
      entryHeight: toBodyZoom(110),
    },
    button: {
      name: "Switch to Grid view",
      toolbar: true,
      icon: ChonkyIconName.smallThumbnail,
      iconOnly: true
    }
  }

//创建资料 行为组件
  const FileCreate: any = defineFileAction({
    id: 'create_file',
    hotkeys: ["insert"],
    button: {
      name: "上传文件",
      tooltip: "上传文件",
      toolbar: true,
      contextMenu: true,
      iconOnly: true,
      icon: ChonkyIconName.excel,
      group: 'Actions'
    }
  })

//创建文件夹 行为组件
  const FolderCreate: any = defineFileAction({
    id: 'create_folder',
    hotkeys: ["ctrl+d"],
    button: {
      name: "新增文件夹",
      tooltip: "新增文件夹",
      toolbar: true,
      contextMenu: true,
      iconOnly: true,
      icon: ChonkyIconName.folderCreate,
      group: '新增'
    }
  })

//创建资料 行为组件
  const DocumentCreate: any = defineFileAction({
    id: 'create_document',
    hotkeys: ["insert"],
    button: {
      name: "新增资料",
      tooltip: "新增资料",
      toolbar: true,
      contextMenu: true,
      iconOnly: true,
      icon: ChonkyIconName.excel,
      group: '新增'
    }
  })

//上传文件 行为组件
  const UploadFile: any = defineFileAction({
    id: 'upload_file',
    hotkeys: ["ctrl+u"],
    button: {
      name: "上传文件",
      tooltip: "上传文件",
      toolbar: true,
      contextMenu: true,
      iconOnly: true,
      icon: ChonkyIconName.upload,
      group: '新增'
    }
  })

//编辑 行为组件
  const EditItem: any = defineFileAction({
    id: 'edit_item',
    hotkeys: ["ctrl+e"],
    requiresSelection: true,
    button: {
      name: "编辑首选中项",
      tooltip: "编辑首选中项",
      toolbar: true,
      contextMenu: true,
      iconOnly: true,
      icon: ChonkyIconName.config,
      group: 'Actions'
    }
  })

//编辑 行为组件
  const Refresh: any = defineFileAction({
    id: 'refresh',
    hotkeys: ["ctrl+R"],
    button: {
      name: "刷新",
      tooltip: "刷新",
      toolbar: true,
      contextMenu: true,
      iconOnly: true,
      icon: ChonkyIconName.loading,
      group: 'Actions'
    }
  })


  const FileLog: any = defineFileAction({
    id: 'FileLog',
    requiresSelection: true,
    button: {
      name: "历史记录",
      tooltip: "历史记录",
      toolbar: true,
      contextMenu: true,
      iconOnly: true,
      icon: ChonkyIconName.archive,
      group: 'Actions'
    }
  })

  const FileShare: any = defineFileAction({
    id: 'FileShare',
    requiresSelection: true,
    button: {
      name: "文件权限",
      tooltip: "文件权限",
      toolbar: true,
      contextMenu: true,
      iconOnly: true,
      icon: ChonkyIconName.share,
      group: 'Actions'
    }
  })


  const SortFilesByNumber: any = defineFileAction({
    id: 'sort_files_by_number',
    sortKeySelector: (file) => file.order,
    button: {
      name: "按序号排序",
      toolbar: true,
      group: 'Options'
    }
  })
//创建资料 行为组件
  const ReName: any = defineFileAction({
    id: 'rename',
    hotkeys: [],
    button: {
      name: "重命名",
      tooltip: "重命名",
      toolbar: true,
      contextMenu: true,
      iconOnly: true,
      icon: ChonkyIconName.excel,
      group: 'Actions'
    }
  });
  return {
    TargetGuide,
    HiddenContainer,
    ListView,
    SortFilesByNumber,
    GridView,
    DocumentCreate,
    UploadFile,
    EditItem,
    FolderCreate,
    FileShare,
    FileLog,
    Refresh,
    ReName,
    FileCreate
  }
}

//隐藏grid模式和list模式的滚动条和文件名字超出部分 样式组件
export const HiddenContainer = styled.div`
  width: 100%;
  height: 100%;
  .chonky-gridContainer::-webkit-scrollbar,div[class^="listContainer-"]::-webkit-scrollbar {
    width: 12px;
    -webkit-border-radius: 0px;
  }
  .chonky-gridContainer::-webkit-scrollbar-track,div[class^="listContainer-"]::-webkit-scrollbar-track {
    -webkit-border-radius: 0px;
  }
  .chonky-gridContainer::-webkit-scrollbar-track-piece,div[class^="listContainer-"]::-webkit-scrollbar-track-piece {
    background-color: rgba(196, 196, 196, 0.2);
    -webkit-border-radius: 0px;
  }
  .chonky-gridContainer::-webkit-scrollbar-thumb:vertical,div[class^="listContainer-"]::-webkit-scrollbar-thumb:vertical {
    background-color: #BDBDBD;
    -webkit-border-radius: 0px;
  }
  .chonky-gridContainer::-webkit-scrollbar-thumb:horizontal,div[class^="listContainer-"]::-webkit-scrollbar-thumb:horizontal {
    background-color: #BDBDBD;
    -webkit-border-radius: 0px;
  }
  .chonky-gridContainer::-webkit-scrollbar-thumb:vertical:hover,div[class^="listContainer-"]::-webkit-scrollbar-thumb:vertical:hover,*::-webkit-scrollbar-thumb:horizontal:hover{
    background-color: rgba(5, 134, 253, 0.6);
  }
  span[class^="gridFileEntryName-"] {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
  }
  .chonky-fileThumbnail{
    background-size: 40%;
  }
  .chonky-chonkyRoot{
    border: none !important;
  }
`


export const TargetGuide = styled.div`
  height: 100%;
  width: 20px;
  position: absolute;
  left: -10px;
  border-radius: 5px;
  &:hover{
    background-color: #c5ebcc82;
    cursor: crosshair;
  }
`
