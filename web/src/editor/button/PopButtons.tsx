import React, { PureComponent } from 'react';
import classnames from 'classnames';
import Popup from '../../layout/pop/Popup';
import { Locale } from '../../theme/PropsType';
import "./popupbuttons.css"
import localeZhCn from "../../theme/locale/zh_CN";

export interface Action {
  text?: React.ReactNode;
  theme?: 'default' | 'primary' | 'danger';
  className?: string;
  onClick?: () => void;
}

export interface PropsType {
  visible?: boolean;
  spacing?: boolean;
  actions?: Action[];
  cancelText?: string;
  onMaskClick?: () => void;
  onCancel?: () => void;
  destroy?: boolean;
  locale?: Locale;
}

export interface ActionSheetProps extends PropsType{
  prefixCls?: string;
  className?: string;
}

export default class ActionSheet extends PureComponent<ActionSheetProps, {}> {
  static defaultProps: ActionSheetProps = {
    prefixCls: 'za-action-sheet',
    visible: false,
    spacing: false,
    actions: [],
    destroy: true,
  };

  renderActions = (action, index) => {
    const { prefixCls } = this.props;
    const actionCls = classnames(`${prefixCls}__item`, action.className, {
      [`${prefixCls}__item--${action.theme}`]: !!action.theme,
    });
    return (
      <div key={+index} className={actionCls} onClick={action.onClick}>
        {action.text}
      </div>
    );
  };

  renderCancel = () => {
    const { prefixCls, onCancel, cancelText, locale = localeZhCn } = this.props;
    return (
      typeof onCancel === 'function' && (
        <div className={`${prefixCls}__cancel`}>
          <div className={`${prefixCls}__item`} onClick={onCancel}>
            {cancelText || locale!.cancelText}
          </div>
        </div>
      )
    );
  };

  render() {
    const { prefixCls, className, spacing, visible, onMaskClick, actions, destroy } = this.props;
    const cls = classnames(prefixCls, {
      [`${prefixCls}--spacing`]: spacing,
    });

    return (
      <Popup className={className} visible={visible} onMaskClick={onMaskClick} destroy={destroy}>
        <div className={cls}>
          <div className={`${prefixCls}__actions`}>{actions!.map(this.renderActions)}</div>
          {this.renderCancel()}
        </div>
      </Popup>
    );
  }
}
