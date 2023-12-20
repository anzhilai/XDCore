import React from 'react';
import './bpmn/index.css'
import {XGrid,XBaseEditor,XBaseEditorProps} from "xdcoreweb";

export interface XBpmnProps extends XBaseEditorProps {
}

/**
 * 流程图编辑
 * @name 流程图编辑器
 * @groupName 输入
 */
export default class XBpmn<P = {}, S = {}> extends XBaseEditor<XBpmnProps & P, any> {
  static ComponentName = "流程图编辑器";

  static defaultProps = {
    ...super.defaultProps,
    placeholder: '流程图编辑器',
    showLabel: false,
    width: "100%",
    height: "100%",
  };

  constructor(props: XBpmnProps) {
    super(props);
  }

  viewer: any;

  async componentDidMount() {
    super.componentDidMount();
    const bpmn = await import(/* webpackChunkName: "tBpmn" */ './bpmn/index.js');
    let {BpmnModeler, Translate, BpmnPropertiesPanelModule, BpmnPropertiesProviderModule} = bpmn.default;
    let options = {
      container: this.container,
      keyboard: {bindTo: document.body}
    };
    if (this.GetReadOnly()) {
      this.viewer = new BpmnModeler({
        ...options,
        additionalModules: [
          {
            translate: ['value', Translate],//汉化
            paletteProvider: ["value", ''],//禁用/清空左侧工具栏
            labelEditingProvider: ["value", ''],//禁用节点编辑
            contextPadProvider: ["value", ''],//禁用图形菜单
            bendpoints: ["value", {}],//禁用连线拖动
            zoomScroll: ["value", ''],//禁用滚动
            moveCanvas: ['value', ''],//禁用拖动整个流程图
            move: ['value', '']//禁用单个图形拖动
          },
        ],
      });
    } else {
      this.viewer = new BpmnModeler({
        ...options,
        propertiesPanel: {parent: this.properties},
        additionalModules: [
          {translate: ['value', Translate]},//汉化
          BpmnPropertiesPanelModule,
          BpmnPropertiesProviderModule
        ],
      });
    }
    this.addModelerListener();
    this.importXML(this.GetValue());
    if (this.props.dataSourceUrl) {
      this.Refresh();
    }
  }

  SetValue(value, triggerValueChange: boolean = true) {
    super.SetValue(value, triggerValueChange);
    this.importXML(value);
  }

  async updateValue() {
    try {
      let result = await this.viewer?.saveXML({format: true});
      result.xml && super.SetValue(result.xml);
      // let elementRegistry = this.viewer.get('elementRegistry');
      // let elements = elementRegistry._elements;//所有的元素
      // let element  = elements[Process_1].gfx;
      // element.classList.add(colorClass);//添加样式
      // :global(.nodeSuccess .djs-visual > :nth-child(1)) {
      //   stroke: #52c41a !important;
      //   stroke-width: 3px;
      // }
    } catch (e) {
    }
  }

  addModelerListener() {
    const events = ['shape.added', 'shape.move.end', 'shape.removed', 'connect.end', 'connect.move']
    events.forEach((event) => {
      this.viewer.on(event, e => {
        let elementRegistry = this.viewer.get('elementRegistry')
        let shape = e.element ? elementRegistry.get(e.element.id) : e.shape
        // console.log(event, shape)
        this.updateValue();
      })
    });
    const eventBus = this.viewer.get('eventBus')
    const eventTypes = ['element.click', 'element.dbclick', 'element.changed']
    eventTypes.forEach((eventType) => {
      eventBus.on(eventType, async (e) => {
        if (!e || e.element.type == 'bpmn:Process') {
          return;
        }
        if (eventType === 'element.changed') {
          this.updateValue();
          // console.log(eventType, e)
        } else if (eventType === 'element.click') {
          console.log('点击了element')
        } else if (eventType === 'element.dbclick') {
          console.log('双击点击了element')
        }
      })
    })
  }

  importXML(xml: string) {
    if (!xml) {
      let id = "sid-" + this.CreateUUID("-");
      xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        "<definitions xmlns=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:omgdc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" id=\"" +
        id + "\" targetNamespace=\"http://bpmn.io/bpmn\" exporter=\"bpmn-js (https://demo.bpmn.io)\" exporterVersion=\"12.0.0\">\n" +
        "  <process id=\"Process_1\" isExecutable=\"false\">\n" +
        "    <startEvent id=\"StartEvent_1\" name=\"开始\" />\n" +
        "  </process>\n" +
        "  <bpmndi:BPMNDiagram id=\"BpmnDiagram_1\">\n" +
        "    <bpmndi:BPMNPlane id=\"BpmnPlane_1\" bpmnElement=\"Process_1\">\n" +
        "      <bpmndi:BPMNShape id=\"StartEvent_1_di\" bpmnElement=\"StartEvent_1\">\n" +
        "        <omgdc:Bounds x=\"152\" y=\"102\" width=\"36\" height=\"36\" />\n" +
        "        <bpmndi:BPMNLabel>\n" +
        "          <omgdc:Bounds x=\"134\" y=\"145\" width=\"73\" height=\"14\" />\n" +
        "        </bpmndi:BPMNLabel>\n" +
        "      </bpmndi:BPMNShape>\n" +
        "    </bpmndi:BPMNPlane>\n" +
        "  </bpmndi:BPMNDiagram>" +
        "</definitions>";
    }
    this.viewer?.importXML(xml, (err) => {
      if (!err) {
        this.viewer?.get('canvas').zoom('fit-viewport');
      }
      // let overlays = this.viewer.get('overlays');
      // let canvas = this.viewer.get('canvas');
    });
  }

  container: HTMLElement;
  properties: HTMLElement;

  renderReadOnly(): JSX.Element {
    return <XGrid boxClassName={"unzoom"}>
      <div ref={e => this.container = e}></div>
    </XGrid>
  }

  renderEditor = () => {
    return <XGrid boxClassName={"unzoom"} columnsTemplate={["1fr", "300px"]}>
      <div ref={e => this.container = e}></div>
      <div ref={e => this.properties = e}></div>
    </XGrid>
  };

  render() {
    if (!this.GetVisible()) {
      return <input value={this.GetValue()} type="hidden"/>;
    } else {
      return super.render();
    }
  }
}
