import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import PropTypes from 'prop-types';

@inject('store')
@observer
export default class Rank extends React.Component {

  static navigationOptions = {
      title: 'My Rank'
  };

  static propTypes = {
      store: PropTypes.object
  }

  render() {
    let rank = this.props.store.gameStore.currentRankings;

    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#333333'}} 
          contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}} 
          centerContent={true}>
        <View style={{ flex: 1, backgroundColor: '#fff', borderWidth: 3, borderColor: 'gold', margin: 20, justifyContent: 'flex-end' }} >        
          <View style={{ flex: 1, backgroundColor: '#fff', borderWidth: 3, borderColor: 'navy', justifyContent: 'flex-end' }} >        
            <View style={{ flex: 1, backgroundColor: '#fff', borderWidth: 3, borderColor: 'gold', padding: 20, justifyContent: 'flex-end' }} >        

              {rank.fastestWin.time > 0 ? <View style={{paddingBottom: 20, paddingTop: 20, alignItems: 'center'}}>
                <Text style={{fontSize: 20, color: '#990000'}}>Fastest win: {rank.fastestWin.time + ' seconds'}</Text>
                <Text>({rank.fastestWin.width + 'x' + rank.fastestWin.height + ' - ' + rank.fastestWin.lastAchievedDate})</Text>
              </View>:null}

              {rank.mostMinesCleared.mines > 0 ? <View style={{paddingBottom: 20, alignItems: 'center'}}>
                <Text style={{fontSize: 20, color: '#990000'}}>Most mines cleared: {rank.mostMinesCleared.mines}</Text>
                <Text>({rank.mostMinesCleared.lastAchievedDate})</Text>
              </View>:null}

              {rank.highestLevelObtained.level > 0 ? <View style={{paddingBottom: 20, alignItems: 'center'}}>
                <Text style={{fontSize: 20, color: '#990000'}}>Most consecutive wins: {rank.highestLevelObtained.level}</Text>
                <Text>({rank.highestLevelObtained.lastAchievedDate})</Text>
              </View>:null}

              {rank.highestPointsWin.points > 0 ? <View style={{paddingBottom: 20, alignItems: 'center'}}>
                <Text style={{fontSize: 20, color: '#990000'}}>Highest pts. scored: {rank.highestPointsWin.points}</Text>
                <Text>({rank.highestPointsWin.lastAchievedDate})</Text>
              </View>:null}

              {rank.gamesPlayed.games > 0 ? 
              <View>
                <View style={{paddingBottom: 20, alignItems: 'center'}}>
                  <Text style={{fontSize: 20, color: '#990000'}}>Games played: {rank.gamesPlayed.games}</Text>
                </View>
                <View style={{paddingBottom: 20, alignItems: 'center'}}>
                  <Text style={{fontSize: 20, color: '#990000'}}>Wins: {rank.gamesPlayed.wins}</Text>
                </View>              
              </View>              
              :
              <View style={{paddingBottom: 20, alignItems: 'center'}}>
                <Text style={{fontSize: 20, color: '#990000'}}>You have no rankings.</Text>
                <Text>(Return when you've completed a game)</Text>
              </View>}

            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}