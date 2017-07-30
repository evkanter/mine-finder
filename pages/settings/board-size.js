import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Picker, ScrollView } from 'react-native';
import { Grid, Row, Col, Button } from 'react-native-elements'
import { observer, inject } from 'mobx-react/native';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation'

@inject('store')
@observer
export default class BoardSize extends React.Component {

  static navigationOptions = {
      title: 'Adjust Board Size'
  };

  static propTypes = {
      store: PropTypes.object
  }

  constructor () {
    super()
    this.state = {
      boardSize: '9,9'
    };
  }

  componentWillMount() {
    this.setState({
      boardSize: this.props.store.gameStore.defaultGame.squaresWide + ',' + this.props.store.gameStore.defaultGame.squaresTall
    });
  }

  setBoardSize(widthAndHeight) {
    let widthAndHeightArray = widthAndHeight.split(',')
    this.props.store.gameStore.setBoardSize(widthAndHeightArray[0], widthAndHeightArray[1]);
  }

  updateSettingsRefreshBoard() {
    this.props.store.gameStore.updateSettingsRefreshBoard();    
  }

  updateSettings() {
    this.setBoardSize(this.state.boardSize);
    this.updateSettingsRefreshBoard();
    this.goBack();
  }

  goBack() {
    const backAction = NavigationActions.back({})
    this.props.navigation.dispatch(backAction)    
  }

  render() {
      return (
        <ScrollView style={{ flex: 1, backgroundColor: '#333333'}} 
            contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}} 
            centerContent={true}>
            <View style={{ flex: 1, borderWidth: 3, borderColor: 'gold', margin: 20 }} >        
                <View style={{ flex: 1, borderWidth: 3, borderColor: 'navy' }} >        
                    <View style={{ flex: 1, backgroundColor: '#fff', borderWidth: 3, borderColor: 'gold', padding: 20 }} >
                        <Picker style={{ height: 180, width: 200, justifyContent: 'center', alignContent: 'center' }}
                                itemStyle={{ color: 'black', fontSize: 20}}
                                selectedValue={this.state.boardSize}
                                onValueChange={(value) => {this.setState({boardSize: value});} }>
                            <Picker.Item label="9x9" value="9,9" />
                            <Picker.Item label="9x16" value="9,16" />
                            <Picker.Item label="9x24" value="9,24" />
                            <Picker.Item label="9x32" value="9,32" />
                            <Picker.Item label="9x40" value="9,40" />
                            <Picker.Item label="9x48" value="9,48" />
                            <Picker.Item label="9x60" value="9,60" />
                            <Picker.Item label="9x72" value="9,72" />
                            <Picker.Item label="9x84" value="9,84" />
                            <Picker.Item label="9x100" value="9,100" />
                            <Picker.Item label="12x12" value="12,12" />
                            <Picker.Item label="12x24" value="12,24" />
                            <Picker.Item label="12x36" value="12,36" />
                            <Picker.Item label="12x48" value="12,48" />
                            <Picker.Item label="12x60" value="12,60" />
                            <Picker.Item label="12x72" value="12,72" />
                            <Picker.Item label="12x84" value="12,84" />
                            <Picker.Item label="12x100" value="12,100" />
                            <Picker.Item label="16x16" value="16,16" />
                            <Picker.Item label="16x24" value="16,24" />
                            <Picker.Item label="16x36" value="16,36" />
                            <Picker.Item label="16x48" value="16,48" />
                            <Picker.Item label="16x60" value="16,60" />
                            <Picker.Item label="16x72" value="16,72" />
                            <Picker.Item label="16x84" value="16,84" />
                            <Picker.Item label="16x100" value="16,100" />
                        </Picker>
                        <Button onPress={ this.updateSettings.bind(this) } title="Update" color="#FFFFFF" fontSize={20} backgroundColor="#0066CC" style={{paddingTop: 20 }} icon={{name: 'cached'}} />
                    </View>
                </View>
            </View>
        </ScrollView>
      );
    }
}

