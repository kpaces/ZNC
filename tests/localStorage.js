global.localStorage = {
  data: {},
  getItem(key) {
    if (this.data[key]) {
      return this.data[key];
    } else {
      return null;
    }
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  }
};
