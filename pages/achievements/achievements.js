import React from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import PropTypes from 'prop-types';
import { Grid, Col, Row, Icon } from 'react-native-elements';

@inject('store')
@observer
export default class Achievements extends React.Component {

  static navigationOptions = {
      title: 'My Achievements'
  };

  static propTypes = {
      store: PropTypes.object
  }

  constructor (props) {
    super(props);
    this.state = {
        textBoxSize: (Math.min(Dimensions.get('window').width, Dimensions.get('window').height) * (2/3)),
        fontSizeBody: ((Math.min((2/3) * this.props.store.gameStore.currentGame.fontSize)-6), 18),
    };
  }

  get clear40MinesInAGame() {
    return this.printRow('Clear 40 Mines in a Game',this.props.store.gameStore.currentAchievements.clear40MinesInAGame);
  }

  get clear60MinesInAGame() {
    return this.printRow('Clear 60 Mines in a Game',this.props.store.gameStore.currentAchievements.clear60MinesInAGame);
  }

  get clear80MinesInAGame() {
    return this.printRow('Clear 80 Mines in a Game',this.props.store.gameStore.currentAchievements.clear80MinesInAGame);
  }
  
  get cleared25Boards() {
    return this.printRow('Cleared 25 Boards',this.props.store.gameStore.currentAchievements.cleared25Boards);
  }

  get cleared50Boards() {
    return this.printRow('Cleared 50 Boards',this.props.store.gameStore.currentAchievements.cleared50Boards);
  }

  get cleared100Boards() {
    return this.printRow('Cleared 100 Boards',this.props.store.gameStore.currentAchievements.cleared100Boards);
  }

  get won5InARow() {
    return this.printRow('Won 5 Games in a Row',this.props.store.gameStore.currentAchievements.won5InARow);
  }

  get won10InARow() {
    return this.printRow('Won 10 Games in a Row',this.props.store.gameStore.currentAchievements.won10InARow);
  }

  printRow(message, isActive) {
    let rowColor;

    if (isActive) { rowColor = '#990000';} else { rowColor = '#AAAAAA';}

    return (
          <Row>
            <Col style={{width: 30, height: 30, paddingTop:10}}>
              <Icon name='heart' type='font-awesome' color={rowColor} style={{width: 30, height: 16, paddingTop:2}} size={16} />
            </Col>
            <Col style={{width: this.state.textBoxSize-30, height: 30, paddingTop:10}}>
              <Text style={{fontSize: this.state.fontSizeBody, color: rowColor}}>{message}</Text>
            </Col>
          </Row>
    )
  }

  render() {
    let rank = this.props.store.gameStore.currentAchievements;
    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#333333'}} 
            contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}} 
            centerContent={true}>
            <View style={{ flex: 1, backgroundColor: '#fff', borderWidth: 3, borderColor: 'gold', margin: 20, justifyContent: 'flex-end' }} >        
                <View style={{ flex: 1, backgroundColor: '#fff', borderWidth: 3, borderColor: 'navy', justifyContent: 'flex-end' }} >        
                    <View style={{ flex: 1, backgroundColor: '#fff', borderWidth: 3, borderColor: 'gold', padding: 20, justifyContent: 'flex-end' }} >
                      <Grid style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        {this.clear40MinesInAGame}
                        {this.clear60MinesInAGame}
                        {this.clear80MinesInAGame}
                        {this.cleared25Boards}
                        {this.cleared50Boards}
                        {this.cleared100Boards}
                        {this.won5InARow}
                        {this.won10InARow}
                      </Grid>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
  }
}