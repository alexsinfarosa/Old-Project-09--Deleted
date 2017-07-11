import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { when } from "mobx";

// components
import Home from "views/Home";
// import Test from "components/Test";

@inject("store")
@observer
class App extends Component {
  constructor(props) {
    super(props);
    when(
      () => this.props.store.app.stations.length === 0,
      () =>
        this.props.store.app
          .loadStations()
          .then(() => this.props.store.app.addIconsToStations())
    );
  }
  render() {
    return (
      <div>
        <Home />
        {/* <Test /> */}
      </div>
    );
  }
}

export default App;
