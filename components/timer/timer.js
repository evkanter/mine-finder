import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Font } from 'expo';
import { Icon, Grid, Col, Row } from 'react-native-elements';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react/native';

@inject('store')
@observer
export default class Timer extends Component {
  
  constructor () {
    super()
    this.state = {secondsElapsed: 0, fontLoaded: false};
  }

  static propTypes = {
    store: PropTypes.object,
  }

  async componentDidMount() {
    await Font.loadAsync({
        Orbitron: require('../../fonts/Orbitron-Medium.ttf')
    });

    this.setState({ fontLoaded: true });
    this.interval = setInterval(this.tick, 1000);
  }

  tick = () => {
    if (this.props.store.gameStore.isGameOver.value === false) {
        this.setState({secondsElapsed: this.state.secondsElapsed + 1});        
        if (this.state.secondsElapsed % 5 == 0) {
          this.props.store.gameStore.setTimeValue(this.state.secondsElapsed);
        }
    } else {
        this.props.store.gameStore.setTimeValue(this.state.secondsElapsed);
        this.props.store.gameStore.calculatePoints();        
    }
    if (this.props.store.gameStore.needsReset.value) {
        this.resetClock();
    }     
  }

  resetClock() {
    clearInterval(this.interval);
    this.setState({secondsElapsed: 0}); 
    this.props.store.gameStore.resetTheResetButtonOnTheClock();
    this.startClockBackUp();
  }

  startClockBackUp = () => {
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
    <View style={{ height: 40, width: 400, backgroundColor: '#333333', alignItems: 'center', marginTop: 20, justifyContent: 'center' }}>
        <Grid>
            <Row>
                <Col style={{width:20}}><Icon name='star' type='font-awesome' color='#FFFFFF' style={{width: 20, height: 20}} size={16} /></Col>        
                <Col style={{width:20, marginRight: 5}}>{this.state.fontLoaded ? <Text style={{fontFamily: 'Orbitron', color: '#FFFFFF', fontSize: 20}}>{this.props.store.gameStore.consecutiveWins.value}</Text>:null}</Col>

                <Col style={{width:20}}><Icon name='bomb' type='font-awesome' color='#FFFFFF' style={{width: 20, height: 20}} size={16} /></Col>        
                <Col style={{width:56, marginRight: 5}}>{this.state.fontLoaded ? <Text style={{fontFamily: 'Orbitron', color: '#FFFFFF', fontSize: 20}}>{this.props.bombCount>0?this.props.bombCount:0}</Text>:null}</Col>

                <Col style={{width:20}}><Icon name='filter-drama' color='#FFFFFF' style={{width: 20, height: 20}} size={16} /></Col>        
                <Col style={{width:90, marginRight: 5}}>{this.state.fontLoaded ? <Text style={{fontFamily: 'Orbitron', color: '#FFFFFF', fontSize: 20}}>{this.props.store.gameStore.currentGame.statistics.gamePoints}</Text>:null}</Col>


                <Col style={{width:60, marginRight: 4}}>{this.state.fontLoaded ? <Text style={{fontFamily: 'Orbitron', color: '#FFFFFF', fontSize: 20, textAlign: 'right'}}>{this.state.secondsElapsed}</Text>:null}</Col>
                <Col style={{width:20}}><Icon name='query-builder' color='#FFFFFF' style={{width: 20, height: 20}} size={16} /></Col>        
            </Row>
        </Grid>
    </View>
    );
  }
}