import EventEmitter from './EventEmitter';

class FileStore extends EventEmitter {
  constructor(props) {
    super(props);
  }

}

const store = new FileStore();
export default store;
