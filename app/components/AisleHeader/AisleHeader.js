import React, {Component} from 'react';

import {
  Text,
  View,
} from 'react-native';
import styles from './styles';

export default class AisleHeader extends Component {
  render() {
    return (
      <View
        style={ styles.listHeaderBox }>
      <Text
        style={ styles.listHeaderText }>
        Aisle {this.props.number}
      </Text>
      </View>
    );
  }
}

