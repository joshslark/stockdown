import React from 'react';
import 'react-native';
import 'react-native-mock-render/mock';
import { JSDOM } from 'jsdom'
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

global.document = new JSDOM();
global.window = document.defaultView;
global.shallow = shallow;

Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
          global[property] = document.defaultView[property];
        }
});

function suppressDomErrors() {
  const suppressedErrors = /(React does not recognize the.*prop on a DOM element|Unknown event handler property|is using uppercase HTML|Received .* for a non-boolean attribute .*|The tag.*is unrecognized in this browser|PascalCase)/;
  // eslint-disable-next-line no-console
  const realConsoleError = console.error;
  // eslint-disable-next-line no-console
  console.error = message => {
    if (message.match(suppressedErrors)) {
      return;
    }
    realConsoleError(message);
  };
}
suppressDomErrors()

configure({adapter: new Adapter()});
