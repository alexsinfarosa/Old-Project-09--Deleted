import { observable, action, computed } from "mobx";
import axios from "axios";
import { matchIconsToStations } from "utils";
import { states } from "utils/states";
import format from "date-fns/format";

export default class AppStore {
  // logic----------------------------------------------------------------------
  @observable protocol = window.location.protocol;
  @computed get areRequiredFieldsSet() {
    return (
      Object.keys(this.subject).length !== 0 &&
      Object.keys(this.state).length !== 0 &&
      Object.keys(this.station).length !== 0
    );
  }
  @observable isVisible = true;
  @action setIsVisible = () => (this.isVisible = !this.isVisible);

  @observable isCollapsed = true;
  @action setIsCollapsed = d => (this.isCollapsed = !this.isCollapsed);

  @observable isLoading = false;
  @action setIsLoading = d => (this.isLoading = d);

  @observable isMap = false;
  @action setIsMap = d => (this.isMap = !this.isMap);

  @observable isGraph = false;
  @action setIsGraph = d => (this.isGraph = !this.isGraph);

  @observable breakpoints = {
    xs: "(max-width: 767px)",
    su: "(min-width: 768px)",
    sm: "(min-width: 768px) and (max-width: 991px)",
    md: "(min-width: 992px) and (max-width: 1199px)",
    mu: "(min-width: 992px)",
    lg: "(min-width: 1200px)"
  };
  @observable isSidebarOpen;
  @action setIsSidebarOpen = d => (this.isSidebarOpen = d);
  @action toggleSidebar = () => (this.isSidebarOpen = !this.isSidebarOpen);

  // Subject--------------------------------------------------------------
  @observable subjects = [
    {
      name: "Large crabgrass",
      diseases: ["Large crabgrass"],
      graph: false
    },
    {
      name: "Giant foxtail",
      diseases: ["Giant foxtail"],
      graph: false
    },
    {
      name: "Yellow foxtail",
      diseases: ["Yellow foxtail"],
      graph: false
    },
    {
      name: "Common lambsquarters",
      diseases: ["Common lambsquarters"],
      graph: false
    },
    {
      name: "Eastern black nightshade",
      diseases: ["Eastern black nightshade"],
      graph: false
    },
    {
      name: "Smooth pigweed",
      diseases: ["Smooth pigweed"],
      graph: false
    },
    {
      name: "Common ragweed",
      diseases: ["Common ragweed"],
      graph: false
    },
    {
      name: "Velvetleaf",
      diseases: ["Velvetleaf"],
      graph: false
    }
  ];
  @observable subject = JSON.parse(localStorage.getItem("weed")) || {};
  @action resetSubject = () => (this.subject = {});
  @action setSubjectFromLocalStorage = d => (this.subject = d);
  @action setSubject = d => {
    this.subject = this.subjects.find(subject => subject.name === d);
    localStorage.setItem(`weed`, JSON.stringify(this.subject));
  };

  // State----------------------------------------------------------------------
  @observable state = JSON.parse(localStorage.getItem("state")) || {};
  @action setState = stateName => {
    localStorage.removeItem("state");
    this.station = {};
    this.state = states.find(state => state.name === stateName);
    localStorage.setItem("state", JSON.stringify(this.state));
  };

  // Station--------------------------------------------------------------------
  @observable stations = [];
  @action setStations = d => (this.stations = d);
  @computed get stationsWithMatchedIcons() {
    return matchIconsToStations(this.protocol, this.stations, this.state);
  }
  @computed get getCurrentStateStations() {
    return this.stations.filter(
      station => station.state === this.state.postalCode
    );
  }
  @observable station = JSON.parse(localStorage.getItem("station")) || {};
  @computed get getStation() {
    return this.station;
  }
  @action setStation = stationName => {
    localStorage.removeItem("station");
    this.station = this.stations.find(station => station.name === stationName);
    localStorage.setItem("station", JSON.stringify(this.station));
  };

  // Dates----------------------------------------------------------------------
  @observable currentYear = new Date().getFullYear().toString();
  @observable endDate = JSON.parse(localStorage.getItem("endDate")) ||
    new Date();
  @action setEndDate = d => {
    this.endDate = format(d, "YYYY-MM-DD");
    localStorage.setItem("endDate", JSON.stringify(this.endDate));
  };
  @computed get startDate() {
    return `${format(this.endDate, "YYYY")}-01-01`;
  }
  @computed get startDateYear() {
    return format(this.endDate, "YYYY");
  }

  // ACISData ------------------------------------------------------------------
  @observable weedData = [];
  @action setweedData = d => (this.weedData = d);

  @action setWeedData = () => {
    this.setIsLoading(true);
    const params = {
      loc: `${this.station.lon}, ${this.station.lat}`,
      sdate: `2040-${format(new Date(), "MM-DD")}`,
      edate: `2069-${format(new Date(), "MM-DD")}`,
      grid: 23,
      elems: [
        {
          name: "maxt",
          interval: [1, 0, 0],
          duration: "std",
          season_start: "01-01",
          reduce: `cnt_ge_${this.temperature}`
        }
      ]
    };

    // console.log(params);

    return axios
      .post(`${this.protocol}//grid.rcc-acis.org/GridData`, params)
      .then(res => {
        if (!res.data.hasOwnProperty("error")) {
          // return res.data.data;
          this.setProjectedData2040(res.data.data);
          this.setIsLoading(false);
          return;
        }
        console.log(res.data.error);
      })
      .catch(err => {
        console.log(err);
      });
  };
}
