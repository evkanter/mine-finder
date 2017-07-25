import React, { Component } from 'react';
import { action, observable, computed, extendObservable, autorun } from 'mobx';
import { Alert, Dimensions } from 'react-native';
import { AsyncStorage } from 'react-native';

import moment from 'moment';

class GameStore {

    defaultGame = observable({
        gameMode: 'Normal',
        landMines: 10,
        squaresWide: 9,
        squaresTall: 16,
        squareSize: 36,
        fontSize: 24,
        gameboard: [],
        statistics: {
            landMinesOnTheBoard: 0,
            landMinesUncovered: 0,
            squaresUncovered: 0,
            squaresUncoveredNotZero: 0,
            gamePoints: 0,
            finalTimer: 0,
            isWin: false,
            isLoss: false
        }
    });

    currentGame = Object.assign({}, this.defaultGame);
    needsReset = observable({value:false});
    isGameOver = observable({value:false});
    clearScreen = observable({value:false});
    consecutiveWins = observable({value:0});
    totalWins = observable({value:0});

    defaultAchievements = observable({
        clear40MinesInAGame: false,
        clear60MinesInAGame: false,
        clear80MinesInAGame: false,
        cleared1Board: false,
        cleared25Boards: false,
        cleared50Boards: false,
        cleared100Boards: false,
        won5InARow: false,
        won10InARow: false
    });

    currentAchievements = Object.assign({}, this.defaultAchievements);

    defaultFastestWin = observable({ timesAchieved: 0 });
    defaultMostMinesCleared = observable({ timesAchieved: 0 });
    defaultHighestLevelObtained = observable({ timesAchieved: 0 });
    defaultHighestPointsWin = observable({ timesAchieved: 0 });
    defaultGamesPlayed = observable({ games: 0, wins: 0, losses: 0 });

    defaultRankings = {
        fastestWin: this.defaultFastestWin,
        mostMinesCleared: this.defaultMostMinesCleared,
        highestLevelObtained: this.defaultHighestLevelObtained,
        highestPointsWin: this.defaultHighestPointsWin,
        gamesPlayed: this.defaultGamesPlayed
    }

    currentRankings = {
        fastestWin: this.defaultFastestWin,
        mostMinesCleared: this.defaultMostMinesCleared,
        highestLevelObtained: this.defaultHighestLevelObtained,
        highestPointsWin: this.defaultHighestPointsWin,
        gamesPlayed: this.defaultGamesPlayed        
    }

    @action runFirst() {
        extendObservable(this.currentGame.gameboard, this.setBoard(this.currentGame.landMines, this.currentGame.squaresWide, this.currentGame.squaresTall) );
        extendObservable(this.currentGame.statistics,         
            {
                landMinesOnTheBoard: this.currentGame.statistics.landMinesOnTheBoard,
                landMinesUncovered: 0,
                squaresUncovered: 0,
                squaresUncoveredNotZero: 0,
                gamePoints: 0,
                finalTimer: 0,
                isWin: false,
                isLoss: false
            }
        );
        this.connectOpenPatches();
    }

    @action startClock() {
        this.needsReset.value = true;
    }

