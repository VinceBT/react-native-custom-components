import React from 'react';
import { Animated, Platform } from 'react-native';

let initialHeightValue = 0;
if (Platform.OS === 'ios') {
  initialHeightValue = 20;
} else if (Platform.OS === 'android') {
  if (Platform.Version >= 23)
    initialHeightValue = 24;
  else
    initialHeightValue = 25;
}

const animValue = new Animated.Value(initialHeightValue);

const StatusBarPadder = ({ ...props }) => {
  if (Platform.OS === 'web')
    return null;
  return (
    <Animated.View style={{ height: animValue }} />
  );
};

export default StatusBarPadder;
