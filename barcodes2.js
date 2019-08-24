import React, {useState, useEffect} from 'react';
import {View, Button, Flatlist, Text} from 'react-native';
import styles from './styles';

const { createStore } = Redux;
const store = createStore(barcodes);
const initialState = {barcodes: null};

function reducer(state, action) {
  switch (action.type) {
    case 'add':
      // SQL to add a barcode into db
    case 'remove':
      // SQL to remove a barcode from db
    case 'get':
      // SQL to get barcodes from db
    case 'clear':
      // SQL to delete all barcodes
    default: 
      throw new Error();
  }
}


function ClearListButton() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
      <View
        style={{backgroundColor:"white"}}>
        <Button
          onPress={() => dispatch({type: 'clear'})}
          title={"Clear List"}
        />
      </View>
  );
}

function BarcodesList() {
  const [state, dispatch] = useReducer(reducer, initialState);
  dispatch({type: 'get'});

  return (
      <View>
        <FlatList
          ref={ref => {
            this.flatlist = ref;
          }}
          data={state.barcodes}
          extraData={state}
          keyExtractor={(item, index) => index.toString()}
          renderItem={_renderBarcode}
        />
      </View>
  );
}

function Barcodes() {
  return (
      <View style={ styles.listContainer }>
        <ClearListButton/>
        <BarcodesList/>
      </View>
  );
}
        
