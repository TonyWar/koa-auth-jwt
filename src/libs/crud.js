export default class ICRUD {
  constructor(collection) {
    if (!collection) {
      throw Error('No collection');
    }
    this.collection = collection;
  }
  getAll = () => { }
  get = (id) => { }
  create = (data) => { }
  update = (id, data) => { }
  delete = (id) => { }
}
