/**
 * https://github.com/VinceBT/react-native-state-animated
 * @flow
 */
import React, {Component, PropTypes} from "react";
import {View, Easing} from "react-native";
import * as Animatable from "react-native-animatable";
import StylePropTypes from "react-style-proptype";

function createStateAnimatedComponent(rawComponent) {
  return (
    class StateAnimated extends Component {

      static propTypes = {
        currentState: PropTypes.string,
        states: PropTypes.objectOf(PropTypes.shape({
          style: StylePropTypes.supportingArrays.isRequired,
          duration: PropTypes.number,
          easing: PropTypes.instanceOf(Easing),
        })).isRequired,
        style: StylePropTypes.supportingArrays,
        children: PropTypes.oneOfType([
          PropTypes.arrayOf(PropTypes.node),
          PropTypes.node,
        ]),
      };

      static defaultProps = {};

      componentDidUpdate(prevProps, prevState) {
        let oldStateName = prevProps.currentState, newStateName = this.props.currentState;
        if (newStateName != null && newStateName !== oldStateName) {
          this.applyPattern(newStateName);
        }
      }

      applyPattern = (pattern) => {
        let tokens = pattern.split(',').map(t => t.trim());
        if (tokens.length == 0)
          return;
        let token = tokens.shift();
        let timeOut = 400;
        if (isNaN(token)) {
          try {
            let newState = this.props.states[token];
            this._refAnimView.stopAnimation();
            this._refAnimView.transitionTo(newState.style, newState.duration, newState.easing);
            if (newState.duration)
              timeOut = newState.duration;
          } catch (e) {
            console.warn("Undefined state: " + tokens[0]);
          }
        } else {
          timeOut = Number.parseFloat(token);
        }
        setTimeout(() => {
          this.applyPattern(tokens.join(','));
        }, timeOut);
      };

      _refAnimView: ?View = null;
      _defaultState: ?string = null;

      render() {
        const {currentState, states, style, children, ...otherProps} = this.props;
        if (this._defaultState === null) {
          this._defaultState = currentState;
        }
        const AnimatableComponent = Animatable.createAnimatableComponent(rawComponent);
        return (
          <AnimatableComponent
            ref={c => { this._refAnimView  = c; }}
            style={[style, states[this._defaultState].style]}
            {...otherProps}>
            {children}
          </AnimatableComponent>
        );
      }
    }
  );
}

export default {
  createStateAnimatedComponent,
  View: createStateAnimatedComponent(View),
  Text: createStateAnimatedComponent(Text),
};
