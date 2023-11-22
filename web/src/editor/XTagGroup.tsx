import React from 'react';
import { Input, Tag } from 'antd';
import XBaseEditor, { XBaseEditorProps } from "../base/XBaseEditor";
import XIcon from '../display/XIcon';

export interface XTagGroupProps extends XBaseEditorProps {
  /**
   * 标签之间的分隔字符
   */
  splitStr?: string,
  /**
   * 创建新标签文本
   */
  newTagStr?: string,
  colors?: string[],
  allowEdit?: boolean,
}

/**
 * 一组标签选择，可以自定义增加删除
 * @name 标签组
 * @groupName 选择
 */
export default class XTagGroup extends XBaseEditor<XTagGroupProps, any> {
  static ComponentName = "标签组";
  static Tag: typeof Tag = Tag;
  static defaultProps = {
    ...XBaseEditor.defaultProps,
    splitStr: ' ',
    newTagStr: '新标签',
    colors: ["#ff0000"],
    allowEdit: true,
  };

  input: any
  editInput: any

  constructor(props) {
    super(props);
    this.state.tags = [];
    this.state.inputVisible = false;
    this.state.inputValue = '';
    this.state.editInputIndex = -1;
    this.state.editInputValue = '';
  }

  toTags(value) {
    if (!value) {
      return [];
    }
    return value.split(this.props.splitStr).filter(tag => tag !== " " && tag !== "");
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.state.value) {
      this.setState({tags: this.toTags(this.state.value)})
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.value != this.state.value) {
      this.props.onValueChange && this.props.onValueChange(this.state.value)
    }
  }

  SetValue(value, triggerValueChange = true) {
    super.SetValue(value, triggerValueChange);
    this.setState({tags: this.toTags(value)})
  }

  handleClose = removedTag => {
    this.useStateValue = true;
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({
      value: tags.join(this.props.splitStr),
      tags
    }, () => {
      this.onValueChangeEvent()
    });
  };

  showInput = () => {
    this.setState({inputVisible: true}, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({inputValue: e.target.value});
  };

  handleInputConfirm = () => {
    let {inputValue, tags} = this.state;
    inputValue = inputValue.trim();
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.useStateValue = true;
    this.setState({
      value: tags.join(this.props.splitStr),
      tags,
      inputVisible: false,
      inputValue: '',
    }, () => {
      this.onValueChangeEvent()
    });
  };

  handleInputConfirmProceed = () => {
    this.handleInputConfirm();
    this.showInput();
  }

  handleEditInputChange = e => {
    this.setState({editInputValue: e.target.value});
  };

  handleEditInputConfirm = () => {
    this.useStateValue = true;
    let {tags, editInputIndex, editInputValue} = this.state;
    editInputValue = editInputValue.trim();
    if (editInputValue && (tags[editInputIndex] == editInputValue || tags.indexOf(editInputValue) === -1)) {
      tags[editInputIndex] = editInputValue;//更新
    } else {
      tags.splice(editInputIndex, 1);
    }
    this.setState({
      value: tags.join(this.props.splitStr),
      tags: tags,
      editInputIndex: -1,
      editInputValue: '',
    }, () => {
      this.onValueChangeEvent()
    });
  };

  getEditorStyle() {
    const style = super.getEditorStyle();
    if (this.state.fileList?.length > 0) {
      return {
        ...style,
        flexWrap: 'wrap',
        gap: '5px'}
    }
    return style;
  }

  renderEditor() {
    const {tags, inputVisible, inputValue, editInputIndex, editInputValue} = this.state;
    let style = {cursor: 'pointer', marginTop: 5, marginRight: 5, fontSize: 14, lineHeight: "30px",}
    return <div style={{marginTop: -5}}>
      {tags.map((tag, index) => {
        if (editInputIndex === index) {
          return <Input
            ref={e => this.editInput = e}
            key={tag}
            style={{width: 100}}
            className="tag-input"
            value={editInputValue}
            onChange={this.handleEditInputChange}
            onBlur={this.handleEditInputConfirm}
            onPressEnter={this.handleEditInputConfirm}/>;
        }
        const isLongTag = tag.length > 20;
        const tagElem = <Tag icon={XIcon.TagOutlined()} style={style} title={tag} className="edit-tag" key={tag}
                             closable={true} onClose={() => this.handleClose(tag)}>
              <span onClick={e => {
                this.setState({editInputIndex: index, editInputValue: tag}, () => this.editInput?.focus());
                e.preventDefault();
              }}>
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </span>
        </Tag>;
        return tagElem;
        // return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
      })}
      {inputVisible ?
        <Input
          ref={e => this.input = e}
          type="text"
          size="small"
          style={{width: 100, height: 32, padding: "3px 15px"}}
          className="tag-input"
          value={inputValue}
          onChange={this.handleInputChange}
          onBlur={this.handleInputConfirm}
          onPressEnter={this.handleInputConfirmProceed}/> :
        <Tag style={style} className="site-tag-plus" onClick={this.showInput}>
          {XIcon.PlusOutlined()} {this.props.newTagStr}
        </Tag>}
    </div>
  }
}
