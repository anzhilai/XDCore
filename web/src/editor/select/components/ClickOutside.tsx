import React from 'react';

export interface ClickOutsideProps {
  children?: React.ReactNode,
  onClickOutside?: (event: Event) => void,
  className?:string,
}


class ClickOutside extends React.Component<ClickOutsideProps, any>{
  container = React.createRef();

  static hasClass(target, className) {
    let ret = false;
    if (target) {
      ret = target.classList.contains(className)
      if (!ret) {
        let parent = target.parentElement;
        if (parent && parent.nodeName != "BODY") {
          ret = this.hasClass(parent, className)
        }
      }
    }
    return ret;
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, true);
  }

  handleClick = (event:Event) => {
    const container = this.container.current;
    const { target } = event;
    const { onClickOutside } = this.props;
    // @ts-ignore
    if ((container && container === target) || (container && !container.contains(target))) {
      onClickOutside(event);
    }
  };

  render() {
    const { className, children } = this.props;

    return (
      // @ts-ignore
      <div style={{width:"100%"}} className={className} ref={this.container}>
        {children}
      </div>
    );
  }
}

export default ClickOutside;
