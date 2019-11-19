import React, {useState, useEffect, useContext, useRef} from 'react';
import {View, Button, FlatList, Text, TextInput, TouchableWithoutFeedback} from 'react-native';
import {Icon} from 'react-native-elements';
import styles from './styles';
import {useNewDB, useDBToAddBarcode, useDBToGetSkus, deleteAllSkus} from './SQLiteDB';
import {DataContext} from '../../Provider.js';
import {ActivityView} from 'react-native-activity-view';

export default function Barcodes(props) {
  const context = useContext(DataContext);
  const [editing, setEditing] = useState(Array(context.state.products.length).fill(false));
  const flatlistRef = useRef(null);

  function ItemBar(props) {
    return (
      <TouchableWithoutFeedback 
        onPress={() => {
          setEditing(prevArr => {
            prevArr[prevArr.findIndex(x => x)] = false;
            prevArr[props.index] = true;
            return prevArr;
          });
          // Todo cause rerender
          context.renderProduct();
        }}>
        <View
          style={styles.listItemLeftMargin}>
          {props.children}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  function Barcode (props) {
    return (
      <ItemBar index={props.index}>
        <View style={{...styles.listItem, flexDirection: 'row'}}>
          <View style={{width:'95%'}}>
            <Text style={{fontSize: 20}}>{props.product.description}</Text>
            <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <View>
                <Text style={{...styles.listItemText, paddingLeft:10}}>{props.product.sku}</Text>
                <Text style={{paddingLeft:10}}>{props.product.upc}</Text>
              </View>
              <View style={{
                justifyContent: 'center', 
                alignItems: 'center',
                paddingRight: 40}}> 
                <Text>{props.product.location}</Text>
                <Text>{props.product.onhands}</Text>
              </View>
            </View>
          </View>
        </View>
      </ItemBar>
    );
  }

  function Properties(props) {
    const [values, setValues] = useState(props.product); 
    const [isSelected, setIsSelected] = useState(props.product.getPropertyNames());
    const refs = Array(props.product.getPropertyNames().length).fill(useRef(null));
    // Todo onChangeText and value reference props.product
    return (
      <>
        <View style={{
          flexDirection: 'column', 
          flex:1,
          }}>
          {
            props.product.getPropertyNames().map((name, index) => (
              <View key={index} style={{
                flexDirection: 'row',
                flex: 1,
              }}>
                <Text style={{fontSize:25, flex:1, textAlign:'right', alignSelf:'center'}}>
                  {name}
                </Text>
                <View style={{
                  flex:1.5, 
                  borderWidth: 1, 
                  borderRadius: 5, 
                  padding:5, 
                  margin: 10, 
                  marginRight: 0,
                  borderColor:'grey'}}>
                  <TextInput
                    ref={refs[index]}
                    onSubmitEditing={(event) => {
                      refs[(index+1)%5].current.focus();
                    }}
                    placeholder={"Insert "+ name + " here"}
                    style={{
                      fontSize:20, 
                      flex:0.8, 
                      paddingLeft:10, 
                      color: 'black', 
                    }}
                    clearButtonMode={"always"}
                    onChangeText={(text) => {props.product[name] = text}}
                    defaultValue={props.product[name]}
                  />
                </View>
              </View>))
          }
        </View>
        <View style={{
          flexDirection: 'column',
          paddingLeft: 30 }}>
        </View>
      </>
    );
  }

  function Editor(props) {
    return (
      <ItemBar>
        <View style={styles.listItem}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Icon
              name='close'
              type='material'
              size={25}
              onPress={() => {
                setEditing((prevArr) => {
                  prevArr[prevArr.findIndex(x=>x)] = false;
                  return prevArr;
                });
                // Todo Cause a rerender of list
                context.renderProduct();
              }}
              containerStyle={{
                position: 'absolute',
                left: 0,
                paddingTop: 10, 
                paddingBottom: 10,
              }}
            />
            <Text 
              style={{
                fontSize: 25, 
                paddingTop: 10, 
                paddingBottom: 10}}> 
              Editing Mode 
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Properties product={props.product} />
          </View>
        </View>
      </ItemBar>
    );
  }

  function handleDeletion() {
    // Todo remove products from list
    //deleteAllSkus();
    //context.setSkus([]);
  }

  function share() {
    //createShareDBFile();
    ActivityView.show({
      text: "Sample Text"
    });
  }

  useNewDB();
  //useDBToGetSkus();
  //useDBToAddBarcode();

  // Todo figure out when to scroll
  useEffect(() => {
    flatlistRef.current.scrollToEnd({animated: true});
  }, [context.state]);

  return (
    <View style={styles.listContainer}>
      <View style={{backgroundColor: 'white'}}>
        <Button onPress={() => share()} title={'Share this list'} />
      </View>
      <View style={{flex:1}}>
        <FlatList
          ref={flatlistRef}
          data={context.state.products}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index, separators}) => {
            if (editing[index]) {
              return <Editor key={index} product={item}/>;
            } else {
              return <Barcode index={index} product={item}/>;
            }
          }}
        />
      </View>
    </View>
  );
}
