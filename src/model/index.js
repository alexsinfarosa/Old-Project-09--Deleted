import React, { Component } from "react";
import { inject, observer } from "mobx-react";

// import takeRight from 'lodash/takeRight';
// import isAfter from 'date-fns/is_after';
// import format from 'date-fns/format';

import "styles/table.styl";
import { Flex, Box } from "reflexbox";

import Table from "antd/lib/table";
import "antd/lib/table/style/css";

import UserTable from "./UserTable";
import Graph from "./Graph";

//columns for the model
const columns = [
  {
    title: "Species",
    dataIndex: "name",
    key: "name",
    width: 150
  },
  {
    title: "Percent Cumulative Emergence",
    children: [
      {
        title: "Yesterday",
        dataIndex: "yesterday",
        key: "yesterday",
        width: 150
      },
      {
        title: "Today",
        dataIndex: "today",
        key: "today",
        width: 150
      },
      {
        title: "Forecast (currently not available)",
        dataIndex: "tomorrow",
        key: "tomorrow",
        width: 150
      }
    ]
  }
];

@inject("store")
@observer
export default class Weed extends Component {
  render() {
    const {
      station,
      state,
      areRequiredFieldsSet,
      crabgrass,
      gFoxtail,
      yFoxtail,
      lambsquarters,
      pigweed,
      ragweed,
      nightshade,
      velvetleaf
    } = this.props.store.app;
    const { isTable } = this.props.store.logic;
    const { mobile } = this.props;
    const species = [
      crabgrass,
      gFoxtail,
      yFoxtail,
      lambsquarters,
      pigweed,
      ragweed,
      nightshade,
      velvetleaf
    ];

    return (
      <div>
        <UserTable />
        <Graph />
        {isTable &&
          <Flex column>
            <Box>
              {!mobile
                ? <h2>
                    Weed species for{" "}
                    <em style={{ color: "#008751" }}>
                      {station.name}, {state.postalCode}
                    </em>
                  </h2>
                : <h3>
                    Weed species for{" "}
                    <em style={{ color: "#008751" }}>
                      {station.name}, {state.postalCode}
                    </em>
                  </h3>}
            </Box>

            <Flex justify="center">
              <Box mt={1} col={12} lg={12} md={12} sm={12}>
                {species.map((specie, i) =>
                  <Table
                    key={i}
                    showHeader={i === 0 ? true : false}
                    size={mobile ? "small" : "middle"}
                    columns={columns}
                    rowKey={record => record}
                    loading={this.props.store.app.isLoading}
                    pagination={false}
                    dataSource={areRequiredFieldsSet ? specie.slice(-1) : null}
                  />
                )}
              </Box>
            </Flex>
          </Flex>}
      </div>
    );
  }
}
