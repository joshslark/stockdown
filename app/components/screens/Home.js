// @format

'use strict';

import React, {Component} from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  View,
  FlatList,
  Button,
} from 'react-native';

import {RNCamera} from 'react-native-camera';
import styles from './styles';
import barcodes from './barcodes';

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      paused: true,
      lastRead: 0,
      canDetectBarcode: true,
    };
  }

  pauseCameraToggle() {
    this.setState({
      paused: !this.state.paused,
      canDetectBarcode: true,
    });
    console.log(
      this.state.paused ? 'The camera is paused' : 'The camera is active'
    );
    this.state.paused
      ? this.camera.pausePreview()
      : this.camera.resumePreview();
  }
  
  onSuccess = readData => {
    if (readData.data === this.state.lastRead) {
      return;
    }
    this.setState({lastRead: readData.data});
    var sku = readData.data;

    var skuEnd = sku.slice(-3);
    var skuBegin = '';
    // Remove leading prefix
    sku = sku.substring(4);
    // Example 1001-100-100
    if (sku.length === 10) {
      skuBegin = sku.slice(0, 4);
      sku = skuBegin + '-' + sku.slice(4, 7) + '-' + skuEnd;
    }
    // Example 999-901
    if (sku.length === 6) {
      skuBegin = sku.slice(0, 3);
      sku = skuBegin + '-' + skuEnd;
    }
    console.log("Adding sku: " + sku);
    this.add(sku);
  };

  render() {
   const {canDetectBarcode} = this.state; 
    return (
      <View style= {{flex:1, width:'100%'}}>
        <TouchableOpacity
          style= {styles.cameraTouchBox }
          onPress={() => {
            this.pauseCameraToggle();
          }}
          activeOpacity={0.8}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            onCameraReady={() => {
              this.setState({paused: true});
            }}
            captureAudio={false}
            style={styles.cameraBox}
            onBarCodeRead={canDetectBarcode ? this.onSuccess: null}
          />
        </TouchableOpacity>
        <View
          style={ styles.listHeaderBox }>
          <Text
            style={ styles.listHeaderText }>
            Aisle 09
          </Text>
        </View>
        <View style={ styles.listContainer }>
          <Barcodes
            ref={ref => {
              this.barcodesList = ref}}
          />
        </View>
      </View>
    );
  }
}

AppRegistry.registerComponent('Home', () => Home);
