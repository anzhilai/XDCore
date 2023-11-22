import React from 'react';
// import SockJS from 'sockjs-client';
// import Stomp from 'stompjs';
import XBaseEditor, {XBaseEditorProps} from '../base/XBaseEditor';

export interface XWebSocketProps extends XBaseEditorProps {
  /**
   * Mqtt服务器的地址
   */
  url?: string,
  /**
   * 传输头信息
   */
  mqttTopic?: string,
  /**
   * 订阅的Mqtt服务器主题
   */
  headers?: object,
  /**
   * Mqtt服务器连接成功事件
   */
  onMqttMessageArrived?: any,
  /**
   * Mqtt服务器消息到达的出发事件
   */
  onConnectSuccess?: any,
}

/**
 * 网页端与后端的实时通信
 * @name WebSocket通信
 * @groupName
 */
export default class XWebSocket extends XBaseEditor<XWebSocketProps, any> {
  static ComponentName = "WebSocket通信";
  static defaultProps = {
    ...XBaseEditor.defaultProps,
    url: "http://127.0.0.1:9099/webSocketServer",
    mqttTopic: "",
    headers: {},
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

  mqttid: any;
  client: any;

  private SockJS: any;
  private Stomp: any;

  async componentDidMount() {
    super.componentDidMount();
    this.mqttid = "/topic/" + this.CreateUUID();
    this.SockJS = await import(/* webpackChunkName: "tWebSocket" */ 'sockjs-client');
    this.Stomp = await import(/* webpackChunkName: "tWebSocket" */ 'stompjs');
    this.init();
  }

  init() {
    let SockJS = this.SockJS.default;
    let Stomp = this.Stomp;
    let socket = new SockJS(this.props.url); // 建立连接对象
    this.client = Stomp.over(socket); // 获取STOMP子协议的客户端对象
    this.client.debug = function () {
    };
    this.connect();
  }

  connect() {
    try {
      this.client.connect(this.props.headers, () => {
        this.onConnectSuccess();
      }, (err) => {
        this.reConnect();
      });
    } catch (e) {
      this.reConnect();
    }
  }

  timeTicket: any;

  componentWillUnmount() {
    super.componentWillUnmount();
    this.client && this.client.connected && this.client.disconnect();
    if (this.timeTicket) {
      clearInterval(this.timeTicket);
    }
    this.client = undefined;
  }

  onConnectSuccess() {
    this.client && this.client && this.client.subscribe("/" + this.mqttid, this.onMessageArrived.bind(this));
    if (this.props.mqttTopic) {
      this.client && this.client.subscribe(this.props.mqttTopic, this.onMessageArrived.bind(this));
    }
    this.props.onConnectSuccess && this.props.onConnectSuccess()
  }

  /**
   * 推送消息
   * @param topic 主题
   * @param message 消息
   */
  Publish(topic: string, message: string | object) {
    let ret = false;
    if (this.client.connected) {
      if (typeof message !== "string") {
        message = JSON.stringify(message);
      }
      this.client.send(topic, this.props.headers, message);
      ret = true;
    }
    return ret;
  }

  /**
   * 订阅主题
   * @param topic 主题
   */
  Subscribe(topic:string) {
    let ret = false;
    if (this.client.connected) {
      this.client && this.client.subscribe(topic, this.onMessageArrived.bind(this), this.props.headers);
      ret = true;
    }
    return ret;
  }

  /**
   * 取消订阅主题
   * @param topic 主题
   */
  Unsubscribe(topic:string) {
    let ret = false;
    if (this.client.connected) {
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
      if (this.client && this.client.connected) {
        this.onConnectSuccess();
        clearInterval(this.timeTicket);
        return;
      } else {
        if (this.client && this.client.connected) {
          this.client.disconnect();
          this.init();
        }
      }
    }, 5000);
  }

  onMessageArrived(message) {
    if (this.props.onMqttMessageArrived) {
      this.props.onMqttMessageArrived(message.body);
    }
  }

  render() {
    return (<></>);

    // return (        <SockJsClient url='http://localhost:9090/webSocketServer' topics={['/topic/process']}
    //                               onMessage={(msg) => { this.onMessageArrived(msg);  }}  onConnect={ () => { console.log("ok"); } }
    //                               onDisconnect={ () => { console.log("nook"); } }
    //                               ref={ (client) => { this.clientRef = client }} />);
  }
}
