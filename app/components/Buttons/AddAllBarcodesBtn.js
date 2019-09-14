import React, {Component} from 'react';
import {
  Button,
  StyleSheet,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements'

function addAllBarcodes() {
 console.log("Adding barcodes"); 
}

export default function AddAllBarcodesBtn() {
  return (
    <View
      style={styles.buttonPosition}>
      <Icon
	raised
	name='add'
	color='#517fa4'
	size={20}
	underlayColor="#ddd"
	disabled={false}
	disabledStyle={{backgroundColor: '#a1a5a8'}}
	onPress={()=>console.log("TODO: Add all barcodes")}
       />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonPosition: {
    position: 'absolute',
    bottom: '5%',
    right: '5%',
    padding: 10,
  },
});
