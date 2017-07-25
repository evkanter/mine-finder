import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Grid, Row, Col, Icon } from 'react-native-elements';

export default class HowToPlay extends React.Component {

    static navigationOptions = {
        title: 'How to Play'
    };

    printTitleRow(message) {
        return  <Row>
                    <Col style={{width: 270, height: 40}}>
                        <Text style={{fontSize: 20, color:'#990000'}}>{message}</Text>
                    </Col>
                </Row>
    }

    printAboutRow(message) {
        return  <Row>
                    <Col style={{width: 30, height: 60, paddingTop:5, paddingBottom:10}}>
                        <Icon name='circle' type='font-awesome' color='#000000' style={{width: 30, height: 12}} size={12} />
                    </Col>
                    <Col style={{width: 240, height: 60, paddingBottom:10}}>
                        <Text style={{fontSize: 16, color:'#000000'}}>{message}</Text>
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
                        {this.printAboutRow('"Tap" a tile to clear it')}
                        {this.printAboutRow('"Tap and Hold" a tile to flag it')}
                    </Grid>


                    <Grid style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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