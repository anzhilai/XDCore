import React, { PureComponent } from 'react';
import classnames from 'classnames';
import formatFn from '../date/utils/format';
import DatePicker,{BaseDatePickerProps} from "./DatePicker";
import "./dateselectpicker.css"
import localeZhCn from "../../theme/locale/zh_CN";
type datePickerPropsWithoutVisible = Omit<BaseDatePickerProps, 'visible'>;

export interface BaseDateSelectProps extends datePickerPropsWithoutVisible {
  placeholder?: string;
  format?: string;
  hasArrow?: boolean;
}


export interface DateSelectPickerProps extends BaseDateSelectProps {
  prefixCls?: string;
  className?: string;
}

export default class DateSelectPicker extends PureComponent<DateSelectPickerProps, any> {
  static defaultProps: DateSelectPickerProps = {
    prefixCls: 'za-date-select',
    mode: 'date',
    disabled: false,
    minuteStep: 1,
    valueMember: 'value',
    hasArrow: true,
    onCancel: () => {},
  };

  static getDerivedStateFromProps(props) {
    return {
      selectValue: props.value,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectValue: props.value,
    };
  }

  handleClick = () => {
    const { disabled } = this.props;
    if (disabled) {
      return false;
    }
    this.setState({
      visible: true,
    });
  };

  onChange = (selected) => {
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange(selected);
    }
  };

  onOk = (selected) => {
    const { onOk } = this.props;
    this.setState({
      visible: false,
      selectValue: selected,
    });

    if (typeof onOk === 'function') {
      onOk(selected);
    }
  };

  onCancel = () => {
    const { onCancel } = this.props;
    this.setState({ visible: false });
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  render() {
    const {
      prefixCls,
      className,
      placeholder,
      disabled,
      onChange,
      locale = localeZhCn,
      value,
      hasArrow,
      ...others
    } = this.props;
    const { visible, selectValue } = this.state;

    const cls = classnames(prefixCls, {
      [`${prefixCls}--placeholder`]: !selectValue,
      [`${prefixCls}--disabled`]: disabled,
      [`${prefixCls}--arrow`]: hasArrow,
    });

    return (
      <div className={cls} onClick={this.handleClick}>
        <input type="hidden" value={formatFn(this, selectValue)} />
        <div className={`${prefixCls}__input`}>
          <div className={`${prefixCls}__value`}>
            {formatFn(this, selectValue) || placeholder || locale!.pickerTitle}
          </div>
        </div>
        <DatePicker
          {...others}
          onChange={onChange}
          className={className}
          visible={visible}
          value={selectValue}
          onOk={this.onOk}
          onCancel={this.onCancel}
        />
      </div>
    );
  }
}