    setBoard(landMines, squaresWide, squaresTall) {
        var a,b;
        var count = 0;
        this.findSquareSize();
        var counterMax = this.currentGame.squaresWide * this.currentGame.squaresTall;

        this.currentGame.statistics.landMinesOnTheBoard = 0;
        var randomizerArray = Array.apply(null, {length: counterMax}).map(Number.call, Number);
        randomizerArray = this.shuffle(randomizerArray);
        let starterGameboard = new Array(squaresWide);

        for (let i = 0; i < squaresWide; i++) {
            starterGameboard[i] = new Array(squaresTall);
        }

        for (a=0; a < squaresWide; a++) {
            for (b=0; b < squaresTall; b++) {
                starterGameboard[a][b] = {
                    landMinesTouchingIt: 0, 
                    isOpen: false, 
                    isLandMinePostActive: false, 
                    itemKey: count, 
                    isLandMine: false,
                    incorrectlyUnhidden: false,
                    openPatch: 0
                };

                if (randomizerArray.indexOf(count) <= this.currentGame.landMines-1) {
                    starterGameboard[a][b].isLandMine = true;
                    this.currentGame.statistics.landMinesOnTheBoard++;
                } else {
                    starterGameboard[a][b].isLandMine = false;
                }

                count++;
            }
        }

        function addLandminesToNeighbors(squaresWide,squaresTall) {
            for (a=0; a < squaresWide; a++) {
                for (b=0; b < squaresTall; b++) {
                    if (starterGameboard[a][b].isLandMine) {
                        for (let x = Math.max(a-1, 0); x <= Math.min(a+1, squaresWide-1); x++) {
                            for (let y = Math.max(b-1, 0); y <= Math.min(b+1, squaresTall-1); y++) {

                                if (starterGameboard[x][y]) {
                                    if (typeof starterGameboard[x][y].landMinesTouchingIt == 'number') {
                                        starterGameboard[x][y].landMinesTouchingIt=starterGameboard[x][y].landMinesTouchingIt+1;
                                    } else {
                                        starterGameboard[x][y].landMinesTouchingIt=1;
                                    }
                                }

                            }
                        }
                    }
                }
            }
        }

        addLandminesToNeighbors(squaresWide,squaresTall);
        this.clearScreen.value = false;
        return starterGameboard;
    }

    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    patchNumber = 1;
    connectedPatch = [];    

    connectOpenPatches(squaresWide,squaresTall) {
        this.patchNumber = 1;
        this.restartConnectPatchArray();
        for (a=0; a < this.currentGame.squaresWide; a++) {
            for (b=0; b < this.currentGame.squaresTall; b++) {
                if (this.currentGame.gameboard[a][b].isLandMine) {
                    this.currentGame.gameboard[a][b].openPatch = -1;
                } else {
                    this.currentGame.gameboard[a][b].openPatch = this.getPatchOfNeighbor(a,b);
                }
            }
        }
    }

    restartConnectPatchArray() {
        this.connectedPatch = [];        
    }

    connectPatch(patchNumber1, patchNumber2) {
        if (!this.connectedPatch[patchNumber1]) { this.connectedPatch[patchNumber1] = []; }
        if (!this.connectedPatch[patchNumber2]) { this.connectedPatch[patchNumber2] = []; }
        this.connectedPatch[patchNumber1].push(patchNumber2);            
        this.connectedPatch[patchNumber2].push(patchNumber1);            
    }

    getPatchOfNeighbor(a,b) {

        let newPatchNumber = this.patchNumber;
        let thisPatch = 0;
        let isOpenable = false;

        for (let x = Math.max(a-1, 0); x <= Math.min(a+1, this.currentGame.squaresWide-1); x++) {
            for (let y = Math.max(b-1, 0); y <= Math.min(b+1, this.currentGame.squaresTall-1); y++) {

                if ((this.currentGame.gameboard[x][y].landMinesTouchingIt === 0) && (!isOpenable)) {
                    isOpenable = true;
                }

                if (this.currentGame.gameboard[x][y].openPatch > 0) {
                    if (thisPatch === 0) {
                        thisPatch = this.currentGame.gameboard[x][y].openPatch;
                    } else {
                        if (this.currentGame.gameboard[x][y].landMinesTouchingIt >= 0) {
                            this.connectPatch(thisPatch, this.currentGame.gameboard[x][y].openPatch);
                        }
                    }
                }
            }
        }

        if (isOpenable) {
            if (thisPatch === 0) {
                this.patchNumber = this.patchNumber + 1;
                return newPatchNumber
            } else {
                return thisPatch;
            }
        } else {
            return 0;                
        }
    }

    @action setTimeValue(timer) {
        this.currentGame.statistics.finalTimer = timer;
    }
    
    saveCurrentGameResults() {
        let gameStats = {
            gameMode: this.currentGame.gameMode,
            landMines: this.currentGame.landMines,
            squaresWide: this.currentGame.squaresWide,
            squaresTall: this.currentGame.squaresTall,
            landMinesOnTheBoard: this.currentGame.statistics.landMinesOnTheBoard,
            landMinesUncovered: this.currentGame.statistics.landMinesUncovered,
            squaresUncovered: this.currentGame.statistics.squaresUncovered,
            squaresUncoveredNotZero: this.currentGame.statistics.squaresUncoveredNotZero,
            timer: this.currentGame.statistics.finalTimer,
            points: this.currentGame.statistics.gamePoints,
            isGameOver: this.isGameOver.value,
            isWin: this.currentGame.statistics.isWin,
            isLoss: this.currentGame.statistics.isLoss,
            level: this.consecutiveWins.value,
            dayStamp: moment().format('l')
        };
        this.saveResults(gameStats);
    }

