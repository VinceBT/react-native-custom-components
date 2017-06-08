import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ScrollView, Animated, TouchableOpacity, Easing } from 'react-native';

const SCROLL_PADDING = 25;
const SCROLL_DISPLACE = 70;

// Generate an incremental array like [0, 1, 2, 3, 4, 5, ..., size - 1]
function generateRange(size) {
  const a = [];
  for (let i = 0; i < size; i++) a.push(i);
  return a;
}

// Generate an array with the same values for each member
function generateUniformArray(size, value) {
  const a = [];
  for (let i = 0; i < size; i++) a.push(value);
  return a;
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
  },
  equalWidthTab: {
    flex: 1,
  },
  paddedTab: {
    paddingLeft: SCROLL_PADDING,
    paddingRight: SCROLL_PADDING,
  },
  navTab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class TabBar extends Component {

  static defaultProps = {
    height: 56,
    scrollable: false,
    tabStyle: {},
    indicatorStyle: {},
    renderIndicator: true,
    animationDuration: 130,
    indicatorStickTop: false,
    pressOpacity: 0.5,
    onTabPress: () => {},
  }

  static propTypes = {
    height: PropTypes.number,
    tabs: PropTypes.arrayOf(PropTypes.element).isRequired,
    animatedValue: PropTypes.instanceOf(Animated.Value),
    scrollable: PropTypes.bool,
    tabStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    indicatorStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    renderIndicator: PropTypes.bool,
    pressOpacity: PropTypes.number,
    animationDuration: PropTypes.number,
    indicatorStickTop: PropTypes.bool,
    activeColor: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onTabPress: PropTypes.func,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  };

  constructor(props: Object) {
    super(props);
    this.animateSelf = (props.animatedValue == null);
    this.indicatorAnim = this.animateSelf ? new Animated.Value(0) : props.animatedValue;
    this.scrollAnim = new Animated.Value(0);
    this.navLayout = {};
    this.tabLayouts = [];
  }

  // Preferences
  navView: Object;

  // Properties
  animateSelf: boolean;
  indicatorAnim: Animated.Value;
  scrollAnim: Animated.Value;
  navLayout: Object;
  tabLayouts: Array<Object>;

  scrollTo(i: number) {
    if (!this.props.scrollable) return;
    if (i < 0) i = 0;
    if (i > this.tabLayouts.length) i = this.tabLayouts.length;
    const offsetLeft = this.tabLayouts[i].x;
    const offsetRight = offsetLeft + this.tabLayouts[i].width;
    const tabWidth = this.tabLayouts[i].width;
    const navWidth = this.navLayout.width;
    const scrollOffset = this.scrollAnim._value;
    if (offsetLeft < scrollOffset) {
      this._scrollNav(offsetLeft - SCROLL_DISPLACE);
    } else if (offsetRight > scrollOffset + navWidth) {
      this._scrollNav(offsetLeft + tabWidth - navWidth + SCROLL_DISPLACE);
    }
  }

  _scrollNav = (offsetX: number) => {
    this.navView.scrollTo({ x: offsetX, animated: true });
  };

  _handleTabPress = (i: number) => {
    this.props.onTabPress(i);
    this.scrollTo(i);
    if (this.animateSelf) {
      if (this.props.animationDuration > 0) {
        Animated.timing(this.indicatorAnim, {
          toValue: i,
          duration: 120,
          easing: Easing.out(Easing.ease),
        }).start();
      } else {
        this.indicatorAnim.setValue(i);
      }
    }
  };

  _renderIndicator() {
    const { indicatorStyle, tabs, indicatorStickTop } = this.props;

    if (this.tabLayouts.length === 0) return;

    const nbChildren = tabs.length;

    const offsetValue = this.indicatorAnim.interpolate({
      inputRange: generateRange(nbChildren),
      outputRange: this.tabLayouts.map(layout => layout.x),
    });

    const widthValue = this.indicatorAnim.interpolate({
      inputRange: generateRange(nbChildren),
      outputRange: this.tabLayouts.map(layout => layout.width),
    });

    const posStyle = {};
    if (indicatorStickTop) posStyle.top = 0;
    else posStyle.bottom = 0;

    return (
      <Animated.View
        pointerEvents="none"
        style={[{
          position: 'absolute',
          width: widthValue,
          height: 3,
          backgroundColor: 'white',
          left: 0,
          transform: [{ translateX: offsetValue }],
        }, posStyle, indicatorStyle]} />
    );
  }

  _handleNavLayout = (event: Object) => {
    this.navLayout = event.nativeEvent.layout;
  };

  _handleNavScroll = (event: Object) => {
    this.scrollAnim.setValue(event.nativeEvent.contentOffset.x);
  };

  _handleTabLayout(event: Object, tabIndex: number) {
    this.tabLayouts[tabIndex] = event.nativeEvent.layout;
    const nbChildren = this.props.tabs.length;
    if (this.tabLayouts.length === nbChildren) this.forceUpdate();
  }

  _renderTabs() {
    const { tabs, tabStyle, scrollable, pressOpacity, activeColor } = this.props;
    const tabStyles = [];
    if (!scrollable) {
      tabStyles.push(styles.equalWidthTab);
    } else {
      tabStyles.push(styles.paddedTab);
    }
    tabStyles.push(tabStyle);

    const nbChildren = tabs.length;

    return tabs.map((element, i) => {
      const uniformValues = generateUniformArray(nbChildren, activeColor ? 0 : 0.8);
      uniformValues[i] = 1;
      const mainOpacityValue = this.indicatorAnim.interpolate({
        inputRange: generateRange(nbChildren),
        outputRange: uniformValues,
      });
      const secondOpacityValue = this.indicatorAnim.interpolate({
        inputRange: generateRange(nbChildren),
        outputRange: uniformValues.map(v => Math.abs(v - 1)),
      });
      return (
        <TouchableOpacity
          key={i}
          delayPressIn={0}
          activeOpacity={pressOpacity}
          onLayout={event => this._handleTabLayout(event, i)}
          style={tabStyles}
          onPress={() => this._handleTabPress(i)}>
          <Animated.View style={[styles.equalWidthTab, styles.navTab]}>
            <View style={{ position: 'relative' }}>
              <Animated.View style={{ opacity: activeColor ? mainOpacityValue : 0 }}>
                {React.cloneElement(element, { color: activeColor, style: { color: activeColor } })}
              </Animated.View>
              <Animated.View style={[StyleSheet.absoluteFill, { opacity: activeColor ? secondOpacityValue : mainOpacityValue }]}>
                {element}
              </Animated.View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      );
    });
  }

  _renderStandardNav() {
    const { height, style, renderIndicator } = this.props;
    return (
      <View
        ref={c => this.navView = c}
        onLayout={this._handleNavLayout}
        style={[styles.nav, { height }, style]}>
        {this._renderTabs()}
        {renderIndicator && this._renderIndicator()}
      </View>
    );
  }

  _renderScrollableNav() {
    const { height, style, renderIndicator } = this.props;
    return (
      <ScrollView
        ref={c => this.navView = c}
        onLayout={this._handleNavLayout}
        showsHorizontalScrollIndicator={false}
        onScroll={this._handleNavScroll}
        horizontal
        style={[styles.nav, { height }, style]}>
        {this._renderTabs()}
        {renderIndicator && this._renderIndicator()}
      </ScrollView>
    );
  }

  render() {
    const { scrollable } = this.props;
    if (scrollable) {
      return this._renderScrollableNav();
    }
    return this._renderStandardNav();
  }
}
