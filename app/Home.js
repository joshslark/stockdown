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
      <View style= {{flex:1, width:'100%', height:'100%'}}>
	<View style= {{backgroundColor:'rgb(233,207,178)', height:'5%'}}/>
	<AisleHeader
	  number="09"
	/>
        <Barcodes 
          addBarcode={barcode}/>
	<Camera
	  saveBarcode={(data)=>this.setState({barcode: data})}
	/>
      </View>
    );
  }
}

AppRegistry.registerComponent('Home', () => Home);
