import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  cameraBox: {
    flex: 1,
    height: 100,
  },
  debugBarcodeBox: {
    position: 'absolute',
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    borderColor: 'green',
    top: 60,
    left: 120,
    width: 150,
    height: 45,
  },
  highlightBox: {
    position: 'absolute',
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#F00',
  },
  upperCorner: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  infoTextPosition: {
    position: 'absolute',
    bottom: '5%',
    width: '100%',
  },
  infoText: {
    color: 'white',
    fontSize: 36,
    textAlign: 'center',
    marginTop: '1%',
  },
});

export default styles;
