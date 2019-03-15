/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import {mount} from 'enzyme';

import {Home} from '../app/components/screens/';

jest.mock('react-native-camera', () => 'Camera');
jest.mock('react-native-permissions');
jest.mock('react-native-qrcode-scanner');

describe('Home', () => {
  it('renders a qrcode scanner', () => {
    const wrapper = mount(<Home />);

    expect(wrapper.find('QRCodeScanner').length).toEqual(1);
  });
});
