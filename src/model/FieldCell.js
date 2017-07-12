import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import Input from "antd/lib/input";
import "antd/lib/input/style/css";

import Icon from "antd/lib/icon";
import "antd/lib/icon/style/css";

@inject("store")
@observer
export default class FieldCell extends Component {
  handleChange = e => {
    const value = e.target.value;
    const { record } = this.props;
  };

  // onEdit = d => {
  //   const { userData } = this.props.store.app;
  //   const { record } = this.props;
  //   const idx = userData.findIndex(field => field.key === record.key);
  //   userData[idx]["field"] = dateString;
  //   this.props.store.logic.setIsEditing(true);
  //   const { userData } = this.props.store.app;
  //   const data = userData.slice(index, 1);
  //   this.props.store.app.updateUserData(data);
  // };

  render() {
    const { userData } = this.props.store.app;
    return (
      <div>
        {false
          ? <Input
              style={{ width: 120 }}
              size="small"
              onChange={this.handleChange}
              onPressEnter={this.check}
            />
          : <p>
              {this.props.value}
            </p>}
      </div>
    );
  }
}
