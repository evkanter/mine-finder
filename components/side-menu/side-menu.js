import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import { StyleSheet, Text, ScrollView, View, TouchableOpacity } from 'react-native';
import { Button, Icon, List, ListItem } from 'react-native-elements';
import SideMenu from 'react-native-side-menu';
import PropTypes from 'prop-types';
import { Font } from 'expo';

import Timer from '../../components/timer/timer';

import { StackNavigator } from 'react-navigation';

import GameBoard from '../gameboard/gameboard';

const list = [
    {
        title: 'Board Size',
        icon: 'border-all',
        iconType: 'material',
        pageName: 'BoardSize'
    },
    {
        title: 'Update Mine Quantity',
        icon: 'bomb',
        iconType: 'font-awesome',
        pageName: 'LandMineSettings'
    },
    {
        title: 'How to Play',
        icon: 'help',
        iconType: 'material',
        pageName: 'HowToPlay'
    },
    {
        title: 'Rank',
        icon: 'star',
        iconType: 'material',
        pageName: 'Rank'
    },
    {
        title: 'Achievements',
        icon: 'bank',
        iconType: 'font-awesome',
        pageName: 'Achievements'
    },
    {
        title: 'About this Game',
        icon: 'home',
        iconType: 'font-awesome',
        pageName: 'About'
    }
]

@inject('store')
@observer
export default class AppSideMenu extends Component {

    static propTypes = {
        store: PropTypes.object,
    }

    constructor () {
        super()
        this.state = {fontLoaded: false};
        this.toggleSideMenu = this.toggleSideMenu.bind(this);
    }

    async componentDidMount() {

        await Font.loadAsync({
            Orbitron: require('../../fonts/Orbitron-Medium.ttf')
        });

        this.setState({ fontLoaded: true });
    }

    onSideMenuChange (isOpen) {
        this.props.store.menuStore.onSideMenuChange(isOpen);
    }

    toggleSideMenu () {
        this.props.store.menuStore.toggleSideMenu();
    }

    startNewGame() {
        this.props.store.gameStore.startNewGame();
        this.props.store.menuStore.onSideMenuChange(false);
    }

    changeRoute(routeName, passedInProperties = null) {
        this.props.store.menuStore.onSideMenuChange(false);
        let { navigate } = this.props.navigation;
        navigate(routeName,{...passedInProperties});    
    }

    render () {
        let isSideMenuOpen = this.props.store.menuStore.isSideMenuOpen.value;
        let squaresWide = this.props.store.gameStore.currentGame.squaresWide;
        let squaresTall = this.props.store.gameStore.currentGame.squaresTall;
        let squareSize = this.props.store.gameStore.currentGame.squareSize;

        const MenuComponent = (
            <ScrollView scrollsToTop={false} style={{flex: 1, backgroundColor: '#ededed', paddingTop: 0}}>
                <List>
                    <ListItem
                        key={-1}
                        title='New Game'
                        titleStyle={{marginLeft:5}}
                        underlayColor='#fafad2'
                        leftIcon={{name: 'play-arrow', style: {marginRight:0}}}
                        onPress={() => this.startNewGame()} 
                    />
                    {
                        list.map((item, i) => (
                            <ListItem
                                key={i}
                                title={item.title}
                                titleStyle={{marginLeft:5}}
                                underlayColor='#fafad2'
                                leftIcon={{name: item.icon, type: item.iconType, style: {marginRight:0}}}
                                onPress={() => this.changeRoute(item.pageName)} 
                            />
                        ))
                    }
                </List>
            </ScrollView>
        )
        
        return (
            <SideMenu
                isOpen={isSideMenuOpen}
                onChange={this.onSideMenuChange.bind(this)}
                menuPosition='left'
                menu={MenuComponent}>
                <ScrollView style={{flex: 1, backgroundColor: '#333333'}} zoomEnabled={true} minimumZoomScale={1} maximumZoomScale={3} >
                    <View style={{flex: 1, backgroundColor: '#333333', alignItems: 'center', justifyContent: 'center'}} >
                        <Timer bombCount={this.props.store.gameStore.currentGame.statistics.landMinesOnTheBoard-this.props.store.gameStore.currentGame.statistics.landMinesUncovered} />
                    </View>
                    <View style={{flex: 10, 
                        backgroundColor: '#333333', 
                        overflow: 'visible', 
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} >                    
                        <GameBoard store={this.props.store} />
                    </View>
                    <View style={{flex: 1, backgroundColor: '#333333', height: 90, alignItems: 'center', justifyContent: 'center'}} >
                        <Button 
                            onPress={ this.startNewGame.bind(this) }
                            title="New Game"
                            color="white"
                            fontSize={20}
                            backgroundColor="#0066CC"
                            style={{paddingTop: 20, paddingBottom:20, alignItems: 'center', justifyContent: 'center' }}
                            icon={{name: 'play-arrow', type: 'material'}}
                        />
                    </View>
                </ScrollView>
            </SideMenu>
        )
    }
}