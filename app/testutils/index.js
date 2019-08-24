import React from 'react';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { shallow } from 'enzyme';

chai.use(sinonChai);

global.React = React;
global.should = chai.should;
global.sinon = sinon;
global.shallow = shallow;

require('react-native-mock/mock');
