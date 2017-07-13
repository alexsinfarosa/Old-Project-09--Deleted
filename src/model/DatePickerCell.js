import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import DatePicker from "antd/lib/date-picker";
import "antd/lib/date-picker/style/css";
import moment from "moment";
import format from "date-fns/format";

@inject("store")
@observer
export default class DatePickerCell extends Component {
  onChange = (date, dateString) => {
    this.props.store.app.replaceField(this.props.record, dateString);
    const today = format(new Date(), "YYYY-MM-DD");
    this.props.store.app.loadGridData(dateString, today);
  };

  render() {
    const { endDate } = this.props.store.app;
    return (
      <DatePicker
        showToday={false}
        style={{ width: 120 }}
        size="small"
        allowClear={false}
        value={moment(this.props.record.date)}
        format="YYYY-MM-DD"
        onChange={this.onChange}
      />
    );
  }
}
