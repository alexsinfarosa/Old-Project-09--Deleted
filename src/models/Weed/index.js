import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import takeRight from "lodash/takeRight";
import { autorun } from "mobx";

import "styles/table.styl";
import { Flex, Box } from "reflexbox";

import Table from "antd/lib/table";
import "antd/lib/table/style/css";

// components
import Graph from "./Graph";

// styled-components
import { RiskLevel, Value, Info } from "./styles";

// To display the 'forecast text' and style the cell
const forecastText = date => {
  return (
    <Flex justify="center" align="center" column>
      <Value>
        {date.split("-")[0]}
      </Value>

      <Info>
        {date.split("-")[1]}
      </Info>
    </Flex>
  );
};

//columns for the model
const columns = [
  {
    title: "Date",
    dataIndex: "dateTable",
    key: "dateTable",
    className: "table",
    render: date => forecastText(date)
  }
];

@inject("store")
@observer
export default class CercosporaBeticola extends Component {
  render() {
    const { weedData, station, areRequiredFieldsSet } = this.props.store.app;
    const { mobile } = this.props;

    return (
      <Flex column>
        <Box>
          {!mobile
            ? <h2>
                Weed
                {" "}
                <em style={{ color: "#008751" }}>{station.name}</em>
              </h2>
            : <h3>
                Weed
                {" "}
                <em style={{ color: "#008751" }}>{station.name}</em>
              </h3>}
        </Box>

        <Flex justify="center">
          <Box mt={1} col={12} lg={12} md={12} sm={12}>
            <Table
              size={mobile ? "small" : "middle"}
              columns={columns}
              rowKey={record => record.date}
              loading={weedData.length === 0}
              pagination={false}
              dataSource={areRequiredFieldsSet ? takeRight(weedData, 8) : null}
            />
          </Box>
        </Flex>
      </Flex>
    );
  }
}
