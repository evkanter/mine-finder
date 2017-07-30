import React, { Component } from 'react';
import { AsyncStorage, Alert, Dimensions } from 'react-native';
import { action, observable, computed, extendObservable, toJS, autorun } from 'mobx';
import _ from 'lodash';
import moment from 'moment';

class GameStore {
    defaultGame = observable({
        gameMode: 'Normal',
        gameDifficulty: 'easy',
        isCustom: false,
        landMines: 10,
        squaresWide: 9,
        squaresTall: 9,
        squareSize: 36,
        fontSize: 24,
        gameboardArray: observable.array([]),
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

    gameboardArray = [];
    gameBoardKey = observable({value:Math.random()});

    explodeTemp = [];
    explodeToCheck = [];
    explodeMap = [];

    defaultFastestWin = observable({ timesAchieved: 0 });
    defaultMostMinesCleared = observable({ timesAchieved: 0 });
    defaultHighestLevelObtained = observable({ timesAchieved: 0 });
    defaultHighestPointsWin = observable({ timesAchieved: 0 });
    defaultGamesPlayed = observable({ games: 0, wins: 0, losses: 0 });
    
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
        this.gameBoardKey.value = Math.random();
        this.setBoardArray(this.currentGame.landMines, this.currentGame.squaresWide, this.currentGame.squaresTall);
        this.setBoardMinesAndNeighbors(this.currentGame.landMines, this.currentGame.squaresWide, this.currentGame.squaresTall);
        this.extendObservableVariables();
        this.setUpExplodeIndex();
    }

    extendObservableVariables() {
        extendObservable(this.currentGame.statistics, {
                landMinesOnTheBoard: this.currentGame.statistics.landMinesOnTheBoard,
                landMinesUncovered: 0,
                squaresUncovered: 0,
                squaresUncoveredNotZero: 0,
                gamePoints: 0,
                finalTimer: 0,
                isWin: false,
                isLoss: false
        });

        this.currentGame.gameboardArray = observable.array(this.gameboardArray);

        for (let a=0; a < this.currentGame.squaresTall * this.currentGame.squaresWide; a++) {
            extendObservable(this.currentGame.gameboardArray[a], {
                x: this.gameboardArray[a].x,
                y: this.gameboardArray[a].y,
                randomKey: this.gameboardArray[a].randomKey,
                landMinesTouchingIt: this.gameboardArray[a].landMinesTouchingIt, 
                neighbors: this.gameboardArray[a].neighbors,
                isOpen: this.gameboardArray[a].isOpen, 
                isLandMinePostActive: this.gameboardArray[a].isLandMinePostActive, 
                itemKey: this.gameboardArray[a].itemKey, 
                explodeKey: this.gameboardArray[a].explodeKey,
                isLandMine: this.gameboardArray[a].isLandMine,
                incorrectlyUnhidden: this.gameboardArray[a].incorrectlyUnhidden
            });
        }
    }

    calculateLandMineValues() {
        let itemKey;
        let importedArray = Object.assign({}, this.gameboardArray);        
        let result = _.filter(importedArray, function(o) { return (o.isLandMine === true); })
        let itemNeighbors = result.map(function(o) { return o.neighbors; });
        
        for (a=0; a < itemNeighbors.length; a++) {
            for (b=0; b < itemNeighbors[a].length; b++) {
                itemKey = itemNeighbors[a][b];
                if (!this.gameboardArray[itemKey].isLandMine) {
                    if (typeof this.gameboardArray[itemKey].landMinesTouchingIt === 'number') {
                        this.gameboardArray[itemKey].landMinesTouchingIt = this.gameboardArray[itemKey].landMinesTouchingIt + 1;
                    } else {
                        this.gameboardArray[itemKey].landMinesTouchingIt = 1
                    }
                }
            }
        }
    }

    analyzeNeighborsByRowCol(row, col, count, squaresWide, squaresTall) {
        let importedArray = Object.assign({}, this.gameboardArray);        

        let result = _.filter(importedArray, function(o) { 
            return ((o.x >= Math.max(row-1, 0)) 
                && (o.x <= Math.min(row+1, squaresWide-1)) 
                && (!(o.x == row && o.y == col))
                && (o.y >= Math.max(col-1, 0))
                && (o.y <= Math.min(col+1, squaresTall-1))
            );
        })
        
        let itemKeys = result.map(function(o) { return o.itemKey; });
        this.gameboardArray[count].neighbors = itemKeys;
    }

    setUpExplodeIndex() {
        this.explodeMap = [];
        this.explodeMap[0] = [];
        this.explodeTemp = [];
        this.explodeToCheck = [];

        let importedArray = Object.assign({}, toJS(this.currentGame.gameboardArray));
        let result = _.filter(importedArray, function(o) { return ((o.isLandMine == false)); })
        this.explodeTemp = result.map(function(o) { return { itemKey: o.itemKey, landMinesTouchingIt: o.landMinesTouchingIt, explodeKey: o.explodeKey }; });

        this.explodeNextItem();
    }

    explodeNextItem() {
        if (this.explodeTemp.length > 0) {
            let importedArray = this.explodeTemp;
            let result = _.filter(importedArray, function(o) { return (o.explodeKey == 0);})

            let nextToExplode = _.find(result, function (o) { return o.landMinesTouchingIt == 0 })
            if (nextToExplode) {
                this.startProcessExploder(nextToExplode.itemKey);
                this.explodeNextItem();
            }
        }
    }

    startProcessExploder(count) {
        this.processNeighborsToExplode(count)    
        this.finishProcessExploder();
        this.explodeToCheck = [];
    }
    
    processNeighborsToExplode(count) {
        let itemKey;
        let allItemsToTry = this.currentGame.gameboardArray[count].neighbors;
        this.explodeToCheck.push(count);

        for(let u=0; u<allItemsToTry.length; u++) {
            itemKey = allItemsToTry[u];
            if ( (!this.explodeToCheck.includes(itemKey)) && (!this.gameboardArray[itemKey].isLandMine) ) {                        
                this.explodeToCheck.push(itemKey);
                if (this.currentGame.gameboardArray[itemKey].landMinesTouchingIt === 0) {
                    this.processNeighborsToExplode(itemKey);
                }
            }
        }        
    }
    
    finishProcessExploder() {
        let itemsToExplode = [...new Set(this.explodeToCheck)];
        let size = _.size(itemsToExplode);
        let nextExplodeMap = this.explodeMap.length;
        this.explodeMap[nextExplodeMap] = itemsToExplode;

        for(let c=0; c < size; c++) {
            this.gameboardArray[itemsToExplode[c]].explodeKey=nextExplodeMap;
            _.remove(this.explodeTemp, {itemKey: itemsToExplode[c] });
        }
    }
    
    setBoardArray(landMines, squaresWide, squaresTall) {
        let count = 0;
        let counterMax = squaresWide * squaresTall;
        this.currentGame.statistics.landMinesOnTheBoard = 0;
        this.findSquareSize();
        let randomizerArray = Array.apply(null, {length: counterMax}).map(Number.call, Number);
        randomizerArray = this.shuffle(randomizerArray);

        for (let a=0; a < squaresTall; a++) {
            for (let b=0; b < squaresWide; b++) {
                this.gameboardArray[count] = observable({
                    x: b,
                    y: a,
                    landMinesTouchingIt: 0, 
                    neighbors: [],
                    isOpen: false, 
                    isLandMinePostActive: false, 
                    itemKey: count, 
                    explodeKey: 0,
                    randomKey: Math.random(),
                    isLandMine: false,
                    incorrectlyUnhidden: false
                });

                if (randomizerArray.indexOf(count) <= this.currentGame.landMines-1) {
                    this.gameboardArray[count].isLandMine = true;
                    this.currentGame.statistics.landMinesOnTheBoard = this.currentGame.statistics.landMinesOnTheBoard + 1;
                } else {
                    this.gameboardArray[count].isLandMine = false;
                }

                count = count + 1;
            }
        }
    }

    setBoardMinesAndNeighbors(landMines, squaresWide, squaresTall) {
        let count = 0;

        for (a=0; a < squaresTall; a++) {
            for (b=0; b < squaresWide; b++) {
                this.analyzeNeighborsByRowCol(b, a, count, squaresWide, squaresTall);
                count = count + 1;
            }
        }
        this.calculateLandMineValues();
        this.clearScreen.value = false;
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

    @action startClock() {
        this.needsReset.value = true;
    }

    @action setTimeValue(timer) {
        this.currentGame.statistics.finalTimer = timer;
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

    checkIfMineIsUncovered(count) {
        if (this.currentGame.gameboardArray[count].isLandMine) {
            this.showIncorrectSquare(count);		
            this.showLoserBoard();
            var startNewGame = () => this.startNewGame();

            setTimeout(function(){ 
                Alert.alert('Oops!','You uncovered a mine, sorry, Try again!',[{text: 'New Game', onPress: startNewGame}],{ cancelable: false });
            }, 3000);

        } else {
            if ((this.currentGame.gameboardArray[count].landMinesTouchingIt === 0) && (this.currentGame.gameboardArray[count].explodeKey > 0)) {
                this.bulkExplode(this.currentGame.gameboardArray[count].explodeKey);
            }
        }
    }

    checkIfMineGuessWasIncorrect(count) {
        if (!this.currentGame.gameboardArray[count].isLandMine) {
            this.showIncorrectSquare(count);		
            this.showLoserBoard();
            var startNewGame = () => this.startNewGame();

            setTimeout(function(){ 
                Alert.alert( 'Oops!', 'That was not a mine, sorry, Try again!', [{text: 'New Game', onPress: startNewGame}],{ cancelable: false });
            }, 3000);

        } else {
            this.currentGame.statistics.landMinesUncovered = this.currentGame.statistics.landMinesUncovered+1;            
            this.checkForSuccess();
        }
    }

    showIncorrectSquare(count) {
        this.currentGame.gameboardArray[count].incorrectlyUnhidden = true;
        this.currentGame.gameboardArray[count].isOpen = true;
    }

    showAllTilesBoard() {
        for(let i=0; i<this.currentGame.squaresWide * this.currentGame.squaresTall; i++) {
            if ((!this.currentGame.gameboardArray[i].isLandMine) && (!this.currentGame.gameboardArray[i].isOpen)) {
                this.currentGame.gameboardArray[i].isOpen = true;
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

        for(let i=0; i<this.currentGame.squaresWide * this.currentGame.squaresTall; i++) {
            if ((this.currentGame.gameboardArray[i].isLandMine) && (!this.currentGame.gameboardArray[i].isOpen)) {
                this.currentGame.gameboardArray[i].isOpen = true;
            }
        }  
        this.calculatePoints();
        this.saveAllResults();

        if (this.currentGame.statistics.isLoss) {
            this.consecutiveWins.value = 0;
        }

    }

    bulkExplode(explodeMapToOpen) {
        if (!this.isGameOver.value) {

            let itemsToUnhide = [...new Set(this.explodeMap[explodeMapToOpen])];
            let importedArray = Object.assign({}, toJS(this.currentGame.gameboardArray));

            let result = _.filter(importedArray, function(o) { 
                return (itemsToUnhide.includes(o.itemKey) && (o.explodeKey == explodeMapToOpen) && (o.isOpen == false) && (o.isLandMine == false));
            })

            let itemKeys = result.map(function(obj) { return obj.itemKey; });
            let size = _.size(itemKeys);

            let squaresUncoveredNotZeroArray = result.map(function(obj) { return (obj.landMinesTouchingIt>0?1:0); });
            let squaresUncoveredNotZero = squaresUncoveredNotZeroArray.reduce((a,b) => a+b, 0);

            for(let c=0; c < size; c++) {
                this.currentGame.gameboardArray[itemKeys[c]].isOpen=true;
            }
            
        }        
    }

    unhide(count) {
        if (!this.isGameOver.value) {
            if (!this.currentGame.gameboardArray[count].isOpen) {
                this.currentGame.gameboardArray[count].isOpen=true;
                if (this.currentGame.gameboardArray[count].landMinesTouchingIt > 0) {
                    this.currentGame.statistics.squaresUncoveredNotZero = this.currentGame.statistics.squaresUncoveredNotZero + 1;
                }
                this.currentGame.statistics.squaresUncovered = this.currentGame.statistics.squaresUncovered + 1;
            }
            this.checkIfMineIsUncovered(count);
        }
    }

    @action startUnhide(count) {
        this.unhide(count);
        this.calculatePoints();
    }

    @action startNewGame() {
        this.isGameOver.value = false;
        this.clearScreen.value = false;
        this.currentGame = Object.assign({}, this.defaultGame);
        this.runFirst();
        this.startClock();
    }

    addFlagOnScreen(count) {
        if (!this.isGameOver.value) {
            this.currentGame.gameboardArray[count].isLandMinePostActive=true;
            this.currentGame.gameboardArray[count].isOpen=true;        
            this.checkIfMineGuessWasIncorrect(count);
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

    @action setDifficulty(difficulty, width, height, mines) {
        if ((this.defaultGame.gameDifficulty !== difficulty) || (difficulty === 'custom')) {
            this.defaultGame.isCustom = (difficulty==='custom');
            this.defaultGame.gameDifficulty = difficulty;
            this.currentGame.isCustom = (difficulty==='custom');
            this.currentGame.gameDifficulty = difficulty;
            if ((width>0) && (height>0) && (mines>0)) {
                this.defaultGame.squaresTall = width;
                this.defaultGame.squaresWide = height;
                this.currentGame.squaresTall = width;
                this.currentGame.squaresWide = height;
                this.defaultGame.landMines = mines;
                this.currentGame.landMines = mines;
            }
            this.isGameOver.value = true;
            this.clearScreen.value = true;
            this.findSquareSize();
        }
    }

    @action resetTheResetButtonOnTheClock() {
        this.needsReset.value = false;
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

            var startNewGame = () => this.startNewGame();
            var pointStatistics = this.currentGame.statistics.gamePoints;

            setTimeout(function(){ 
                Alert.alert('Congratulations, you won!','You scored ' + pointStatistics + ' points',[{text: 'New Game', onPress: startNewGame}],{ cancelable: true });
            }, 1500);

        }
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
            Alert.alert('Congratulations!',message,[{text: 'OK', onPress: () => {}, style: 'cancel'}],{ cancelable: false });
        }
    }

    saveAllResults() {
        this.saveCurrentGameResults();
        this.checkGameForAchievements();
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

    async saveResults(gameStats) {
        await this.checkResultsToUpdateStatistics(gameStats);
        await this.storeAsyncData();
    }
    
    @action async getAsyncData() {
        let previousRankings;
        const value = await AsyncStorage.getItem('STATS');

        if ((value.length > 2) && (value !== '{}')) {
            previousRankings = JSON.parse(value);

            previousRankings.gamesPlayed.wins ? this.totalWins.value = previousRankings.gamesPlayed.wins : 0;
            this.currentRankings = {
                fastestWin: previousRankings.fastestWin,
                mostMinesCleared: previousRankings.mostMinesCleared,
                highestLevelObtained: previousRankings.highestLevelObtained,
                highestPointsWin: previousRankings.highestPointsWin,
                gamesPlayed: previousRankings.gamesPlayed 
            }
            this.checkPastGamesForAchievements();
        } else {
            previousRankings = this.defaultRankings;
        }
    }

    @action storeAsyncData() {
        let exportRankings = Object.assign({}, this.currentRankings);
        AsyncStorage.setItem('STATS', JSON.stringify(exportRankings), () => {});
    }

    @action async resetAsyncData() {
        let exportRankings = Object.assign({}, this.defaultRankings);
        await AsyncStorage.setItem('STATS', JSON.stringify(exportRankings), () => {});
        this.getAsyncData();
    }

}

export const gameStore = new GameStore();
