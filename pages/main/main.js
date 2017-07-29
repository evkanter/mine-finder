import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react/native';
import { Icon } from 'react-native-elements';

import AppSideMenu from '../../components/side-menu/side-menu';

@inject('store')
@observer
export default class Main extends Component {

    static propTypes = {
        store: PropTypes.object
    }

    constructor (props) {
        super(props);
    }
    
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: 'Mine Finder',
        headerLeft: (
            <Icon name='bars' type='font-awesome' fontSize='24' color='#333333' iconStyle={{paddingLeft:30}} onPress={screenProps.toggleSideMenu} />
        ),
        headerRight: (
            <Icon name='play-arrow' type='material' fontSize='24' color='#333333' iconStyle={{paddingRight:30}} onPress={screenProps.startNewGame} />
        )
    });

    render() {
        return (
            <AppSideMenu store={this.props.store} navigation={this.props.navigation}/>
        );
    }
}