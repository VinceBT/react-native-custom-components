import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class Toolbar extends Component {

  static defaultProps = {
    height: 56,
    onLeftButtonPress: () => {
    },
    hideLeftButton: false,
  };

  static propTypes = {
    height: PropTypes.number,
    leftButton: PropTypes.element,
    onLeftButtonPress: PropTypes.func,
    hideLeftButton: PropTypes.bool,
    rightButtons: PropTypes.arrayOf(PropTypes.shape({
      icon: PropTypes.element.isRequired,
      onPress: PropTypes.func.isRequired,
    })),
    children: PropTypes.element,
  };

  _handleLeftButtonPress = () => {
    this.props.onLeftButtonPress();
  };

  render() {
    const { height: buttonSize, leftButton, hideLeftButton, rightButtons, children, style } = this.props;
    return (
      <View style={[style, { flexDirection: 'row', height: buttonSize }]}>
        {hideLeftButton === false && leftButton && (
          <TouchableOpacity
            onPress={this._handleLeftButtonPress}
            style={[styles.button, { width: buttonSize }]}>
            {leftButton}
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>{children}</View>
        {rightButtons && rightButtons.map((button, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.button, { width: buttonSize }]}
            onPress={button.onPress}>
            {button.icon}
          </TouchableOpacity>
        ))}
      </View>
    );
  }

}
