// @flow
import React, { Component, PropTypes } from 'react';
import { View, ScrollView } from 'react-native';

export default class GridView extends Component {

  static propTypes = {
    col: PropTypes.number,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    colStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  };

  static defaultProps = {
    col: 1,
    style: {},
    colStyle: {},
  };

  render() {
    const { col, style, colStyle, children } = this.props;
    const realNbCol = Math.max(1, Math.min(300, col));
    const columns = [];
    for (let i = 0; i < realNbCol; i++) {
      columns.push([]);
    }
    let i = 0;
    children.forEach(child => {
      columns[i++].push(child);
      if (i >= columns.length) {
        i = 0;
      }
    });
    return (
      <ScrollView>
        <View style={[style, { flexDirection: 'row' }]}>
          {columns.map((column, columnIndex) => (
            <View key={columnIndex} style={[colStyle, { flex: 1, flexDirection: 'column' }]}>
              {column}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

}

