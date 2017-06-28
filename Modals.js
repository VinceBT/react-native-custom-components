import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BackHandler, StyleSheet, View } from 'react-native';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import * as Animatable from 'react-native-animatable';
import styleProptype from 'react-style-proptype';

global.modals = null;

let lockModals = false;

class ModalWrapper extends Component {

  static defaultProps = {
    duration: 200,
    defaultStyle: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'white',
    },
    hiddenStyle: {
      transform: [{ translateY: 200 }],
      opacity: 0,
    },
    shownStyle: {},
    animatedStyles: ['translateY', 'opacity'],
  };

  static propTypes = {
    duration: PropTypes.number,
    defaultStyle: styleProptype.supportingArrays,
    hiddenStyle: styleProptype.supportingArrays,
    shownStyle: styleProptype.supportingArrays,
    animatedStyles: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  componentWillAppear(callback) {
    this.setState({ isVisible: true });
    setTimeout(callback, this.props.duration);
  }

  componentDidAppear() {
  }

  componentWillEnter(callback) {
    this.setState({ isVisible: true });
    setTimeout(callback, this.props.duration);
  }

  componentDidEnter() {
  }

  componentWillLeave(callback) {
    this.setState({ isVisible: false });
    setTimeout(callback, this.props.duration);
  }

  componentDidLeave() {
  }

  render() {
    const {
      duration,
      defaultStyle,
      hiddenStyle,
      shownStyle,
      animatedStyles,
    } = this.props;
    return (
      <Animatable.View
        pointerEvents="box-none"
        transition={animatedStyles}
        duration={duration}
        style={[defaultStyle, this.state.isVisible ? shownStyle : hiddenStyle]}>
        {this.props.children}
      </Animatable.View>
    );
  }

}

export default class Modals extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modals: [],
    };
  }

  componentDidMount() {
    // Stock current instance in global
    global.modals = this;
    BackHandler.addEventListener('hardwareBackPress', this._handlePopRequest);
  }

  componentWillUnmount() {
    // Clear global variable
    global.modals = null;
    BackHandler.removeEventListener('hardwareBackPress', this._handlePopRequest);
  }

  /**
   * Push a modal onto the stack
   * @public
   */
  open = (modalComponent, { keyPrefix = 'modal', duration, lock = true, ...otherProps }) => {
    if (lockModals) return;
    const modals = this.state.modals.slice(0);
    modals.push(
      <ModalWrapper
        key={`${keyPrefix}-${Math.floor(Math.random() * 1000000)}`}
        duration={duration}
        {...otherProps}>
        {modalComponent}
      </ModalWrapper>
    );
    this.setState({ modals });
    if (lock) {
      lockModals = true;
      setTimeout(() => {
        lockModals = false;
      }, duration);
    }
  };

  /**
   * Pops the latest modal
   * @public
   */
  pop = () => {
    const modals = this.state.modals.slice(0);
    modals.pop();
    this.setState({ modals });
  };

  /**
   * Callback for pop requests
   * @private
   */
  _handlePopRequest = () => {
    if (this.state.modals.length !== 0) {
      this.pop();
      return true;
    }
    return false;
  };

  render() {
    return (
      <TransitionGroup
        component={View}
        pointerEvents="box-none"
        style={StyleSheet.absoluteFill}>
        {this.state.modals}
      </TransitionGroup>
    );
  }

}
