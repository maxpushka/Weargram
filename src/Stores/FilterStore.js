import EventEmitter from './EventEmitter';

class FilterStore extends EventEmitter {
  constructor(props) {
    super(props);
  }

}

const store = new FilterStore();
export default store;
