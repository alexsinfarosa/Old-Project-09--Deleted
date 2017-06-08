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
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    className: 'table',
    width: 150,
    render: date => forecastText(date)
  },
  {
    title: '% Cumulative emergence',
    children: [
      {
        title: 'Crabgrass',
        dataIndex: 'crabgrass.crabgrass',
        key: 'crabgrass',
        className: 'table',
        width: 150
      },
      {
        title: 'Giant foxtail',
        dataIndex: 'gFoxtail.gFoxtail',
        key: 'gFoxtail',
        className: 'table',
        width: 150
      },
      {
        title: 'Yellow foxtail',
        dataIndex: 'yFoxtail.yFoxtail',
        key: 'yFoxtail',
        className: 'table',
        width: 150
      },
      {
        title: 'Common lambsquarters',
        dataIndex: 'lambsquarters.lambsquarters',
        key: 'lambsquarters',
        className: 'table',
        width: 150
      },
      {
        title: 'Smooth pigweed',
        dataIndex: 'pigweed.pigweed',
        key: 'pigweed',
        className: 'table',
        width: 150
      },
      {
        title: 'Eastern black nightshade',
        dataIndex: 'nightshade.nightshade',
        key: 'nightshade',
        className: 'table',
        width: 150
      },
      {
        title: 'Common ragweed',
        dataIndex: 'ragweed.ragweed',
        key: 'ragweed',
        className: 'table',
        width: 150
      },
      {
        title: 'Velvetleaf',
        dataIndex: 'velvetleaf.velvetleaf',
        key: 'velvetleaf',
        className: 'table',
        width: 150
      }
    ]
  }
];

@inject('store')
@observer
export default class Weed extends Component {
  render() {
    const { model, station, areRequiredFieldsSet } = this.props.store.app;
    const filteredCrabgrass = model.slice();
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
              rowKey={record => record.date}
              loading={this.props.store.app.isLoading}
              pagination={false}
              dataSource={areRequiredFieldsSet ? filteredCrabgrass : null}
            />
          </Box>
        </Flex>
      </Flex>
    );
  }
}
