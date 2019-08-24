import React from 'react';
import Home from './Home';

describe ('Home', function () {
  let component;
  let cameraComponent = 'Camera';
  let headerComponent = 'AisleHeader';
  let listComponent = 'Barcodes';

  beforeEach(function () {
    component = shallow (<Home />);
  });

  test('renders a camera', function () {
    expect(component.exists(cameraComponent)).toBeTrue;
  });

  test('has a header', function () {
    expect(component.exists(headerComponent)).toBeTrue;
  });

  test('has a list of barcodes', function () {
    expect(component.exists(listComponent)).toBeTrue;
  });

  describe('Camera', function () {

    test('saves barcodes', function () {
      const data = "someData";
      component.find(cameraComponent).invoke('saveBarcode')(data);
      expect(component.state('barcode')).toEqual(data);
    });

  });


  describe('AisleHeader', function () {
    
    test('accepts a number that corresponds to the aisle the barcodes came from', function () {
      const aisleNumber = "09";
      expect(component.find(headerComponent).prop('number')).toEqual(aisleNumber);
    });

  });

  describe('Barcodes', function () {

    test('takes a barcode and adds it to the list', function () {
      const barcodeData = "1001-100-100";
      expect(component.find(listComponent).prop('addBarcode'))
        .toMatch(component.state('barcode'))
    });

  });
});
