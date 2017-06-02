import AppStore from './appStore';
import LogicStore from './logicStore';
const fetcher = url => window.fetch(url).then(response => response.json());

const store = {
  app: new AppStore(fetcher),
  logic: new LogicStore()
};
export default store;

store.app.loadStates();
store.app.loadSpecies();
