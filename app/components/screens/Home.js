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
} from 'react-native';

import {RNCamera} from 'react-native-camera';

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      paused: false,
      barcodes: [],
    };
  }

  pauseCameraToggle() {
    this.setState({
      paused: !this.state.paused,
    });
  }

  componentDidUpdate() {
    console.log(
      this.state.paused ? 'The camera is paused' : 'The camera is active',
    );
    this.state.paused
      ? this.camera.pausePreview()
      : this.camera.resumePreview();
  }

  onSuccess(barcode) {
    this.setState({barcodes: [...barcodes, ...barcode.data]});
    alert(this.state.barcodes);
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          style= { styles.cameraBox }
          onPress={() => {
            this.pauseCameraToggle();
          }}
          activeOpacity={0.8}>
          <View
            style= { styles.cameraBox }>
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              onCameraReady={() => {
                this.setState({paused: true});
              }}
              captureAudio={false}
              style={ styles.cameraBox }
              onBarCodeRead={this.onSuccess}
            />
          </View>
        </TouchableOpacity>
        <View
          style={ styles.listContainer }>
          <View
            style={ styles.listHeaderBox }>
            <Text
              style={ styles.listHeaderText }>
              }}>
              Aisle 09
            </Text>
          </View>
          <View style={ styles.listContainer }>
            <FlatList
              contentContainerStyle={ styles.listBackground }
              data={this.state.barcodes}
              extraData={this.state}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <View style={ styles.listItemBackground }>
                  <View
                    style={ styles.listItem }>
                    <Text style={ styles.listItemText }>{item}</Text>
                  </View>
                </View>
              )}
            />
        </View>
      </View>
    );
  }
}}

const styles = StyleSheet.create({
  cameraBox: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  listContainer: {
    flex: 1, width: '100%'
  },
  listBackground: {
    backgroundColor: 'rgb(172,122,66)',
  },
  listHeaderContainer: {
    flex: 2,
    justifyContent: 'flex-start',
    backgroundColor: 'rgb(172,122,66)',
  },
  listHeaderBox: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'rgb(233,207,178)',
  },
  listHeaderText: {
    alignSelf: 'center',
    fontSize: 36,
    borderBottomWidth: 1,
    padding: 10,
    color: 'black',
  },
  listItem: {
    height: 50,
    width: '95%',
    alignSelf: 'flex-end',
    borderBottomColor: 'grey',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingLeft: 10,
    justifyContent: 'center',
    backgroundColor: 'rgb(235,232,215)',
  },
  listItemBackground: {
    backgroundColor: 'rgb(235,232,215)',
  }
  listItemText: {
    color: 'black'
  },
});

AppRegistry.registerComponent('Home', () => Home);
