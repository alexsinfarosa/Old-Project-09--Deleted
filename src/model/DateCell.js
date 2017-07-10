import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import format from "date-fns/format";

// import Input from "antd/lib/input";
// import "antd/lib/input/style/css";

import Icon from "antd/lib/icon";
import "antd/lib/icon/style/css";

import Select from "antd/lib/select";
import "antd/lib/select/style/css";
const Option = Select.Option;

@inject("store")
@observer
export default class FieldCell extends Component {
  state = {
    value: this.props.value,
    editable: false
  };

  handleChange = e => {
    const value = format(e, "MMM D");
    this.setState({ value });
  };

  check = e => {
    this.setState({ editable: false });
    this.props.store.app.setEditable(false);
    this.props.store.app.loadGridData();
    this.props.store.app.setCurrentField(this.state.value);
    // localStorage.setItem(
    //   "userData",
    //   JSON.stringify(this.props.store.app.userData)
    // );
  };
  edit = () => {
    this.setState({ editable: true });
    this.props.store.app.setEditable(true);
    this.props.store.app.loadGridData();
  };

  render() {
    const { value, editable } = this.state;
    const { graph } = this.props.store.app;

    const dateList = graph.map(d =>
      <Option key={d.date} value={d.date}>
        {format(d.date, "MMM D")}
      </Option>
    );

    return (
      <div className="editable-cell">
        {editable
          ? <div className="editable-cell-input-wrapper">
              <Select
                name="date"
                size="small"
                value={this.state.value}
                // placeholder="Select State"
                style={{ width: 100 }}
                onChange={this.handleChange}
              >
                {dateList}
              </Select>
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
