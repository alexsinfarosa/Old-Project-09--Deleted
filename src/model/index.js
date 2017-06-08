import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

// import takeRight from 'lodash/takeRight';
import isAfter from 'date-fns/is_after';
import format from 'date-fns/format';

import 'styles/table.styl';
import { Flex, Box } from 'reflexbox';

import Table from 'antd/lib/table';
import 'antd/lib/table/style/css';

// styled-components
import { Value, Info } from './styles';

// To display the 'forecast text' and style the cell
const forecastText = date => {
  const today = new Date();
  if (isAfter(date, today)) {
    return (
      <Flex justify="center" align="center" column>
        <Value>
          {format(date, 'MMM D')}
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
        {format(date, 'MMM D')}
      </Value>
    </Flex>
  );
};

const riskLevel = (text, record, i) => {
  // console.log(text, record, i);
  return (
    <Flex justify="center" align="center" column>
      {record.y >= 25
        ? <Value style={{ color: record.color }}>
            {text}
          </Value>
        : <Value>{text}</Value>}
      {/* <Info col={7} lg={4} md={4} sm={7} style={{ background: record.color }}>
        {record.riskLevel}
      </Info> */}
    </Flex>
  );
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
    render: (text, record) =>
      record.y.slice().map((e, i) => <div key={i}>{e}</div>)
  },
  {
    title: 'Soil DD',
    dataIndex: 'cdd',
    key: 'cdd',
    // className: 'table',
    width: 150,
    render: (text, record) =>
      record.cdd.slice().map((e, i) => <div key={i}>{e}</div>)
  },
  {
    title: 'Dates',
    dataIndex: 'dates',
    key: 'dates',
    // className: 'table',
    width: 150,
    render: (text, record) =>
      record.dates
        .slice()
        .map((e, i) => <div key={i}>{format(e, 'MMM DD')}</div>)
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
              scroll={{ y: 500 }}
              rowKey={record => record}
              loading={this.props.store.app.isLoading}
              pagination={false}
              dataSource={areRequiredFieldsSet ? crabgrass : null}
            />
            <Table
              showHeader={false}
              size={mobile ? 'small' : 'middle'}
              columns={columns}
              scroll={{ y: 500 }}
              rowKey={record => record}
              loading={this.props.store.app.isLoading}
              pagination={false}
              dataSource={areRequiredFieldsSet ? gFoxtail : null}
            />
            <Table
              showHeader={false}
              size={mobile ? 'small' : 'middle'}
              columns={columns}
              scroll={{ y: 500 }}
              rowKey={record => record}
              loading={this.props.store.app.isLoading}
              pagination={false}
              dataSource={areRequiredFieldsSet ? yFoxtail : null}
            />
            <Table
              showHeader={false}
              size={mobile ? 'small' : 'middle'}
              columns={columns}
              scroll={{ y: 500 }}
              rowKey={record => record}
              loading={this.props.store.app.isLoading}
              pagination={false}
              dataSource={areRequiredFieldsSet ? lambsquarters : null}
            />
            <Table
              showHeader={false}
              size={mobile ? 'small' : 'middle'}
              columns={columns}
              scroll={{ y: 500 }}
              rowKey={record => record}
              loading={this.props.store.app.isLoading}
              pagination={false}
              dataSource={areRequiredFieldsSet ? nightshade : null}
            />
            <Table
              showHeader={false}
              size={mobile ? 'small' : 'middle'}
              columns={columns}
              scroll={{ y: 500 }}
              rowKey={record => record}
              loading={this.props.store.app.isLoading}
              pagination={false}
              dataSource={areRequiredFieldsSet ? pigweed : null}
            />
            <Table
              showHeader={false}
              size={mobile ? 'small' : 'middle'}
              columns={columns}
              scroll={{ y: 500 }}
              rowKey={record => record}
              loading={this.props.store.app.isLoading}
              pagination={false}
              dataSource={areRequiredFieldsSet ? ragweed : null}
            />
            <Table
              showHeader={false}
              size={mobile ? 'small' : 'middle'}
              columns={columns}
              scroll={{ y: 500 }}
              rowKey={record => record}
              loading={this.props.store.app.isLoading}
              pagination={false}
              dataSource={areRequiredFieldsSet ? velvetleaf : null}
            />
          </Box>
        </Flex>
      </Flex>
    );
  }
}
