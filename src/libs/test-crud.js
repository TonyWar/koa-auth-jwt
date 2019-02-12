import ICRUD from './crud';

export default class TestCrud extends ICRUD {
  constructor() {
    const collection = [];
    for (let i = 0; i < 1000; i++) {
      collection.push({
        id: i,
        text: `this is ${i + 1} item of collection`
      });
    }
    super(collection);
  }
  getAll = async () => this.collection
  get = async id => this.collection.find(item => item.id === id)
  create = async data => {
    if (this.collection.find(item => item.id === data.id)) {
      throw Error('Item already exist');
    }
    collection.push(data);
    return data;
  }
  update = async (id, data) => {
    if (!this.collection.find(item => item.id === id)) {
      throw Error('Item not found');
    }
    collection[collection.findIndex(item => item.id == ctx.params.id)] = { ...collection[collection.findIndex(item => item.id == ctx.params.id)], ...data };
    return collection[collection.findIndex(item => item.id == ctx.params.id)];
  }
  delete = async id => {
    if (!this.collection.find(item => item.id === id)) {
      throw Error('Item not found');
    }
    removedItems = collection.splice(ctx.params.id, 1);
    return removedItems[0];
  }
}