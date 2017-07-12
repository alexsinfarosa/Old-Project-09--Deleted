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
  onGraph = d => {
    this.props.store.app.setSelectedField(d);
    const { isEditing } = this.props.store.logic;
    const today = format(new Date(), "YYYY-MM-DD");
    console.log(d.date);

    if (!isEditing) {
      this.props.store.app.loadGridData(d.date, today);
    }
  };

  onEdit = index => {
    const { userData } = this.props.store.app;
    userData[index]["editing"] = true;
  };

  onDelete = index => {
    this.props.store.logic.setIsEditing(true);
    const { userData } = this.props.store.app;
    const data = [...userData];
    data.splice(index, 1);
    this.props.store.app.updateUserData(data);
  };

  render() {
    const { mobile } = this.props;
    const { userData, areRequiredFieldsSet, editable } = this.props.store.app;
    const { isEditing } = this.props.store.logic;
    //columns for the model
    const columns = [
      {
        title: "Field",
        dataIndex: "field",
        key: "field",
        width: "30%",
        render: (text, record, index) =>
          <FieldCell value={text} record={record} />
      },
      {
        title: "Date",
        dataIndex: "date",
        width: "35%",
        render: (text, record, index) => <DatePickerCell record={record} />
      },
      {
        title: "Action",
        dataIndex: "operation",
        width: "35%",
        render: (text, record, index) => {
          return userData.length > 0
            ? <span>
                <a onClick={() => this.onGraph(record)}>Graph</a>
                <span className="ant-divider" />
                <a onClick={() => this.onEdit(index)}>Edit</a>
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

    // rowSelection object indicates the need for row selection
    const rowSelection = {
      type: "radio",
      onSelect: (rec, sel, selRows) => {
        console.log(rec, sel);
      }
    };

    return (
      <Flex justify="center">
        <Box mb={1} col={12} lg={12} md={12} sm={12}>
          <Flex justify="space-between" align="center" mt={1} mb={1}>
            <h2>User Data</h2>

            <Button
              onClick={() => this.props.store.app.addUserData()}
              type="default"
            >
              Reset PCE
            </Button>
          </Flex>

          <Table
            // bordered
            size={mobile ? "small" : "middle"}
            columns={columns}
            scroll={{ y: 500 }}
            rowKey={record => record.key}
            // loading={this.props.store.app.isLoading}
            pagination={false}
            // rowSelection={rowSelection}
            // onGraph={this.onGraph}
            dataSource={areRequiredFieldsSet ? userData.slice() : null}
          />
        </Box>
      </Flex>
    );
  }
}
