/**
 * Packdown Assistance React Native App
 * An app that allows the user to keep track of inventory needing
 * to be pulled down from overheads.
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import Home from './app/Home'
console.disableYellowBox = true;

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={{flex:1}}>
      <Home />
      </View>
    );
  }
}
