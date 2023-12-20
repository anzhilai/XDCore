import React, {Component} from 'react'
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './style.css'
import {XTools} from "xdcoreweb";

let toBodyZoom = XTools.toBodyZoom;
export interface SelectableBoxProps {
  enabled?: boolean,
  onSelectionChange?: (keys: []) => void,
  disabledOnElements?: boolean,
  openMoveChange?: boolean,
  throttlingTime?: number,
  items?: any,
  container?: any,
  dataHook?: string,
  children?: React.ReactNode,
}

export default class SelectableBox extends Component<SelectableBoxProps, any> {

  static defaultProps = {
    enabled: true,
    disabledOnElements: false,
    onSelectionChange: _.noop,
    dataHook: 'key',
    openMoveChange: false,
    throttlingTime: 100,
    items: [],
    container: undefined
  };


  state = {
    mouseDown: false,
    startPoint: null,
    endPoint: null,
    selectionBox: null,
    selectedItems: {},
    appendMode: false
  }
  selectedChildren: any;
  lastUpdateTime: any;


  componentWillMount() {
    this.selectedChildren = {};
  }

  componentWillReceiveProps(nextProps) {
    let nextState = {};
    if (!nextProps.enabled) {// @ts-ignore
      nextState.selectedItems = {};
    }
    this.setState(nextState);
  }

  componentDidUpdate() {
    if (this.state.mouseDown && !_.isNull(this.state.selectionBox)) {
      this._updateCollidingChildren(this.state.selectionBox);
    }
  }

  _onMouseDown = (e) => {
    // @ts-ignore
    if (!this.props.enabled || e.button === 2 || e.nativeEvent.which === 2) {
      return;
    }
    let nextState: any = {};
    if (e.ctrlKey || e.altKey || e.shiftKey) {
      nextState.appendMode = true;
    } else {
      this.selectedChildren = {}
    }
    nextState.mouseDown = true;
    const container = this._getContainerElement()
    nextState.startPoint = {
      x: toBodyZoom(e.pageX) + (container?.scrollLeft || 0),
      y: toBodyZoom(e.pageY) + (container?.scrollTop || 0),
    };
    // @ts-ignore
    if (this.props.disabledOnElements && this._downOnElements({
      left: toBodyZoom(e.pageX) + (container?.scrollLeft || 0),
      top: toBodyZoom(e.pageY) + (container?.scrollTop || 0),
      width: 0,
      height: 0
    })) return;
    this.setState(nextState);
    window.document.addEventListener('mousemove', this._onMouseMove);
    window.document.addEventListener('mouseup', this._onMouseUp);
  }

  _downOnElements(pointBox) {
    let inElements = false
    // @ts-ignore
    this._elementsForeach((element, key, elementBox) => {
      if (this._boxIntersects(pointBox, elementBox)) {
        inElements = true;
      }
    })
    return inElements
  }

  _onMouseUp = (e) => {
    // e.preventDefault()
    e.stopPropagation()
    window.document.removeEventListener('mousemove', this._onMouseMove);
    window.document.removeEventListener('mouseup', this._onMouseUp);
    const hasEffective = !!this.state.endPoint
    this.setState({
      mouseDown: false,
      startPoint: null,
      endPoint: null,
      selectionBox: null,
      appendMode: false
    });
    if (hasEffective) {// @ts-ignore
      this.props.onSelectionChange.call(null, _.keys(this.selectedChildren));
    }
  }

  _onMouseMove = (e) => {
    e.preventDefault();
    if (this.state.mouseDown) {
      const container = this._getContainerElement()
      let endPoint = {
        x: toBodyZoom(e.pageX) + (container?.scrollLeft || 0),
        y: toBodyZoom(e.pageY) + (container?.scrollTop || 0)
      };
      if (this._checkEffective(this.state.startPoint, endPoint)) {
        this.setState({
          endPoint: endPoint,
          selectionBox: this._calculateSelectionBox(this.state.startPoint, endPoint)
        });
      }
    }
  }

  _checkEffective = (startPoint, endPoint) => Math.abs(startPoint.x - endPoint.x) >= 10 && Math.abs(startPoint.y - endPoint.y) >= 10

  render() {
    let className = 'selection selectionBox ' + (this.state.mouseDown ? 'dragging' : '');
    return <div className={className} ref='selectionBox' onMouseDown={this._onMouseDown}>
      {// @ts-ignore
        this.props.children}
      {this.renderSelectionBox()}
    </div>;
  }

