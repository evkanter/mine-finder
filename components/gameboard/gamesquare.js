import React, { Component } from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react/native';
import { Icon } from 'react-native-elements';

import Images from '../../core/services/images.service';

@inject('store')
@observer
export default class GameSquare extends Component {

    constructor (props) {
        super(props);
    }

    static propTypes = {
        store: PropTypes.object,
        isLandMine: PropTypes.bool.isRequired,
        landMinesTouchingIt: PropTypes.number.isRequired,
        isOpen: PropTypes.bool.isRequired,
        isLandMinePostActive: PropTypes.bool.isRequired,
        itemKey: PropTypes.number.isRequired,
        neighbors: PropTypes.object.isRequired,
        incorrectlyUnhidden: PropTypes.bool.isRequired,
        randomKey: PropTypes.number.isRequired,
        squareWide: PropTypes.number.isRequired,
        squareTall: PropTypes.number.isRequired
    } 

    unhide() {
        this.props.store.gameStore.startUnhide(this.props.itemKey)
    }

    addMineOnScreen() {
        this.props.store.gameStore.addFlagOnScreen(this.props.itemKey)
    }

    determineWhichToShow(squareSize, fontSize) {
        let QtySquare;
        let QtySquareColor = ['white','blue','green','red','purple','maroon','darkolivegreen','orangered','royalblue','teal','black'];

        let showFlagButton = 
                <View style={{width: squareSize, height: squareSize, backgroundColor: '#FFFFFF', borderColor: '#999999', borderWidth: 1, shadowColor: '#666666', shadowOpacity: .5, borderRadius: 0, alignItems: 'center', justifyContent: 'center' }} >
                    <Image style={{width: fontSize, height: fontSize}} source={Images.FlagButton} />
                </View>

        let showFlagXButton = 
                <View style={{width: squareSize, height: squareSize, backgroundColor: '#FFFFFF', borderColor: '#999999', borderWidth: 1, shadowColor: '#666666', shadowOpacity: .5, borderRadius: 0, alignItems: 'center', justifyContent: 'center' }} >
                    <Image style={{width: fontSize, height: fontSize}} source={Images.FlagXButton} />
                </View>

        let showUnClickedButton = 
            <TouchableOpacity onPress={this.unhide.bind(this)} onLongPress={this.addMineOnScreen.bind(this)} >
                <View style={{width: squareSize, height: squareSize,  backgroundColor: '#CCCCCC',  borderColor: '#999999', borderWidth: 1, shadowColor: '#666666', shadowOpacity: .5, borderRadius: 0 }} />
            </TouchableOpacity>

        let showMineButton = 
                <View style={{width: squareSize, height: squareSize, backgroundColor: '#FFFFFF', borderColor: '#999999', borderWidth: 1, shadowColor: '#666666', shadowOpacity: .5, borderRadius: 0, alignItems: 'center', justifyContent: 'center' }} >
                    <Icon name='bomb' type='font-awesome' color='#000000' style={{width: fontSize-4, height: fontSize-4, paddingLeft: 2}} size={fontSize-4} />
                </View>

        let showRedMineButton = 
                <View style={{width: squareSize, height: squareSize, backgroundColor: 'red', borderColor: '#999999', borderWidth: 1, shadowColor: '#666666', shadowOpacity: .5, borderRadius: 0, alignItems: 'center', justifyContent: 'center' }} >
                    <Icon name='bomb' type='font-awesome' color='#FFFFFF' style={{width: fontSize-4, height: fontSize-4, paddingLeft: 2}} size={fontSize-4} />
                </View>

        if (this.props.landMinesTouchingIt<=0) {
            QtySquare = <View style={{width: squareSize, height: squareSize, backgroundColor: '#FFFFFF', borderColor: '#999999', borderWidth: 1, shadowColor: '#666666', shadowOpacity: .5, borderRadius: 0, alignItems: 'center', justifyContent: 'center' }} />
        } else {
            QtySquare = 
                <View style={{width: squareSize, height: squareSize, backgroundColor: '#FFFFFF', borderColor: '#999999', borderWidth: 1, shadowColor: '#666666', shadowOpacity: .5, borderRadius: 0, alignItems: 'center', justifyContent: 'center' }} >
                    <Text style={{color: QtySquareColor[this.props.landMinesTouchingIt], fontSize: fontSize}}>{this.props.landMinesTouchingIt}</Text>
                </View>
        } 

        if (this.props.isOpen) {
            if (this.props.incorrectlyUnhidden) {
                if (this.props.isLandMine) {
                    actualButton = showRedMineButton;
                } else {
                    actualButton = showFlagXButton;                    
                }
            } else {
                if (this.props.isLandMinePostActive) {
                    actualButton = showFlagButton;                
                } else if (this.props.isLandMine) {
                    actualButton = showMineButton;
                } else {
                    if (this.props.landMinesTouchingIt >= 0) {
                        actualButton = QtySquare;
                    } else {
                        actualButton = null;
                    }
                }
            }
        } else {
            actualButton = showUnClickedButton;
        }

        return actualButton;
    }

    render() {
        let squareSize = this.props.store.gameStore.currentGame.squareSize;
        let fontSize = this.props.store.gameStore.currentGame.fontSize;
        let actualButton = this.determineWhichToShow(squareSize, fontSize);
        let display = this.props.store.gameStore.clearScreen.value;

        return (
            <View key={this.props.randomKey} style={{width: squareSize, height: squareSize, display: display?'none':'flex' }}>
                {actualButton}
            </View>
        );
    }
}