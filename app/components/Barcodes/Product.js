export class Product {
  constructor(desc, sku, upc, location, onhands){
    this._description = desc || "NEW PRODUCT";
    this._sku = sku || "000-000";
    this._upc = upc || "0000000000000";
    this._location = location || "00-000";
    this._onhands = onhands || 0;
  }
  set id(productId) {
    this._id=productId;
  }
  set description(productDesc) {
    this._description=productDesc;
  }
  set sku(productSku) {
    this._sku=productSku;
  }
  set upc(productUpc) {
    this._upc=productUpc;
  }
  set location(productLocation) {
    this._location=productLocation;
  }
  set onhands(productOnhands) {
    this._onhands=productOnhands;
  }

  get id() {
    return this._id;
  }
  get description() {
    return this._description;
  }
  get sku() {
    return this._sku;
  }
  get upc() {
    return this._upc;
  }
  get location() {
    return this._location;
  }
  get onhands() {
    return this._onhands;
  }

  getPropertyNames() {
    return [
      "description",
      "sku",
      "upc", 
      "location",
      "onhands"];
  }
}
