import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

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
const today = format(new Date(), 'YYYY-MM-DD');

const displayDate = text => {
  return text.map((e, i) => {
    const date = format(e, 'MMM DD');
    if (e === today) {
      return <div style={{ color: '#008751' }} key={i}>Today</div>;
    }
    return <div key={i}>{date}</div>;
  });
};

const displayDD = (text, record) => {
  return record.dates.map((e, i) => {
    if (e === today) {
      return <div style={{ color: '#008751' }} key={i}>{text[i]}</div>;
    }
    return <div key={i}>{text[i]}</div>;
  });
};

const displayEmergence = (text, record) => {
  return record.dates.map((e, i) => {
    if (e === today) {
      return <div style={{ color: '#008751' }} key={i}>{text[i]}</div>;
    }
    return <div key={i}>{text[i]}</div>;
  });
};

//columns for the model
const columns = [
  {
    title: 'Species',
    dataIndex: 'name',
    key: 'name',
    // className: 'table',
    width: 150
  },
  {
    title: '% Cumulative emergence',
    dataIndex: 'y',
    key: 'y',
    // className: 'table',
    width: 150,
    render: (text, record) => displayEmergence(text, record)
  },
  {
    title: 'Soil DD',
    dataIndex: 'cdd',
    key: 'cdd',
    // className: 'table',
    width: 150,
    render: (text, record) => displayDD(text, record)
  },
  {
    title: 'Dates',
    dataIndex: 'dates',
    key: 'dates',
    // className: 'table',
    width: 150,
    render: (text, record) => displayDate(text, record)
  }
];

@inject('store')
@observer
export default class Weed extends Component {
  render() {
    const { model, station, areRequiredFieldsSet } = this.props.store.app;
    const crabgrass = model.filter(specie => specie.name === 'Large crabgrass');
    const gFoxtail = model.filter(specie => specie.name === 'Giant foxtail');
    const yFoxtail = model.filter(specie => specie.name === 'Yellow foxtail');
    const lambsquarters = model.filter(
      specie => specie.name === 'Common lambsquarters'
    );
    const pigweed = model.filter(specie => specie.name === 'Smooth pigweed');
    const nightshade = model.filter(
      specie => specie.name === 'Eastern black nightshade'
    );
    const ragweed = model.filter(specie => specie.name === 'Common ragweed');
    const velvetleaf = model.filter(specie => specie.name === 'Velvetleaf');
    const { mobile } = this.props;

    return (
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
              rowKey={record => record}
              loading={this.props.store.app.isLoading}
              pagination={false}
              dataSource={areRequiredFieldsSet ? crabgrass : null}
            />
            <Table
              showHeader={false}
              size={mobile ? 'small' : 'middle'}
              columns={columns}
              rowKey={record => record}
              loading={this.props.store.app.isLoading}
              pagination={false}
              dataSource={areRequiredFieldsSet ? gFoxtail : null}
            />
            <Table
              showHeader={false}
              size={mobile ? 'small' : 'middle'}
              columns={columns}
              rowKey={record => record}
              loading={this.props.store.app.isLoading}
              pagination={false}
              dataSource={areRequiredFieldsSet ? yFoxtail : null}
            />
            <Table
              showHeader={false}
              size={mobile ? 'small' : 'middle'}
              columns={columns}
              rowKey={record => record}
              loading={this.props.store.app.isLoading}
              pagination={false}
              dataSource={areRequiredFieldsSet ? lambsquarters : null}
            />
            <Table
              showHeader={false}
              size={mobile ? 'small' : 'middle'}
              columns={columns}
              rowKey={record => record}
              loading={this.props.store.app.isLoading}
              pagination={false}
              dataSource={areRequiredFieldsSet ? nightshade : null}
            />
            <Table
              showHeader={false}
              size={mobile ? 'small' : 'middle'}
              columns={columns}
              rowKey={record => record}
              loading={this.props.store.app.isLoading}
              pagination={false}
              dataSource={areRequiredFieldsSet ? pigweed : null}
            />
            <Table
              showHeader={false}
              size={mobile ? 'small' : 'middle'}
              columns={columns}
              rowKey={record => record}
              loading={this.props.store.app.isLoading}
              pagination={false}
              dataSource={areRequiredFieldsSet ? ragweed : null}
            />
            <Table
              showHeader={false}
              size={mobile ? 'small' : 'middle'}
              columns={columns}
              rowKey={record => record}
              loading={this.props.store.app.isLoading}
              pagination={false}
              dataSource={areRequiredFieldsSet ? velvetleaf : null}
            />
          </Box>
        </Flex>
        {this.props.store.app.userData.length > 0 && <UserTable />}
        <Graph />
      </Flex>
    );
  }
}
