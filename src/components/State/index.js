import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Select from 'antd/lib/select';
import 'antd/lib/select/style/css';
const Option = Select.Option;

@inject('store')
@observer
export default class State extends Component {
  handleChange = value => {
    this.props.store.app.setState(value);
    this.props.store.logic.setIsMap(true);
    this.props.store.app.addIconsToStations();
  };
  render() {
    const { state, states } = this.props.store.app;
    const stateList = states.map(state =>
      <Option key={state.postalCode} value={state.name}>{state.name}</Option>
    );
    return (
      <div style={{ marginBottom: '2rem' }}>
        <label>State:</label>
        <Select
          name="state"
          size="large"
          value={state.name}
          placeholder="Select State"
          style={{ width: 200 }}
          onChange={this.handleChange}
        >
          {stateList}
        </Select>
      </div>
    );
  }
}
