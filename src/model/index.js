import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import takeRight from 'lodash/takeRight';

// import takeRight from 'lodash/takeRight';
// import isAfter from 'date-fns/is_after';
import format from 'date-fns/format';

import 'styles/table.styl';
import { Flex, Box } from 'reflexbox';

import Table from 'antd/lib/table';
import 'antd/lib/table/style/css';

import UserTable from './UserTable';
import Graph from './Graph';

// import { RiskLevel, Value, Info } from './styles';
// const today = format(new Date(), 'YYYY-MM-DD');

const displayDate = text => {
  console.log(text);
  return <div key={text}>{text}</div>;
};

const yesterday = (text, record) => {
  console.log(text);
  // return <div key={i}>{text[i]}</div>;
};
//
// const displayEmergence = (text, record) => {
//   if (e === today) {
//     return <div style={{ color: '#008751' }} key={i}>{text[i]}</div>;
//   }
//   return <div key={i}>{text[i]}</div>;
// };

//columns for the model
const columns = [
  {
    title: 'Species',
    dataIndex: 'name',
    key: 'name',
    width: 150
    // render: text => displayDate(text)
  },
  {
    title: '% Cumulative emergence',
    children: [
      {
        title: 'Yesterday',
        dataIndex: 'y',
        key: 'y',
        width: 150
        // render: text => yesterday(text)
      }
      // {
      //   title: 'Today',
      //   dataIndex: 'y',
      //   key: 'y',
      //   width: 150
      // }
    ]
  }
];

@inject('store')
@observer
export default class Weed extends Component {
  render() {
    const {
      station,
      areRequiredFieldsSet,
      crabgrass,
      gFoxtail,
      yFoxtail,
      lambsquarters,
      pigweed,
      nightshade,
      ragweed,
      velvetleaf
    } = this.props.store.app;
    const { isTable } = this.props.store.logic;
    const { mobile } = this.props;

    return (
      <div>
        {isTable &&
          <Flex column>
            <Box>
              {!mobile
                ? <h2>
                    Crabgrass specie for
                    {' '}
                    <em style={{ color: '#008751' }}>{station.name}</em>
                  </h2>
                : <h3>
                    Crabgrass specie for
                    {' '}
                    <em style={{ color: '#008751' }}>{station.name}</em>
                  </h3>}
            </Box>

            <Flex justify="center">
              <Box mt={1} col={12} lg={12} md={12} sm={12}>
                <Table
                  size={mobile ? 'small' : 'middle'}
                  columns={columns}
                  rowKey={record => record.date}
                  loading={this.props.store.app.isLoading}
                  pagination={false}
                  dataSource={
                    areRequiredFieldsSet ? takeRight(crabgrass, 2) : null
                  }
                />
                <Table
                  showHeader={false}
                  size={mobile ? 'small' : 'middle'}
                  columns={columns}
                  rowKey={record => record.date}
                  loading={this.props.store.app.isLoading}
                  pagination={false}
                  dataSource={
                    areRequiredFieldsSet ? takeRight(gFoxtail, 2) : null
                  }
                />
                <Table
                  showHeader={false}
                  size={mobile ? 'small' : 'middle'}
                  columns={columns}
                  rowKey={record => record.date}
                  loading={this.props.store.app.isLoading}
                  pagination={false}
                  dataSource={
                    areRequiredFieldsSet ? takeRight(yFoxtail, 2) : null
                  }
                />
                <Table
                  showHeader={false}
                  size={mobile ? 'small' : 'middle'}
                  columns={columns}
                  rowKey={record => record.date}
                  loading={this.props.store.app.isLoading}
                  pagination={false}
                  dataSource={
                    areRequiredFieldsSet ? takeRight(lambsquarters, 2) : null
                  }
                />
                <Table
                  showHeader={false}
                  size={mobile ? 'small' : 'middle'}
                  columns={columns}
                  rowKey={record => record.date}
                  loading={this.props.store.app.isLoading}
                  pagination={false}
                  dataSource={
                    areRequiredFieldsSet ? takeRight(nightshade, 2) : null
                  }
                />
                <Table
                  showHeader={false}
                  size={mobile ? 'small' : 'middle'}
                  columns={columns}
                  rowKey={record => record.date}
                  loading={this.props.store.app.isLoading}
                  pagination={false}
                  dataSource={
                    areRequiredFieldsSet ? takeRight(pigweed, 2) : null
                  }
                />
                <Table
                  showHeader={false}
                  size={mobile ? 'small' : 'middle'}
                  columns={columns}
                  rowKey={record => record.date}
                  loading={this.props.store.app.isLoading}
                  pagination={false}
                  dataSource={
                    areRequiredFieldsSet ? takeRight(ragweed, 2) : null
                  }
                />
                <Table
                  showHeader={false}
                  size={mobile ? 'small' : 'middle'}
                  columns={columns}
                  rowKey={record => record.date}
                  loading={this.props.store.app.isLoading}
                  pagination={false}
                  dataSource={
                    areRequiredFieldsSet ? takeRight(velvetleaf, 2) : null
                  }
                />
              </Box>
            </Flex>
          </Flex>}
        {this.props.store.app.userData.length > 0 && <UserTable />}
        <Graph />
      </div>
    );
  }
}
