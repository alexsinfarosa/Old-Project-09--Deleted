import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
// import { toJS } from 'mobx';

import 'styles/table.styl';
import { Flex, Box } from 'reflexbox';

import Table from 'antd/lib/table';
import 'antd/lib/table/style/css';

//columns for the model
const columns = [
  {
    title: 'Field',
    dataIndex: 'field',
    key: 'field',
    width: 150
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    width: 150
  }
];

@inject('store')
@observer
export default class UserTable extends Component {
  render() {
    const { mobile } = this.props;
    const { dates, areRequiredFieldsSet } = this.props.store.app;

    return (
      <Flex justify="center">
        <Box mt={4} mb={4} col={12} lg={12} md={12} sm={12}>
          <h2>User Data</h2>
          <Table
            size={mobile ? 'small' : 'middle'}
            columns={columns}
            scroll={{ y: 500 }}
            rowKey={record => record.date}
            loading={this.props.store.app.isLoading}
            pagination={false}
            dataSource={areRequiredFieldsSet ? dates.slice() : null}
          />
        </Box>
      </Flex>
    );
  }
}
