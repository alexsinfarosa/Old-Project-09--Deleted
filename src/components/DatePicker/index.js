import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import DatePicker from "antd/lib/date-picker";
import "antd/lib/date-picker/style/css";
import moment from "moment";

@inject("store")
@observer
export default class Datepicker extends Component {
  onChange = (date, dateString) => {
    const { areRequiredFieldsSet } = this.props.store.app;
    const mobile = this.props.size;
    this.props.store.app.setEndDate(dateString);
    this.props.store.app.loadGridData();
    this.props.store.logic.setIsMap(false);
    if (areRequiredFieldsSet && mobile) {
      this.props.store.logic.setIsSidebarOpen(false);
    }
    this.props.store.logic.setIsRowSelected(false);
  };

  render() {
    const { endDate } = this.props.store.app;
    return (
      <div style={{ marginBottom: "2rem" }}>
        <label>Date:</label>

        <DatePicker
          style={{ width: 200 }}
          size="large"
          allowClear={false}
          value={moment(endDate)}
          format="MMM DD YYYY"
          onChange={(date, dateString) => this.onChange(date, dateString)}
        />
      </div>
    );
  }
}