  renderSelectionBox() {
    if (!this.state.mouseDown || _.isNull(this.state.endPoint) || _.isNull(this.state.startPoint)) {
      return null;
    }
    let parentNode = this.refs.selectionBox;
    const {selectionBox} = this.state
    let container = this._getContainerElement()
    if (parentNode == container) {
      container = null;
    }
    return (
      <div className='selection-border' style={{
        ...selectionBox,
        left: selectionBox.left - getLeft(parentNode) - (container?.scrollLeft || 0),
        top: selectionBox.top - getTop(parentNode) - (container?.scrollTop || 0)
      }}></div>
    );
  }

  selectItem(key, isSelected) {
    if (isSelected) {
      this.selectedChildren[key] = isSelected;
    } else {
      delete this.selectedChildren[key];
    }// @ts-ignore
    this.props.onSelectionChange.call(null, _.keys(this.selectedChildren));
    this.forceUpdate();
  }

  selectAll() {
    _.each(this.refs, function (ref, key) {
      if (key !== 'selectionBox') {
        this.selectedChildren[key] = true;
      }
    }.bind(this));
  }

  clearSelection() {
    this.selectedChildren = {};// @ts-ignore
    this.props.onSelectionChange.call(null, []);
    this.forceUpdate();
  }

  _boxIntersects(boxA, boxB) {
    if (boxA.left <= boxB.left + boxB.width &&
      boxA.left + boxA.width >= boxB.left &&
      boxA.top <= boxB.top + boxB.height &&
      boxA.top + boxA.height >= boxB.top) {
      return true;
    }
    return false;
  }

  _getContainerElement() {// @ts-ignore
    const container = this.props.container
    if (container instanceof String) {// @ts-ignore
      return document.querySelector(container)
    } else if (container instanceof Function) {
      return container()
    }
    return null
  }

  _getElementsByItems() {// @ts-ignore
    const items = this.props.items
    if (Array.isArray(items)) {
      return items
    } else if (items instanceof String) {// @ts-ignore
      return document.querySelectorAll(items)
    } else if (items instanceof Function) {
      return items()
    }
    return null
  }


  //选择计算
  _updateCollidingChildren(selectionBox) {
    this._elementsForeach((element, key, elementBox) => {
      if (this._boxIntersects(selectionBox, elementBox)) {
        this.selectedChildren[key] = true;
      } else {
        if (!this.state.appendMode) {
          delete this.selectedChildren[key];
        }
      }
    }, () => {// @ts-ignore
      if (this.props.openMoveChange) {// @ts-ignore
        this.props.onSelectionChange.call(null, _.keys(this.selectedChildren));
      }
    })
  }

  _elementsForeach(callback, onComplete) {
    const currTime = new Date().getTime();// @ts-ignore
    if ((currTime - (this.lastUpdateTime || 0)) > this.props.throttlingTime) {
      this.lastUpdateTime = currTime;
      if (callback && callback instanceof Function) {
        let _this = this;
        let tempNode = null;
        let tempBox = null;
        const elements = _this._getElementsByItems()
        if (elements) {
          _.each(elements, function (element) {
            if (element) {
              tempNode = ReactDom.findDOMNode(element);
              if (tempNode) {// @ts-ignore
                const key = tempNode.getAttribute(_this.props.dataHook);
                const elCoordinate = getElCoordinate(tempNode);
                if (key) {
                  tempBox = {
                    top: getTop(tempNode) + elCoordinate.y,
                    left: getLeft(tempNode) + elCoordinate.x,
                    width: tempNode.clientWidth,
                    height: tempNode.clientHeight
                  };
                  callback && callback(element, key, tempBox)
                }
              }
            }
          });
          onComplete && onComplete()
        }
      }
    }
  }


  _calculateSelectionBox(startPoint, endPoint) {
    if (!this.state.mouseDown || _.isNull(endPoint) || _.isNull(startPoint)) {
      return null;
    }
    let left = Math.min(startPoint.x, endPoint.x);
    let top = Math.min(startPoint.y, endPoint.y);
    let width = Math.abs(startPoint.x - endPoint.x);
    let height = Math.abs(startPoint.y - endPoint.y);
    return {
      left: left,
      top: top,
      width: width,
      height: height
    };
  }

}

function getLeft(e) {
  let offset = e.offsetLeft;
  if (e.offsetParent != null) offset += getLeft(e.offsetParent);
  return offset;
}

function getTop(e) {
  let offset = e.offsetTop;
  if (e.offsetParent != null) offset += getTop(e.offsetParent);
  return offset;
}

function getElCoordinate(node) {
  const translates = document.defaultView.getComputedStyle(node, null).transform
  let str = translates.replace(")", "");
  let split = str.split(',');
  const y = Number(split.pop()) || 0
  const x = Number(split.pop()) || 0
  return {
    y,
    x,
    width: node.clientWidth,
    height: node.clientHeight
  };
}
