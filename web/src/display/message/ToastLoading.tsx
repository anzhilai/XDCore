import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import type PropsType from '../image/PropsType';
import Popup from '../../layout/pop/Popup';
import { getMountContainer } from '../../toolkit/utils/dom';
import Loading from '../loading/Loading';
import "./toastloading.css"
export interface LoadingProps extends PropsType {
  prefixCls?: string;
  className?: string;
}

export default class ToastLoading extends PureComponent<LoadingProps, {}> {
  static defaultProps: LoadingProps = {
    prefixCls: 'za-loading',// @ts-ignore
    mask: true,
  };

  static zarmLoading: HTMLElement | null;

  private static loadingContainer: HTMLElement;

  static hideHelper: () => void;

  static show = (content?: LoadingProps) => {
    ToastLoading.unmountNode();
    // TODO: after calling .unmountNode(), ToastLoading.zarmLoading is null. Is this check necessary?
    if (!ToastLoading.zarmLoading) {
      ToastLoading.zarmLoading = document.createElement('div');
      ToastLoading.zarmLoading.classList.add('za-ToastLoading-container');
      if (content && content.className) {
        ToastLoading.zarmLoading.classList.add(content.className);
      }
      ToastLoading.loadingContainer =// @ts-ignore
        content && content.mountContainer// @ts-ignore
          ? getMountContainer(content.mountContainer)
          : getMountContainer();
      ToastLoading.loadingContainer.appendChild(ToastLoading.zarmLoading);
    }
    const props: LoadingProps = {
      ...ToastLoading.defaultProps,
      ...(content as LoadingProps),
      ...{ visible: true, mountContainer: false },
    };

    ToastLoading.hideHelper = () => {
      ReactDOM.render(<ToastLoading {...props} visible={false} />, ToastLoading.zarmLoading);
    };
    ReactDOM.render(<ToastLoading {...props} />, ToastLoading.zarmLoading);
  };

  static hide = () => {
    if (ToastLoading.zarmLoading) {
      ToastLoading.hideHelper();
    }
  };

  static unmountNode = () => {
    const { zarmLoading } = ToastLoading;
    if (zarmLoading) {
      ReactDOM.render(<></>, zarmLoading);
      ToastLoading.loadingContainer.removeChild(zarmLoading);
      ToastLoading.zarmLoading = null;
    }
  };

  private timer: ReturnType<typeof setTimeout>;

  state = {
    visible: this.props.visible,
  };

  componentDidMount() {
    this.autoClose();
  }

  componentDidUpdate(prevProps: LoadingProps) {
    const { visible } = this.props;
    if (prevProps.visible !== visible) {
      if (visible) {
        // eslint-disable-next-line
        this.setState({ visible: true });
        this.autoClose();
      } else {
        this._hide();
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  afterClose = () => {// @ts-ignore
    const { afterClose } = this.props;
    if (ToastLoading.zarmLoading) {
      ReactDOM.unmountComponentAtNode(ToastLoading.zarmLoading);
      ToastLoading.loadingContainer.removeChild(ToastLoading.zarmLoading);
      ToastLoading.zarmLoading = null;
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

  autoClose() {// @ts-ignore
    const { stayTime } = this.props;

    if (stayTime && stayTime > 0) {
      this.timer = setTimeout(() => {
        this._hide();
        clearTimeout(this.timer);
      }, stayTime);
    }
  }

  render() {// @ts-ignore
    const { prefixCls, content, stayTime, className, ...others } = this.props;
    const { visible } = this.state;
    return (
      <Popup
        direction="center"
        maskType="transparent"
        width="70%"
        {...others}
        visible={visible}
        afterClose={this.afterClose}
      >
        <div className={prefixCls}>
          <div className={`${prefixCls}__container`}>
            {content || <Loading type="spinner" size="lg" />}
          </div>
        </div>
      </Popup>
    );
  }
}
