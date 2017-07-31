import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View, Linking } from 'react-native';
import { Grid, Row, Col, Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

@inject('store')
@observer
export default class About extends React.Component {

    static navigationOptions = {
        title: 'About this game'
    };

    static propTypes = {
        store: PropTypes.object
    } 
    
    constructor (props) {
        super(props);
        this.state = {
            textBoxSize: (Math.min(Dimensions.get('window').width, Dimensions.get('window').height) * (2/3)),
            fontSizeHeadline: ((Math.min((2/3) * this.props.store.gameStore.currentGame.fontSize), 24)),
            fontSizeBody: ((Math.min((2/3) * this.props.store.gameStore.currentGame.fontSize)-6), 18),
        };
    }

    addLinkToOutsideUrl(url) {
        Linking.openURL(url).catch();
    }

    printOutsideUrl(message, url) {
        return  <Row>
                    <Col style={{width: this.state.textBoxSize, height: (this.state.fontSizeBody+8)}}>
                        <Text style={{fontSize: this.state.fontSizeBody, color:'#000000'}} onPress={() => this.addLinkToOutsideUrl(url)}>{message}</Text>
                    </Col>
                </Row>
    }
    
    printTitleRow(message) {
        return  <Row>
                    <Col style={{width: this.state.textBoxSize, height: (2*(this.state.fontSizeHeadline+4)) }}>
                        <Text style={{fontSize: this.state.fontSizeHeadline, color:'#990000', fontWeight: 'bold', textShadowColor: '#EFEFEF'}}>{message}</Text>
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
                                {this.printTitleRow('Mine Finder')}
                                {this.printAboutContentRow('A classic game based on the well known rules of Minesweeper',3)}
                            </Grid>

                            <Grid style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>
                                {this.printTitleRow('Features')}
                                {this.printAboutRow('Change the "board size" and "quantity of mines" for added challenge')}
                                {this.printAboutRow('Added points feature so you can track your progress')}
                                {this.printAboutRow('Win achievements and keep track of your playing record')}
                                {this.printAboutRow('Win a point bonus for consecutive wins and finishing games quickly')}
                            </Grid>

                            <Grid style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
                                {this.printTitleRow('About the Game')}
                                {this.printAboutContentRow('Created by Evan Kanter',1)}
                                {this.printAboutContentRow('Copyright 2017',2)}
                                {this.printOutsideUrl('View the website','https://minefindergame.com')}
                                {this.printOutsideUrl('Check out the source code','https://minefindergame.com/2017/07/26/open-source-code/')}
                                {this.printOutsideUrl('Like it? Review us!','https://minefindergame.com/testimonials/')}
                            </Grid>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}