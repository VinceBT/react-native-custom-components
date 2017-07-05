import React from 'react';
import { View, Platform } from 'react-native';
import { PropTypes } from 'prop-types';

let initialHeightValue = 0;
if (Platform.OS === 'ios') {
  initialHeightValue = 20;
} else if (Platform.OS === 'android') {
  if (Platform.Version >= 23)
    initialHeightValue = 24;
  else
    initialHeightValue = 25;
}

const StatusBarPadder = ({ style, ...props }) => {
  if (Platform.OS === 'web')
    return null;
  return (
    <View style={[style, { height: initialHeightValue }]} {...props} />
  );
};

StatusBarPadder.propTypes = {
  style: PropTypes.any,
};

export const statusBarHeight = initialHeightValue;
export default StatusBarPadder;
