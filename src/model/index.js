import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import takeRight from "lodash/takeRight";
import isAfter from "date-fns/is_after";
import format from "date-fns/format";

import "styles/table.styl";
import { Flex, Box } from "reflexbox";

import Table from "antd/lib/table";
import "antd/lib/table/style/css";

// styled-components
import { Value, Info } from "./styles";

// To display the 'forecast text' and style the cell
const forecastText = date => {
  const today = new Date();
  if (isAfter(date, today)) {
    return (
      <Flex justify="center" align="center" column>
        <Value>
          {format(date, "MMM D")}
        </Value>
        <Info>
          Forecast
        </Info>
      </Flex>
    );
  }
  return (
    <Flex justify="center" align="center" column>
      <Value>
        {format(date, "MMM D")}
      </Value>
    </Flex>
  );
};

//columns for the model
const columns = [
  {
    title: "Date",
    dataIndex: "crabgrass.date",
    key: "date",
    className: "table",
    render: date => forecastText(date)
  },
  {
    title: "Crabgrass",
    dataIndex: "crabgrass.y",
    key: "crabgrass",
    className: "table"
    // render: date => forecastText(date)
  }
];

@inject("store")
@observer
export default class Weed extends Component {
  render() {
    const { model, station, areRequiredFieldsSet } = this.props.store.app;
    const { mobile } = this.props;

    return (
      <Flex column>
        <Box>
          {!mobile
            ? <h2>
                Weed model for
                {" "}
                <em style={{ color: "#008751" }}>{station.name}</em>
              </h2>
            : <h3>
                Weed model for
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
              loading={this.props.store.app.isLoading}
              pagination={false}
              dataSource={areRequiredFieldsSet ? takeRight(model, 10) : null}
            />
          </Box>
        </Flex>
      </Flex>
    );
  }
}
