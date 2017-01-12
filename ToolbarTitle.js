// @flow
import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export default class ToolbarTitle extends Component {

  static defaultProps: Object = {
    title: '',
    color: '#fff',
    size: 18,
    onTouch: () => {},
  };

  static propTypes: Object = {
    title: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.number,
    onTouch: PropTypes.func,
    style: PropTypes.object,
  };

  _handleTouch = () => {
    this.props.onTouch();
  };

  render() {
    const { title, color, size, style } = this.props;
    return (
      <TouchableWithoutFeedback onPress={this._handleTouch}>
        <View style={styles.container}>
          <Text
            style={[{
              color,
              fontSize: size,
              marginLeft: 5,
            }, style]}>{title}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

}
