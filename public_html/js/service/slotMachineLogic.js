/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {

    var numberCard, lineList20, lineList9, prizeList, cardList, bets, potPercent;

    cardList = [0 /*aplle*/, 1 /*lemon*/, 2 /*orange*/, 3 /*strawberry*/, 4 /*watermelon*/, 5 /*cherry*/,
        6 /*ring*/, 7 /*seven*/, 8 /*bar*/, 9 /*wild*/, 10 /*bonus*/, 11 /*scatter*/];

    numberCard = cardList.length;

    bets = [100, 1000, 10000, 100000];

    prizeList = [[{length: 3, value: 4}, {length: 4, value: 15}, {length: 5, value: 50}],
        [{length: 3, value: 5}, {length: 4, value: 20}, {length: 5, value: 60}],
        [{length: 3, value: 10}, {length: 4, value: 30}, {length: 5, value: 80}],
        [{length: 3, value: 15}, {length: 4, value: 50}, {length: 5, value: 100}],
        [{length: 3, value: 20}, {length: 4, value: 75}, {length: 5, value: 150}],
        [{length: 2, value: 3}, {length: 3, value: 25}, {length: 4, value: 100}, {length: 5, value: 200}],
        [{length: 2, value: 3}, {length: 3, value: 30}, {length: 4, value: 150}, {length: 5, value: 300}],
        [{length: 2, value: 4}, {length: 3, value: 40}, {length: 4, value: 200}, {length: 5, value: 500}],
        [{length: 2, value: 4}, {length: 3, value: 50}, {length: 4, value: 250}, {length: 5, value: 0}],
        [],
        [{length: 3, value: 2}, {length: 4, value: 5}, {length: 5, value: 10}],
        [{length: 3, value: 2}, {length: 4, value: 3}, {length: 5, value: 5}]];

    lineList20 = [[1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [2, 2, 2, 2, 2], [1, 1, 0, 1, 1], [1, 1, 2, 1, 1],
        [0, 0, 1, 0, 0], [2, 2, 1, 2, 2], [0, 2, 0, 2, 0], [2, 0, 2, 0, 2], [1, 0, 2, 0, 1],
        [2, 1, 0, 1, 2], [0, 1, 2, 1, 0], [1, 2, 1, 0, 1], [1, 0, 1, 2, 1], [2, 1, 1, 1, 2],
        [0, 1, 1, 1, 0], [1, 2, 2, 2, 1], [1, 0, 0, 0, 1], [2, 2, 1, 0, 0], [0, 0, 1, 2, 2]];

    lineList9 = [[1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [2, 2, 2, 2, 2],
        [0, 1, 2, 1, 0], [2, 1, 0, 1, 2], [1, 0, 0, 0, 1],
        [1, 2, 2, 2, 1], [0, 0, 1, 2, 2], [2, 2, 1, 0, 0]];

    potPercent = 0.05;

    var SlotMachineLogic = new EventEmitter();

    var p = SlotMachineLogic;

    p.getInfo = function () {
        var result = {};
        var userData = this.getUserData();
        result.money = userData.money;
        var potData = this.getPotData();
        result.potData = potData;
        result.bets = bets;
        return result;
    };

    p.getUserData = function () {
        var userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            userData = {
                money: 1000000
            };
            localStorage.setItem('userData', JSON.stringify(userData));
        }
        return userData;
    };

    p.setUserData = function (data) {
        var userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            userData = {
                money: 1000000
            };
        }
        $.extend(userData, data);
        localStorage.setItem('userData', JSON.stringify(userData));
        return userData;
    };

    p.getPotData = function () {

        var potData = JSON.parse(localStorage.getItem('potData'));
        if (!potData) {
            potData = bets.map(function (item) {
                return item * 500;
            });
            localStorage.setItem('potData', JSON.stringify(potData));
        }
        return potData;
    };

    p.setPotData = function (data) {
        localStorage.setItem('potData', JSON.stringify(data));
        return data;
    };

    p.generateMap = function (options) {
        var map = [];
        var xSize, ySize;
        xSize = (options && options.x) ? options.x : 5;
        ySize = (options && options.y) ? options.y : 3;
        for (var x = 0; x < xSize; x++) {
            map[x] = [];
            for (var y = 0; y < ySize; y++) {
                map[x][y] = (options && !isNaN(options.value)) ? options.value : Math.floor(Math.random() * numberCard);
            }
        }
        return map;
    };

    p.getResult = function (activeLines, betting, options) {
        var resultLines = lineList9;
        var resultTable = this.generateMap();
        var result = {
            map: resultTable,
            explodePot: false,
            pzires: [],
            freeSpins: 0,
            bonusGameValue: 0,
            oldMoney: 0,
            newMoney: 0,
            potData: [],
            totalWin: 0
        };
        $.extend(result,options);
        for (var i = 0; i < activeLines.length; i++) {
            var line = resultLines[activeLines[i]];
            var lineResult = this.getResultByLine(resultTable, line);
            lineResult.line = activeLines[i];
            if (lineResult.prize) {
                if (lineResult.prize.value === 0) {
                    result.explodePot = true;
                }
                result.pzires.push(lineResult);
                result.totalWin += lineResult.prize.value * betting;
            }
        }

        result.freeSpins = this.getFreeSpins(resultTable);
        result.bonusGameValue = this.getBonusGameValue(resultTable);

        result.oldMoney = this.getUserData().money;
        var newMoney = result.oldMoney + result.totalWin * (1 - potPercent);
        result.newMoney = this.setUserData({money: newMoney}).money;
        
        var betIndex = bets.indexOf(betting);
        var potData = this.getPotData();
        potData[betIndex] += result.totalWin * potPercent;
        result.potData = this.setPotData(potData);
        
        return result;
    };

    p.getFreeSpins = function (resultTable) {
        var freeSpins = 0;
        var numberItem = 0;
        var freeIndex = 10;

        for (var i = 0; i < resultTable.length; i++) {
            var columnsItem = resultTable[i];
            if (columnsItem.indexOf(freeIndex) > -1) {
                numberItem++;
            }
        }
        ;


        var freeSpinPrize = prizeList[freeIndex].find(function (item, index) {
            return item.length === numberItem;
        });

        if (freeSpinPrize)
            freeSpins = freeSpinPrize.value;

        return freeSpins;
    };

    p.getBonusGameValue = function (resultTable) {
        var value = 0;
        var numberItem = 0;
        var bonusIndex = 11;

        for (var i = 0; i < resultTable.length; i++) {
            var columnsItem = resultTable[i];
            if (columnsItem.indexOf(bonusIndex) > -1) {
                numberItem++;
            }
        }
        ;

        var bonusGamePrize = prizeList[bonusIndex].find(function (item, index) {
            return item.length === numberItem;
        });

        if (bonusGamePrize)
            value = bonusGamePrize.value;

        return value;
    };

    p.getResultByLine = function (resultTable, line) {
        var itemsList = [];
        var firstItem = resultTable[0][line[0]];
        var resultList = [];
        var result = {};

        for (var i = 0; i < line.length; i++) {
            var item = resultTable[i][line[i]];
            itemsList[i] = item;
            if (firstItem == 9) {
                firstItem = item;
            }
            if ((item == firstItem || item == 9) && firstItem <= 10) {
                resultList[i] = item;
            } else {
                break;
            }
        }

        if (firstItem === 9) {
            firstItem = 8;
        }
        var prize = prizeList[firstItem].find(function (item, index) {
            return item.length === resultList.length;
        });

        result.prize = prize;

        return result;

    };

    window.TWIST = window.TWIST || {};
    window.TWIST.SlotMachineLogic = SlotMachineLogic;
})();


