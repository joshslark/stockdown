import React, {Component} from 'react';

export const DataContext = React.createContext();

class Product {
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

export default class Provider extends Component {
  state = {
    barcode: "",
    title: "",
    isTitleFocused: false,
    products: [new Product("NEW PRODUCT", "1001-100-100", "035862413026", "07-003", 20)],
    curListIndex: 0,
    areTablesLoaded: false
  };

  render() {
    return (
      <DataContext.Provider 
        value = {{ 
          state: this.state,
          addProduct: () => this.setState(Array(...this.state.products, new Product())),
          renderProduct: () => this.setState(Array(this.state.products)),
          setBarcode: (value) => this.setState({barcode: value}),
          setCurrentList: (value) => this.setState({curListIndex: value}),
          setAreTablesLoaded: (value) => this.setState({areTablesLoaded: value}),
          setTitle: (value) => this.setState({title: value}),
          setIsTitleFocused: (value) => this.setState({isTitleFocused: value})
        }}>
        {this.props.children}
      </DataContext.Provider>
    );
  }
}

