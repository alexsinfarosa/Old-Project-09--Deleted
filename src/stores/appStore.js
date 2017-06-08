import { observable, action, computed } from 'mobx';
import axios from 'axios';
import format from 'date-fns/format';
import addDays from 'date-fns/add_days';

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

// class Model {
//   @observable date;
//   @observable mint;
//   @observable avgt;
//   @observable maxt;
//   @observable gdd;
//   @observable cdd;
//
//   constructor({ date, mint, avgt, maxt, gdd, cdd = 0 }) {
//     this.date = date;
//     this.mint = mint;
//     this.avgt = avgt;
//     this.maxt = maxt;
//     this.gdd = gdd;
//     this.cdd = cdd;
//   }
// }

export default class appStore {
  @observable protocol = window.location.protocol;
  @observable isLoading = false;
  @computed
  get areRequiredFieldsSet() {
    return (
      // Object.keys(this.specie).length !== 0 &&
      Object.keys(this.state).length !== 0 &&
      Object.keys(this.station).length !== 0
    );
  }

  constructor(fetch) {
    this.fetch = fetch;
  }

  // Species ------------------------------------------------------------------
  @observable species = [];
  @action
  loadSpecies() {
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

  @action
  updateSpecies(json) {
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

  // States -------------------------------------------------------------------
  @observable states = [];
  @action
  loadStates() {
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

  @action
  updateStates(json) {
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

  // Stations -----------------------------------------------------------------
  @observable stations = [];
  @action
  loadStations() {
    this.isLoading = true;
    return axios
      .get(
        `${this.protocol}//newa2.nrcc.cornell.edu/newaUtil/stateStationList/all`
      )
      .then(res => {
        this.updateStations(res.data.stations);
        this.addIconsToStations();
        this.isLoading = false;
        console.log('ciccio');
        // console.log(this.stations.slice());
      })
      .catch(err => {
        console.log('Failed to load stations', err);
      });
  }

  @action
  updateStations(res) {
    console.log('della');
    this.stations.clear();
    res.forEach(station => {
      this.stations.push(new Station(station));
    });
  }

  @computed
  get currentStateStations() {
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

  @action
  addIconsToStations() {
    // if (Object.keys(this.station).length !== 0) {
    const { protocol, stations, state } = this;
    stations.forEach(station => {
      station['icon'] = matchIconsToStations(protocol, station, state);
    });
    // }
  }

  // Dates---------------------------------------------------------------------
  @observable currentYear = new Date().getFullYear().toString();
  @observable endDate = JSON.parse(localStorage.getItem('endDate')) ||
    format(new Date(), 'YYYY-MM-DD');
  @action setEndDate = d => {
    this.endDate = format(d, 'YYYY-MM-DD');
    localStorage.setItem('endDate', JSON.stringify(this.endDate));
  };
  @computed
  get startDate() {
    return `${format(this.endDate, 'YYYY')}-01-01`;
  }
  @computed
  get startDateYear() {
    return format(this.endDate, 'YYYY');
  }

  // Current Model ------------------------------------------------------------
  @observable model = [];
  @action
  loadData() {
    this.isLoading = true;
    let edate;
    if (this.startDateYear === this.currentYear) {
      edate = format(addDays(this.endDate, 5), 'YYYY-MM-DD');
    }
    edate = format(this.endDate, 'YYYY-MM-DD');
    let loc = '-75.7000, 42.5000';
    if (this.state.name) {
      loc = `${this.station.lon}, ${this.station.lat}`;
    }

    const params = {
      loc: loc,
      sdate: this.startDate,
      edate: edate,
      grid: 3,
      elems: [
        {
          name: 'mint',
          units: 'degreeC'
        },
        {
          name: 'avgt',
          units: 'degreeC'
        },
        {
          name: 'maxt',
          units: 'degreeC'
        },
        {
          name: 'gdd',
          base: 9, // ˚C
          units: 'degreeC'
        }
      ]
    };

    console.log(params);

    return axios
      .post(`${this.protocol}//grid.rcc-acis.org/GridData`, params)
      .then(res => {
        this.updateData(res.data.data);
        this.isLoading = false;
        // console.log(this.model.slice());
      })
      .catch(err => {
        console.log('Failed to load data model', err);
      });
  }

  @action
  updateData(data) {
    this.model.clear();
    let crabgrass = { name: 'Large crabgrass', y: [], dates: [], cdd: [] };
    let gFoxtail = { name: 'Giant foxtail', y: [], dates: [], cdd: [] };
    let yFoxtail = { name: 'Yellow foxtail', y: [], dates: [], cdd: [] };
    let lambsquarters = {
      name: 'Common lambsquarters',
      y: [],
      dates: [],
      cdd: []
    };
    let pigweed = { name: 'Smooth pigweed', y: [], dates: [], cdd: [] };
    let nightshade = {
      name: 'Eastern black nightshade',
      y: [],
      dates: [],
      cdd: []
    };
    let ragweed = { name: 'Common ragweed', y: [], dates: [], cdd: [] };
    let velvetleaf = { name: 'Velvetleaf', y: [], dates: [], cdd: [] };

    let crabgrassCDD = 0;
    let gFoxtailCDD = 0;
    let yFoxtailCDD = 0;
    let lambsquartersCDD = 0;
    let nightshadeCDD = 0;
    let pigweedCDD = 0;
    let ragweedCDD = 0;
    let velvetleafCDD = 0;

    data.forEach((day, i) => {
      crabgrassCDD += day[4];
      gFoxtailCDD += day[4];
      yFoxtailCDD += day[4];
      lambsquartersCDD += day[4];
      nightshadeCDD += day[4];
      pigweedCDD += day[4];
      ragweedCDD += day[4];
      velvetleafCDD += day[4];

      const crabgrassY = Math.round(
        100 / (1 + Math.exp(19.44 - 3.06 * Math.log(crabgrassCDD))) * 100
      );
      if (crabgrassY >= 25) {
        crabgrass['y'].push(crabgrassY);
        crabgrass['dates'].push(day[0]);
        crabgrass['cdd'].push(crabgrassCDD);
        crabgrassCDD = 0;
      }

      const gFoxtailY = Math.round(
        100 / (1 + Math.exp(18.05 - 3.06 * Math.log(gFoxtailCDD))) * 100
      );
      if (gFoxtailY >= 25) {
        gFoxtail['y'].push(gFoxtailY);
        gFoxtail['dates'].push(day[0]);
        gFoxtail['cdd'].push(gFoxtailCDD);
        gFoxtailCDD = 0;
      }

      const yFoxtailY = Math.round(
        100 / (1 + Math.exp(19.46 - 3.31 * Math.log(yFoxtailCDD))) * 100
      );
      if (yFoxtailY >= 25) {
        yFoxtail['y'].push(yFoxtailY);
        yFoxtail['dates'].push(day[0]);
        yFoxtail['cdd'].push(yFoxtailCDD);
        yFoxtailCDD = 0;
      }

      const lambsquartersY = Math.round(
        100 / (1 + Math.exp(11.69 - 1.9 * Math.log(lambsquartersCDD))) * 100
      );
      if (lambsquartersY >= 25) {
        lambsquarters['y'].push(lambsquartersY);
        lambsquarters['dates'].push(day[0]);
        lambsquarters['cdd'].push(lambsquartersCDD);
        lambsquartersCDD = 0;
      }

      const nightshadeY = Math.round(
        100 / (1 + Math.exp(27.93 - 4.18 * Math.log(nightshadeCDD))) * 100
      );
      if (nightshadeY >= 25) {
        nightshade['y'].push(nightshadeY);
        nightshade['dates'].push(day[0]);
        nightshade['cdd'].push(nightshadeCDD);
        nightshadeCDD = 0;
      }

      const pigweedY = Math.round(
        100 / (1 + Math.exp(20.06 - 3.12 * Math.log(pigweedCDD))) * 100
      );
      if (pigweedY >= 25) {
        pigweed['y'].push(pigweedY);
        pigweed['dates'].push(day[0]);
        pigweed['cdd'].push(pigweedCDD);
        pigweedCDD = 0;
      }

      const ragweedY = Math.round(
        100 / (1 + Math.exp(12.93 - 2.63 * Math.log(ragweedCDD))) * 100
      );
      if (ragweedY >= 25) {
        ragweed['y'].push(ragweedY);
        ragweed['dates'].push(day[0]);
        ragweed['cdd'].push(ragweedCDD);
        ragweedCDD = 0;
      }
      const velvetleafY = Math.round(
        100 / (1 + Math.exp(18.86 - 3.21 * Math.log(velvetleafCDD))) * 100
      );
      if (velvetleafY >= 25) {
        velvetleaf['y'].push(velvetleafY);
        velvetleaf['dates'].push(day[0]);
        velvetleaf['cdd'].push(velvetleafCDD);
        velvetleafCDD = 0;
      }
    });

    this.model.push(
      crabgrass,
      gFoxtail,
      yFoxtail,
      lambsquarters,
      nightshade,
      pigweed,
      ragweed,
      velvetleaf
    );
  }
}
