import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
// import { toJS } from "mobx";

// styled-components
import { MapContainer } from './styles';

// reflexbox
import { Flex, Box } from 'reflexbox';

const myIcon = e =>
  L.icon({
    iconUrl: e
  });

@inject('store')
@observer
export default class TheMap extends Component {
  onClickSetStation = e => {
    const { lat, lng } = e.latlng;
    const { stations, state } = this.props.store.app;
    const selectedStation = stations.filter(
      station => station.lat === lat && station.lon === lng
    )[0];
    if (selectedStation.state === state.postalCode) {
      this.props.store.app.setStation(selectedStation.name);
    } else {
      const selectedStation = stations.filter(
        station => station.lat === lat && station.lon === lng
      )[0];
      const state = this.props.store.app.states.filter(
        state => state.postalCode === selectedStation.state
      )[0];
      alert(`Select ${state.name} from the State menu to access this station.`);
    }
  };

  render() {
    // const position = [this.state.lat, this.state.lng];
    const { stations, state, protocol } = this.props.store.app;
    // const {mobile} = this.props;

    const MarkerList = stations.map(station => (
      <Marker
        key={`${station.id} ${station.network}`}
        // network={station.network}
        position={[station.lat, station.lon]}
        // postalCode={station.state}
        icon={myIcon(station.icon)}
        title={station.name}
        onClick={this.onClickSetStation}
      />
    ));

    return (
      <Flex justify="center">
        <Box mb={4} col={12} lg={12} md={12} sm={12}>
          <MapContainer
            zoomControl={true}
            scrollWheelZoom={false}
            ref="map"
            center={
              Object.keys(state).length === 0
                ? [42.9543, -75.5262]
                : [state.lat, state.lon]
            }
            zoom={Object.keys(state).length === 0 ? 6 : state.zoom}
          >
            <TileLayer
              url={`${protocol}//server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}`}
            />
            {MarkerList}
          </MapContainer>
        </Box>
      </Flex>
    );
  }
}
