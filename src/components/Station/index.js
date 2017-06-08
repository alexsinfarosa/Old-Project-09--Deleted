import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Select from 'antd/lib/select';
import 'antd/lib/select/style/css';
const Option = Select.Option;

@inject('store')
@observer
export default class Station extends Component {
  handleChange = async value => {
    const mobile = this.props.size;
    await this.props.store.app.setStation(value);
    this.props.store.app.loadData();

    if (this.props.store.app.areRequiredFieldsSet && mobile) {
      this.props.store.logic.setIsSidebarOpen(false);
    }
  };
  render() {
    const { currentStateStations, station } = this.props.store.app;

    const stationList = currentStateStations.map(station =>
      <Option key={`${station.id} ${station.network}`} value={station.name}>
        {station.name}
      </Option>
    );

    return (
      <div style={{ marginBottom: '2rem' }}>
        <label>Station:</label>
        <Select
          name="station"
          size="large"
          value={station.name}
          placeholder={`Select Station (${currentStateStations.length})`}
          style={{ width: 200 }}
          onChange={this.handleChange}
        >
          {stationList}
        </Select>
      </div>
    );
  }
}
