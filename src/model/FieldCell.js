import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import Input from "antd/lib/input";
import "antd/lib/input/style/css";

import Icon from "antd/lib/icon";
import "antd/lib/icon/style/css";

@inject("store")
@observer
export default class FieldCell extends Component {
  state = {
    value: this.props.value,
    editable: false
  };
  handleChange = e => {
    this.props.store.logic.setIsEditing(true);
    const value = e.target.value;
    const { userData } = this.props.store.app;
    const { key } = this.props.record;
    const idx = userData.findIndex(field => field.key === key);
    userData[idx]["field"] = value;
    this.setState({ value });
    localStorage.setItem(
      "userData",
      JSON.stringify(this.props.store.app.userData)
    );
    this.props.store.logic.setIsEditing(false);
  };
  check = e => {
    this.props.store.logic.setIsEditing(true);
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
    this.props.store.logic.setIsEditing(false);
  };
  edit = () => {
    this.props.store.logic.setIsEditing(true);
    this.setState({ editable: true });
  };

  render() {
    const { value, editable } = this.state;
    return (
      <div className="editable-cell">
        {editable
          ? <div className="editable-cell-input-wrapper">
              <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
              />
              <Icon
                type="check"
                className="editable-cell-icon-check"
                onClick={this.check}
              />
            </div>
          : <div className="editable-cell-text-wrapper">
              {value || " "}
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit}
              />
            </div>}
      </div>
    );
  }
}
