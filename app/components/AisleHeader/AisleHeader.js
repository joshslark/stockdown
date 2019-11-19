import React, {useState, useContext, useRef} from 'react';
import {DataContext} from '../../Provider.js';
import {useDBToSaveTitle, useDBToLoadTitle} from '../Barcodes/SQLiteDB';

import {
  TextInput,
  View,
} from 'react-native';
import styles from './styles';

export default function AisleHeader() {
  const dbContext = useContext(DataContext);
  //useDBToLoadTitle();

  return (
    <View
      style={ styles.listHeaderBox }>
      <TextInput
        style={ styles.listHeaderText }
        testID="listTitleInput"
        onSubmitEditing={(event) => {
          useDBToSaveTitle(dbContext.state.curListIndex, event.nativeEvent.text);
        }}
        underlineColorAndroid={'transparent'}
        defaultValue={dbContext.state.title}
      >
      </TextInput>
    </View>
  );
}

