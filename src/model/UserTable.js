import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import format from 'date-fns/format';
// import { toJS } from 'mobx';

import "styles/table.styl";
import { Flex, Box } from "reflexbox";

import Table from "antd/lib/table";
import "antd/lib/table/style/css";

import Button from "antd/lib/button";
import "antd/lib/button/style/css";

import Popconfirm from "antd/lib/popconfirm";
import "antd/lib/popconfirm/style/css";

import EditableCell from "./EditableCell";

const onCellChange = (index, key) => {
  return value => {
    const dataSource = [...this.state.dataSource];
    dataSource[index][key] = value;
    this.setState({ dataSource });
  };
};

@inject("store")
@observer
export default class UserTable extends Component {
  isRecordInArray = () => {
    const { endDate, userData } = this.props.store.app;
    if (userData.find(record => record.date === endDate) === undefined)
      return true;
  };

  onDelete = index => {
    const { userData } = this.props.store.app;
    const data = [...userData];
    data.splice(index, 1);
    this.props.store.app.updateUserData(data);
  };

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
          <EditableCell value={text} onChange={onCellChange(index, "field")} />
      },
      {
        title: "Date",
        dataIndex: "dateTable",
        width: "35%"
      },
      {
        title: "Operation",
        dataIndex: "operation",
        width: "35%",
        render: (text, record, index) => {
          return userData.length > 1
            ? <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.onDelete(index)}
              >
                <a href="#">Delete</a>
              </Popconfirm>
            : null;
        }
      }
    ];

    return (
      <Flex justify="center">
        <Box mb={1} col={12} lg={12} md={12} sm={12}>
          <Flex justify="space-between" align="center" mt={1} mb={1}>
            <h2>User Data</h2>
            {true
              ? <Button
                  onClick={() => this.props.store.app.setUserData()}
                  type="default"
                >
                  Reset PCE
                </Button>
              : <Button type="default" disabled>
                  ADD
                </Button>}
          </Flex>
          <Table
            bordered
            size={mobile ? "small" : "middle"}
            columns={columns}
            scroll={{ y: 500 }}
            rowKey={record => record.key}
            loading={this.props.store.app.isLoading}
            pagination={false}
            onRowClick={d => this.props.store.app.setCurrentField(d)}
            dataSource={areRequiredFieldsSet ? userData.slice() : null}
          />
        </Box>
      </Flex>
    );
  }
}
