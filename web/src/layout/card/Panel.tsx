import React, { ReactNode,HTMLAttributes, PureComponent } from 'react';
import classnames from 'classnames';
import "./panel.css"
export type HTMLDivProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'>;

export interface PanelProps extends HTMLDivProps {
    prefixCls?: string;
    className?: string;
    title?: ReactNode;
    more?: ReactNode;
}

export default class Panel extends PureComponent<PanelProps, {}> {
    static defaultProps: PanelProps = {
        prefixCls: 'x-panel',
    };

    render() {
        const { prefixCls, className, title, more, children } = this.props;
        const cls = classnames(`${prefixCls}`, className);

        return (
            <div className={cls}>
                {(title || more) && <div className={`${prefixCls}__header`}>
                    {title && <div className={`${prefixCls}__header__title`}>{title}</div>}
                    {more && <div className={`${prefixCls}__header__more`}>{more}</div>}
                </div>}
                <div className={`${prefixCls}__body`}>{children}</div>
            </div>
        );
    }
}
