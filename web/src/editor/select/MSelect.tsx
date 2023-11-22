import React, { Component } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ClickOutside from './components/ClickOutside';

import Clear from './components/Clear';
import Content from './components/Content';
import Dropdown from './components/Dropdown';
import DropdownHandle from './components/DropdownHandle';
import Loading from './components/Loading';
import Separator from './components/Separator';

import { LIB_NAME } from './constants';
import {
  debounce, getByPath,
  getProp, hexToRGBA,
  isEqual, isomorphicWindow, valueExistInSelected
} from './util';
// https://sanusart.github.io/react-dropdown-select/
export class MSelect extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onDropdownClose: PropTypes.func,
    onDropdownCloseRequest: PropTypes.func,
    onDropdownOpen: PropTypes.func,
    onClearAll: PropTypes.func,
    onSelectAll: PropTypes.func,
    values: PropTypes.array,
    options: PropTypes.array.isRequired,
    keepOpen: PropTypes.bool,
    dropdownGap: PropTypes.number,
    multi: PropTypes.bool,
    labelField: PropTypes.string,
    valueField: PropTypes.string,
    placeholder: PropTypes.string,
    addPlaceholder: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    loading: PropTypes.bool,
    clearable: PropTypes.bool,
    searchable: PropTypes.bool,
    separator: PropTypes.bool,
    dropdownHandle: PropTypes.bool,
    searchBy: PropTypes.string,
    sortBy: PropTypes.string,
    closeOnScroll: PropTypes.bool,
    openOnTop: PropTypes.bool,
    style: PropTypes.object,
    contentRenderer: PropTypes.func,
    dropdownRenderer: PropTypes.func,
    itemRenderer: PropTypes.func,
    noDataRenderer: PropTypes.func,
    optionRenderer: PropTypes.func,
    inputRenderer: PropTypes.func,
    loadingRenderer: PropTypes.func,
    clearRenderer: PropTypes.func,
    separatorRenderer: PropTypes.func,
    dropdownHandleRenderer: PropTypes.func,
    direction: PropTypes.string,
    required: PropTypes.bool,
    pattern: PropTypes.string,
    name: PropTypes.string,
    backspaceDelete: PropTypes.bool,
    compareValuesFunc: PropTypes.func,
    portal:PropTypes.any,
    create: PropTypes.bool,
    dropdownLeftPosition:PropTypes.string,
    dropdownPosition:PropTypes.string,
    dropdownHeight: PropTypes.string,
    dropdownWidth: PropTypes.string,
    minDropdownWidth: PropTypes.string,
    autoFocus: PropTypes.bool,
    searchFn:PropTypes.func,
    clearOnSelect: PropTypes.bool,
    allowAdd: PropTypes.bool,
    itemContentRender: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      dropdown: false,
      values: props.values,
      search: '',
      selectBounds: {},
      cursor: null,
      searchResults: props.options,
    };
// @ts-ignore
    this.methods = {
      removeItem: props?.methods?.removeItem?.bind(this) || this.removeItem,
      dropDown: props?.methods?.dropDown?.bind(this) || this.dropDown,
      addItem: props?.methods?.addItem?.bind(this) || this.addItem,
      setItems: props?.methods?.setItems?.bind(this) || this.setItems,
      setSearch: props?.methods?.setSearch?.bind(this) || this.setSearch,
      getInputSize: props?.methods?.getInputSize?.bind(this) || this.getInputSize,
      toggleSelectAll: props?.methods?.toggleSelectAll?.bind(this) || this.toggleSelectAll,
      clearAll: props?.methods?.clearAll?.bind(this) || this.clearAll,
      selectAll: props?.methods?.selectAll?.bind(this) || this.selectAll,
      searchResults: props?.methods?.searchResults?.bind(this) || this.searchResults,
      getSelectRef: props?.methods?.getSelectRef?.bind(this) || this.getSelectRef,
      isSelected: props?.methods?.isSelected?.bind(this) || this.isSelected,
      getSelectBounds: props?.methods?.getSelectBounds?.bind(this) || this.getSelectBounds,
      areAllSelected: props?.methods?.areAllSelected?.bind(this) || this.areAllSelected,
      handleKeyDown: props?.methods?.handleKeyDown?.bind(this) || this.handleKeyDown,
      activeCursorItem: props?.methods?.activeCursorItem?.bind(this) || this.activeCursorItem,
      createNew: props?.methods?.createNew?.bind(this) || this.createNew,
      sortBy: props?.methods?.sortBy?.bind(this) || this.sortBy,
      safeString: props?.methods?.safeString?.bind(this) || this.safeString
    };
