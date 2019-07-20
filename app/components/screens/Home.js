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
  ScrollView,
} from 'react-native';

import {ListItem} from 'react-native-elements';

import QRCodeScanner from 'react-native-qrcode-scanner';

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      paused: false,
      scanned: null,
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

  onSuccess(e) {
    this.setState({scanned: {sku: e.data}});
    console.log(this.state.scanned);
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => {
            this.pauseCameraToggle();
          }}
          activeOpacity={0.8}>
          <QRCodeScanner
            cameraProps={{
              captureAudio: false,
              ref: node => {
                this.camera = node;
              },
              onCameraReady: () => {
                this.setState({paused: true});
              },
            }}
            ref={node => {
              this.scanner = node;
            }}
            onRead={this.onSuccess.bind(this)}
            cameraStyle={{flex: 1}}
            fadeIn={false}
            topViewStyle={{display: 'none'}}
            bottomViewStyle={{display: 'none'}}
            containerStyle={{
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 2,
            justifyContent: 'flex-start',
            backgroundColor: 'rgb(172,122,66)',
          }}>
          <View
            style={{
              borderBottomWidth: StyleSheet.hairlineWidth,
              backgroundColor: 'rgb(233,207,178)',
            }}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 36,
                borderBottomWidth: 1,
                padding: 10,
                color: 'black',
              }}>
              Aisle 09
            </Text>
          </View>
          <FlatList
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'flex-start',
              backgroundColor: 'rgb(172,122,66)',
            }}
            data={[
              {sku: '1001-001-100'},
              {sku: '1001-001-100'},
              {sku: '1001-002-102'},
            ]}
            extraData={this.state.scanned}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={{backgroundColor: 'rgb(235,232,215)'}}>
                <View
                  style={{
                    height: 50,
                    width: '95%',
                    alignSelf: 'flex-end',
                    borderBottomColor: 'grey',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    paddingLeft: 10,
                    justifyContent: 'center',
                    backgroundColor: 'rgb(235,232,215)',
                  }}>
                  <Text style={{color: 'black'}}>{item.sku}</Text>
                </View>
              </View>
            )}
          />
          <ScrollView>
            <ListItem
              checkBox={{checked: false}}
              // Description
              title={'Description'}
              // Sku
              subtitle={'1001-001-100'}
              // Amount in stock
              badge={{value: '12'}}
              bottomDivider
            />
            <ListItem
              title={'Description2'}
              subtitle={'1001-001-101'}
              badge={{value: '1'}}
              bottomDivider
            />
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

AppRegistry.registerComponent('Home', () => Home);
