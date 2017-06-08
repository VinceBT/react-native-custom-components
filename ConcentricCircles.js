import React, { Component } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Flex from 'react-native-flex-helper';
import createColor from 'color';

class ConcentricCircles extends Component {

  render() {
    const { style, color, animValue, size, circles, contentScale, children } = this.props;
    const baseColor = createColor(color);
    return (
      <View style={[style, { position: 'relative' }]}>
        {circles.map((circle, i) => (
          <View key={i} style={[StyleSheet.absoluteFill, Flex.center]}>
            <Animated.View
              style={{
                width: size,
                height: size,
                borderRadius: 99999,
                backgroundColor: baseColor.fade(1 - circle.alpha).string(),
                transform: [{
                  scale: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [circle.initialScale || 1, circle.scale],
                  }),
                }],
              }} />
          </View>
        ))}
        <Animated.View
          style={[StyleSheet.absoluteFill, Flex.center, {
            transform: [{
              scale: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, contentScale],
              }),
            }],
          }]}>
          {children}
        </Animated.View>
      </View>
    );
  }

}

ConcentricCircles.propTypes = {
  style: PropTypes.any.isRequired,
  animValue: PropTypes.instanceOf(Animated.Value).isRequired,
  color: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  contentScale: PropTypes.number,
  circles: PropTypes.arrayOf(PropTypes.shape({
    alpha: PropTypes.number.isRequired,
    scale: PropTypes.number.isRequired,
    initialScale: PropTypes.number,
  })).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
ConcentricCircles.defaultProps = {
  contentScale: 1,
};

export default ConcentricCircles;
