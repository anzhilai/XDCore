import React, { Component } from 'react';
import styled from '@emotion/styled';
import { hexToRGBA, getByPath } from '../util';
import * as PropTypes from 'prop-types';
import { LIB_NAME } from '../constants';

class Item extends Component {
  item = React.createRef();

  componentDidMount() {// @ts-ignore
    const { props, methods } = this.props;

    if (
      this.item.current &&
      !props.multi &&
      props.keepSelectedInList &&// @ts-ignore
      methods.isSelected(this.props.item)
    )// @ts-ignore
      this.item.current.scrollIntoView({ block: 'nearest', inline: 'start' });
  }

  componentDidUpdate() {// @ts-ignore
    if (this.props.state.cursor === this.props.itemIndex) {
      this.item.current &&// @ts-ignore
        this.item.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }

  render() {// @ts-ignore
    const { props, state, methods, item, itemIndex } = this.props;

    if (props.itemRenderer) {
      return props.itemRenderer({ item, itemIndex, props, state, methods });
    }

    if (!props.keepSelectedInList && methods.isSelected(item)) {
      return null;
    }

    return (
      <ItemComponent
        role="option"// @ts-ignore
        ref={this.item}
        aria-selected={methods.isSelected(item)}
        aria-disabled={item.disabled}
        aria-label={getByPath(item, props.labelField)}
        disabled={item.disabled}
        key={`${getByPath(item, props.valueField)}${getByPath(item, props.labelField)}`}// @ts-ignore
        tabIndex="-1"
        className={`${LIB_NAME}-item ${
          methods.isSelected(item) ? `${LIB_NAME}-item-selected` : ''
        } ${state.cursor === itemIndex ? `${LIB_NAME}-item-active` : ''} ${
          item.disabled ? `${LIB_NAME}-item-disabled` : ''
        }`}
        onClick={item.disabled ? undefined : () => methods.addItem(item)}
        onKeyPress={item.disabled ? undefined : () => methods.addItem(item)}
        color={props.color}>
        {getByPath(item, props.labelField)} {item.disabled && <ins>{props.disabledLabel}</ins>}
      </ItemComponent>
    );
  }
}
// @ts-ignore
Item.propTypes = {
  props: PropTypes.any,
  state: PropTypes.any,
  methods: PropTypes.any,
  item: PropTypes.any,
  itemIndex: PropTypes.any
};

const ItemComponent = styled.span`
  padding: 5px 10px;
  cursor: pointer;
  border-bottom: 1px solid #fff;

  &.${LIB_NAME}-item-active {
    border-bottom: 1px solid #fff;
    ${// @ts-ignore
  ({ disabled, color }) => !disabled && color && `background: ${hexToRGBA(color, 0.1)};`}
  }

  :hover,
  :focus {
    background: ${({ color }) => color && hexToRGBA(color, 0.1)};
    outline: none;
  }

  &.${LIB_NAME}-item-selected {
    ${// @ts-ignore
  ({ disabled, color }) =>
      disabled
        ? `
    background: #f2f2f2;
    color: #ccc;
    `
        : `
    background: ${color};
    color: #fff;
    border-bottom: 1px solid #fff;
    `}
  }

  ${// @ts-ignore
  ({ disabled }) =>
    disabled
      ? `
    background: #f2f2f2;
    color: #ccc;

    ins {
      text-decoration: none;
      border:1px solid #ccc;
      border-radius: 2px;
      padding: 0px 3px;
      font-size: x-small;
      // text-transform: uppercase;
    }
    `
      : ''}
`;

export default Item;
