import React, {useState, useEffect, useContext} from 'react';
import {View, Button, FlatList, Text} from 'react-native';
import styles from './styles';
import {useNewDB, useDBToAddBarcode, useDBToGetSkus, deleteAllSkus} from './SQLiteDB';
import {DataContext} from '../../Home.js';

export default function Barcodes(props) {
  function _renderBarcode ({item}) {
    return (
      <View style={styles.listItemLeftMargin}>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>{item}</Text>
        </View>
      </View>
    );
  }

  function handleDeletion() {
    deleteAllSkus();
    setState({});
  }

  const cameraContext = useContext(DataContext);

  // used to force rerender
  let [,setState] = useState();

  useNewDB();
  let skus = [];
  skus = useDBToGetSkus();
  useDBToAddBarcode(cameraContext.state.barcode);
  useEffect(() => {
    this.flatlist && this.flatlist.scrollToEnd({animated: true});
  }, [skus]);

  return (
    <View style={styles.listContainer}>
      <View style={{backgroundColor: 'white'}}>
        <Button onPress={() => handleDeletion()} title={'Delete All Barcodes'} />
      </View>
      <View style={{flex:1}}>
        <FlatList
          ref={ref => {
            this.flatlist = ref;
          }}
          data={skus}
          keyExtractor={(item, index) => index.toString()}
          renderItem={_renderBarcode}
        />
      </View>
    </View>
  );
}
