import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';

class Overlay extends Component {

  constructor(props) {
    super(props);
    this.state = {
      renderChildren: props.visible,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible) {
      setTimeout(() => {
        this.setState({ renderChildren: nextProps.visible });
      }, nextProps.visible ? 0 : this.props.duration);
    }
  }

  render() {
    const { states, visible, duration, style, children, ...otherProps } = this.props;
    const transitions = [];
    const additionalStyles = {};
    for (const [key, value] of Object.entries(states)) {
      if (!transitions.includes(key)) {
        transitions.push(key);
      }
      if (key === 'opacity') {
        additionalStyles.opacity = visible ? value[1] : value[0];
      } else {
        additionalStyles.transform = additionalStyles.transform || [];
        const item = {};
        item[key] = visible ? value[1] : value[0];
        additionalStyles.transform.push(item);
      }
    }
    return (
      <Animatable.View
        pointerEvents={this.state.renderChildren ? 'auto' : 'none'}
        duration={duration}
        transition={transitions}
        style={[style, StyleSheet.absoluteFill, additionalStyles]}
        {...otherProps}>
        {this.state.renderChildren && children}
      </Animatable.View>
    );
  }

}

Overlay.propTypes = {
  visible: PropTypes.bool.isRequired,
  states: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  duration: PropTypes.number,
  style: PropTypes.any,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
Overlay.defaultProps = {
  visible: true,
  duration: 200,
};

export default Overlay;