    @action calculatePoints() {
        let level = this.consecutiveWins.value + 1;
        let squaresUncovered = this.currentGame.statistics.squaresUncovered;
        let squaresUncoveredNotZero = this.currentGame.statistics.squaresUncoveredNotZero;
        let minesUncovered = this.currentGame.statistics.landMinesUncovered;
        let isWin = this.currentGame.statistics.isWin;
        let finalTimer = this.currentGame.statistics.finalTimer;
        let points = ((200 * minesUncovered) + (50 * squaresUncoveredNotZero));
        let timerBonus = 0;
        if (isWin && this.currentGame.statistics.finalTimer > 0 && this.currentGame.statistics.finalTimer < 400) {
            timerBonus = (4000 - (finalTimer * 10));
            points = points + timerBonus;
        }
        points = level * points;
        this.currentGame.statistics.gamePoints = points;
    }

    checkIfMineIsUncovered(a,b) {
        if (this.currentGame.gameboard[a][b].isLandMine) {
            this.showIncorrectSquare(a,b);		
            this.showLoserBoard();

            Alert.alert(
                'Oops!',
                'You uncovered a mine, sorry, Try again!',
                [
                    {text: 'New Game', onPress: () => this.startNewGame()}
                ],
                { cancelable: false }
            );
        } else {
            if ((this.currentGame.gameboard[a][b].landMinesTouchingIt === 0) && (this.currentGame.gameboard[a][b].openPatch > 0)) {
                this.openAllConnectedItems(this.currentGame.gameboard[a][b].openPatch);
            }
        }
    }

    checkPastGamesForAchievements() {
        this.currentAchievements.clear40MinesInAGame = (this.currentRankings.mostMinesCleared.mines >= 40);
        this.currentAchievements.clear60MinesInAGame = (this.currentRankings.mostMinesCleared.mines >= 60);
        this.currentAchievements.clear80MinesInAGame = (this.currentRankings.mostMinesCleared.mines >= 80);
        this.currentAchievements.cleared25Boards = (this.currentRankings.gamesPlayed.wins >= 25);
        this.currentAchievements.cleared50Boards = (this.currentRankings.gamesPlayed.wins >= 50);
        this.currentAchievements.cleared100Boards = (this.currentRankings.gamesPlayed.wins >= 100);
        this.currentAchievements.won5InARow = (this.currentRankings.highestLevelObtained.level >= 5);
        this.currentAchievements.won10InARow = (this.currentRankings.highestLevelObtained.level >= 10);
    }

    checkGameForAchievements() {
        if ((this.currentGame.statistics.landMinesUncovered >= 40) && (!this.currentAchievements.clear40MinesInAGame)) {
            this.currentAchievements.clear40MinesInAGame=true;
            sendAlert('You cleared 40 mines in one game!');
        }

        if ((this.currentGame.statistics.landMinesUncovered >= 60) && (!this.currentAchievements.clear60MinesInAGame)) {
            this.currentAchievements.clear60MinesInAGame=true;
            sendAlert('You cleared 60 mines in one game!');
        }

        if ((this.currentGame.statistics.landMinesUncovered >= 80) && (!this.currentAchievements.clear80MinesInAGame)) {
            this.currentAchievements.clear80MinesInAGame=true;
            sendAlert('You cleared 80 mines in one game!');
        }
        
        if ((this.totalWins.value >= 25) && (!this.currentAchievements.cleared25Boards)) {
            this.currentAchievements.cleared25Boards = true;
            sendAlert('You cleared 25 boards, keep it up!');
        }

        if ((this.totalWins.value >= 50) && (!this.currentAchievements.cleared50Boards)) {
            this.currentAchievements.cleared50Boards = true;
            sendAlert('You cleared 50 boards, keep it up!');
        }

        if ((this.totalWins.value >= 100) && (!this.currentAchievements.cleared100Boards)) {
            this.currentAchievements.cleared100Boards = true;
            sendAlert('You cleared 100 boards, keep it up!');
        }

        if ((this.consecutiveWins.value >= 5) && (!this.currentAchievements.won5InARow)) {
            this.currentAchievements.won5InARow = true;
            sendAlert('You won 5 games in a row!');
        }

        if ((this.consecutiveWins.value >= 10) && (!this.currentAchievements.won10InARow)) {
            this.currentAchievements.won10InARow = true;
            sendAlert('You won 10 games in a row!');
        }

        function sendAlert(message) {
            Alert.alert(
                'Congratulations!',
                message,
                [
                    {text: 'OK', onPress: () => {}, style: 'cancel'}
                ],
                { cancelable: false }
            );
        }
    }

