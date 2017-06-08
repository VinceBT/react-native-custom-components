import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Platform } from 'react-native';
import ViewPager from 'react-native-view-pager';

export default class Pager extends Component {

  static defaultProps = {};

  static propTypes = {
    activeTab: PropTypes.number.isRequired,
    animValue: PropTypes.instanceOf(Animated.Value).isRequired,
    onTabSelect: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  };

  constructor(props) {
    super(props);
    this._actualPage = props.activeTab;
  }

  componentDidUpdate(prevProps, prevState) {
    const currentTabIndex = this.props.activeTab;
    if (currentTabIndex !== prevProps.activeTab && currentTabIndex !== this._actualPage) {
      this._actualPage = currentTabIndex;
      this._viewPager.setPage(currentTabIndex);
      if (this.props.onTabSelect)
        this.props.onTabSelect(currentTabIndex);
      if (Platform.OS === 'web')
        Animated.timing(this.props.animValue, {
          duration: 150,
          toValue: currentTabIndex,
        }).start();
    }
  }

  _viewPager = null;
  _actualPage = 0;

  render() {
    const { activeTab, animValue, children, ...otherProps } = this.props;
    return (
      <ViewPager
        ref={component => { this._viewPager = component; }}
        initialPage={activeTab}
        scrollEventThrottle={16}
        onPageScroll={(event) => {
          const { position, offset } = event.nativeEvent;
          animValue.setValue(position + offset);
        }}
        onPageSelected={(event) => {
          const selectedTab = event.nativeEvent.position;
          this._actualPage = selectedTab;
          if (this.props.onTabSelect)
            this.props.onTabSelect(selectedTab);
        }}
        {...otherProps}>
        {children}
      </ViewPager>
    );
  }

}
