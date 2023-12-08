import React, {lazy} from 'react';
//import TGrid from "./toast-ui.grid/src/grid";
// import TGrid from "tui-grid";

// @ts-ignore

import './final/tui-grid.css';
import ReactDOMClient from "react-dom/client";

const reactivePropSetterMap = {
  data: 'resetData',
  columns: 'setColumns',
  bodyHeight: 'setBodyHeight',
  frozenColumnCount: 'setFrozenColumnCount',
};

export class TuiGrid extends React.Component<any, any> {

  constructor(props: any) {
    super(props)
  }

  TGrid: any = null;
  rootEl: any = React.createRef();

  gridInst: any = null;

  bindEventHandlers(props: any, preprops: any) {
    Object.keys(props)
      .filter((key) => /^on[A-Z][a-zA-Z]+/.test(key))
      .forEach((key) => {
        const eventName = key[2].toLowerCase() + key.slice(3);
        this.gridInst?.off(eventName);
        this.gridInst?.on(eventName, props[key]);
      });
  }

  handleAppendRow = () => {
    this.getInstance().appendRow({});
  };

  getInstance() {
    return this.gridInst;
  }

  getRootElement() {
    return this.rootEl.current;
  }

  updateColumns() {
    if (this.rootEl.current) {
      let ths = this.rootEl.current.getElementsByTagName("th");
      this.props.columns.forEach((column: any) => {
        this.setColumn(column, ths);
      });
    }
  }

  setColumn(column: any, ths: any) {
    if (typeof column.header == 'object') {
      for (let i = 0; i < ths.length; i++) {
        if (ths[i].dataset.columnName == column.field) {
          let el = ths[i].children[0];
          if (el) {
            let div = document.createElement('div');
            div.style.display = 'inline-block';
            el.appendChild(div);
            let root = ReactDOMClient.createRoot(div);
            root.render(column.header);
          }
          break;
        }
      }
    }
    if (column.children && column.children.length > 0) {
      column.children.forEach((column: any) => {
        this.setColumn(column, ths);
      });
    }
  }

  componentDidUpdate() {
    this.updateColumns();
  }

  async componentDidMount() {
    const TGrid = await import(/* webpackChunkName: "tgrid" */ './final/tui-grid');
    this.TGrid = TGrid.default;
    if (!this.gridInst) {
      // @ts-ignore
      this.gridInst = new TGrid.default({
        el: this.rootEl.current,
        data: {
          api: {
            readData: {url: '/xdevelop', method: 'GET'}
          }
        },
        scrollX: true,
        scrollY: true,
        selectionUnit: 'cell',
        useClientSort: false,
        bodyHeight: 'fitToParent',
        columnOptions: {
          resizable: true
        },
        keyColumnName: "id",
        treeColumnOptions: {
          name: this.props.treeColumnName,
          useCascadingCheckbox: true,
          useIcon: this.props.useTreeIcon
        },
        ...this.props,
        draggable: this.props.draggable,
        summary: this.props.summary,
        minRowHeight: this.props.minRowHeight,
        rowHeight: 'auto',
        contextMenu: this.props.contextMenu,
        editingEvent: this.props.editingEvent,  //dblclick, click
        isActiveFilterFun: this.props.isActiveFilterFun,
      });
      this.bindEventHandlers(this.props, undefined);
      this.updateColumns();
      this.props.onDidMount && this.props.onDidMount(this);
    }
  }

  shouldComponentUpdate(nextProps: any) {
    // @ts-ignore
    const {oneTimeBindingProps = []} = this.props;
    const reactiveProps = Object.keys(reactivePropSetterMap).filter(
      (propName) => oneTimeBindingProps.indexOf(propName) === -1
    );
    reactiveProps.forEach((propName) => {
      const currentValue = this.props[propName];
      const nextValue = nextProps[propName];
      if (currentValue !== nextValue) {
        // @ts-ignore
        const setterName = reactivePropSetterMap[propName];
        this.gridInst?.[setterName](nextValue);
      }
    });

    this.bindEventHandlers(nextProps, this.props);

    return false;
  }

  componentWillUnmount() {
    this.gridInst && this.gridInst.destroy();
  }

  render() {

    return <div ref={this.rootEl}/>;
  }

  SetTheme(options: any) {
    // @ts-ignore
    this.TGrid.applyTheme("default", options);
  }
}

export default TuiGrid;
