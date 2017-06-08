import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ScrollView, Animated, Platform, TouchableOpacity, Easing } from 'react-native';

export default class Tabs extends Component {

  static propTypes = {
    animValue: PropTypes.instanceOf(Animated.Value).isRequired,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
    renderTab: PropTypes.func.isRequired,
    style: PropTypes.any,
    indicatorStyle: PropTypes.any,
  };

  state = {
    layoutWidth: null,
  };

  componentDidMount() {
    if (Platform.OS === 'web') {
      window.addEventListener('resize', () => {
        this.forceUpdate();
      });
    }
  }

  render() {
    const { animValue, children, style, indicatorStyle, renderTab, ...otherProps } = this.props;
    return (
      <View
        onLayout={(event) => {
          this.setState({ layoutWidth: event.nativeEvent.layout.width });
        }}
        style={[{ flexDirection: 'row', position: 'relative' }, style]}
        {...otherProps}>
        {children.map((tab, i) => (
          <View key={i} style={[{ flex: 1 }]}>{renderTab(tab, i)}</View>
        ))}
        {this.state.layoutWidth !== null && (
          <Animated.View
            style={[{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: 4,
              backgroundColor: 'white',
              width: this.state.layoutWidth / children.length,
              transform: [{
                translateX: animValue.interpolate({
                  inputRange: [0, children.length],
                  outputRange: [0, this.state.layoutWidth],
                }),
              }],
            }, indicatorStyle]} />
        )}
      </View>
    );
  }

 }
