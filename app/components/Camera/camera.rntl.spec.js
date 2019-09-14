import React from "react";
import { render, fireEvent } from 'react-native-testing-library';
import Camera from "./Camera";

describe ('Camera', () => {
  beforeEach ( () => {
    ({ getByTestId } = render(<Camera />));
  });

  test("renders a camera", function() {
    expect(getByTestId('rncamera')).toBeTruthy();
  });
});