// @ts-ignore
    this.select = React.createRef();// @ts-ignore
    this.dropdownRoot = typeof document !== 'undefined' && document.createElement('div');
  }

  componentDidMount() {// @ts-ignore
    this.props.portal && this.props.portal.appendChild(this.dropdownRoot);
    isomorphicWindow().addEventListener('resize', debounce(this.updateSelectBounds));
    isomorphicWindow().addEventListener('scroll', debounce(this.onScroll));
// @ts-ignore
    this.dropDown('close');
// @ts-ignore
    if (this.select) {
      this.updateSelectBounds();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let formatValues = (values) => {
      let ret = undefined;
      if (values && values instanceof Array) {
        ret = [];
        values.forEach(item => {
          let _item = {id: item.id};// @ts-ignore
          _item[this.props.labelField] = item[this.props.labelField];// @ts-ignore
          _item[this.props.valueField] = item[this.props.valueField];
          ret.push(_item);
        });
      } else {
        ret = values;
      }
      return ret;
    }// @ts-ignore
    if (!this.props.compareValuesFunc(formatValues(prevProps.values), formatValues(this.props.values))) {
      // @ts-ignore
      this.setState({values: this.props.values});
      this.updateSelectBounds();
    }
// @ts-ignore
    if (prevProps.options !== this.props.options) {
      this.setState({ searchResults: this.searchResults() });
    }
// @ts-ignore
    if (prevState.values !== this.state.values) {// @ts-ignore
      this.props.onChange(this.state.values);
      this.updateSelectBounds();
    }
// @ts-ignore
    if (prevState.search !== this.state.search) {
      this.updateSelectBounds();
    }
// @ts-ignore
    if (prevState.values !== this.state.values && this.props.closeOnSelect) {// @ts-ignore
      this.dropDown('close');
    }
// @ts-ignore
    if (prevProps.multi !== this.props.multi) {
      this.updateSelectBounds();
    }
// @ts-ignore
    if (prevState.dropdown && prevState.dropdown !== this.state.dropdown) {
      this.onDropdownClose();
    }
// @ts-ignore
    if (!prevState.dropdown && prevState.dropdown !== this.state.dropdown) {// @ts-ignore
      this.props.onDropdownOpen();
    }
  }

  componentWillUnmount() {// @ts-ignore
    this.props.portal && this.props.portal.removeChild(this.dropdownRoot);
    isomorphicWindow().removeEventListener(
      'resize',// @ts-ignore
      debounce(this.updateSelectBounds, this.props.debounceDelay)
    );
    isomorphicWindow().removeEventListener(
      'scroll',// @ts-ignore
      debounce(this.onScroll, this.props.debounceDelay)
    );
  }

  onDropdownClose = () => {
    this.setState({ cursor: null });// @ts-ignore
    this.props.onDropdownClose();
  };

  onScroll = () => {// @ts-ignore
    if (this.props.closeOnScroll) {// @ts-ignore
      this.dropDown('close');
    }

    this.updateSelectBounds();
  };

  updateSelectBounds = () =>// @ts-ignore
    this.select.current &&
    this.setState({// @ts-ignore
      selectBounds: this.select.current.getBoundingClientRect()
    });
// @ts-ignore
  getSelectBounds = () => this.state.selectBounds;

  dropDown = (action = 'toggle', event, force = false) => {

    const target = (event && event.target) || (event && event.srcElement);

    if (// @ts-ignore
      this.props.onDropdownCloseRequest !== undefined &&// @ts-ignore
      this.state.dropdown &&
      force === false &&
      action === 'close'
    ) {// @ts-ignore
      return this.props.onDropdownCloseRequest({
        props: this.props,// @ts-ignore
        methods: this.methods,
        state: this.state,
        close: () => this.dropDown('close', null, true)
      });
    }

    if (// @ts-ignore
      this.props.portal &&// @ts-ignore
      !this.props.closeOnScroll &&// @ts-ignore
      !this.props.closeOnSelect &&
      event && target && ClickOutside.hasClass(target, 'react-dropdown-select-dropdown')
    ) {
      return;
    }
// @ts-ignore
    if (this.props.keepOpen) {
      return this.setState({ dropdown: true });
    }
// @ts-ignore
    if (action === 'close' && this.state.dropdown) {// @ts-ignore
      this.select.current.blur();

      return this.setState({
        dropdown: false,// @ts-ignore
        search: this.props.clearOnBlur ? '' : this.state.search,// @ts-ignore
        searchResults: this.props.options,
      });

    }
// @ts-ignore
    if (action === 'open' && !this.state.dropdown) {
      this.updateSelectBounds();
      return this.setState({ dropdown: true });
    }

    if (action === 'toggle') {// @ts-ignore
      this.updateSelectBounds();// @ts-ignore
      this.select.current.focus();// @ts-ignore
      if(this.state.dropdown){
        return this.setState({// @ts-ignore
          dropdown: !this.state.dropdown ,// @ts-ignore
          search: this.props.clearOnBlur ? '' : this.state.search,
        });
      }else{
        // @ts-ignore
        return this.setState({ dropdown: !this.state.dropdown });
      }
    }

    return false;
  };
// @ts-ignore
  getSelectRef = () => this.select.current;

  //update by tangbin
  setItems = (items) => {// @ts-ignore
    if (this.props.multi) {
      this.setState({// @ts-ignore
        values: [...items]
      });
    } else {
      this.setState({
        values: items.length > 0 ? [items[0]] : [],
        dropdown: false,
        search: ''
      });
    }
// @ts-ignore
    this.props.clearOnSelect &&
    this.setState({ search: '' }, () => {
      this.setState({ searchResults: this.searchResults() });
    });
    return true;
  }

  addItem = (item, dropdown = false) => {// @ts-ignore
    if (this.props.multi) {
      if (// @ts-ignore
        this.methods.isSelected(item)
        // valueExistInSelected(getByPath(item, this.props.valueField), this.state.values, this.props)
      ) {// @ts-ignore
        return this.methods.removeItem(null, item, false);
      }

      this.setState({// @ts-ignore
        values: [...this.state.values, item]
      });
    } else {
      this.setState({
        values: [item],
        dropdown: dropdown,
        search: ''
      });
    }
// @ts-ignore
    this.props.clearOnSelect &&
    this.setState({ search: '' }, () => {
      this.setState({ searchResults: this.searchResults() });
    });
    return true;
  };

  removeItem = (event, item, close = false) => {
    if (event && close) {
      event.preventDefault();
      event.stopPropagation();// @ts-ignore
      this.dropDown('close');
    }

    this.setState({// @ts-ignore
      values: this.state.values.filter(
        (values) =>// @ts-ignore
          getByPath(values, this.props.valueField) !== getByPath(item, this.props.valueField)
      )
    });
  };

  //modify by xuedan
  handle1?: any;
  setSearch = (event) => {
    this.setState({cursor: null});
    const v = event.target.value;
    this.setState({search: v,});
    clearTimeout(this.handle1);
    this.handle1 = setTimeout(() => {// @ts-ignore
      this.props.searchFn && this.props.searchFn(v);
    }, 500);
  };

  getInputSize = () => {// @ts-ignore
    if (this.state.search) {// @ts-ignore
      return this.state.search.length;
    }
// @ts-ignore
    if (this.state.values.length > 0) {// @ts-ignore
      return this.props.addPlaceholder.length;
    }
// @ts-ignore
    return this.props.placeholder.length;
  };

  toggleSelectAll = () => {
    return this.setState({// @ts-ignore
      values: this.state.values.length === 0 ? this.selectAll() : this.clearAll()
    });
  };

  clearAll = () => {// @ts-ignore
    this.props.onClearAll();
    this.setState({
      values: []
    });
  };

  selectAll = (valuesList = []) => {// @ts-ignore
    this.props.onSelectAll();
    const values =// @ts-ignore
      valuesList.length > 0 ? valuesList : this.props.options.filter((option) => !option.disabled);

    this.setState({ values });
  };

  isSelected = (option) =>// @ts-ignore
    !!this.state.values.find(
      (value) =>// @ts-ignore
        getByPath(value, this.props.valueField) === getByPath(option, this.props.valueField)
    );

  areAllSelected = () =>// @ts-ignore
    this.state.values.length === this.props.options.filter((option) => !option.disabled).length;

  safeString = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  sortBy = () => {// @ts-ignore
    const { sortBy, options } = this.props;

    if (!sortBy) {
      return options;
    }

    options.sort((a, b) => {// @ts-ignore
      if (getProp(a, sortBy) < getProp(b, sortBy)) {
        return -1;// @ts-ignore
      } else if (getProp(a, sortBy) > getProp(b, sortBy)) {
        return 1;
      } else {
        return 0;
      }
    });

    return options;
  };

  searchFn = ({ state, methods }) => {
    const regexp = new RegExp(methods.safeString(state.search), 'i');

    return methods
      .sortBy()
      .filter((item) =>// @ts-ignore update by tangbin
        // regexp.test(getByPath(item, this.props.searchBy) || getByPath(item, this.props.valueField))
        regexp.test(getByPath(item, this.props.searchBy))
      );
  };

  searchResults = () => {// @ts-ignore
    const args = { state: this.state, props: this.props, methods: this.methods };
    // @ts-ignore modify by xuedan
    // return this.props.searchFn(args) || this.searchFn(args);
  };

  activeCursorItem = (activeCursorItem) =>
    this.setState({
      activeCursorItem
    });

  handleKeyDown = (event) => {
    const args = {
      event,
      state: this.state,
      props: this.props,// @ts-ignore
      methods: this.methods,
      setState: this.setState.bind(this)
    };
    // @ts-ignore
    this.props.handleKeyDownFn(args)
    return this.handleKeyDownFn(args);
  };

  handleKeyDownFn = ({ event, state, props, methods, setState }) => {
    const { cursor, searchResults } = state;
    const escape = event.key === 'Escape';
    const enter = event.key === 'Enter';
    const arrowUp = event.key === 'ArrowUp';
    const arrowDown = event.key === 'ArrowDown';
    const backspace = event.key === 'Backspace';
    const tab = event.key === 'Tab' && !event.shiftKey;
    const shiftTab = event.shiftKey && event.key === 'Tab';

    if (arrowDown && !state.dropdown) {
      event.preventDefault();// @ts-ignore
      this.dropDown('open');
      return setState({cursor: 0});
    }

    if ((arrowDown || (tab && state.dropdown)) && cursor === null) {
      return setState({cursor: 0});
    }

    if (arrowUp || arrowDown || (shiftTab && state.dropdown) || (tab && state.dropdown)) {
      event.preventDefault();
    }

    if (escape) {// @ts-ignore
      this.dropDown('close');
    }

    if (enter) {
      const currentItem = searchResults[cursor];
      if (currentItem && !currentItem.disabled) {
        if (props.create && valueExistInSelected(state.search, state.values, props)) {
          return null;
        }

        methods.addItem(currentItem);
      }
    }

    if ((arrowDown || (tab && state.dropdown)) && searchResults.length === cursor) {
      return setState({cursor: 0});
    }

    if (arrowDown || (tab && state.dropdown)) {
      setState((prevState) => ({cursor: prevState.cursor + 1}));
    }

    if ((arrowUp || (shiftTab && state.dropdown)) && cursor > 0) {
      setState((prevState) => ({cursor: prevState.cursor - 1}));
    }

    if ((arrowUp || (shiftTab && state.dropdown)) && cursor === 0) {
      setState({cursor: searchResults.length});
    }

    if (backspace && props.backspaceDelete && this.getInputSize() === 0) {
      this.setState({// @ts-ignore
        values: this.state.values.slice(0, -1)
      });
    }
  };

  renderDropdown = () =>// @ts-ignore
    this.props.portal ? (
      ReactDOM.createPortal(// @ts-ignore
        <Dropdown props={this.props} state={this.state} methods={this.methods} />,// @ts-ignore
        this.dropdownRoot
      )
    ) : (// @ts-ignore
      <Dropdown props={this.props} state={this.state} methods={this.methods} />
    );

  createNew = (item) => {// @ts-ignore
    if (this.props.allowAdd) {
      const newValue = {
        isNew: true,// @ts-ignore
        [this.props.labelField]: item,// @ts-ignore
        [this.props.valueField]: item
      };

      this.addItem(newValue);// @ts-ignore
      this.props.onCreateNew(newValue);
      this.setState({ search: '' });
    }
  };


  Focus() {
    this.dropDown('toggle', undefined)
  }

  render() {
    return (
      <ClickOutside onClickOutside={(event) => this.dropDown('close', event)}>
        <ReactDropdownSelect
          onKeyDown={this.handleKeyDown}
          aria-label="Dropdown select"// @ts-ignore
          aria-expanded={this.state.dropdown}
          onClick={(event) => {
            this.dropDown('toggle', event)
          }}// @ts-ignore
          tabIndex={this.props.disabled ? '-1' : '0'}// @ts-ignore
          direction={this.props.direction}// @ts-ignore
          style={this.props.style}// @ts-ignore
          ref={this.select}// @ts-ignore
          disabled={this.props.disabled}// @ts-ignore
          className={`${LIB_NAME} ${this.props.className}`}// @ts-ignore
          color={this.props.color}// @ts-ignore
          {...this.props.additionalProps}>
          <Content event={this} props={this.props} state={this.state} methods={// @ts-ignore
            this.methods} itemContentRender={this.props.itemContentRender}/>

          {// @ts-ignore
            (this.props.name || this.props.required) && (
              <input
                tabIndex={-1}
                style={{ opacity: 0, width: 0, position: 'absolute' }}// @ts-ignore
                name={this.props.name}// @ts-ignore
                required={this.props.required}// @ts-ignore
                pattern={this.props.pattern}// @ts-ignore
                defaultValue={// @ts-ignore
                  this.state.values.map((value) => value[this.props.labelField]).toString() || []
                }// @ts-ignore
                disabled={this.props.disabled}
              />
            )}

          {// @ts-ignore
            this.props.loading && <Loading props={this.props} />}

          {// @ts-ignore
            this.props.clearable && (// @ts-ignore
              <Clear props={this.props} state={this.state} methods={this.methods} />
            )}

          {// @ts-ignore
            this.props.separator && (// @ts-ignore
              <Separator props={this.props} state={this.state} methods={this.methods} />
            )}

          {// @ts-ignore
            this.props.dropdownHandle && (
              <DropdownHandle// @ts-ignore
                onClick={() => this.select.current.focus()}
                props={this.props}
                state={this.state}// @ts-ignore
                methods={this.methods}
              />
            )}

          {// @ts-ignore
            this.state.dropdown && !this.props.disabled && this.renderDropdown()}
        </ReactDropdownSelect>
      </ClickOutside>
    );
  }
}
// @ts-ignore
MSelect.defaultProps = {
  addPlaceholder: '',
  placeholder: '选择...',
  values: [],
  options: [],
  multi: false,
  disabled: false,
  searchBy: 'label',
  sortBy: null,
  clearable: false,
  searchable: true,
  dropdownHandle: true,
  separator: false,
  keepOpen: undefined,
  noDataLabel: '无数据',
  createNewLabel: '添加 {search}',
  disabledLabel: 'disabled',
  dropdownGap: 5,
  closeOnScroll: false,
  debounceDelay: 0,
  labelField: 'label',
  valueField: 'id',
  color: '#0074D9',
  keepSelectedInList: true,
  closeOnSelect: false,
  clearOnBlur: true,
  clearOnSelect: true,
  dropdownLeftPosition: 'auto',
  dropdownPosition: 'auto',
  minDropdownWidth: '300px',
  dropdownHeight: '300px',
  dropdownWidth: '',
  autoFocus: false,
  portal: null,
  create: true,
  direction: 'ltr',
  name: null,
  required: false,
  pattern: undefined,
  onChange: () => undefined,
  onDropdownOpen: () => undefined,
  onDropdownClose: () => undefined,
  onDropdownCloseRequest: undefined,
  onClearAll: () => undefined,
  onSelectAll: () => undefined,
  onCreateNew: () => undefined,
  searchFn: () => undefined,
  handleKeyDownFn: () => undefined,
  additionalProps: null,
  backspaceDelete: true,
  compareValuesFunc: isEqual,
  itemContentRender: (label) => label,
};

const ReactDropdownSelect = styled.div`
  box-sizing: border-box;
  position: relative;
  display: flex;
  border: 1px solid #ccc;
  width: 100%;
  border-radius: 2px;
  padding: 0px 5px;
  flex-direction: row;
  direction: ${// @ts-ignore
  ({ direction }) => direction};
  align-items: baseline;
  cursor: pointer;
  min-height: 30px;
  ${// @ts-ignore
  ({ disabled }) =>
    disabled ? 'cursor: not-allowed;pointer-events: none;opacity: 0.3;' : 'pointer-events: all;'}

  :hover,
  :focus-within {
    border-color: ${({ color }) => color};
  }

  :focus,
  :focus-within {
    outline: 0;
    box-shadow: 0 0 0 3px ${({ color }) => hexToRGBA(color, 0.2)};
  }

  * {
    box-sizing: border-box;
  }
`;

export default MSelect;
