// @format

'use strict';

import React, {Component} from 'react';

import {
  AppRegistry,
  View,
  Alert,
} from 'react-native';

import {Camera, AisleHeader, Barcodes} from './components';

export default class Home extends Component {
  state = {
    barcode: ""
  };

  render() {
    const barcode = this.state.barcode;
    return (
      <View style= {{flex:1, width:'100%'}}>
	<Camera
	  saveBarcode={(data)=>this.setState({barcode: data})}
	/>
	<AisleHeader
	  number="09"
	/>
        <Barcodes 
          addBarcode={barcode}/>
      </View>
    );
  }
  storeRef = (ref) => {this.barcodesList = ref};
}

AppRegistry.registerComponent('Home', () => Home);
