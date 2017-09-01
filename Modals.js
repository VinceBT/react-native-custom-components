/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BackHandler, StyleSheet, View } from 'react-native';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import * as Animatable from 'react-native-animatable';

global.modals = null;

let lockModals = false;

const DEFAULT_DURATION = 200;

class ModalWrapper extends Component {

  static defaultProps = {
    transitionDuration: DEFAULT_DURATION,
    defaultStyle: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    hiddenStyle: {
      transform: [{ translateY: 200 }],
      opacity: 0,
    },
    shownStyle: {},
    animatedStyles: ['scale', 'translateX', 'translateY', 'opacity'],
  };

  static propTypes = {
    transitionDuration: PropTypes.number,
    defaultStyle: PropTypes.any,
    hiddenStyle: PropTypes.any,
    shownStyle: PropTypes.any,
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
    setTimeout(callback, this.props.transitionDuration);
  }

  componentDidAppear() {
  }

  componentWillEnter(callback) {
    this.setState({ isVisible: true });
    setTimeout(callback, this.props.transitionDuration);
  }

  componentDidEnter() {
  }

  componentWillLeave(callback) {
    this.setState({ isVisible: false });
    setTimeout(callback, this.props.transitionDuration);
  }

  componentDidLeave() {
  }

  render() {
    const {
      transitionDuration,
      defaultStyle,
      hiddenStyle,
      shownStyle,
      animatedStyles,
    } = this.props;
    return (
      <Animatable.View
        pointerEvents="box-none"
        useNativeDriver
        transition={animatedStyles}
        duration={transitionDuration}
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
  open = (modalComponent, options = {}) => {
    if (lockModals) return;
    const modals = this.state.modals.slice(0);
    const { keyPrefix = 'modal', lock = true, ...otherProps } = options;
    modals.push(
      <ModalWrapper
        key={`${keyPrefix || 'modal'}-${Math.floor(Math.random() * 1000000)}`}
        {...otherProps}>
        {modalComponent}
      </ModalWrapper>
    );
    this.setState({ modals });
    if (lock) {
      lockModals = true;
      setTimeout(() => {
        lockModals = false;
      }, options.transitionDuration || DEFAULT_DURATION);
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
   * Pops all modals
   * @public
   */
  popAll = () => {
    this.setState({ modals: [] });
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
