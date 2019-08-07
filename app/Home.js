// @format

'use strict';

import React, {Component} from 'react';

import {
  AppRegistry,
  View,
} from 'react-native';

import {Camera, AisleHeader, Barcodes} from './components';

export default class Home extends Component {
  render() {
    return (
      <View style= {{flex:1, width:'100%'}}>
	<Camera
	  saveBarcode={this.barcodesList.add}
	/>
	<AisleHeader
	  number = "09"
	/>
	<Barcodes
	  ref={this.storeRef}
	/>
      </View>
    );
  }
  storeRef = (ref) => {this.barcodesList = ref};
}

AppRegistry.registerComponent('Home', () => Home);
