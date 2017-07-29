import React, { Component } from 'react';
import { View, Text, Picker, ScrollView } from 'react-native';
import { Button } from 'react-native-elements'
import { observer, inject } from 'mobx-react/native';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation'

@inject('store')
@observer
export default class LandMineSettings extends React.Component {

  static navigationOptions = {
      title: 'Update Mine Quantity'
  };

  static propTypes = {
      store: PropTypes.object
  }

  constructor () {
    super()
    this.state = {
      landMines: 0,
    };
  }

  componentWillMount() {
    this.setState({
      landMines: this.props.store.gameStore.defaultGame.landMines,
    });
  }

  setLandmines(mines) {
    this.props.store.gameStore.setLandmines(mines);    
  }

  updateSettingsRefreshBoard() {
    this.props.store.gameStore.updateSettingsRefreshBoard();    
  }

  updateSettings() {
    this.setLandmines(this.state.landMines);
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
                <Picker
                    style={{ height: 180, width:200, justifyContent: 'center', alignContent: 'center' }}
                    itemStyle={{ color: 'black', fontSize: 20}}
                    selectedValue={this.state.landMines}
                    onValueChange={(value) => {this.setState({landMines: value});} }>
                    <Picker.Item label="10" value="10" />
                    <Picker.Item label="15" value="15" />
                    <Picker.Item label="20" value="20" />
                    <Picker.Item label="25" value="25" />
                    <Picker.Item label="30" value="30" />
                    <Picker.Item label="35" value="35" />
                    <Picker.Item label="40" value="40" />
                    <Picker.Item label="45" value="45" />
                    <Picker.Item label="50" value="50" />
                    <Picker.Item label="55" value="55" />
                    <Picker.Item label="60" value="60" />
                    <Picker.Item label="65" value="65" />
                    <Picker.Item label="70" value="70" />
                    <Picker.Item label="75" value="75" />
                    <Picker.Item label="80" value="80" />
                    <Picker.Item label="90" value="90" />
                    <Picker.Item label="99" value="99" />
                </Picker>
                <Button onPress={this.updateSettings.bind(this)} title="Update"
                    color="white"
                    fontSize={20}
                    backgroundColor="#0066CC"
                    style={{paddingTop:20}}
                    icon={{name: 'cached'}}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      );
    }
}

