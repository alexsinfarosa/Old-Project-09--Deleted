import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import format from "date-fns/format";
// import { toJS } from 'mobx';

import { Flex, Box } from "reflexbox";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
  // Legend
} from "recharts";

// components
import CustomLabels from "./CustomLabel";
import Spin from "antd/lib/spin";
import "antd/lib/spin/style/css";

@inject("store")
@observer
export default class Graph extends Component {
  render() {
    const {
      getGraph,
      station,
      state,
      isLoading,
      selectedField,
      startDate
    } = this.props.store.app;
    const { isRowSelected } = this.props.store.logic;

    let idx = getGraph.findIndex(o => o.aboveZero === true);
    const aboveZero = getGraph[idx - 1];

    let filteredGraph = getGraph;
    if (getGraph[0].date === startDate) {
      filteredGraph = getGraph.slice(idx - 1);
    }
    // if (isField) {
    //   filteredGraph = currentField.slice();
    // }
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
      <div>
        {!isLoading
          ? <Flex mb={4} mt={2} column>
              <Flex column>
                {isRowSelected
                  ? <Box>
                      <h2>
                        Percent Cumulative Emergence (PCE) for{" "}
                        <span style={{ color: "#008751" }}>
                          {selectedField.station}, {selectedField.state}
                        </span>
                      </h2>
                      <h3>
                        Field name:{" "}
                        <span style={{ color: "#008751" }}>
                          {selectedField.field}
                        </span>
                      </h3>
                    </Box>
                  : <Flex column>
                      <Box>
                        <h2>
                          Percent Cumulative Emergence (PCE) for{" "}
                          <span style={{ color: "#008751" }}>
                            {station.name}, {state.postalCode}
                          </span>
                        </h2>
                      </Box>
                      <Box>
                        {idx > 20 &&
                          aboveZero &&
                          <h4>
                            From January 1 to {format(aboveZero.date, "MMMM D")},
                            all species are at 0%.
                          </h4>}
                      </Box>
                    </Flex>}
              </Flex>

              <Box mb={4}>
                <ResponsiveContainer width="100%" aspect={aspect}>
                  <LineChart
                    width={600}
                    height={200}
                    data={filteredGraph}
                    syncId="anyId"
                    margin={{ top: 30, right: 0, left: -30, bottom: 30 }}

                    // onClick={d =>
                    //   this.props.store.app.setGraphStartDate(d.activeLabel)}
                  >
                    <XAxis
                      dataKey="dateTable"
                      tick={<CustomLabels />}
                      domain={["dataMin", "dataMax"]}
                    />
                    <YAxis
                      unit="%"
                      type="number"
                      domain={["dataMin", "dataMax"]}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip />
                    {/* <Legend verticalAlign="top" layout="horizontal" height={72} /> */}
                    <Line
                      dataKey="Large crabgrass"
                      stroke="#ff7f00"
                      dot={false}
                    />
                    <Line
                      dataKey="Giant foxtail"
                      stroke="#fdbf6f"
                      dot={false}
                    />
                    <Line
                      dataKey="Yellow foxtail"
                      stroke="#e31a1c"
                      dot={false}
                    />
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
                    <Line
                      dataKey="Smooth pigweed"
                      stroke="#b2df8a"
                      dot={false}
                    />
                    <Line
                      dataKey="Common ragweed"
                      stroke="#1f78b4"
                      dot={false}
                    />
                    <Line dataKey="Velvetleaf" stroke="#a6cee3" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Flex>
          : <Flex justify="center" align="center" mt={4}>
              <Spin />
            </Flex>}
      </div>
    );
  }
}
