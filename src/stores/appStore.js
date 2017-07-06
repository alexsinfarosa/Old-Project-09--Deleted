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

// class Record {
//   @observable date;
//   @observable field;
//
//   constructor({ date, field }) {
//     this.date = date;
//     this.field = field;
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
        // console.log(this.states.slice());
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
  setStateFromEntireMap = d => {
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
  @observable model = [];
  @observable graph = [];

  @observable mainData = [];
  @action updateMainData = d => (this.mainData = d);

  @action
  loadGridData() {
    this.isLoading = true;
    let edate;
    if (this.startDateYear === this.currentYear) {
      edate = format(addDays(this.endDate, 5), "YYYY-MM-DD");
    }
    edate = format(this.endDate, "YYYY-MM-DD");
    let loc = "-75.7000, 42.5000";
    if (this.state.name !== "All States") {
      loc = `${this.station.lon}, ${this.station.lat}`;
    }

    const params = {
      loc: loc,
      sdate: this.startDate,
      edate: edate,
      grid: 3,
      elems: [{ name: "avgt" }]
    };

    // console.log(params);

    return axios
      .post(`${this.protocol}//grid.rcc-acis.org/GridData`, params)
      .then(res => {
        this.updateMainData(res.data.data);
        this.updateData(res.data.data);
        this.updateGraph(res.data.data);
        // this.setUserData();
        this.isLoading = false;
        // console.log(this.model.slice());
      })
      .catch(err => {
        console.log("Failed to load data model", err);
      });
  }

  @observable crabgrass = [];
  @observable gFoxtail = [];
  @observable yFoxtail = [];
  @observable lambsquarters = [];
  @observable pigweed = [];
  @observable nightshade = [];
  @observable ragweed = [];
  @observable velvetleaf = [];

  @action
  updateData(data) {
    let crabgrassCDD = 0;
    let gFoxtailCDD = 0;
    let yFoxtailCDD = 0;
    let lambsquartersCDD = 0;
    let nightshadeCDD = 0;
    let pigweedCDD = 0;
    let ragweedCDD = 0;
    let velvetleafCDD = 0;

    const base = 48.2; // 9˚C
    data.forEach((day, i) => {
      const dd = day[1] - base > 0 ? Math.round(day[1] - base) : 0;
      crabgrassCDD += dd;
      gFoxtailCDD += dd;
      yFoxtailCDD += dd;
      lambsquartersCDD += dd;
      nightshadeCDD += dd;
      pigweedCDD += dd;
      ragweedCDD += dd;
      velvetleafCDD += dd;

      let yesterday;
      const crabgrassY = Math.round(
        100 / (1 + Math.exp(19.44 - 3.06 * Math.log(crabgrassCDD)))
      );

      if (i > 0) {
        yesterday = this.crabgrass[i - 1].today;
      }
      this.crabgrass.push({
        name: "Large crabgrass",
        today: crabgrassY,
        date: day[0],
        yesterday: yesterday,
        cdd: crabgrassCDD
      });

      const gFoxtailY = Math.round(
        100 / (1 + Math.exp(18.05 - 3.06 * Math.log(gFoxtailCDD)))
      );
      if (i > 0) {
        yesterday = this.gFoxtail[i - 1].today;
      }
      this.gFoxtail.push({
        name: "Giant foxtail",
        today: gFoxtailY,
        date: day[0],
        yesterday: yesterday,
        cdd: gFoxtailCDD
      });

      const yFoxtailY = Math.round(
        100 / (1 + Math.exp(19.46 - 3.31 * Math.log(yFoxtailCDD)))
      );
      if (i > 0) {
        yesterday = this.yFoxtail[i - 1].today;
      }
      this.yFoxtail.push({
        name: "Yellow foxtail",
        today: yFoxtailY,
        date: day[0],
        yesterday: yesterday,
        cdd: yFoxtailCDD
      });

      const lambsquartersY = Math.round(
        100 / (1 + Math.exp(11.69 - 1.9 * Math.log(lambsquartersCDD)))
      );
      if (i > 0) {
        yesterday = this.lambsquarters[i - 1].today;
      }
      this.lambsquarters.push({
        name: "Common lambsquarters",
        today: lambsquartersY,
        date: day[0],
        yesterday: yesterday,
        cdd: lambsquartersCDD
      });

      const nightshadeY = Math.round(
        100 / (1 + Math.exp(27.93 - 4.18 * Math.log(nightshadeCDD)))
      );
      if (i > 0) {
        yesterday = this.nightshade[i - 1].today;
      }
      this.nightshade.push({
        name: "Eastern black nightshade",
        today: nightshadeY,
        date: day[0],
        yesterday: yesterday,
        cdd: nightshadeCDD
      });

      const pigweedY = Math.round(
        100 / (1 + Math.exp(20.06 - 3.12 * Math.log(pigweedCDD)))
      );
      if (i > 0) {
        yesterday = this.pigweed[i - 1].today;
      }
      this.pigweed.push({
        name: "Smooth pigweed",
        today: pigweedY,
        date: day[0],
        yesterday: yesterday,
        cdd: pigweedCDD
      });

      const ragweedY = Math.round(
        100 / (1 + Math.exp(12.93 - 2.63 * Math.log(ragweedCDD)))
      );
      if (i > 0) {
        yesterday = this.ragweed[i - 1].today;
      }
      this.ragweed.push({
        name: "Common ragweed",
        today: ragweedY,
        date: day[0],
        yesterday: yesterday,
        cdd: ragweedCDD
      });

      const velvetleafY = Math.round(
        100 / (1 + Math.exp(18.86 - 3.21 * Math.log(velvetleafCDD)))
      );
      if (i > 0) {
        yesterday = this.velvetleaf[i - 1].today;
      }
      this.velvetleaf.push({
        name: "Velvetleaf",
        today: velvetleafY,
        date: day[0],
        yesterday: yesterday,
        cdd: velvetleafCDD
      });
    });
  }

  @action
  updateGraph(data, idx = 0, destination = this.graph) {
    this.graph.clear();
    let crabgrassCDD = 0;
    let gFoxtailCDD = 0;
    let yFoxtailCDD = 0;
    let lambsquartersCDD = 0;
    let nightshadeCDD = 0;
    let pigweedCDD = 0;
    let ragweedCDD = 0;
    let velvetleafCDD = 0;

    const base = 48.2; // 9˚C
    data.slice(idx).forEach((day, i) => {
      const dd = day[1] - base > 0 ? Math.round(day[1] - base) : 0;
      crabgrassCDD += dd;
      gFoxtailCDD += dd;
      yFoxtailCDD += dd;
      lambsquartersCDD += dd;
      nightshadeCDD += dd;
      pigweedCDD += dd;
      ragweedCDD += dd;
      velvetleafCDD += dd;

      let aboveZero = false;
      const crabgrassY = Math.round(
        100 / (1 + Math.exp(19.44 - 3.06 * Math.log(crabgrassCDD)))
      );

      const gFoxtailY = Math.round(
        100 / (1 + Math.exp(18.05 - 3.06 * Math.log(gFoxtailCDD)))
      );

      const yFoxtailY = Math.round(
        100 / (1 + Math.exp(19.46 - 3.31 * Math.log(yFoxtailCDD)))
      );

      const lambsquartersY = Math.round(
        100 / (1 + Math.exp(11.69 - 1.9 * Math.log(lambsquartersCDD)))
      );

      const nightshadeY = Math.round(
        100 / (1 + Math.exp(27.93 - 4.18 * Math.log(nightshadeCDD)))
      );

      const pigweedY = Math.round(
        100 / (1 + Math.exp(20.06 - 3.12 * Math.log(pigweedCDD)))
      );

      const ragweedY = Math.round(
        100 / (1 + Math.exp(12.93 - 2.63 * Math.log(ragweedCDD)))
      );

      const velvetleafY = Math.round(
        100 / (1 + Math.exp(18.86 - 3.21 * Math.log(velvetleafCDD)))
      );

      if (
        (crabgrassY ||
          gFoxtailY ||
          yFoxtailY ||
          lambsquartersY ||
          nightshadeY ||
          pigweedY ||
          ragweedY ||
          velvetleafY) > 0
      ) {
        aboveZero = true;
      }

      destination.push({
        key: `${i + Math.random()}`,
        field: `field ${i}`,
        date: day[0],
        dateTable: `${format(day[0], "MMM D")}`,
        "Large crabgrass": crabgrassY,
        "Giant foxtail": gFoxtailY,
        "Yellow foxtail": yFoxtailY,
        "Common lambsquarters": lambsquartersY,
        "Eastern black nightshade": nightshadeY,
        "Smooth pigweed": pigweedY,
        "Common ragweed": ragweedY,
        Velvetleaf: velvetleafY,
        aboveZero: aboveZero
      });
    });
  }

  @observable graphStartDate;

  @action
  setGraphStartDate = d => {
    this.graphStartDate = d;
    this.setUserData();
  };

  @computed
  get startDateIndex() {
    return this.graph.findIndex(day => day.date === this.endDate);
  }

  @observable currentField = [];
  @action
  setCurrentField = d => {
    this.currentField.clear();
    this.updateGraph(this.mainData);
    console.log(d.date);
    console.log(this.graph.slice());
    // const selectedField = this.userData.find(day => day.date === d.date);
    const idx = this.graph.findIndex(day => day.date === d.date);
    console.log(idx);
    this.updateGraph(this.mainData, idx, this.currentField);
    console.log(this.currentField.slice());
    this.setIsField(true);
  };

  @observable isField = false;
  @action setIsField = d => (this.isField = d);

  @observable userData = JSON.parse(localStorage.getItem("userData")) || [];
  @action
  setUserData() {
    if (this.startDateIndex !== -1) {
      const today = this.graph.find(day => day.date === "2017-03-23");
      this.userData.push(today);
      localStorage.setItem("userData", JSON.stringify(this.userData));
    }
  }
}
