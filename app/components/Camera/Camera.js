import React, {Component} from 'react';
import {View, Text, Alert, TouchableOpacity, Dimensions} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {recognizeSku} from '../utility/SkuParser'
import styles from './styles';

export default class Camera extends Component {

  // prevBarcode used to prevent repeat barcodes
  state = {
    paused: true,
    canDetectBarcode: true,
    canDetectText: false,
    prevBarcode: 0,
    barcodes: [],
    textBlocks: [],
    selectedText: "",
  };

  constructor(props) {
    super(props);
    this.camera = React.createRef();
  }


  // saveBarcode prop is callback to save the barcode
  // that was scanned
  componentDidMount() {
    this.add = this.props.saveBarcode;
  }

  renderTextblocks = () => (
    <View>
      {this.state.textBlocks.map((textBlock) => this.renderTextblock(textBlock))}
    </View>
  );

  renderTextblock = ({bounds,value}) => (
    <React.Fragment key={value + bounds.origin.x}>
      <TouchableOpacity
        style = {[
          {
            position:"absolute",
            padding: 10,
            borderWidth: 2,
            borderRadius: 2,
            borderColor: '#F00',
          },
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
        ]}
        onPress={() => this.setState({selectedText: value})}
        activeOpacity={0.8}
      />
    </React.Fragment>
  );
      
  renderBarcodes = () => (
    <View style={{
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      top: 0,
    }}>
      {this.state.barcodes.map((barcode) => this.renderBarcode(barcode))}
    </View>
  );

  renderBarcode = ({ bounds, data, type}) => (
    <React.Fragment key={data + bounds.origin.x}>
      <TouchableOpacity
        style = {[
          {
            position:"absolute",
            padding: 10,
            borderWidth: 2,
            borderRadius: 2,
            borderColor: '#F00',
          },
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
        ]}
        onPress={() => {
          let sku = recognizeSku(data);
          sku ? this.add(sku) : this.add(data);
        }}
        activeOpacity={0.8}
      >
      </TouchableOpacity>
    </React.Fragment>
  );

  renderSelectedText = () => (
    <View
      pointerEvents= "none"
      style= {{
	position:"absolute",
	bottom: "5%",
	width: "100%",
      }}>
      <Text 
	style={{
	    color:"white",
	    fontSize: 36,
	    textAlign: "center",
	    marginTop: "1%",
	  }}
	
      >
    {this.state.selectedText}
      </Text>
    </View>
  );

  render () {
    const {canDetectBarcode, canDetectText} = this.state; 
    return (
      <RNCamera
	ref={this.camera}
	captureAudio={false}
	style={styles.cameraBox}
	onTextRecognized={canDetectText ? this.textRecognized : null}
	onGoogleVisionBarcodesDetected={
	  canDetectBarcode ? this.barcodeRecognized: null}
	googleVisionBarcodeType={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.All}
      >
      {!!canDetectBarcode && this.renderBarcodes()}
      {!!canDetectText && this.renderTextblocks()}
      {(this.state.selectedText.length > 0) && this.renderSelectedText()}
      </RNCamera>
    );
  }

  pauseCameraToggle = () => {
    this.setState({
      paused: !this.state.paused,
      canDetectText: !this.state.canDetectText,
    });
    console.log(
      this.state.paused ? 
      'The camera is paused' : 'The camera is active'
    );
    this.state.paused
      ? this.pauseCamera()
      : this.resumeCamera();
  }

  // new function for google vision barcode scanning
  barcodeRecognized = ({ barcodes }) => this.setState({ barcodes });

  textRecognized = object => {
    const { textBlocks } = object;
    this.setState({ textBlocks });
  };

  // function previously used for ios barcode scanning
  processBarcode = (barcode) => {
    if (barcode.data === this.state.prevBarcode) {
      return;
    }
    const barcodeData = barcode.data;
    this.setState({prevBarcode: barcodeData});
    var sku = recognizeSku(barcode.data);

    sku ? this.add(sku): this.add(barcode.data);
  };

  pauseCamera = () => {this.camera.current.pausePreview()};
  resumeCamera = () => {this.camera.current.resumePreview()};
}
