import React from 'react';
import styled from '@emotion/styled';

import { LIB_NAME } from '../constants';
import NoData from '../components/NoData';
import Item from '../components/Item';

import { valueExistInSelected, hexToRGBA, isomorphicWindow } from '../util';
import XTools from "../../../toolkit/XTools";
const {toBodyZoom} = XTools

const dropdownPosition = (props, methods) => {
  const DropdownBoundingClientRect = methods.getSelectRef().getBoundingClientRect();//输入框
  const dropdownHeight =
    DropdownBoundingClientRect.bottom + parseInt(props.dropdownHeight, 10) + parseInt(props.dropdownGap, 10);

  if (props.dropdownPosition !== 'auto') {
    return props.dropdownPosition;
  }

  if (dropdownHeight > toBodyZoom(isomorphicWindow().innerHeight) && dropdownHeight > DropdownBoundingClientRect.top) {
    return 'top';
  }

  return 'bottom';
};

//update by tangbin
const dropdownLeftPosition = (props, methods) => {
  const DropdownBoundingClientRect = methods.getSelectRef().getBoundingClientRect();//输入框
  const dropdownWidth =
    DropdownBoundingClientRect.left + parseInt(props.dropdownWidth, 10);

  if (props.dropdownLeftPosition !== 'auto') {
    return props.dropdownLeftPosition;
  }

  if (dropdownWidth > toBodyZoom(isomorphicWindow().innerWidth)) {
    return 'right';
  }

  return 'left';
};

const Dropdown = ({ props, state, methods }) => (
  <DropDown
    // @ts-ignore
    tabIndex="-1"
    aria-expanded="true"
    role="list"
    dropdownPosition={dropdownPosition(props, methods)}
    dropdownLeftPosition={dropdownLeftPosition(props, methods)}
    selectBounds={state.selectBounds}
    portal={props.portal}
    dropdownGap={props.dropdownGap}
    dropdownHeight={props.dropdownHeight}
    dropdownWidth={props.dropdownWidth == "auto" ? "" : props.dropdownWidth}
    minDropdownWidth={props.minDropdownWidth}
    className={`${LIB_NAME}-dropdown ${LIB_NAME}-dropdown-position-${dropdownPosition(props, methods)}`}>
    {props.dropdownRenderer ? (
      props.dropdownRenderer({ props, state, methods })
    ) : (
      <React.Fragment>
        {props.create && state.search && !valueExistInSelected(state.search, [...state.values, ...props.options], props) && (
          <AddNew
            role="button"
            className={`${LIB_NAME}-dropdown-add-new`}
            color={props.color}
            onClick={() => methods.createNew(state.search)}>
            {props.createNewLabel.replace('{search}', `"${state.search}"`)}
          </AddNew>
        )}
        {state.searchResults.length === 0 ? (
          <NoData
            // @ts-ignore
            className={`${LIB_NAME}-no-data`}
            state={state}
            props={props}
            methods={methods}
          />
        ) : (
            state.searchResults
              .map((item, itemIndex) => (
                <Item
                  key={item[props.valueField].toString()}
                  // @ts-ignore
                  item={item}
                  itemIndex={itemIndex}
                  state={state}
                  props={props}
                  methods={methods}
                />
              ))
          )}
      </React.Fragment>
    )}
  </DropDown>
);

const DropDown = styled.div`
  position: absolute;
  ${// @ts-ignore
  ({ selectBounds, dropdownGap, dropdownPosition }) =>
    dropdownPosition === 'top'
      ? `bottom: ${selectBounds.height + 2 + dropdownGap}px`
      : `top: ${selectBounds.height + 2 + dropdownGap}px`};

  ${// @ts-ignore
  ({selectBounds, dropdownGap, dropdownPosition, dropdownLeftPosition, portal}) =>
    portal
      ? `
      position: fixed;
      ${dropdownPosition === 'bottom' ? `top: ${selectBounds.bottom + dropdownGap}px;` : `bottom: ${toBodyZoom(isomorphicWindow().innerHeight) - selectBounds.top + dropdownGap}px;`}
      ${dropdownLeftPosition === 'left' ? `left: ${selectBounds.left - 1}px;` : `right: ${toBodyZoom(isomorphicWindow().innerWidth) - selectBounds.right - 1}px;`}`
      : 'left: -1px;'};
  border: 1px solid #ccc;
  min-width: ${// @ts-ignore
  ({ minDropdownWidth }) => minDropdownWidth};
  width: ${// @ts-ignore
  ({selectBounds, dropdownWidth}) => dropdownWidth ? dropdownWidth : (selectBounds.width + "px")};
  padding: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 0 10px 0 ${() => hexToRGBA('#000000', 0.2)};
  max-height: ${// @ts-ignore
  ({ dropdownHeight }) => dropdownHeight};
  overflow: auto;
  z-index: 9999;

  :focus {
    outline: none;
  }
}
`;

const AddNew = styled.div`
  color: ${({ color }) => color};
  padding: 5px 10px;

  :hover {
    background: ${({ color }) => color && hexToRGBA(color, 0.1)};
    outline: none;
    cursor: pointer;
  }
`;

export default Dropdown;
