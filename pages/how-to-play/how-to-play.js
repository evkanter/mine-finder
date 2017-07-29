import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Grid, Row, Col, Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

@inject('store')
@observer
export default class HowToPlay extends React.Component {

    static navigationOptions = {
        title: 'How to Play'
    };

    static propTypes = {
        store: PropTypes.object
    } 
    
    constructor (props) {
        super(props);
        this.state = {
            textBoxSize: (Math.min(Dimensions.get('window').width, Dimensions.get('window').height) * (2/3)),
            fontSizeHeadline: Math.min((2/3) * this.props.store.gameStore.currentGame.fontSize, 24),
            fontSizeBody: ((Math.min((2/3) * this.props.store.gameStore.currentGame.fontSize)-6), 18),
        };
    }
    
    printTitleRow(message) {
        return  <Row>
                    <Col style={{width: this.state.textBoxSize, height: (2*(this.state.fontSizeHeadline+4)) }}>
                        <Text style={{fontSize: this.state.fontSizeHeadline, color:'#990000'}}>{message}</Text>
                    </Col>
                </Row>
    }

    printAboutContentRow(message, lines) {
        return  <Row>
                    <Col style={{width: this.state.textBoxSize, height: (lines * (this.state.fontSizeBody+8))}}>
                        <Text style={{fontSize: this.state.fontSizeBody, color:'#000000'}}>{message}</Text>
                    </Col>
                </Row>
    }

    printAboutRow(message) {
        return  <Row>
                    <Col style={{width: 30, height: 4*(this.state.fontSizeBody+4), paddingTop:5, paddingBottom:10}}>
                        <Icon name='circle' type='font-awesome' color='#000000' style={{width: 30, height: this.state.fontSizeBody/2}} size={this.state.fontSizeBody/2} />
                    </Col>
                    <Col style={{width: this.state.textBoxSize-30, height: 4*(this.state.fontSizeBody+4), paddingBottom:10}}>
                        <Text style={{fontSize: this.state.fontSizeBody, color:'#000000'}}>{message}</Text>
                    </Col>
                </Row>
    }

    render() {

        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#333333'}} 
                contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}} 
                zoomEnabled={true} minimumZoomScale={1} maximumZoomScale={2}
                centerContent={true}>
                <View style={{ flex: 1, borderWidth: 3, borderColor: 'gold', margin: 20 }} >        
                    <View style={{ flex: 1, borderWidth: 3, borderColor: 'navy' }} >        
                        <View style={{ flex: 1, backgroundColor: '#fff', borderWidth: 3, borderColor: 'gold', padding: 20 }} >

                            <Grid style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                {this.printTitleRow('Tap Rules')}
                                {this.printAboutContentRow('"Tap" a tile to clear it',2)}
                                {this.printAboutContentRow('"Tap and Hold" a tile to flag it',2)}
                            </Grid>


                            <Grid style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
                                {this.printTitleRow('How to Win')}
                                {this.printAboutRow('Clear the board by accurately placing a flag on all mines')}
                            </Grid>

                            <Grid style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
                                {this.printTitleRow('Game Hints')}
                                {this.printAboutRow('The higher the consecutive wins, the higher your scores can be')}
                                {this.printAboutRow('Completing harder boards will give you more points')}
                                {this.printAboutRow('If you tap an empty square, it will clear many of its neighbors')}
                                {this.printAboutRow('The more mines you uncover, the higher the potential score')}
                                {this.printAboutRow('Points only count on "Rank" and "Achievements" if you clear the board')}
                            </Grid>

                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}