    checkIfMineGuessWasIncorrect(a,b) {
        if (!this.currentGame.gameboard[a][b].isLandMine) {
            this.showIncorrectSquare(a,b);		
            this.showLoserBoard();
            Alert.alert(
                'Oops!',
                'That was not a mine, sorry, Try again!',
                [
                    {text: 'New Game', onPress: () => this.startNewGame()}
                ],
                { cancelable: false }
            );
        } else {
            this.currentGame.statistics.landMinesUncovered = this.currentGame.statistics.landMinesUncovered+1;            
            this.checkForSuccess();
        }
    }

    showIncorrectSquare(a,b) {
        this.currentGame.gameboard[a][b].incorrectlyUnhidden = true;
        this.currentGame.gameboard[a][b].isOpen = true;
    }

    showAllTilesBoard() {
        for(var i=0; i<this.currentGame.squaresWide; i++) {
            for(var j=0; j<this.currentGame.squaresTall; j++){
                if ((!this.currentGame.gameboard[i][j].isLandMine) && (!this.currentGame.gameboard[i][j].isOpen)) {
                    this.currentGame.gameboard[i][j].isOpen = true;
                }
            }
        }  
        this.calculatePoints();
        this.saveAllResults();
    }

    showLoserBoard() {
        this.isGameOver.value = true;
        if (!this.currentGame.statistics.isWin) {
            this.currentGame.statistics.isLoss = true;
        }

        for(let i=0; i<this.currentGame.squaresWide; i++) {
            for(let j=0; j<this.currentGame.squaresTall; j++){
                if ((this.currentGame.gameboard[i][j].isLandMine) && (!this.currentGame.gameboard[i][j].isOpen)) {
                    this.currentGame.gameboard[i][j].isOpen = true;
                }
            }
        }  
        this.calculatePoints();
        this.saveAllResults();

        if (this.currentGame.statistics.isLoss) {
            this.consecutiveWins.value = 0;
        }

    }

    
    openAllConnectedItems(openPatch) {
        let connectedItems = [openPatch];
        let unique = [...new Set(this.connectedPatch[openPatch])];

        for(let u=0; u<unique.length; u++) {
            if (unique[u] !== openPatch) {
                let moreUnique = [...new Set(this.connectedPatch[unique[u]])];

                for(let v=moreUnique.length-1; v >= 0; v--) {
                    if ((moreUnique[v] !== openPatch) && (moreUnique[v] !== unique[u])) {
                        let evenMoreUnique = [...new Set(this.connectedPatch[moreUnique[v]])];

                        for(let w=0; w < evenMoreUnique.length; w++) {
                            if ((evenMoreUnique[w] !== openPatch) && (evenMoreUnique[w] !== moreUnique[v]) && (evenMoreUnique[w] !== unique[u])) {
                                let oneMoreUnique = [...new Set(this.connectedPatch[evenMoreUnique[w]])];

                                for(let x=0; x < oneMoreUnique.length; x++) {
                                    connectedItems.push(oneMoreUnique[x]);
                                }                
                            }
                            connectedItems.push(evenMoreUnique[w]);
                        }                
                    }
                    connectedItems.push(moreUnique[v]);
                }                
            }
            connectedItems.push(unique[u]);
        }

        if (openPatch > 0) {
            for(let i=0; i<this.currentGame.squaresWide; i++) {
                for(let j=0; j<this.currentGame.squaresTall; j++) {
                    if ((connectedItems.includes(this.currentGame.gameboard[i][j].openPatch)) && (!this.currentGame.gameboard[i][j].isOpen)) {
                        this.currentGame.gameboard[i][j].isOpen = true;
                    }
                }
            }  
        }
        this.calculatePoints();
    }
    

