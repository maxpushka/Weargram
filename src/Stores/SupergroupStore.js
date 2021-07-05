import EventEmitter from './EventEmitter';

class SupergroupStore extends EventEmitter {
  constructor() {
    super();
  }
}

const store = new SupergroupStore();
export default store;
