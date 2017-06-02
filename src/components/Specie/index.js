import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
// import { toJS } from "mobx";

import Select from 'antd/lib/select';
import 'antd/lib/select/style/css';
const Option = Select.Option;

@inject('store')
@observer
export default class Specie extends Component {
  handleChange = value => {
    const { areRequiredFieldsSet } = this.props.store.app;
    const mobile = this.props.size;
    this.props.store.app.setSpecie(value);
    if (areRequiredFieldsSet && mobile) {
      // console.log('inside Specie');
      this.props.store.logic.setIsSidebarOpen(false);
    }
    // console.log(`specie: ${value}`);
  };
  render() {
    const { specie, species } = this.props.store.app;

    const speciesList = species.map((specie, i) => {
      return (
        <Option key={i} value={specie.name}>
          {specie.name}
        </Option>
      );
    });
    return (
      <div style={{ marginBottom: '2rem' }}>
        <label>Specie:</label>
        <Select
          name="specie"
          size="large"
          autoFocus
          value={specie.name}
          placeholder="Select Specie"
          style={{ width: 200 }}
          onChange={this.handleChange}
        >
          {speciesList}
        </Select>
        {/* <h2>Cercospora beticola</h2> */}
      </div>
    );
  }
}
