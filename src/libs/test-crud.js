import ICRUD from './crud';

class TestCrud extends ICRUD {
  constructor() {
    const collection = [];
    for (let i = 0; i < 1000; i++) {
      collection.push({
        id: i,
        text: `this is ${i + 1} item of collection`
      });
    }
    super(collection);
    this.freeId = 1000;
  }
  getAll = async () => this.collectionremovedItems
  get = async id => this.collection.find(item => item.id === +id)
  create = async data => {
    data.id = this.freeId++;
    this.collection.push(data);
    return data;
  }
  update = async (id, data) => {
    if (!this.collection.find(item => item.id === +id)) {
      throw Error('Item not found');
    }
    const index = this.collection.findIndex(item => item.id === +id)
    this.collection[index] = { ...this.collection[index], ...data };
    return this.collection[index];
  }
  delete = async id => {
    if (!this.collection.find(item => item.id === +id)) {
      throw Error('Item not found');
    }
    const index = this.collection.findIndex(item => item.id === +id)
    const removedItems = this.collection.splice(index, 1);
    return removedItems[0];
  }
}

const testCrud = new TestCrud();
export default testCrud;