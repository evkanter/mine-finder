import React from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { Button, Icon } from 'react-native-elements';

import Images from '../../core/services/images.service';

@inject('store')
@observer
export default class Splash extends React.Component {

    static propTypes = {
        store: PropTypes.object
    }

    constructor (props) {
        super(props);
        this.props.store.gameStore.checkForThinModeOnAndroid();
    }

    static navigationOptions = ({ navigation, screenProps }) => ({
        header: null
    });    

    startNewGame(routeName = 'Main') {
        this.props.store.gameStore.startNewGame();
        this.changeRoute(routeName);
    }

    howToPlay() {
        this.changeRoute('HowToPlay');        
    }
    
    changeRoute(routeName, passedInProperties = null) {
        let { navigate } = this.props.navigation;
        navigate(routeName,{...passedInProperties});    
    }

    render() {
        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#333333'}} 
                contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}                
                centerContent={true}>

                <Image style={{width: 300, height: 300, marginTop: 30}} source={Images.AppNameLogoLarge} />

                <View style={{flex: 1, backgroundColor: '#333333', height: 150}} >
                    <Button 
                        onPress={() => this.startNewGame() }
                        title="Play Now"
                        color="#FFFFFF"
                        fontSize={20}
                        backgroundColor="#0066CC"
                        style={{paddingTop: 20, paddingBottom:20 }}
                        icon={{name: 'play-arrow', type: 'material'}}
                    />
                    <Button 
                        onPress={() => this.howToPlay() }
                        title="How to Play"
                        color="#FFFFFF"
                        fontSize={20}
                        backgroundColor="#666666"
                        style={{ paddingBottom:20 }}
                        icon={{name: 'help', type: 'material'}}
                    />
                </View>

            </ScrollView>
        );
    }
}