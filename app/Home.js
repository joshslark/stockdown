// @format

'use strict';

import React, {Component} from 'react';

import {AppRegistry, View, Alert} from 'react-native';

import {Camera, AisleHeader, Barcodes} from './components';

export default class Home extends Component {
  render() {
    return (
      <View style={{flex: 1, width: '100%', height: '100%'}}>
        {
          <View style={{backgroundColor: 'rgb(233,207,178)', height: '5%'}} />
        }
        <AisleHeader />
        <Barcodes />
        <Camera />
      </View>
    );
  }
}

AppRegistry.registerComponent('Home', () => Home);
