import React, {useState, useContext} from 'react';
import {DataContext} from '../../Home.js';
import {useDBToSaveTitle, useDBToLoadTitle} from '../Barcodes/SQLiteDB';

import {
  TextInput,
  View,
} from 'react-native';
import styles from './styles';

export default function AisleHeader() {
  const dbContext = useContext(DataContext);
  const title = useDBToLoadTitle(dbContext.state.curListIndex);
  
  return (
    <View
      style={ styles.listHeaderBox }>
      <TextInput
	style={ styles.listHeaderText }
	testID="listTitleInput"
	onSubmitEditing={(event) => useDBToSaveTitle(dbContext.state.curListIndex, event.nativeEvent.text)}
	underlineColorAndroid={'transparent'}
        placeholder={title}
        placeholderTextColor={"black"}
      >
      </TextInput>
    </View>
  );
}

