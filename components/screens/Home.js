// @format

'use strict';

import React, { Component } from 'react';

import {
  AppRegistry,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  View,
  FlatList,
} from 'react-native';

import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { SQLite } from 'expo-sqlite';

import styles from './styles';

const db = SQLite.openDatabase('storage2.db');

class Barcodes extends React.Component {
  state = {
    barcodes: null,
  };

  componentDidMount() {
    this.update();
  }

  _renderBarcode = ({item}) => (
      <View style={styles.listItemLeftMargin}>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>{item.data}</Text>
        </View>
      </View>
  );

  render() {
    const { barcodes } = this.state;
    if (barcodes === null) {
      return null;
    } 
    else {
      return (
        <FlatList
          ref={ref => {
            this.flatlist = ref;
          }}
          data={this.state.barcodes}
          extraData={this.state}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this._renderBarcode}
        />
      );
    }
  }

  handleError (e) {
    console.log(e);
  }

  update() {
    console.log("Calling inner update");
    db.transaction(tx => {
      tx.executeSql(
        `select * from barcodes`,
        null,
        (_, { rows: { _array } }) =>
          this.setState({ barcodes: _array}),
        this.handleError
      );
    });

    //this.flatlist.scrollToEnd({ animated: true });
  }
}
export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      paused: true,
      lastRead: 0,
      canDetectBarcode: true,
      hasCameraPermission: null,
    };
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });

    db.transaction(tx => {
      tx.executeSql(
        `create table if not exists barcodes (id integer primary key not null, data text);`
      );
    });
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

  componentDidUpdate() {
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

  add(data) {
    console.log("Adding new data");
    if ((data === null) | (data === '')) {
      return false;
    }

    db.transaction(
      tx => {
        tx.executeSql('insert into barcodes (data) values (?) ', [data]);
        tx.executeSql('select * from barcodes', [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
      this.handleError,
      this.update
    );
  }

  update = () => {
    console.log ("Updating from database");
    this.barcodesList && this.barcodesList.update();
  };

  handleError = (e) => {
    console.log (e);
  };

  render() {
    const { canDetectBarcode, hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text> No access to camera </Text>;
    } else {
      return (
        <View style={{ flex: 1, width: '100%' }}>
          <TouchableOpacity
            style={styles.cameraTouchBox}
            onPress={() => {
              this.pauseCameraToggle();
            }}
            activeOpacity={0.8}>
            <Camera
              ref={ref => {
                this.camera = ref;
              }}
              onCameraReady={() => {
                this.setState({ paused: true });
              }}
              captureAudio={false}
              style={styles.cameraBox}
              onBarCodeScanned={canDetectBarcode ? this.onSuccess : null}
            />
          </TouchableOpacity>
          <View style={styles.listHeaderBox}>
            <Text style={styles.listHeaderText}>Aisle 10</Text>
          </View>
          <Button 
            onPress={() => {
              db.transaction( tx => {
                tx.executeSql(`delete from barcodes`);
              });
              this.onSuccess({data: '98071000999901'});
              }}
            title="Add a sku to the list"
          />
          <View style={styles.listContainer}>
            <Barcodes
             ref={ref => {
               this.barcodesList = ref}}
            />
          </View>
        </View>
      );
    }
  }
}

AppRegistry.registerComponent('Home', () => Home);
