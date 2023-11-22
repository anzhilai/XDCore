import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import Popup from '../../layout/pop/Popup';
import {ContainerType, getMountContainer} from '../../toolkit/utils/dom';
import "./toast.css"
const contentIsToastProps = (content: ReactNode | ToastProps): content is ToastProps =>
  !!content && typeof content === 'object' && 'content' in content;


export interface PropsType {
  visible?: boolean;
  stayTime?: number;
  content?: ReactNode;
  mountContainer?: ContainerType | false;
  afterClose?: () => void;
  mask?: boolean;
  onMaskClick?: () => void;
}


export interface ToastProps extends PropsType {
  prefixCls?: string;
  className?: string;
}

export default class Toast extends Component<ToastProps, any> {
  static hideHelper: () => void;

  private static zarmToast: HTMLDivElement | null;

  private static toastContainer: HTMLElement;

  static show = (content: ReactNode | ToastProps) => {
    Toast.unmountNode();
    if (!Toast.zarmToast) {
      Toast.zarmToast = document.createElement('div');
      Toast.zarmToast.classList.add('za-toast-container');
      if (contentIsToastProps(content) && content.className) {
        Toast.zarmToast.classList.add(content.className);
      }
      Toast.toastContainer =
        contentIsToastProps(content) && content.mountContainer
          ? getMountContainer(content.mountContainer)
          : getMountContainer();
      Toast.toastContainer.appendChild(Toast.zarmToast);
    }

    if (Toast.zarmToast) {
      const props: ToastProps = contentIsToastProps(content)
        ? {
            ...Toast.defaultProps,
            ...content,
            mountContainer: false,
            visible: true,
          }
        : {
            ...Toast.defaultProps,
            visible: true,
            mountContainer: false,
            content,
          };

      Toast.hideHelper = () => {
        ReactDOM.render(<Toast {...props} visible={false} />, Toast.zarmToast);
      };
      ReactDOM.render(<Toast {...props} />, Toast.zarmToast);
    }
  };

  static hide = () => {
    if (Toast.zarmToast) {
      Toast.hideHelper();
    }
  };

  static unmountNode = () => {
    const { zarmToast } = Toast;
    if (zarmToast) {
      ReactDOM.render(<></>, zarmToast);
      Toast.toastContainer.removeChild(zarmToast);
      Toast.zarmToast = null;
    }
  };

  private timer = 0;

  static defaultProps: ToastProps = {
    prefixCls: 'za-toast',
    visible: false,
    stayTime: 3000,
    mask: false,
  };

  state = {
    visible: this.props.visible,
  };

  componentDidMount() {
    this.autoClose();
  }

  componentDidUpdate(prevProps: ToastProps) {
    const { visible } = this.props;

    if (prevProps.visible !== visible) {
      if (visible === true) {
        // eslint-disable-next-line
        this.setState({
          visible: true,
        });
        this.autoClose();
      } else {
        clearTimeout(this.timer);
        this._hide();
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  afterClose = () => {
    const { afterClose } = this.props;
    if (Toast.zarmToast) {
      ReactDOM.unmountComponentAtNode(Toast.zarmToast);
      Toast.toastContainer.removeChild(Toast.zarmToast);
      Toast.zarmToast = null;
    }

    if (typeof afterClose === 'function') {
      afterClose();
    }
  };

  _hide = () => {
    this.setState({
      visible: false,
    });
  };

  autoClose() {
    const { stayTime } = this.props;
    if ((stayTime as number) > 0) {
      this.timer = window.setTimeout(() => {
        this._hide();
        clearTimeout(this.timer);
      }, stayTime);
    }
  }

  render() {
    const { prefixCls, className, stayTime, content, ...others } = this.props;

    const { visible } = this.state;

    return (
      <Popup
        direction="center"
        maskType={this.props.mask ? "normal" : "transparent"}
        width="70%"
        {...others}
        visible={visible}
        afterClose={this.afterClose}
      >
        <div className={prefixCls}>
          <div className={`${prefixCls}__container`}>{content}</div>
        </div>
      </Popup>
    );
  }
}
