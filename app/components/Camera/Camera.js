import {Component} from 'react';
import {RNCamera} from 'react-native-camera';

export default class Camera extends Component {
	state = {
		paused: true,
		canDetectBarcode: false,
		prevBarcode: 0,
	};

	// saveBarcode prop is callback to save the barcode
	// that was scanned
	componentDidMount() = {
		this.add = this.props.saveBarcode;
	}

	render () {
		const {canDetectBarcode} = this.state; 
		return (
        <TouchableOpacity
          style= {styles.cameraTouchBox}
          onPress={this.pauseCameraToggle}
          activeOpacity={0.8}>
          <RNCamera
            ref={this.storeRef}
            onCameraReady={this.pauseCamera}
            captureAudio={false}
            style={styles.cameraBox}
            onBarCodeRead={
							canDetectBarcode ? this.processBarcode: null}
          />
        </TouchableOpacity>
		);
	}

  pauseCameraToggle = () => {
    this.setState({
      paused: !this.state.paused,
      canDetectBarcode: !this.state.canDetectBarcode,
    });
    console.log(
      this.state.paused ? 
			'The camera is paused' : 'The camera is active'
    );
    this.state.paused
      ? this.pauseCamera()
      : this.resumeCamera();
  }

  processBarcode = (barcode) => {
    if (barcode.data === this.state.prevBarcode) {
      return;
    }
    this.setState({prevBarcode: barcode.data});
		var sku = SkuParser.recognizeSku(barcode.data);

    sku ? this.add(sku): this.add(barcode.data);
  };

	storeRef = (ref) => {this.camera = ref};
	pauseCamera = () => {this.camera.pausePreview()};
	resumeCamera = () => {this.camera.resumePreview()};

