import React from 'react';
import styled from '@emotion/styled';

import Option from './Option';
import Input from './Input';
import { LIB_NAME } from '../constants';
import {getByPath} from '../util';

const Content = ({props, state, methods, itemContentRender, event}) => {
  return (
    <ContentComponent
      className={`${LIB_NAME}-content ${
        props.multi ? `${LIB_NAME}-type-multi` : `${LIB_NAME}-type-single`
      }`}
      onClick={(event) => {
        event.stopPropagation();
        methods.dropDown('toggle');
      }}>
      {props.contentRenderer ? (
        props.contentRenderer({ props, state, methods, event })
      ) : (
        <React.Fragment>
          {props.multi
            ? state.values &&
              state.values.map((item) => (
                <Option
                  key={`${getByPath(item, props.valueField)}${getByPath(item, props.labelField)}`}
                  item={item}
                  state={state}
                  props={props}
                  methods={methods}
                  itemContentRender={itemContentRender}
                />
              ))
            : state.values &&
            state.values.length > 0 &&
            <span>{itemContentRender(getByPath(state.values[0], props.labelField), state.values[0], true)}</span>}
          {props.searchable && <Input props={props} methods={methods} state={state}/>}
        </React.Fragment>
      )}
    </ContentComponent>
  );
};

const ContentComponent = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  // overflow: auto;
  overflow: hidden;
`;

export default Content;
