import React, {useState, useContext, useRef} from 'react';
import {DataContext} from '../../Provider.js';
import {useDBToSaveTitle, useDBToLoadTitle} from '../Barcodes/SQLiteDB';
import {Icon} from 'react-native-elements';

import {
  TextInput,
  View,
} from 'react-native';
import styles from './styles';

export default function AisleHeader() {
  const dbContext = useContext(DataContext);
  useDBToLoadTitle();

  return (
    <View
      style={{...styles.listHeaderBox, flexDirection: 'row'}}>
      <Icon 
        name="keyboard-arrow-left"
        type='material'
        size={60}
        containerStyle={{flex:1, alignSelf: 'flex-start'}}
        onPress={() => {
          const prevIndex = Math.max(dbContext.state.curListIndex-1, 0);
          dbContext.setCurrentList(prevIndex);
        }}
      />
      <TextInput
        style={{ ...styles.listHeaderText, flex:2, textAlign: 'center' }}
        testID="listTitleInput"
        onSubmitEditing={(event) => {
          useDBToSaveTitle(dbContext.state.curListIndex, event.nativeEvent.text);
        }}
        underlineColorAndroid={'transparent'}
        defaultValue={dbContext.state.title}
      >
      </TextInput>
      <Icon 
        name="keyboard-arrow-right"
        type='material'
        size={60}
        containerStyle={{flex: 1, alignSelf:'flex-end'}}
        onPress={() => {
          const nextIndex = Math.min(dbContext.state.curListIndex+1, 10);
          dbContext.setCurrentList(nextIndex);
        }}
      />
    </View>
  );
}

