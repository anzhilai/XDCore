export default function GetzhI18n(chonky) {
  let {ChonkyActions, FileHelper,} = chonky;
  return {
    locale: 'zh',
    defaultLocale: 'zh',
    formatters: {
      formatFileModDate: (intl, file) => {
        const safeModDate = FileHelper.getModDate(file);
        if (safeModDate) {
          return `${intl.formatDate(safeModDate)} ${intl.formatTime(safeModDate)}`;
        } else {
          return null;
        }
      }
    },
    messages: {
      'chonky.toolbar.searchPlaceholder': '搜索当前文件夹',
      'chonky.fileList.nothingToShow': '这里什么都没有!',
      'chonky.actionGroups.新增': '新增',
      "chonky.actions.enable_list_view.button.name": "列表",
      "chonky.actions.enable_grid_view.button.name": "网格",
      [`chonky.actionGroups.Actions`]: '操作',
      [`chonky.actionGroups.Options`]: '显示',
      "chonky.actions.rename.button.name": "重命名",
      "chonky.actions.rename.button.tooltip": "重命名",
      "chonky.actions.create_file.button.name": "上传文件",
      "chonky.actions.create_file.button.tooltip": "上传文件",
      "chonky.actions.create_folder.button.name": "新增文件夹",
      "chonky.actions.create_folder.button.tooltip": "新增文件夹",
      "chonky.actions.refresh.button.name": "刷新",
      "chonky.actions.refresh.button.tooltip": "刷新",
      [`chonky.actions.${ChonkyActions.UploadFiles.id}.button.tooltip`]: '上传文件',
      [`chonky.actions.${ChonkyActions.UploadFiles.id}.button.name`]: '上传文件',
      [`chonky.actions.${ChonkyActions.SortFilesByName.id}.button.name`]: '按名称排序',
      [`chonky.actions.${ChonkyActions.SortFilesBySize.id}.button.name`]: '按大小排序',
      [`chonky.actions.${ChonkyActions.SortFilesByDate.id}.button.name`]: '按日期排序',
      [`chonky.actions.${ChonkyActions.ToggleHiddenFiles.id}.button.name`]: '显示隐藏项',
      [`chonky.actions.${ChonkyActions.ToggleShowFoldersFirst.id}.button.name`]: '文件夹前置',
      [`chonky.actions.${ChonkyActions.OpenSelection.id}.button.name`]: '打开首选中项',
      [`chonky.actions.${ChonkyActions.DeleteFiles.id}.button.name`]: '删除选中项',
      [`chonky.actions.${ChonkyActions.SelectAllFiles.id}.button.name`]: '全选',
      [`chonky.actions.${ChonkyActions.ClearSelection.id}.button.name`]: '清除选择',
      'chonky.toolbar.visibleFileCount': `{fileCount, plural,
          =0 {空}
          one {共 # 项}
          other {共 # 项}
      }`,
      'chonky.toolbar.selectedFileCount': `{fileCount, plural,
          =0 {}
          one {# 选中}
          other {# 选中}
      }`,
      'chonky.toolbar.hiddenFileCount': `{fileCount, plural,
          =0 {}
          one {# 选中}
          other {# 选中}
      }`,
      'chonky.contextMenu.browserMenuShortcut': '浏览器菜单: {shortcut}',

      // File action translation strings. These depend on which actions you have
      // enabled in Chonky.
      [`chonky.actions.${ChonkyActions.OpenParentFolder.id}.button.name`]: '打开上级文件夹',
      [`chonky.actions.${ChonkyActions.CreateFolder.id}.button.name`]: '新增文件夹',
      [`chonky.actions.${ChonkyActions.CreateFolder.id}.button.tooltip`]: '新增文件夹',
      [`chonky.actions.${ChonkyActions.DownloadFiles.id}.button.name`]: '下载选中项',
    },
  }
}
