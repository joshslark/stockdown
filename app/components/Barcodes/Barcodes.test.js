import React from 'react';
import Barcodes from './Barcodes';

import renderer from 'react-test-renderer';

jest.mock('react-native-sqlite-storage');

test('renders correctly', () => {
  const tree = renderer.create(<Barcodes/>).toJSON();
  expect(tree).toMatchSnapshot();
});
