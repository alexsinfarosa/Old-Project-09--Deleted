import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';

// components
import Specie from 'components/Specie';
import State from 'components/State';
import Station from 'components/Station';
import DatePicker from 'components/DatePicker';

import { Box } from 'reflexbox';

// styled-components
import { SideBarContent } from './styles';

@inject('store')
@observer
class SideBar extends Component {
  // toggle Map component
  toggleMap = () => {
    // console.log(`switch to ${checked}`);
    this.props.store.logic.setIsMap();
    this.props.store.logic.setIsSidebarOpen(false);
  };

  toggleGraph = () => {
    // console.log(`switch to ${checked}`);
    this.props.store.logic.setIsGraph();
    this.props.store.logic.setIsSidebarOpen(false);
  };

  render() {
    const { specie } = this.props.store.app;
    const { isGraph, isMap } = this.props.store.logic;
    return (
      <SideBarContent>
        <Box mb={2} style={{ textAlign: 'center', letterSpacing: '1px' }}>
          <h3>
            <a
              style={{ color: '#B31B1B' }}
              href="http://www.cornell.edu/"
              target="_blank"
            >
              Cornell University
            </a>
          </h3>
        </Box>

        <hr />
        <br />

        {/* <Specie size={this.props.size} /> */}
        <State size={this.props.size} />
        <Station size={this.props.size} />
        <DatePicker size={this.props.size} />

        <Box mb={2} mt={2}>
          <Button size="large" icon="environment-o" onClick={this.toggleMap}>
            {isMap ? 'Hide Map' : 'Display Map'}
          </Button>
        </Box>

        {specie.graph &&
          <Box>
            <Button size="large" icon="bar-chart" onClick={this.toggleGraph}>
              {isGraph ? 'Hide Graph' : 'Display Graph'}
            </Button>
          </Box>}
      </SideBarContent>
    );
  }
}

export default SideBar;
