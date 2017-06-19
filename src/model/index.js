import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

// import takeRight from 'lodash/takeRight';
// import isAfter from 'date-fns/is_after';
// import format from 'date-fns/format';

import 'styles/table.styl';
import { Flex, Box } from 'reflexbox';

import Table from 'antd/lib/table';
import 'antd/lib/table/style/css';

import UserTable from './UserTable';
import Graph from './Graph';

// import { RiskLevel, Value, Info } from './styles';
// const today = format(new Date(), 'YYYY-MM-DD');

// const displayDate = text => {
//   return <div key={text}>{text}</div>;
// };

// const displayDD = (text, record) => {
//   return record.dates.map((e, i) => {
//     if (e === today) {
//       return <div style={{ color: '#008751' }} key={i}>{text[i]}</div>;
//     }
//     return <div key={i}>{text[i]}</div>;
//   });
// };
//
// const displayEmergence = (text, record) => {
//   return record.dates.map((e, i) => {
//     if (e === today) {
//       return <div style={{ color: '#008751' }} key={i}>{text[i]}</div>;
//     }
//     return <div key={i}>{text[i]}</div>;
//   });
// };

//columns for the model
const columns = [
  {
    title: 'Species',
    dataIndex: 'name',
    key: 'name',
    width: 150
  },
  {
    title: 'Percent Cumulative Emergence',
    children: [
      {
        title: 'Yesterday',
        dataIndex: 'yesterday',
        key: 'yesterday',
        width: 150
      },
      {
        title: 'Today',
        dataIndex: 'today',
        key: 'today',
        width: 150
      },
      {
        title: 'Tomorrow/Forecast',
        dataIndex: 'tomorrow',
        key: 'tomorrow',
        width: 150
      }
    ]
  }
];

@inject('store')
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

    return (
      <div>
        <UserTable />
        <Graph />
        {isTable &&
          <Flex column>
            <Box>
              {!mobile
                ? <h2>
                    Weed species for
                    {' '}
                    <em style={{ color: '#008751' }}>
                      {station.name}, {state.postalCode}
                    </em>
                  </h2>
                : <h3>
                    Weed species for
                    {' '}
                    <em style={{ color: '#008751' }}>
                      {station.name}, {state.postalCode}
                    </em>
                  </h3>}
            </Box>

            <Flex justify="center">
              <Box mt={1} col={12} lg={12} md={12} sm={12}>
                <Table
                  size={mobile ? 'small' : 'middle'}
                  columns={columns}
                  rowKey={record => record}
                  loading={this.props.store.app.isLoading}
                  pagination={false}
                  dataSource={areRequiredFieldsSet ? crabgrass.slice(-1) : null}
                />
                <Table
                  showHeader={false}
                  size={mobile ? 'small' : 'middle'}
                  columns={columns}
                  rowKey={record => record}
                  loading={this.props.store.app.isLoading}
                  pagination={false}
                  dataSource={areRequiredFieldsSet ? gFoxtail.slice(-1) : null}
                />
                <Table
                  showHeader={false}
                  size={mobile ? 'small' : 'middle'}
                  columns={columns}
                  rowKey={record => record}
                  loading={this.props.store.app.isLoading}
                  pagination={false}
                  dataSource={areRequiredFieldsSet ? yFoxtail.slice(-1) : null}
                />
                <Table
                  showHeader={false}
                  size={mobile ? 'small' : 'middle'}
                  columns={columns}
                  rowKey={record => record}
                  loading={this.props.store.app.isLoading}
                  pagination={false}
                  dataSource={
                    areRequiredFieldsSet ? lambsquarters.slice(-1) : null
                  }
                />
                <Table
                  showHeader={false}
                  size={mobile ? 'small' : 'middle'}
                  columns={columns}
                  rowKey={record => record}
                  loading={this.props.store.app.isLoading}
                  pagination={false}
                  dataSource={
                    areRequiredFieldsSet ? nightshade.slice(-1) : null
                  }
                />
                <Table
                  showHeader={false}
                  size={mobile ? 'small' : 'middle'}
                  columns={columns}
                  rowKey={record => record}
                  loading={this.props.store.app.isLoading}
                  pagination={false}
                  dataSource={areRequiredFieldsSet ? pigweed.slice(-1) : null}
                />
                <Table
                  showHeader={false}
                  size={mobile ? 'small' : 'middle'}
                  columns={columns}
                  rowKey={record => record}
                  loading={this.props.store.app.isLoading}
                  pagination={false}
                  dataSource={areRequiredFieldsSet ? ragweed.slice(-1) : null}
                />
                <Table
                  showHeader={false}
                  size={mobile ? 'small' : 'middle'}
                  columns={columns}
                  rowKey={record => record}
                  loading={this.props.store.app.isLoading}
                  pagination={false}
                  dataSource={
                    areRequiredFieldsSet ? velvetleaf.slice(-1) : null
                  }
                />
              </Box>
            </Flex>
          </Flex>}
      </div>
    );
  }
}
