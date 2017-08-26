import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import format from "date-fns/format";
// import { toJS } from 'mobx';

import "styles/table.styl";
import { Flex, Box } from "reflexbox";

import Table from "antd/lib/table";
import "antd/lib/table/style/css";

import Button from "antd/lib/button";
import "antd/lib/button/style/css";

import Popconfirm from "antd/lib/popconfirm";
import "antd/lib/popconfirm/style/css";

import FieldCell from "./FieldCell";
import DatePickerCell from "./DatePickerCell";

@inject("store")
@observer
export default class UserTable extends Component {
  constructor(props) {
    super(props);
    const { userData } = this.props.store.app;
    userData.map(e => (e.selected = ""));
  }

  onGraph = field => {
    const { isGraph } = this.props.store.logic;
    const { userData } = this.props.store.app;
    userData.map(e => (e.selected = ""));
    if (!isGraph) {
      field.selected = "selected";
      this.props.store.logic.setIsRowSelected(true);
      this.props.store.app.setSelectedField(field);
      const today = format(new Date(), "YYYY-MM-DD");
      this.props.store.app.loadGridData(field.date, today);
      this.props.store.logic.setIsGraph(true);
    } else {
      this.props.store.app.loadGridData();
      this.props.store.logic.setIsRowSelected(false);
      this.props.store.logic.setIsGraph(false);
    }
  };

  onDelete = index => {
    const { userData } = this.props.store.app;
    const data = [...userData];
    data.splice(index, 1);
    this.props.store.app.updateUserData(data);
  };

  // rowSelection = record => {
  //   return record.selected === "selected" ? "selected" : "";
  // };

  render() {
    const { mobile } = this.props;
    const { userData, areRequiredFieldsSet } = this.props.store.app;
    //columns for the model
    const columns = [
      {
        title: "Field",
        dataIndex: "field",
        key: "field",
        width: "30%",
        render: (text, record, index) =>
          <FieldCell value={text} record={record} idx={this.index} />
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        width: "35%",
        render: (text, record, index) => <DatePickerCell record={record} />
      },
      {
        title: "Action",
        dataIndex: "operation",
        key: "operation",
        width: "35%",
        render: (text, record, index) => {
          return userData.length > 0
            ? <span>
                <a onClick={() => this.onGraph(record)}>Graph</a>
                <span className="ant-divider" />
                <Popconfirm
                  title="Sure to delete?"
                  onConfirm={() => this.onDelete(index)}
                >
                  <a href="#">Delete</a>
                </Popconfirm>
              </span>
            : null;
        }
      }
    ];

    return (
      <Flex justify="center">
        {userData.map(e => console.log(e.field, e.selected))}

        <Box mb={1} col={12} lg={12} md={12} sm={12}>
          <Flex align="center" mt={1} mb={1}>
            <h2>User Data</h2>
          </Flex>

          <Table
            size={
              mobile ? "small" : "middle" // bordered
            }
            columns={columns}
            scroll={{ y: 500 }}
            rowKey={record => record.key}
            pagination={false}
            rowClassName={record => record.selected}
            dataSource={areRequiredFieldsSet ? userData.slice() : null}
          />
        </Box>
      </Flex>
    );
  }
}
