import React, {Component} from 'react';

import {
  TextInput,
  View,
} from 'react-native';
import styles from './styles';

export default function AisleHeader() {
  const [value, onChangeText] = React.useState("New List"); 
  
  return (
    <View
      style={ styles.listHeaderBox }>
      <TextInput
	style={ styles.listHeaderText }
	testID="listTitleInput"
	onChangeText={(text) => onChangeText(text)}
	underlineColorAndroid={'transparent'}
	value={value}
      >
      </TextInput>
    </View>
  );
}

