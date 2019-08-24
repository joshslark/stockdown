import React from "react";
import { View } from "react-native";
import Camera from "./Camera";
import { mount } from "enzyme";
import renderer from "react-test-renderer";

describe("Camera", function() {
  let component;
  let _this;
  let cameraComponent = "RNCamera";

  beforeEach(function() {
    component = mount(<Camera />);
    _this = component.instance();
    _this.camera.current.resumePreview = jest.fn();
    _this.camera.current.pausePreview = jest.fn();
  });

  afterEach(function() {
    component.unmount();
  });

  test("renders a camera", function() {
    expect(component.exists(cameraComponent)).toBeTrue;
  });

  test("ui doesn't change unexpectedly", function() {
    let bounds = {
      size: {
        width: "0",
        height: "0"
      },
      origin: {
        x: "0",
        y: "0"
      }
    };
    let data = "test";
    let type = "code128";

    const tree = renderer
      .create(<View>{_this.renderBarcode({ bounds, data, type })}</View>)
      .toJSON();
    expect(tree).toMatchInlineSnapshot(`
      <View>
        <View
          accessible={true}
          clickable={true}
          isTVSelectable={true}
          onClick={[Function]}
          onResponderGrant={[Function]}
          onResponderMove={[Function]}
          onResponderRelease={[Function]}
          onResponderTerminate={[Function]}
          onResponderTerminationRequest={[Function]}
          onStartShouldSetResponder={[Function]}
          style={
            Object {
              "borderColor": "#F00",
              "borderRadius": 2,
              "borderWidth": 2,
              "height": "0",
              "left": "0",
              "opacity": 1,
              "padding": 10,
              "position": "absolute",
              "top": "0",
              "width": "0",
            }
          }
        />
      </View>
    `);
  });

  describe("RNCamera", function() {
    beforeEach(function() {
      nativeComponentName = "Camera";
      nativeComponent = component.find(nativeComponentName).at(1);
    });

    test("renders native camera module", function() {
      expect(component.exists(nativeComponentName)).toBeTrue;
    });

    test("stores a ref to the module", function() {
      expect(component.instance().camera).toBeDefined();
    });

    test("doesn't capture audio", function() {
      expect(nativeComponent.prop("captureAudio")).toBe(false);
    });
  });

  describe("#pauseCameraToggle", function() {
    beforeEach(function() {
      console.log = function() {};
      jest.clearAllMocks();
    });

    test("flips paused state", function() {
      let prevState = component.state("paused");
      _this.pauseCameraToggle();
      expect(component.state("paused")).not.toBe(prevState);
    });

    test("flips text detection state", function() {
      let prevState = component.state("canDetectText");
      _this.pauseCameraToggle();
      expect(component.state("canDetectText")).not.toBe(prevState);
    });

    test("logs the camera's status", function() {
      let activeStatus = "The camera is active";
      let pausedStatus = "The camera is paused";
      console.log = jest.fn();

      _this.pauseCameraToggle();
      if (component.state("paused")) {
        expect(console.log.mock.calls[0][0]).toBe(pausedStatus);
      } else {
        expect(console.log.mock.calls[0][0]).toBe(activeStatus);
      }
    });

    test.each([true, false])(
      "pauses the camera instance (paused: %s)",
      function(isPaused) {
        component.setState({ paused: isPaused });
        _this.pauseCameraToggle();
        if (component.state("paused")) {
          expect(_this.camera.current.pausePreview.mock.calls.length).toBe(1);
          expect(_this.camera.current.resumePreview.mock.calls.length).toBe(0);
        } else {
          expect(_this.camera.current.resumePreview.mock.calls.length).toBe(1);
          expect(_this.camera.current.pausePreview.mock.calls.length).toBe(0);
        }
      }
    );
  });
});
