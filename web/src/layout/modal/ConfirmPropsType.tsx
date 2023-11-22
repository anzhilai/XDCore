import { ReactNode } from 'react';
import { Locale } from '../../theme/PropsType';
import { ContainerType } from '../../toolkit/utils/dom';

export default interface PropsType {
  shape?: 'radius' | 'rect';
  visible?: boolean;
  animationType?:
    | 'fade'
    | 'door'
    | 'flip'
    | 'rotate'
    | 'zoom'
    | 'moveUp'
    | 'moveDown'
    | 'moveLeft'
    | 'moveRight'
    | 'slideUp'
    | 'slideDown'
    | 'slideLeft'
    | 'slideRight';
  animationDuration?: number;
  width?: string | number;
  title?: ReactNode;
  content?: ReactNode;
  okText?: string;
  onOk?: () => void;
  cancelText?: string;
  onCancel?: () => void;
  afterClose?: () => void;
  locale?: Locale;
  mountContainer?: ContainerType;
}
