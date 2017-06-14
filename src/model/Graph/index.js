import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
// import { toJS } from 'mobx';

import { Flex, Box } from 'reflexbox';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
  // Legend
} from 'recharts';

// components
import CustomLabels from './CustomLabel';

@inject('store')
@observer
export default class Graph extends Component {
  render() {
    const { graph } = this.props.store.app;
    let aspect;
    const w = window.innerWidth;
    if (w >= 0 && w <= 401) {
      aspect = 1;
    } else if (w > 401 && w <= 768) {
      aspect = 1.5;
    } else {
      aspect = 2;
    }
    return (
      <Box mb={4} mt={4}>
        <Flex column>
          <Box mb={4}>
            <ResponsiveContainer width="100%" aspect={aspect}>
              <LineChart
                width={600}
                height={200}
                data={graph.slice()}
                syncId="anyId"
                margin={{ top: 30, right: 0, left: -30, bottom: 30 }}
                onClick={d =>
                  this.props.store.app.setGraphStartDate(d.activeLabel)}
              >
                <XAxis dataKey="date" tick={<CustomLabels />} />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip />
                {/* <Legend verticalAlign="top" layout="horizontal" height={72} /> */}
                <Line dataKey="Large crabgrass" stroke="#ff7f00" dot={false} />
                <Line dataKey="Giant foxtail" stroke="#fdbf6f" dot={false} />
                <Line dataKey="Yellow foxtail" stroke="#e31a1c" dot={false} />
                <Line
                  dataKey="Common lambsquarters"
                  stroke="#fb9a99"
                  dot={false}
                />
                <Line
                  dataKey="Eastern black nightshade"
                  stroke="#33a02c"
                  dot={false}
                />
                <Line dataKey="Smooth pigweed" stroke="#b2df8a" dot={false} />
                <Line dataKey="Common ragweed" stroke="#1f78b4" dot={false} />
                <Line dataKey="Velvetleaf" stroke="#a6cee3" dot={false} />

              </LineChart>
            </ResponsiveContainer>
          </Box>

        </Flex>
      </Box>
    );
  }
}
