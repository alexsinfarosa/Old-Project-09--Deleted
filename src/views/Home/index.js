import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import { MatchMediaProvider } from "mobx-react-matchmedia";

// react-sidebar
import Main from "react-sidebar";
import RightContent from "views/RightContent";
import SideBar from "views/SideBar";

@inject("store")
@observer
export default class Home extends Component {
  render() {
    const {
      setIsSidebarOpen,
      isSidebarOpen,
      breakpoints
    } = this.props.store.logic;
    return (
      <MatchMediaProvider breakpoints={breakpoints}>
        <Main
          sidebar={<SideBar size={breakpoints.xs} />}
          docked={breakpoints.su ? true : false}
          open={isSidebarOpen}
          onSetOpen={d => setIsSidebarOpen(d)}
        >
          <RightContent mobile={breakpoints.xs} />
        </Main>
      </MatchMediaProvider>
    );
  }
}
