import React, { Component } from 'react';
import isEqual from 'lodash/isEqual';
import Popup from '../../layout/pop/Popup';
import PickerView from './PickerView';
import parseProps from './utils/parseProps';
import removeFnFromProps from './utils/removeFnFromProps';
import { DataSource } from './PickerView';
import { WheelValue, WheelItem } from './Wheel';
import {BasePickerViewProps} from "./PickerView";
import { ContainerType } from '../../toolkit/utils/dom';
import {Locale} from "../../theme/PropsType";
import "./picker.css"
import localeZhCn from "../../theme/locale/zh_CN";
export  interface BasePickerProps extends Omit<BasePickerViewProps, 'onChange' | 'stopScroll'> {
  visible?: boolean;
  title?: string;
  okText?: string;
  cancelText?: string;
  maskClosable?: boolean;
  destroy?: boolean;
  onChange?: (selected: Array<WheelItem>) => void;
  onOk?: (selected: Array<WheelItem>) => void;
  onCancel?: () => void;
  mountContainer?: ContainerType;
  locale?: Locale;
}

export interface PickerProps extends BasePickerProps {
  prefixCls?: string;
  className?: string;
}

export interface PickerState {
  value: Array<WheelValue>;
  objValue: Array<WheelItem>;
  dataSource: DataSource;
  tempObjValue?: Array<WheelItem>;
  tempValue?: Array<WheelValue>;
  stopScroll?: boolean;
}

export default class Picker extends Component<PickerProps, PickerState> {
  static defaultProps = {
    dataSource: [],
    prefixCls: 'za-picker',
    valueMember: 'value',
    cols: Infinity,
    maskClosable: true,
    itemRender: (data) => data.label,
    destroy: false,
  };

  state: PickerState = { ...parseProps.getSource(this.props), stopScroll: false };

  static getDerivedStateFromProps(props, state) {
    if (
      !isEqual(
        removeFnFromProps(props, ['onOk', 'onCancel', 'onChange']),
        removeFnFromProps(state.prevProps, ['onOk', 'onCancel', 'onChange']),
      )
    ) {
      return {
        prevProps: props,
        ...parseProps.getSource(props),
        tempValue: parseProps.getSource(props).value,
        tempObjValue: parseProps.getSource(props).objValue,
      };
    }

    return null;
  }

  onChange = (selected) => {
    const { valueMember, onChange } = this.props;
    const value = selected.map((item) => item[valueMember!]);
    this.setState({ value, objValue: selected });

    if (typeof onChange === 'function') {
      onChange(selected);
    }
  };

  onCancel = () => {
    const { onCancel } = this.props;
    const { tempValue = [], tempObjValue = [] } = this.state;
    this.setState({
      value: tempValue,
      objValue: tempObjValue,
    });
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  onOk = () => {
    const { onOk } = this.props;
    this.setState(
      {
        stopScroll: true,
      },
      () => {
        this.setState(
          {
            stopScroll: false,
          },
          () => {
            if (typeof onOk === 'function') {
              onOk(this.state.objValue);
            }
          },
        );
      },
    );
  };

  render() {
    const {
      prefixCls,
      className,
      cancelText,
      okText,
      title,
      locale = localeZhCn,
      maskClosable,
      mountContainer,
      destroy,
      onOk,
      onCancel,
      visible,
      ...others
    } = this.props;
    const { value, stopScroll = false } = this.state;
    const noop = () => {};
    return (
      <Popup
        className={className}
        visible={visible}
        onMaskClick={maskClosable ? this.onCancel : noop}
        mountContainer={mountContainer}
        destroy={destroy}
      >
        <div
          className={prefixCls}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className={`${prefixCls}__header`}>
            <div className={`${prefixCls}__cancel`} onClick={this.onCancel}>
              {cancelText || locale!.cancelText}
            </div>
            <div className={`${prefixCls}__title`}>{title || locale!.pickerTitle}</div>
            <div className={`${prefixCls}__submit`} onClick={this.onOk}>
              {okText || locale!.okText}
            </div>
          </div>
          <PickerView {...others} value={value} onChange={this.onChange} stopScroll={stopScroll} />
        </div>
      </Popup>
    );
  }
}