    saveAllResults() {
        this.saveCurrentGameResults();
        this.checkGameForAchievements();
    }


    @action startNewGame() {
        this.isGameOver.value = false;
        this.currentGame = Object.assign({}, this.defaultGame);
        this.runFirst();
        this.startClock();
    }

    @action startUnhide(a,b) {
        this.unhide(a,b);
        this.calculatePoints();
    }

    unhide(a,b) {
        if (!this.isGameOver.value) {
            if (!this.currentGame.gameboard[a][b].isOpen) {
                this.currentGame.gameboard[a][b].isOpen=true;
                if (this.currentGame.gameboard[a][b].landMinesTouchingIt > 0) {
                    this.currentGame.statistics.squaresUncoveredNotZero = this.currentGame.statistics.squaresUncoveredNotZero + 1;
                }
                this.currentGame.statistics.squaresUncovered = this.currentGame.statistics.squaresUncovered + 1;
            }
            this.checkIfMineIsUncovered(a,b);
        }
    }

    addFlagOnScreen(a,b) {
        if (!this.isGameOver.value) {
            this.currentGame.gameboard[a][b].isLandMinePostActive=true;
            this.currentGame.gameboard[a][b].isOpen=true;        
            this.checkIfMineGuessWasIncorrect(a,b);
            this.calculatePoints();
        }
    }

    findSquareSize() {
        let usableBoard = (Math.min(Dimensions.get('window').width, Dimensions.get('window').height) - 40);
        let squareSize = (usableBoard / this.currentGame.squaresWide);
        let fontSize;
        if (squareSize > 38) {
            fontSize = Math.round(squareSize * (3/5));
        } else {
            fontSize = Math.round(squareSize * (2/3));
        }
        this.defaultGame.squareSize = squareSize;
        this.defaultGame.fontSize = fontSize;
        this.currentGame.squareSize = squareSize;
        this.currentGame.fontSize = fontSize;
    }

    @action setBoardSize(width, height) {
        this.defaultGame.squaresWide = width;
        this.defaultGame.squaresTall = height;
        this.currentGame.squaresWide = width;
        this.currentGame.squaresTall = height;
        this.isGameOver.value = true;
        this.clearScreen.value = true;
        this.findSquareSize();
    }

    @action setLandmines(mines) {
        this.defaultGame.landMines = mines;
        this.isGameOver.value = true;
        this.clearScreen.value = true;
    }

    @action resetTheResetButtonOnTheClock() {
        this.needsReset = observable({value:false});
    }

    @action updateSettingsRefreshBoard() {
        this.startNewGame();
    }

    checkForSuccess() {
        if ((this.currentGame.statistics.landMinesOnTheBoard === this.currentGame.statistics.landMinesUncovered) 
            && (this.currentGame.statistics.landMinesOnTheBoard > 0)) {

            this.currentGame.statistics.isWin = true;
            this.consecutiveWins.value = this.consecutiveWins.value + 1;
            this.showAllTilesBoard();

            Alert.alert( 
                'Congratulations, you won!', 
                'You scored ' + this.currentGame.statistics.gamePoints + ' points',
                [{text: 'New Game', onPress: () => this.startNewGame()}], 
                { cancelable: true }
            );
        }
    }

    async saveResults(gameStats) {
        await this.checkResultsToUpdateStatistics(gameStats);
        await this.storeAsyncData();
    }

    checkHighestPointsWin(gameStats) {
        if ((this.currentRankings.highestPointsWin.timesAchieved === 0) || (this.currentRankings.highestPointsWin.points < gameStats.points)) {
            this.currentRankings.highestPointsWin = observable({ points: gameStats.points, lastAchievedDate: gameStats.dayStamp, timesAchieved: 1 });
        } else if (this.currentRankings.highestLevelObtained.level === gameStats.level) {
            this.currentRankings.highestPointsWin = observable({ points: gameStats.points, lastAchievedDate: gameStats.dayStamp, timesAchieved: this.currentRankings.highestPointsWin.timesAchieved + 1 });
        } 
    }

