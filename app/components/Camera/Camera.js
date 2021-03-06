import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Button} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {AddAllBarcodesBtn} from '../Buttons'
import {recognizeSku} from '../utility/SkuParser';
import styles from './styles';
import {DataContext} from '../../Provider.js'

export default class Camera extends Component {
  // prevBarcode used to prevent repeat barcodes
  state = {
    paused: false,
    canDetectBarcode: true,
    canDetectText: false,
    debug: false,
    debugBox: false,
    prevBarcode: 0,
    barcodes: [],
    textBlocks: [],
    selectedText: '',
  };

  constructor(props) {
    super(props);
    this.camera = React.createRef();
  }

  // saveBarcode prop is callback to save the barcode
  // that was scanned
  componentDidMount() {
    if (this.state.debug) {
      const sampleBarcodes = [{
	data: "98071001382486",
	bounds: {
	    size: {
	      width: 200,
	      height: 50
	    },
	    origin: {
	      x: 50,
	      y: 50
	    }
	},
	type: "code128"
      },
      {
	data: "98071003238840",
	bounds: {
	    size: {
	      width: 200,
	      height: 50
	    },
	    origin: {
	      x: 50,
	      y: 110
	    }
	},
	type: "code128"
      },
      {
	data: "98071002166126",
	bounds: {
	    size: {
	      width: 200,
	      height: 50
	    },
	    origin: {
	      x: 50,
	      y: 170
	    }
	},
	type: "code128"
      }];
    this.setState({barcodes: sampleBarcodes});
    }
  }

  renderTextblocks = () => (
    <View>
      {this.state.textBlocks.map(textBlock => this.renderTextblock(textBlock))}
    </View>
  );

  renderTextblock = ({bounds, value}) => (
    <React.Fragment key={value + bounds.origin.x}>
      <TouchableOpacity
        style={[
          styles.barcodeBox,
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
    <View style={styles.upperCorner}>
      {this.state.barcodes.map((barcode,index) => this.renderBarcode(barcode, index))}
      <AddAllBarcodesBtn/>
    </View>
  );

  renderBarcode = ({bounds, data, type}, barcodeIndex) => 
    (<React.Fragment key={data + bounds.origin.x}>
      <DataContext.Consumer>
        {(context) => (
          <TouchableOpacity
            style={[
              styles.highlightBox,
              {
                ...bounds.size,
                left: bounds.origin.x,
                top: bounds.origin.y,
              },
            ]}
            testID={"barcode" + barcodeIndex}
            onPress={() => {
              let sku = recognizeSku(data);
              sku ? context.setBarcode(sku) : context.setBarcode(data);
            }}
            activeOpacity={0.8}
          />
        )}
      </DataContext.Consumer>
    </React.Fragment>
  );

  renderSelectedText = () => (
    <View pointerEvents="none" style={styles.infoTextPosition}>
      <Text style={styles.infoText}>{this.state.selectedText}</Text>
    </View>
  );

  pauseCameraToggle = () => {
    this.setState({
      paused: !this.state.paused,
      canDetectText: !this.state.canDetectText,
    });
    console.log(
      this.state.paused ? 'The camera is paused' : 'The camera is active',
    );
    this.state.paused ? this.pauseCamera() : this.resumeCamera();
  };

  barcodeRecognized = ({barcodes}) => {
    if (barcodes.length > 0)
    {
      //this.camera.current.pausePreview();
      this.setState({barcodes});
    }
  };

  textRecognized = object => {
    const {textBlocks} = object;
    this.setState({textBlocks});
  };

  pauseCamera = () => {
    this.camera.current.pausePreview();
  };
  resumeCamera = () => {
    this.camera.current.resumePreview();
  };

  render() {
    const {canDetectBarcode, canDetectText, debugBox} = this.state;
    return (
      <View style={{flex: 1.5, overflow: 'hidden'}}>
        <RNCamera
          ref={this.camera}
          captureAudio={false}
          ratio={"1:1"}
          style={styles.cameraBox}
          onTextRecognized={canDetectText ? this.textRecognized : null}
          onGoogleVisionBarcodesDetected={
            canDetectBarcode ? this.barcodeRecognized : null
          }
          googleVisionBarcodeType={
            RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.All
          }
          testID="rncamera"
        >
          {!!canDetectBarcode && this.renderBarcodes()}
          {!!canDetectText && this.renderTextblocks()}
          {!!debugBox && <View style={styles.debugBarcodeBox} />}
          {this.state.selectedText.length > 0 && this.renderSelectedText()}
        </RNCamera>
      </View>
    );
  }
}
