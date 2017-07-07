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

import Input from "antd/lib/input";
import "antd/lib/input/style/css";

import Icon from "antd/lib/icon";
import "antd/lib/icon/style/css";

import Popconfirm from "antd/lib/popconfirm";
import "antd/lib/popconfirm/style/css";

class EditableCell extends Component {
  state = {
    value: this.props.value,
    editable: false
  };
  handleChange = e => {
    const value = e.target.value;
    this.setState({ value });
  };
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  };
  edit = () => {
    this.setState({ editable: true });
  };
  render() {
    const { value, editable } = this.state;
    return (
      <div className="editable-cell">
        {editable
          ? <div className="editable-cell-input-wrapper">
              <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
              />
              <Icon
                type="check"
                className="editable-cell-icon-check"
                onClick={this.check}
              />
            </div>
          : <div className="editable-cell-text-wrapper">
              {value || " "}
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit}
              />
            </div>}
      </div>
    );
  }
}

const onCellChange = (index, key) => {
  return value => {
    const dataSource = [...this.state.dataSource];
    dataSource[index][key] = value;
    this.setState({ dataSource });
  };
};

const onDelete = index => {
  const dataSource = [...this.state.dataSource];
  dataSource.splice(index, 1);
  this.setState({ dataSource });
};

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
      return true
        ? <Popconfirm title="Sure to delete?" onConfirm={() => onDelete(index)}>
            <a href="#">Delete</a>
          </Popconfirm>
        : null;
    }
  }
];

@inject("store")
@observer
export default class UserTable extends Component {
  isRecordInArray = () => {
    const { endDate, userData } = this.props.store.app;
    if (userData.find(record => record.date === endDate) === undefined)
      return true;
  };
  render() {
    const { mobile } = this.props;
    const { userData, areRequiredFieldsSet } = this.props.store.app;
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
