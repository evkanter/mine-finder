import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { observer, inject, observable } from 'mobx-react';
import { Grid, Col, Row } from 'react-native-elements';

import GameSquare from './gamesquare';

@inject('store')
@observer
export default class GameBoard extends Component {

    constructor (props) {
        super(props);
    }

    static propTypes = {
        store: PropTypes.object
    }

    createSquare(squareWide, squareTall, count) {
        let square = this.props.store.gameStore.currentGame.gameboardArray[count];
        let squareSize = this.props.store.gameStore.currentGame.squaresSize;

        return ( 
            <Col key={'C' + square.itemKey + square.randomKey} 
                 style={{width: squareSize, height: squareSize }} >
                <GameSquare 
                    key={'GS' + square.itemKey + square.randomKey}
                    isLandMine={square.isLandMine} 
                    landMinesTouchingIt={square.landMinesTouchingIt} 
                    isOpen={square.isOpen} 
                    isLandMinePostActive={square.isLandMinePostActive} 
                    itemKey={square.itemKey} 
                    neighbors={square.neighbors} 
                    incorrectlyUnhidden = {square.incorrectlyUnhidden}
                    randomKey={square.randomKey}
                    squareWide={squareWide}
                    squareTall={squareTall}
                />
            </Col>
        )
    }

    createRow(currentRow) {
        let rowGrid = [];
        let count;
        for(let j=0; j<this.props.store.gameStore.currentGame.squaresWide; j++){
            count = (currentRow * this.props.store.gameStore.currentGame.squaresWide) + j;
            rowGrid.push(this.createSquare(j, currentRow, count));
        }
        return (<Row key={'Row'+currentRow}>{rowGrid}</Row>);        
    }

    createFullGrid() {
        let fullGrid = [];
        for(let i=0; i<this.props.store.gameStore.currentGame.squaresTall; i++) {
            fullGrid.push(this.createRow(i));
        }
        return fullGrid;        
    }

    render() {

        let squaresWide = this.props.store.gameStore.currentGame.squaresWide;
        let squaresTall = this.props.store.gameStore.currentGame.squaresTall;
        let squareSize = this.props.store.gameStore.currentGame.squaresSize;
        let squares = this.createFullGrid();

        return (
            <Grid style={{width: squareSize*squaresWide, height: squareSize*squaresTall }}>                
                {squares.map((gridSquare) => {
                    return gridSquare;
                })}                
            </Grid>
        );
    }
}