import React  from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, Easing } from 'react-native';
import * as Animatable from 'react-native-animatable';

function createStateAnimatedComponent(rawComponent) {
  const AnimatableComponent = Animatable.createAnimatableComponent(rawComponent);
  return React.createClass({

    displayName: `StateAnimated.${rawComponent.displayName}`,

    propTypes: {
      currentState: PropTypes.string,
      states: PropTypes.objectOf(PropTypes.shape({
        style: PropTypes.any,
        duration: PropTypes.number,
        easing: PropTypes.instanceOf(Easing),
      })).isRequired,
      style: PropTypes.any,
      children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
      ]),
    },

    componentDidUpdate(prevProps, prevState) {
      const oldStateName = prevProps.currentState;
      const newStateName = this.props.currentState;
      if (newStateName != null && newStateName !== oldStateName) {
        this.applyPattern(newStateName);
      }
    },

    _refAnimView: null,
    _defaultState: null,

    applyPattern(pattern) {
      const tokens = pattern.split(',').map(t => t.trim());
      if (tokens.length === 0) {
        return;
      }
      let token = tokens.shift();
      let timeOut = 400;
      if (isNaN(token)) {
        const stateKeys = Object.keys(this.props.states);
        if (!stateKeys.includes(token)) {
          if (stateKeys.includes('*')) {
            token = '*';
          } else {
            throw new Error(`Undefined state: ${token}`);
          }
        } else {
          const newState = this.props.states[token];
          this._refAnimView.stopAnimation();
          if (newState.duration) {
            timeOut = newState.duration;
          }
          this._refAnimView.transitionTo(newState.style, timeOut, newState.easing);
        }
      } else {
        timeOut = parseFloat(token);
      }
      setTimeout(() => {
        this.applyPattern(tokens.join(','));
      }, timeOut);
    },

    render() {
      const { currentState, states, style, children, ...otherProps } = this.props;
      if (this._defaultState === null) {
        this._defaultState = currentState;
      }

      return (
        <AnimatableComponent
          ref={c => { this._refAnimView = c; }}
          style={[style, states[this._defaultState].style]}
          {...otherProps}>
          {children}
        </AnimatableComponent>
      );
    },

  });
}

export default {
  createStateAnimatedComponent,
  View: createStateAnimatedComponent(View),
  Text: createStateAnimatedComponent(Text),
  Image: createStateAnimatedComponent(Image),
};

