import React from 'react';
import  {XBaseDisplay,XBaseDisplayProps} from 'xdcoreweb';

export interface XKityminderEditorProps extends XBaseDisplayProps {
  /**
   * 初始组件成功回调
   */
  onInitFun?: (editor: {}, minder: {}, kityminderEditor: XKityminderEditor) => void,
  /**
   * 菜单列表
   */
  menus?: [{ name: string, click: () => void }]
}

const baseURL = 'xdcore/kityminder-editor/';
/**
 * 功能强大的思维导图编辑组件
 * @name 思维导图
 * @groupName
 */
export default class XKityminderEditor extends XBaseDisplay<XKityminderEditorProps, any> {
  static ComponentName = "思维导图";
  static defaultProps = {
    ...XBaseDisplay.defaultProps,
    onInitFun: undefined,
    menus: [],
  };

  menus?: [{ name: string, click: () => void }];

  constructor(props: XKityminderEditorProps) {
    super(props);
    this.menus = this.props.menus;
  }

  /**
   *iframe对象
   */
  iframe: any;
  /**
   * kityminder editor对象
   */
  editor: any;
  /**
   * kityminder minder对象
   */
  minder: any;

  /**
   *导出json格式数据
   */
  ExportJson() {
    return this.minder ? this.minder.exportJson() : "";
  }

  /**
   * 导出图片文件
   * @param type
   */
  async ExportData(type = "png") {
    return await this.minder ? this.minder.exportData(type) : "";
  }

  /**
   * 导入数据
   * @param list
   * @param nameField 名称字段
   * @param title 根节点名称
   * @param template 布局方式(structure|filetree)
   * @param idField id字段
   * @param pidField pid字段
   */
  ImportList(list: [], nameField: string, title = "组织架构", template = "filetree", idField = "id", pidField = "Parentid") {
    this._importList && this._importList(list, nameField, title, template, idField, pidField);
  };

  /**
   * 设置菜单
   * @param menus
   */
  SetMenus(menus: [{ name: string, click: () => void }]) {
    this.menus = menus;
    this._updateMenu && this._updateMenu(menus);
  }

  private _importList: Function;
  private _updateMenu: (list: [{ name: string, click: () => void }]) => void;

  renderDisplay(): JSX.Element {
    return <iframe ref={e => this.iframe = e} onLoad={(e) => {
      if (this.iframe.contentWindow.pageInit) {
        this.iframe.contentWindow.pageInit(async (editor, minder, UpdateMenu, ImportList) => {
          this.editor = editor;
          this.minder = minder;
          this._updateMenu = UpdateMenu;
          this._importList = ImportList;
          if (this.menus && UpdateMenu) {
            UpdateMenu(this.menus);
          }
          this.props.onInitFun && this.props.onInitFun(editor, minder, this);
        });
      }
    }} width="100%" height="100%" frameBorder={0} src={baseURL + "index.html?edit=0"}></iframe>
  }

}
