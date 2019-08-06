import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  cameraBox: {
    flex: 1,
  },
  cameraTouchBox: {
    flex: 1,
  },
  listContainer: {
    flex: 2, 
    width: '100%',
    backgroundColor: 'rgb(172,122,66)',
  },
  listHeaderContainer: {
    flex: 2,
    justifyContent: 'flex-start',
  },
  listHeaderBox: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'rgb(233,207,178)',
  },
  listHeaderText: {
    alignSelf: 'center',
    fontSize: 36,
    borderBottomWidth: 1,
    padding: 10,
    color: 'black',
  },
  listItem: {
    height: 50,
    width: '95%',
    alignSelf: 'flex-end',
    borderBottomColor: 'grey',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingLeft: 10,
    justifyContent: 'center',
    backgroundColor: 'rgb(235,232,215)',
  },
  listItemLeftMargin: {
    backgroundColor: 'rgb(235,232,215)',
  },
  listItemText: {
    color: 'black'
  },
});

export default styles;
