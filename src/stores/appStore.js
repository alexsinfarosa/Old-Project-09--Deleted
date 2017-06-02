import { observable, action, computed } from 'mobx';
import axios from 'axios';
import format from 'date-fns/format';

import { matchIconsToStations } from 'utils';

class Station {
  @observable id;
  @observable name;
  @observable network;
  @observable state;
  @observable lon;
  @observable lat;
  @observable elev;
  @observable icon;

  constructor({ id, name, network, state, lon, lat, elev, icon }) {
    this.id = id;
    this.name = name;
    this.network = network;
    this.state = state;
    this.lon = lon;
    this.lat = lat;
    this.elev = elev;
    this.icon = icon;
  }
}

class State {
  @observable postalCode;
  @observable name;
  @observable lon;
  @observable lat;
  @observable zoom;
  @observable bbox;

  constructor({ postalCode, name, lon, lat, zoom, bbox }) {
    this.postalCode = postalCode;
    this.name = name;
    this.lon = lon;
    this.lat = lat;
    this.zoom = zoom;
    this.bbox = bbox;
  }
}

class Specie {
  @observable name;
  @observable graph;

  constructor({ name, graph }) {
    this.name = name;
    this.graph = graph;
  }
}

export default class appStore {
  @observable protocol = window.location.protocol;
  @observable isLoading = false;
  @computed get areRequiredFieldsSet() {
    return (
      Object.keys(this.specie).length !== 0 &&
      Object.keys(this.state).length !== 0 &&
      Object.keys(this.station).length !== 0
    );
  }

  constructor(fetch) {
    this.fetch = fetch;
  }

  // Species --------------------------------------------------------------
  @observable species = [];
  @action loadSpecies() {
    this.isLoading = true;
    this.fetch('species.json')
      .then(json => {
        this.updateSpecies(json);
        this.isLoading = false;
      })
      .catch(err => {
        console.log('Failed to load species', err);
      });
  }

  @action updateSpecies(json) {
    this.species.clear();
    json.forEach(specieJson => {
      this.species.push(new Specie(specieJson));
    });
  }

  @observable specie = JSON.parse(localStorage.getItem('specie')) || {};
  @action setSpecie = d => {
    localStorage.removeItem('specie');
    this.specie = this.species.find(specie => specie.name === d);
    localStorage.setItem(`specie`, JSON.stringify(this.specie));
  };

  // States -------------------------------------------------------------------------
  @observable states = [];
  @action loadStates() {
    this.isLoading = true;
    this.fetch('states.json')
      .then(json => {
        this.updateStates(json);
        this.isLoading = false;
        // console.log(this.states.slice());
      })
      .catch(err => {
        console.log('Failed to load states', err);
      });
  }

  @action updateStates(json) {
    this.states.clear();
    json.forEach(stateJson => {
      this.states.push(new State(stateJson));
    });
  }

  @observable state = JSON.parse(localStorage.getItem('state')) || {};
  @action setState = stateName => {
    localStorage.removeItem('state');
    this.station = {};
    this.state = this.states.find(state => state.name === stateName);
    localStorage.setItem('state', JSON.stringify(this.state));
  };

  // Stations ----------------------------------------------------------------------
  @observable stations = [];
  @action loadStations() {
    this.isLoading = true;
    return axios
      .get(
        `${this.protocol}//newa2.nrcc.cornell.edu/newaUtil/stateStationList/all`
      )
      .then(res => {
        this.updateStations(res.data.stations);
        this.addIconsToStations();
        this.isLoading = false;
        // console.log(this.stations.slice());
      })
      .catch(err => {
        console.log('Failed to load stations', err);
      });
  }

  @action updateStations(res) {
    this.stations.clear();
    res.forEach(station => {
      this.stations.push(new Station(station));
    });
  }

  @computed get currentStateStations() {
    return this.stations.filter(
      station => station.state === this.state.postalCode
    );
  }

  @observable station = JSON.parse(localStorage.getItem('station')) || {};
  @action setStation = stationName => {
    localStorage.removeItem('station');
    this.station = this.stations.find(station => station.name === stationName);
    localStorage.setItem('station', JSON.stringify(this.station));
  };

  @action addIconsToStations() {
    const { protocol, stations, state } = this;
    stations.forEach(station => {
      station['icon'] = matchIconsToStations(protocol, station, state);
    });
  }

  // Dates----------------------------------------------------------------------
  @observable currentYear = new Date().getFullYear().toString();
  @observable endDate = JSON.parse(localStorage.getItem('endDate')) ||
    format(new Date(), 'YYYY-MM-DD');
  @action setEndDate = d => {
    this.endDate = format(d, 'YYYY-MM-DD');
    localStorage.setItem('endDate', JSON.stringify(this.endDate));
  };
  @computed get startDate() {
    return `${format(this.endDate, 'YYYY')}-01-01`;
  }
  @computed get startDateYear() {
    return format(this.endDate, 'YYYY');
  }
}
