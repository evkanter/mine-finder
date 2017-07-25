import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { Grid, Col, Row } from 'react-native-elements';

import GameSquare from './gamesquare';

@observer
export default class GameBoard extends Component {

    constructor (props) {
        super(props);
    }

    static propTypes = {
        store: PropTypes.object
    }

    createSquare(squareWide, squareTall) {
        let square = this.props.store.gameStore.currentGame.gameboard[squareWide][squareTall];
        let squareSize = this.props.store.gameStore.currentGame.squaresSize;

        return ( 
            <Col key={square.itemKey} style={{width: squareSize, height: squareSize }} >
                <GameSquare 
                    key={square.itemKey}
                    isLandMine={square.isLandMine} 
                    landMinesTouchingIt={square.landMinesTouchingIt} 
                    isOpen={square.isOpen} 
                    isLandMinePostActive={square.isLandMinePostActive} 
                    itemKey={square.itemKey} 
                    incorrectlyUnhidden = {square.incorrectlyUnhidden}
                    openPatch = {square.openPatch}
                    squareWide={squareWide}
                    squareTall={squareTall}
                />
            </Col>
        )
    }

    createRow(currentRow) {
        const rowGrid = [];
        for(let j=0; j<this.props.store.gameStore.currentGame.squaresWide; j++){
            rowGrid.push(this.createSquare(j, currentRow));
        }
        return (<Row key={'Row'+currentRow}>{rowGrid}</Row>);        
    }

    createFullGrid() {
        const fullGrid = [];
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