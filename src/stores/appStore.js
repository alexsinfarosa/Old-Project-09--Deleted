import { observable, action, computed } from "mobx";
import axios from "axios";
import format from "date-fns/format";
import addDays from "date-fns/add_days";

import { matchIconsToStations } from "utils";

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

class Field {
  @observable name;
  @observable date;

  constructor({ name, date }) {
    this.name = name;
    this.date = date;
  }
}

export default class appStore {
  @observable protocol = window.location.protocol;
  @observable isLoading = false;
  @computed
  get areRequiredFieldsSet() {
    return (
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
    this.fetch("species.json")
      .then(json => {
        this.updateSpecies(json);
        this.isLoading = false;
      })
      .catch(err => {
        console.log("Failed to load species", err);
      });
  }

  @action
  updateSpecies(json) {
    this.species.clear();
    json.forEach(specieJson => {
      this.species.push(new Specie(specieJson));
    });
  }

  @observable specie = JSON.parse(localStorage.getItem("specie")) || {};
  @action
  setSpecie = d => {
    localStorage.removeItem("specie");
    this.specie = this.species.find(specie => specie.name === d);
    localStorage.setItem(`specie`, JSON.stringify(this.specie));
  };

  // States -------------------------------------------------------------------
  @observable states = [];

  @action
  loadStates() {
    this.isLoading = true;
    this.fetch("states.json")
      .then(json => {
        this.updateStates(json);
        this.isLoading = false;
      })
      .catch(err => {
        console.log("Failed to load states", err);
      });
  }

  @action
  updateStates(json) {
    this.states.clear();
    json.forEach(stateJson => {
      this.states.push(new State(stateJson));
    });
  }

  @observable
  state = JSON.parse(localStorage.getItem("state")) || {
    postalCode: "ALL",
    lat: 42.5,
    lon: -75.7,
    zoom: 6,
    name: "All States"
  };

  @action
  setState = stateName => {
    localStorage.removeItem("state");
    this.station = {};
    this.state = this.states.find(state => state.name === stateName);
    localStorage.setItem("state", JSON.stringify(this.state));
  };

  @action
  setStateFromMap = d => {
    this.state = this.states.find(state => state.postalCode === d);
    localStorage.setItem("state", JSON.stringify(this.state));
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
        this.isLoading = false;
        // console.log(this.stations.slice());
      })
      .catch(err => {
        console.log("Failed to load stations", err);
      });
  }

  @action
  updateStations(res) {
    this.stations.clear();
    res.forEach(station => {
      this.stations.push(new Station(station));
    });
  }

  @observable stationsWithIcons = [];
  @action
  addIconsToStations() {
    this.stationsWithIcons.clear();
    this.stations.forEach(station => {
      station["icon"] = matchIconsToStations(
        this.protocol,
        station,
        this.state
      );
      this.stationsWithIcons.push(station);
    });
  }

  @computed
  get currentStateStations() {
    return this.stations.filter(
      station => station.state === this.state.postalCode
    );
  }

  @observable station = JSON.parse(localStorage.getItem("station")) || {};
  @action
  setStation = stationName => {
    localStorage.removeItem("station");
    this.station = this.stations.find(station => station.name === stationName);
    localStorage.setItem("station", JSON.stringify(this.station));
  };

  // Dates---------------------------------------------------------------------
  @observable currentYear = new Date().getFullYear().toString();
  @observable
  endDate = JSON.parse(localStorage.getItem("endDate")) ||
    format(new Date(), "YYYY-MM-DD");
  @action
  setEndDate = d => {
    this.endDate = format(d, "YYYY-MM-DD");
    localStorage.setItem("endDate", JSON.stringify(this.endDate));
  };
  @computed
  get startDate() {
    return `${format(this.endDate, "YYYY")}-01-01`;
  }
  @computed
  get startDateYear() {
    return format(this.endDate, "YYYY");
  }

  // Current Model ------------------------------------------------------------
  @observable gridData = [];
  @action
  updateGridData = d => {
    this.gridData.clear();
    this.gridData = d;
  };

  @action
  loadGridData(sDate = this.startDate, eDate = this.endDate) {
    this.isLoading = true;

    let loc = "-75.7000, 42.5000";
    if (this.state.name !== "All States") {
      loc = `${this.station.lon}, ${this.station.lat}`;
    }

    const params = {
      loc: loc,
      sdate: sDate,
      edate: eDate,
      grid: 3,
      elems: [{ name: "avgt" }]
    };

    // console.log(params);

    return axios
      .post(`${this.protocol}//grid.rcc-acis.org/GridData`, params)
      .then(res => {
        this.updateGridData(res.data.data);
        this.crabgrass;
        this.gFoxtail;
        this.yFoxtail;
        this.lambsquarters;
        this.nightshade;
        this.pigweed;
        this.ragweed;
        this.velvetleaf;
        this.getGraph;
        this.isLoading = false;
      })
      .catch(err => {
        console.log("Failed to load data model", err);
      });
  }

  @computed
  get crabgrass() {
    const base = 48.2; // 9˚C
    let results = [];
    let cdd = 0;
    this.gridData.forEach((day, i) => {
      const dd = day[1] - base > 0 ? Math.round(day[1] - base) : 0;
      cdd += dd;
      const index = Math.round(
        100 / (1 + Math.exp(19.44 - 3.06 * Math.log(cdd)))
      );

      let indexMinus2;
      if (i > 1) {
        indexMinus2 = results[i - 2].index;
      }
      results.push({
        name: "Large crabgrass",
        date: day[0],
        index: index,
        indexMinus2: indexMinus2,
        cdd: cdd
      });
    });
    return results;
  }

  @computed
  get gFoxtail() {
    const base = 48.2; // 9˚C
    let results = [];
    let cdd = 0;
    this.gridData.forEach((day, i) => {
      const dd = day[1] - base > 0 ? Math.round(day[1] - base) : 0;
      cdd += dd;
      const index = Math.round(
        100 / (1 + Math.exp(18.05 - 3.06 * Math.log(cdd)))
      );

      let indexMinus2;
      if (i > 1) {
        indexMinus2 = results[i - 2].index;
      }
      results.push({
        name: "Giant foxtail",
        date: day[0],
        index: index,
        indexMinus2: indexMinus2,
        cdd: cdd
      });
    });
    return results;
  }

  @computed
  get yFoxtail() {
    const base = 48.2; // 9˚C
    let results = [];
    let cdd = 0;
    this.gridData.forEach((day, i) => {
      const dd = day[1] - base > 0 ? Math.round(day[1] - base) : 0;
      cdd += dd;
      const index = Math.round(
        100 / (1 + Math.exp(19.46 - 3.31 * Math.log(cdd)))
      );

      let indexMinus2;
      if (i > 1) {
        indexMinus2 = results[i - 2].index;
      }
      results.push({
        name: "Yellow foxtail",
        date: day[0],
        index: index,
        indexMinus2: indexMinus2,
        cdd: cdd
      });
    });
    return results;
  }

  @computed
  get lambsquarters() {
    const base = 48.2; // 9˚C
    let results = [];
    let cdd = 0;
    this.gridData.forEach((day, i) => {
      const dd = day[1] - base > 0 ? Math.round(day[1] - base) : 0;
      cdd += dd;
      const index = Math.round(
        100 / (1 + Math.exp(11.69 - 1.9 * Math.log(cdd)))
      );

      let indexMinus2;
      if (i > 1) {
        indexMinus2 = results[i - 2].index;
      }
      results.push({
        name: "Common lambsquarters",
        date: day[0],
        index: index,
        indexMinus2: indexMinus2,
        cdd: cdd
      });
    });
    return results;
  }

  @computed
  get nightshade() {
    const base = 48.2; // 9˚C
    let results = [];
    let cdd = 0;
    this.gridData.forEach((day, i) => {
      const dd = day[1] - base > 0 ? Math.round(day[1] - base) : 0;
      cdd += dd;
      const index = Math.round(
        100 / (1 + Math.exp(27.93 - 4.18 * Math.log(cdd)))
      );

      let indexMinus2;
      if (i > 1) {
        indexMinus2 = results[i - 2].index;
      }
      results.push({
        name: "Eastern black nightshade",
        date: day[0],
        index: index,
        indexMinus2: indexMinus2,
        cdd: cdd
      });
    });
    return results;
  }

  @computed
  get pigweed() {
    const base = 48.2; // 9˚C
    let results = [];
    let cdd = 0;
    this.gridData.forEach((day, i) => {
      const dd = day[1] - base > 0 ? Math.round(day[1] - base) : 0;
      cdd += dd;
      const index = Math.round(
        100 / (1 + Math.exp(20.06 - 3.12 * Math.log(cdd)))
      );

      let indexMinus2;
      if (i > 1) {
        indexMinus2 = results[i - 2].index;
      }
      results.push({
        name: "Smooth pigweed",
        date: day[0],
        index: index,
        indexMinus2: indexMinus2,
        cdd: cdd
      });
    });
    return results;
  }

  @computed
  get ragweed() {
    const base = 48.2; // 9˚C
    let results = [];
    let cdd = 0;
    this.gridData.forEach((day, i) => {
      const dd = day[1] - base > 0 ? Math.round(day[1] - base) : 0;
      cdd += dd;
      const index = Math.round(
        100 / (1 + Math.exp(12.93 - 2.63 * Math.log(cdd)))
      );

      let indexMinus2;
      if (i > 1) {
        indexMinus2 = results[i - 2].index;
      }
      results.push({
        name: "Common ragweed",
        date: day[0],
        index: index,
        indexMinus2: indexMinus2,
        cdd: cdd
      });
    });
    return results;
  }

  @computed
  get velvetleaf() {
    const base = 48.2; // 9˚C
    let results = [];
    let cdd = 0;
    this.gridData.forEach((day, i) => {
      const dd = day[1] - base > 0 ? Math.round(day[1] - base) : 0;
      cdd += dd;
      const index = Math.round(
        100 / (1 + Math.exp(18.86 - 3.21 * Math.log(cdd)))
      );

      let indexMinus2;
      if (i > 1) {
        indexMinus2 = results[i - 2].index;
      }
      results.push({
        name: "Common ragweed",
        date: day[0],
        index: index,
        indexMinus2: indexMinus2,
        cdd: cdd
      });
    });
    return results;
  }

  @computed
  get getGraph() {
    let results = [];
    this.gridData.forEach((day, i) => {
      // to center the graph
      let aboveZero = false;
      if (
        (this.crabgrass[i].index ||
          this.gFoxtail[i].index ||
          this.yFoxtail[i].index ||
          this.lambsquarters[i].index ||
          this.nightshade[i].index ||
          this.pigweed[i].index ||
          this.ragweed[i].index ||
          this.velvetleaf[i].index) > 0
      ) {
        aboveZero = true;
      }

      results.push({
        key: i + Math.random(),
        field: `Field name`,
        state: this.state.postalCode,
        station: this.station.name,
        editing: false,
        date: day[0],
        dateTable: format(day[0], "MMM D"),
        "Large crabgrass": this.crabgrass[i].index,
        "Giant foxtail": this.gFoxtail[i].index,
        "Yellow foxtail": this.yFoxtail[i].index,
        "Common lambsquarters": this.lambsquarters[i].index,
        "Eastern black nightshade": this.nightshade[i].index,
        "Smooth pigweed": this.pigweed[i].index,
        "Common ragweed": this.ragweed[i].index,
        Velvetleaf: this.velvetleaf[i].index,
        aboveZero: aboveZero
      });
    });
    return results;
  }

  @observable userData = JSON.parse(localStorage.getItem("userData")) || [];

  @action
  updateUserData = d => {
    this.userData.clear();
    this.userData = d;
    localStorage.setItem("userData", JSON.stringify(this.userData));
  };

  @observable selectedField = {};
  @action setSelectedField = d => (this.selectedField = d);

  @action
  addUserData = () => {
    // change this.endDate with today
    const field = this.getGraph.find(day => day.date === this.endDate);
    this.userData.push(field);
    localStorage.setItem("userData", JSON.stringify(this.userData));
  };

  @action
  replaceField = (field, date) => {
    let selectedField = this.userData.find(d => d.key === field.key);
    selectedField["date"] = date;
    const idx = this.userData.findIndex(d => d.key === field.key);
    const data = [...this.userData];
    data.splice(idx, 1, selectedField);
    this.userData = data;
    localStorage.setItem("userData", JSON.stringify(this.userData));
  };
}
