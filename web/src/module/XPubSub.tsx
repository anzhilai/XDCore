import React from "react";
import XBaseObject, {XBaseObjectProps} from "../base/XBaseObject";
import PubSub from './pubsub/pubsub'


export interface XPubSubProps extends XBaseObjectProps {
}

/**
 * 前端精简的发布订阅组件
 * @name 发布订阅
 * @groupName
 */
export default class XPubSub extends XBaseObject<XPubSubProps, any> {
  static PubSub = PubSub
}
