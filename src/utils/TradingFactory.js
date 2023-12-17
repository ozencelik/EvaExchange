class Trade {
  constructor(type, price, quantity) {
    this.type = type;
    this.price = price;
    this.quantity = quantity;
  }
  create() {
    return type === "buy"
      ? new Buy()
      : new Sell();
  }

  finalize() {
    return type === "buy"
      ? new Buy()
      : new Sell();
  }
}

class Buy extends Trade {
  constructor() {
    super(brand);
    this.model = mod;
  }
  validate() {
    return this.present() + ', it is a ' + this.model;
  }
}