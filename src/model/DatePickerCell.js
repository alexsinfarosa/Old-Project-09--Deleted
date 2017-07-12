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
    this.props.store.logic.setIsRowSelected(true);

    const { userData } = this.props.store.app;
    const { record } = this.props;
    const today = format(new Date(), "YYYY-MM-DD");
    const idx = userData.findIndex(field => field.key === record.key);
    userData[idx]["date"] = dateString;
    userData[idx]["key"] = Math.round();
    this.props.store.app.updateUserData(userData);
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
