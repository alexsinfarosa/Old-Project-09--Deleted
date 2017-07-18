import { observable, action } from "mobx";

export default class LogicStore {
  @observable isVisible = true;
  @action setIsVisible = () => (this.isVisible = !this.isVisible);

  @observable isCollapsed = true;
  @action setIsCollapsed = d => (this.isCollapsed = !this.isCollapsed);

  @observable isLoading = false;
  @action setIsLoading = d => (this.isLoading = d);

  @observable
  isMap = JSON.parse(localStorage.getItem("state")) !== null ? false : true;
  @action setIsMap = d => (this.isMap = d);
  @action toggleMap = d => (this.isMap = !this.isMap);

  @observable isGraph = false;
  @action setIsGraph = d => (this.isGraph = !this.isGraph);

  @observable isTable = false;
  @action setIsTable = d => (this.isTable = !this.isTable);

  @observable isEditing = false;
  @action setIsEditing = d => (this.isEditing = d);

  @observable isRowSelected = false;
  @action setIsRowSelected = d => (this.isRowSelected = d);

  @observable
  breakpoints = {
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
}
