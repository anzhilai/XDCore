import { ReactNode } from 'react';
import type { Locale } from '../../theme/PropsType';
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
  cancelText?: string;
  destroy?: boolean;
  onCancel?: () => void;
  afterClose?: () => void;
  locale?: Locale;
  mountContainer?: ContainerType;
}
