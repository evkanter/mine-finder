import React, { Component } from 'react';

import { observer, inject } from 'mobx-react';

import { StackNavigator } from 'react-navigation';

import Main from '../../pages/main/main';
import Settings from '../../pages/settings/settings';
import HowToPlay from '../../pages/how-to-play/how-to-play';
import Rank from '../../pages/rank/rank';

const MainRouter = StackNavigator({
    Main: { screen: Main },
    Settings: { screen: Settings },
    HowToPlay: { screen: HowToPlay },
    Rank: { screen: Rank },
}, {
    initialRouteName: 'Main'
});

toggleSideMenu () {
    this.props.store.menuStore.toggleSideMenu();
}


@inject('store')
@observer
export default class AppRouter extends Component {

    constructor (props) {
        super(props);
    }

    render() {
        let props = {
            store: this.props.store, 
            toggleSideMenu: this.toggleSideMenu.bind(this)
        };

        return (
            <MainRouter screenProps={props} />
        );
    }
}