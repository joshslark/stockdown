import React, {Component} from 'react';
import {Product} from './components/Barcodes/Product'

export const DataContext = React.createContext();

export default class Provider extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    barcode: "",
    title: "",
    isTitleFocused: false,
    products: [],
    lastID: -1,
    curListIndex: 0,
    areTablesLoaded: false
  };

  render() {
    return (
      <DataContext.Provider 
        value = {{ 
          state: this.state,
          addProduct: (product) => {
            this.setState({
              products: Array(...this.state.products, product)
            });
          },
          setProducts: (newProducts) => 
            this.setState({products: newProducts}),
          renderProduct: () => this.setState({
            products: this.state.products}),
          setBarcode: (value) => this.setState({barcode: value}),
          setCurrentList: (value) => this.setState({curListIndex: value}),
          setAreTablesLoaded: (value) => this.setState({areTablesLoaded: value}),
          setTitle: (value) => this.setState({title: value}),
          setIsTitleFocused: (value) => this.setState({isTitleFocused: value}),
          setLastID: (value) => this.setState({lastID: value})
        }}>
        {this.props.children}
      </DataContext.Provider>
    );
  }
}

