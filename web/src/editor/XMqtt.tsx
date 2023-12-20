import React from 'react';
import PropTypes from 'prop-types'
import XBaseEditor, {XBaseEditorProps} from '../base/XBaseEditor';
import XTools from "../toolkit/XTools";

export interface XMqttProps extends XBaseEditorProps {
  /**
   * Mqtt服务器的地址
   */
  url?: string,
  /**
   * Mqtt服务器的端口
   */
  port?: number,
  /**
   * Mqtt服务器的登录名
   */
  userName?: string,
  /**
   * Mqtt服务器的登录密码
   */
  password?: string,
  /**
   * 订阅的Mqtt服务器主题
   */
  mqttTopic?: string,
  /**
   * Mqtt服务器消息到达的出发事件
   */
  onMqttMessageArrived?: (payloadString: string) => void,
  /**
   * Mqtt服务器连接成功事件
   */
  onConnectSuccess?: () => void,
}

/**
 * 与MQTT服务的消息中间件集成
 * @name MQTT通信
 * @groupName
 */
export default class XMqtt extends XBaseEditor<XMqttProps, any> {
  static ComponentName = "MQTT通信";
  static defaultProps = {
    ...XBaseEditor.defaultProps,
    url: "127.0.0.1",
    port: 61614,
    userName: "admin",
    password: "admin",
    mqttTopic: "",
    onMqttMessageArrived: undefined,
    onConnectSuccess: undefined,
  };

  constructor(props) {
    super(props)
  }

  /**
   * 获取客户端id
   */
  GetClientId() {
    return this.mqttid;
  }

  mqttid: string;
  client: any;

  async componentDidMount() {
    super.componentDidMount();

    await XTools.CreateScript("xdcore/mqtt/mqttws31/mqttws31.min.js");
    this.mqttid = "web_" + this.CreateUUID();
    // @ts-ignore
    if (window.Paho && window.Paho.MQTT) {
      // @ts-ignore
      this.client = new window.Paho.MQTT.Client(this.props.url, this.props.port, this.mqttid);
      this.client.onConnectionLost = this.onConnectionLost.bind(this);
      this.client.onMessageArrived = this.onMessageArrived.bind(this);
      this.clientConnect();
    } else {
      this.client = {};
    }
  }

  clientConnect() {
    try {
      this.client.connect({
        userName: this.props.userName,
        password: this.props.password,
        onSuccess: this.onConnectSuccess.bind(this),
        onFailure: this.onConnectFailure.bind(this)
      });
    } catch (e) {
      this.reConnect();
    }
  }

  timeTicket: any;

  componentWillUnmount() {
    super.componentWillUnmount();
    try {
      this.client && this.client.disconnect();
    } catch (e) {
    }
    if (this.timeTicket) {
      clearInterval(this.timeTicket);
    }
    this.client = undefined;
  }

  onConnectSuccess() {
    this.client && this.client && this.client.subscribe("/" + this.mqttid);
    if (this.props.mqttTopic) {
      this.client && this.client.subscribe(this.props.mqttTopic);
    }
    this.props.onConnectSuccess && this.props.onConnectSuccess()
  }

  onConnectFailure() {
    this.reConnect();
  }

  /**
   * 推送消息
   * @param topic 主题
   * @param message 消息
   */
  Publish(topic: string, message: string | object) {
    let ret = false;
    if (this.client.isConnected()) {
      if (typeof message !== "string") {
        message = JSON.stringify(message);
      }
      this.client.send(topic, message);
      ret = true;
    }
    return ret;
  }

  /**
   * 订阅主题
   * @param topic 主题
   */
  Subscribe(topic: string) {
    let ret = false;
    if (this.client.isConnected()) {
      this.client && this.client.subscribe(topic);
      ret = true;
    }
    return ret;
  }

  /**
   * 取消订阅主题
   * @param topic 主题
   */
  Unsubscribe(topic: string) {
    let ret = false;
    if (this.client.isConnected()) {
      this.client.unsubscribe(topic);
      ret = true;
    }
    return ret;
  }

  reConnect() {
    if (this.timeTicket) {
      clearInterval(this.timeTicket);
    }
    this.timeTicket = setInterval(() => {
      if (this.client && this.client.isConnected()) {
        this.onConnectSuccess();
        clearInterval(this.timeTicket);
        return;
      } else {
        if (this.client) {
          this.clientConnect();
        }
      }
    }, 5000);
  }

  onMessageArrived(message) {
    console.log(message.isRetained, message)
    if (this.props.onMqttMessageArrived) {
      this.props.onMqttMessageArrived(message.payloadString);
    }
  }

  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
    this.reConnect();
  }

  render() {
    return (<></>);
  }
}
export const XMqttHelp = {
  name: "XMqtt",
  parent: "XBaseEditor",
  desc: "Mqtt消息组件",
  properties: [
    {
      name: "url",
      desc: "Mqtt服务器的地址",
      type: "string",
      default: "",
    }, {
      name: "port",
      desc: "Mqtt服务器的端口",
      type: "string",
      default: "",
    }, {
      name: "userName",
      desc: "Mqtt服务器的登录名",
      type: "string",
      default: "",
    }, {
      name: "password",
      desc: "Mqtt服务器的登录密码",
      type: "string",
      default: "",
    }, {
      name: "mqttTopic",
      desc: "订阅的Mqtt服务器主题",
      type: "string",
      default: "",
    }, {
      name: "onConnectSuccess",
      desc: "Mqtt服务器连接成功事件",
      type: "()=>{}",
      default: "",
    }, {
      name: "onMqttMessageArrived",
      desc: "Mqtt服务器消息到达的出发事件",
      type: "(message)=>{}",
      default: "",
    },
  ],
  methods: [
    {
      name: "Publish(topic, value)",
      desc: "向Mqtt服务器发布消息",
      input: "topic:要发布的主题，value：消息内容",
      output: "",
    }, {
      name: "Subscribe(topic)",
      desc: "订阅主题",
      input: "topic:订阅的主题",
      output: "",
    },
  ]
}
