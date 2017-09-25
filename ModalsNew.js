/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import * as Animatable from 'react-native-animatable';

let currentInstance: ?Modal = null;

let lockModals = false;

const MOUNT_STATUS = {
  MOUNTING: 0,
  MOUNTED: 1,
  UNMOUNTED: 2,
};

class ModalWrapper extends Component {

  static propTypes = {
    onAppear: PropTypes.func.isRequired,
    onDisappear: PropTypes.func.isRequired,
    options: PropTypes.shape({
      defaultStyle: PropTypes.object.isRequired,
      inStyle: PropTypes.object.isRequired,
      activeStyle: PropTypes.object.isRequired,
      outStyle: PropTypes.object.isRequired,
      inEasing: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
      outEasing: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
      inDuration: PropTypes.number.isRequired,
      outDuration: PropTypes.number.isRequired,
    }).isRequired,
    children: PropTypes.node.isRequired,
  };

  state = {
    mountStatus: MOUNT_STATUS.MOUNTING,
  };

  componentWillAppear(callback) {
    this.setState({ mountStatus: MOUNT_STATUS.MOUNTED }, () => {
      setTimeout(callback, this.props.options.inDuration);
    });
  }

  componentDidAppear() {
    this.props.onAppear();
  }

  componentWillEnter(callback) {
    this.setState({ mountStatus: MOUNT_STATUS.MOUNTED }, () => {
      setTimeout(callback, this.props.options.inDuration);
    });
  }

  componentDidEnter() {
    this.props.onAppear();
  }

  componentWillLeave(callback) {
    this.setState({ mountStatus: MOUNT_STATUS.UNMOUNTED }, () => {
      setTimeout(callback, this.props.options.outDuration);
    });
  }

  componentDidLeave() {
    this.props.onDisappear();
  }

  render() {
    const child = Array.isArray(this.props.children) ? this.props.children[0] : this.props.children;
    return (
      <Animatable.View
        useNativeDriver
        pointerEvents="box-none"
        transition={['scale', 'translateX', 'translateY', 'opacity']}
        duration={
          (this.state.mountStatus === MOUNT_STATUS.MOUNTING || this.state.mountStatus === MOUNT_STATUS.MOUNTED)
            ? this.props.options.inDuration
            : this.props.options.outDuration
        }
        easing={
          (this.state.mountStatus === MOUNT_STATUS.MOUNTING || this.state.mountStatus === MOUNT_STATUS.MOUNTED)
            ? this.props.options.inEasing
            : this.props.options.outEasing
        }
        style={[StyleSheet.absoluteFill, {
          ...this.props.options.defaultStyle,
          ...(this.state.mountStatus === MOUNT_STATUS.MOUNTING
              ? this.props.options.inStyle
              : this.state.mountStatus === MOUNT_STATUS.MOUNTED
                ? this.props.options.activeStyle
                : this.props.options.outStyle
          ),
        }]}>{React.cloneElement(child, { modalManager: currentInstance })}</Animatable.View>
    );
  }

}

export default class ModalsNew extends Component {

  static propTypes = {
    setBackHandler: PropTypes.func,
    unsetBackHandler: PropTypes.func,
  };

  state = {
    currentModals: [],
  };

  componentDidMount() {
    currentInstance = this;
    if (this.props.setBackHandler)
      this.props.setBackHandler(this._handlePopRequest);
  }

  componentWillUnmount() {
    currentInstance = null;
    if (this.props.unsetBackHandler)
      this.props.unsetBackHandler(this._handlePopRequest);
  }

  show = (component, lock = true) => {
    return new Promise((resolve, reject) => {
      if (!component) {
        reject('No component found');
      } else if (lockModals) {
        reject('Cannot show a modal while another one in animating in');
      } else {
        const currentModals = this.state.currentModals.slice(0);
        const modalOptions = {
          defaultStyle: {},
          inStyle: { opacity: 0, transform: [{ translateY: 200 }] },
          activeStyle: {},
          outStyle: { opacity: 0, transform: [{ translateY: 5 }] },
          inEasing: 'ease',
          outEasing: 'ease',
          inDuration: 200,
          outDuration: 200,
          ...(component.type.modalOptions || {}),
        };
        if (lock) lockModals = true;
        currentModals.push(
          <ModalWrapper
            key={currentModals.length}
            options={modalOptions}
            onAppear={() => {
              if (lock) {
                lockModals = false;
                resolve();
              }
            }}
            onDisappear={() => {
              console.log('yo');
            }}>{component}</ModalWrapper>
        );
        this.setState({ currentModals }, () => {
          if (!lock) resolve();
        });
      }
    });
  };

  pop = (lock = true) => {
    return new Promise((resolve, reject) => {
      if (lockModals) {
        reject('Cannot pop the current modal while another is animating');
      } else {
        const currentModals = this.state.currentModals.slice(0);
        if (currentModals.length === 0) resolve();
        if (lock) lockModals = true;
        const modalComponent = currentModals.pop();
        this.setState({ currentModals }, () => {
          setTimeout(() => {
            if (lock) lockModals = false;
            resolve();
          }, modalComponent.props.options.outDuration);
        });
      }
    });
  };

  popAll = () => {
    return new Promise((resolve, reject) => {
      this.setState({ currentModals: [] }, () => {
        resolve();
      });
    });
  };

  isLocked = () => {
    return lockModals;
  };

  _handlePopRequest = () => {
    if (this.state.currentModals.length !== 0) {
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
        {this.state.currentModals}
      </TransitionGroup>
    );
  }

}
