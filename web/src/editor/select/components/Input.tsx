import React, { Component } from 'react';
import styled from '@emotion/styled';
import { LIB_NAME } from '../constants';
import { valueExistInSelected } from '../util';

const handlePlaceHolder = (props, state) => {
  const { addPlaceholder, searchable, placeholder } = props;
  const noValues = state.values && state.values.length === 0;
  const hasValues = state.values && state.values.length > 0;

  if (hasValues && addPlaceholder && searchable) {
    return addPlaceholder;
  }

  if (noValues) {
    return placeholder;
  }

  if (hasValues && !searchable) {
    return '';
  }

  return '';
};
export interface InputProps {
  props?: object,
  state?: object,
  methods?: object
}

class Input extends Component<InputProps, any> {
  input = React.createRef();

  componentDidUpdate(prevProps) {
    if (
      // @ts-ignore
      this.props.state.dropdown || (prevProps.state.dropdown !== this.props.state.dropdown && this.props.state.dropdown) ||
      // @ts-ignore
      this.props.props.autoFocus
    ) {
      // @ts-ignore
      this.input.current.focus();
    }

    // @ts-ignore
    if (prevProps.state.dropdown !== this.props.state.dropdown && !this.props.state.dropdown) {
      // @ts-ignore
       this.input.current.blur();
    }
  }

  onBlur = (event) => {
    event.stopPropagation();
    // @ts-ignore
    if (!this.props.state.dropdown) {
      // @ts-ignore
      return this.input.current.blur();
    }

    // @ts-ignore
    return this.input.current.focus();
  };

  handleKeyPress = (event) => {
    const { props, state, methods } = this.props;

    return (
      // @ts-ignore
      props.create &&
      event.key === 'Enter' &&
      // @ts-ignore
      !valueExistInSelected(state.search, [...state.values, ...props.options], this.props) &&
      // @ts-ignore
      state.search &&
      // @ts-ignore
      state.cursor === null &&
      // @ts-ignore
      methods.createNew(state.search)
    );
  };

  render() {
    const { props, state, methods } = this.props;

    // @ts-ignore
    if (props.inputRenderer) {
      // @ts-ignore
      return props.inputRenderer({ props, state, methods, inputRef: this.input });
    }

    return (
      <InputComponent
        // @ts-ignore
        ref={this.input}
        // @ts-ignore
        tabIndex="-1"
        onFocus={(event) => event.stopPropagation()}
        className={`${LIB_NAME}-input`}
        // @ts-ignore
        size={methods.getInputSize()}
        // @ts-ignore
        value={state.search}
        // @ts-ignore
        readOnly={!props.searchable}
        // @ts-ignore
        onClick={() => methods.dropDown('toggle')}
        onKeyPress={this.handleKeyPress}
        // @ts-ignore
        onChange={methods.setSearch}
        onBlur={this.onBlur}
        placeholder={handlePlaceHolder(props, state)}
        // @ts-ignore
        disabled={props.disabled}
      />
    );
  }
}

const InputComponent = styled.input`
  line-height: inherit;
  border: none;
  margin-left: 5px;
  background: transparent;
  padding: 0;
  // width: calc(${({ size }) => `${size}ch`} + 5px);
  width: calc(${({ size }) => `${size}ch`} + 15px);
  // max-width: 100%;
  // width: auto;
  font-size: smaller;
  ${({ readOnly }) => readOnly && 'cursor: pointer;'}
  :focus {
    outline: none;
  }
`;

export default Input;
