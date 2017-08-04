import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Picker, ScrollView } from 'react-native';
import { CheckBox, Divider, Slider, Grid, Row, Col, Button } from 'react-native-elements'
import { observer, inject } from 'mobx-react/native';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation'

@inject('store')
@observer
export default class DifficultyLevel extends React.Component {

  static navigationOptions = {
      title: 'Adjust Difficulty'
  };

  static propTypes = {
      store: PropTypes.object
  }

  constructor () {
    super()
    this.state = { difficulty: 'custom', mines: -1, rows: -1, cols: -1 };
  }

  componentWillMount() {
    this.setState({
      difficulty: this.props.store.gameStore.defaultGame.gameDifficulty,
      mines: this.props.store.gameStore.defaultGame.landMines,
      rows: this.props.store.gameStore.defaultGame.squaresTall,
      cols: this.props.store.gameStore.defaultGame.squaresWide
    });
  }

  setDifficulty() {
    this.props.store.gameStore.setDifficulty(this.state.difficulty, this.state.rows, this.state.cols, this.state.mines);
  }

  updateSettingsRefreshBoard() {
    this.props.store.gameStore.updateSettingsRefreshBoard();    
  }

  updateSettings() {
    this.setDifficulty();
    this.updateSettingsRefreshBoard();
    this.goBack();
  }

  goBack() {
    const backAction = NavigationActions.back({})
    this.props.navigation.dispatch(backAction)    
  }

  get customMaxCols() {
      let maxCols;
      let defaultGame = this.props.store.gameStore.defaultGame;
      if ((defaultGame.isAndroidThinMode) && (defaultGame.thinModeMaximumCols >= 9)) {
          maxCols = Math.min(16,defaultGame.thinModeMaximumCols);
      } else {
          maxCols = 16;
      }
      return maxCols;
  }

  get showCustomCols() {
      return (this.customMaxCols > 9)
  }

  render() {
      let settings = this.props.store.gameStore.currentDifficultySettings;
      return (
        <ScrollView style={{ flex: 1, backgroundColor: '#333333'}} 
            contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}} 
            centerContent={true}>
            <View style={{ flex: 1, borderWidth: 3, borderColor: 'gold', margin: 20 }} >        
                <View style={{ flex: 1, borderWidth: 3, borderColor: 'navy' }} >        
                    <View style={{ flex: 1, backgroundColor: '#fff', borderWidth: 3, borderColor: 'gold', padding: 20 }} >
                        <Text style={{color: '#990000', fontSize: 24, fontWeight: 'bold', textShadowColor: '#EFEFEF' }}>Difficulty:</Text>
                        <CheckBox
                            title='Easy'
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            containerStyle={{ height: 50, width: 250 }}
                            textStyle={{ color: 'black', fontSize: 20 }}
                            onPress={(value) => {this.setState({difficulty: 'easy', mines: settings.easy.mines, rows: settings.easy.rows, cols: settings.easy.cols });} }
                            checked={this.state.difficulty==='easy'}
                        />
                        <CheckBox
                            title='Intermediate'
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            containerStyle={{ height: 50, width: 250 }}
                            textStyle={{ color: 'black', fontSize: 20 }}
                            onPress={(value) => {this.setState({difficulty: 'intermediate', mines: settings.intermediate.mines, rows: settings.intermediate.rows, cols: settings.intermediate.cols });} }
                            checked={this.state.difficulty==='intermediate'}
                        />
                        <CheckBox
                            title='Advanced'
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            containerStyle={{ height: 50, width: 250 }}
                            textStyle={{ color: 'black', fontSize: 20 }}
                            onPress={(value) => {this.setState({difficulty: 'advanced', mines: settings.advanced.mines, rows: settings.advanced.rows, cols: settings.advanced.cols });} }
                            checked={this.state.difficulty==='advanced'}
                        />
                        <CheckBox
                            title='Expert'
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            containerStyle={{ height: 50, width: 250 }}
                            textStyle={{ color: 'black', fontSize: 20 }}
                            onPress={(value) => {this.setState({difficulty: 'expert', mines: settings.expert.mines, rows: settings.expert.rows, cols: settings.expert.cols });} }
                            checked={this.state.difficulty==='expert'}
                        />
                        <CheckBox
                            title='Custom'
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            containerStyle={{ height: 50, width: 250 }}
                            textStyle={{ color: 'black', fontSize: 20 }}
                            onPress={(value) => {this.setState({difficulty: 'custom', mines:this.props.store.gameStore.defaultGame.landMines, rows:this.props.store.gameStore.defaultGame.squaresTall, cols: this.props.store.gameStore.defaultGame.squaresWide});} }
                            checked={this.state.difficulty==='custom'}
                        />
                        <View style={{flex: 1, marginTop:30, marginBottom:30, display:this.state.difficulty==='custom'?'flex':'none'}} >
                            <Text style={{color: '#990000', fontSize: 24, fontWeight: 'bold', textShadowColor: '#EFEFEF' }}>Mines: {this.state.mines}</Text>
                            <Slider
                                value={this.state.mines}
                                minimumValue={10}
                                maximumValue={150}
                                step={5}
                                style={{width: 240}}
                                thumbTintColor='#333333'
                                onValueChange={(mines) => this.setState({mines})} />

                        </View>
                        <View style={{flex: 1, marginTop:30, marginBottom:30, display:this.state.difficulty==='custom'?'flex':'none'}} >
                            <Text style={{color: '#990000', fontSize: 24, fontWeight: 'bold', textShadowColor: '#EFEFEF' }}>Board Rows: {this.state.rows}</Text>
                            <Slider
                                value={this.state.rows}
                                minimumValue={9}
                                maximumValue={100}
                                step={1}
                                style={{width: 240}}
                                thumbTintColor='#333333'
                                onValueChange={(rows) => this.setState({rows})} />

                        </View>
                        {this.showCustomCols?
                        <View style={{flex: 1, marginTop:30, marginBottom:30, display:this.state.difficulty==='custom'?'flex':'none'}} >
                            <Text style={{color: '#990000', fontSize: 24, fontWeight: 'bold', textShadowColor: '#EFEFEF' }}>Board Cols: {this.state.cols}</Text>
                            <Slider
                                value={this.state.cols}
                                minimumValue={9}
                                maximumValue={this.customMaxCols}
                                step={1}
                                style={{width: 240}}
                                thumbTintColor='#333333'
                                onValueChange={(cols) => this.setState({cols})} />
                        </View>:null}

                        <Button onPress={ this.updateSettings.bind(this) } title="Update" color="#FFFFFF" fontSize={20} backgroundColor="#0066CC" style={{paddingTop: 20 }} icon={{name: 'cached'}} />
                    </View>
                </View>
            </View>
        </ScrollView>
      );
    }
}

