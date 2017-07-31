import React, { Component } from 'react';
import { StatusBar, Button, StyleSheet, Text, View } from 'react-native';
import { observer, Provider, inject } from 'mobx-react';
import { StackNavigator } from 'react-navigation';

import About from './pages/about/about';
import Achievements from './pages/achievements/achievements';
import DifficultyLevel from './pages/settings/difficulty-level';
import HowToPlay from './pages/how-to-play/how-to-play';
import Main from './pages/main/main';
import Rank from './pages/rank/rank';
import Splash from './pages/main/splash';

import masterStore from './core/stores/master.store';

import AppSideMenu from './components/side-menu/side-menu';

const MainRouter = StackNavigator({
    About: { screen: About },
    Achievements: { screen: Achievements },
    DifficultyLevel: { screen: DifficultyLevel },
    HowToPlay: { screen: HowToPlay },
    Main: { screen: Main },
    Rank: { screen: Rank },
    Splash: { screen: Splash }
}, {
    initialRouteName: 'Splash'
});

@observer
export default class App extends Component {

  constructor (props) {
    super(props);
    masterStore.gameStore.getAsyncData();
  }

  toggleSideMenu() {
      masterStore.menuStore.toggleSideMenu();    
  }

  startNewGame() {
      masterStore.gameStore.startNewGame();
      masterStore.menuStore.onSideMenuChange(false);
  }

  render() {
    let props = {
        store: masterStore, 
        toggleSideMenu: this.toggleSideMenu.bind(this),
        startNewGame: this.startNewGame.bind(this)
    };

    return (
      <View style={{flex: 1}}>
        <StatusBar hidden />
        <Provider store={masterStore}>
          <MainRouter screenProps={props} />
        </Provider>
      </View>
    );
  }
}
