import React from 'react';
import AisleHeader from './AisleHeader';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<AisleHeader number="00" />).toJSON();
  expect(tree).toMatchSnapshot();
});