    checkHighestLevelObtained(gameStats) {
        if ((this.currentRankings.highestLevelObtained.timesAchieved === 0) || (this.currentRankings.highestLevelObtained.level < gameStats.level)) {
            this.currentRankings.highestLevelObtained = observable({ level: gameStats.level, lastAchievedDate: gameStats.dayStamp, timesAchieved: 1 });
        } else if (this.currentRankings.highestLevelObtained.level === gameStats.level) {
            this.currentRankings.highestLevelObtained = observable({ level: gameStats.level, lastAchievedDate: gameStats.dayStamp, timesAchieved: this.currentRankings.highestLevelObtained.timesAchieved + 1 });
        } 
    }

    checkMostMinesCleared(gameStats) {
        if ((this.currentRankings.mostMinesCleared.timesAchieved === 0) || (this.currentRankings.mostMinesCleared.mines < gameStats.landMinesUncovered)) {
            this.currentRankings.mostMinesCleared = observable({ mines: gameStats.landMinesUncovered, lastAchievedDate: gameStats.dayStamp, timesAchieved: 1 });
        } else if (this.currentRankings.mostMinesCleared.mines === gameStats.landMinesUncovered) {
            this.currentRankings.mostMinesCleared = observable({ mines: gameStats.landMinesUncovered, lastAchievedDate: gameStats.dayStamp, timesAchieved: this.currentRankings.mostMinesCleared.timesAchieved + 1 });
        } 
    }

    checkFastestWin(gameStats) {
        if ((this.currentRankings.fastestWin.timesAchieved === 0) || (this.currentRankings.fastestWin.time > gameStats.timer)) {
            this.currentRankings.fastestWin = observable({ time: gameStats.timer, width: gameStats.squaresWide, height: gameStats.squaresTall, lastAchievedDate: gameStats.dayStamp, timesAchieved: 1 });
        } else if (this.currentRankings.fastestWin.time === gameStats.timer) {
            this.currentRankings.fastestWin.timesAchieved = this.currentRankings.fastestWin.timesAchieved + 1;
            this.currentRankings.fastestWin.lastAchievedDate = gameStats.dayStamp;
        }
    }

    checkResultsToUpdateStatistics(gameStats) {
        if (gameStats.isWin) {
            this.currentRankings.gamesPlayed.games = this.currentRankings.gamesPlayed.games + 1;
            this.currentRankings.gamesPlayed.wins = this.currentRankings.gamesPlayed.wins + 1;
            this.totalWins.value = this.currentRankings.gamesPlayed.wins;
            this.checkHighestPointsWin(gameStats);
            this.checkHighestLevelObtained(gameStats);
            this.checkMostMinesCleared(gameStats);
            this.checkFastestWin(gameStats);
        } else if (gameStats.isLoss) {
            this.currentRankings.gamesPlayed.games = this.currentRankings.gamesPlayed.games + 1;
            this.currentRankings.gamesPlayed.losses = this.currentRankings.gamesPlayed.losses + 1;
        }
    }

    @action async getAsyncData() {
        let previousRankings;
        const value = await AsyncStorage.getItem('STATS');

        if ((value.length > 2) && (value !== '{}')) {
            previousRankings = JSON.parse(value);

            this.totalWins.value = previousRankings.gamesPlayed.wins;
            this.currentRankings = {
                fastestWin: observable(previousRankings.fastestWin),
                mostMinesCleared: observable(previousRankings.mostMinesCleared),
                highestLevelObtained: observable(previousRankings.highestLevelObtained),
                highestPointsWin: observable(previousRankings.highestPointsWin),
                gamesPlayed: observable(previousRankings.gamesPlayed)       
            }
            this.checkPastGamesForAchievements();
        } else {
            previousRankings = this.defaultRankings;
        }
    }

    @action storeAsyncData() {
        let exportRankings = Object.assign({}, this.currentRankings);

        AsyncStorage.setItem('STATS', JSON.stringify(exportRankings), () => {
        });
    }

    @action async resetAsyncData() {
        let exportRankings = Object.assign({}, this.defaultRankings);

        await AsyncStorage.setItem('STATS', JSON.stringify(exportRankings), () => { });
        this.getAsyncData();
    }

}

export const gameStore = new GameStore();
