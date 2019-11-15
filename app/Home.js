// @format

'use strict';

import React, {Component} from 'react';

import {
  AppRegistry,
  View,
  Alert,
} from 'react-native';

import {Camera, AisleHeader, Barcodes} from './components';

export const DataContext = React.createContext();

export default class Home extends Component {
  state = {
    barcode: "",
    curListIndex: 0
  };

  render() {
    const barcode = this.state.barcode;
    return (
      <View style= {{flex:1, width:'100%', height:'100%'}}>
	<View style= {{backgroundColor:'rgb(233,207,178)', height:'5%'}}/>
        <DataContext.Provider 
          value = {{ 
            state: this.state,
            setBarcode: (value) => this.setState({barcode: value}),
            setTitle: (value) => this.setState({listTitle: value})
          }}>
          <AisleHeader />
          <Barcodes />
          <Camera />
        </DataContext.Provider>
      </View>
    );
  }
}

AppRegistry.registerComponent('Home', () => Home);
