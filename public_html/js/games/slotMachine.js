/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    var gameSize, columnSize, itemSize, distance, columns, speed, effectArray,
            statusList, endingPhase, numberCard, time, stepValue, spinAreaConf, colorList,
            lineList9, lineList20, isLine9, line9Left, line9Right, line20Left, line20Right,
            line9Coordinate, activeLines, bets, effectQueue, moneyFallingEffectTime, currentEffectTurn, numberEffectCompleted,
            timeOutList, fistLog;

    colorList = ['#7d4627', '#9ad3de', '#935347', '#9068be', '#856046', '#e62739', '#fae596', '#3fb0ac', '#173e43', '#e6cf8b',
        '#b56969', '#22264b', '#98dafc', '#daad86', '#312c32', '#5a5c51', '#ba9077', '#729f98', '#283018', '#aa863a'];
    //http://www.awwwards.com/trendy-web-color-palettes-and-material-design-color-schemes-tools.html

    lineList20 = [[1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [2, 2, 2, 2, 2], [1, 1, 0, 1, 1], [1, 1, 2, 1, 1],
        [0, 0, 1, 0, 0], [2, 2, 1, 2, 2], [0, 2, 0, 2, 0], [2, 0, 2, 0, 2], [1, 0, 2, 0, 1],
        [2, 1, 0, 1, 2], [0, 1, 2, 1, 0], [1, 2, 1, 0, 1], [1, 0, 1, 2, 1], [2, 1, 1, 1, 2],
        [0, 1, 1, 1, 0], [1, 2, 2, 2, 1], [1, 0, 0, 0, 1], [2, 2, 1, 0, 0], [0, 0, 1, 2, 2]];

    lineList9 = [[1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [2, 2, 2, 2, 2],
        [0, 1, 2, 1, 0], [2, 1, 0, 1, 2], [1, 0, 0, 0, 1],
        [1, 2, 2, 2, 1], [0, 0, 1, 2, 2], [2, 2, 1, 0, 0]];

    activeLines = [];

    isLine9 = true;

    line9Left = [4, 2, 8, 6, 1, 7, 9, 3, 5];

    line9Right = [4, 2, 9, 6, 1, 7, 8, 3, 5];

    line9Coordinate = [[{x: 2.5, y: 2.4}], [], [{x: 1.5, y: 0}, {x: 3.5, y: -1}],
        [{x: 0.5, y: 0}, {x: 1.5, y: 0.3}, {x: 3.5, y: 0.3}, {x: 4.5, y: -1}],
        [], [{x: 0.5, y: 0}, {x: 1.5, y: 2.7}, {x: 3.5, y: 2.7}, {x: 4.5, y: -1}],
        [{x: 1.5, y: 0}, {x: 3.5, y: -1}], [], [{x: 2.5, y: 0.6}]];

    statusList = ["pause", "running", "ending", "effecting"];

    endingPhase = -1;

    stepValue = 1;

    gameSize = {x: 5, y: 3};

    itemSize = {width: 210, height: 170, padding: 10};

    columnSize = {width: itemSize.width, height: itemSize.height * 3};

    distance = itemSize.height;

    columns = [];

    speed = 2;//default 2

    numberCard = 12;

    spinAreaConf = {x: 100, y: 100};

    effectQueue = [];

    bets = [100, 1000, 10000, 100000];

    moneyFallingEffectTime = 3000;

    currentEffectTurn = 0;

    numberEffectCompleted = 0;

    timeOutList = [];

    function SlotMachine(el, size) {
        this.initGame(el, size);
    }

    var p = SlotMachine.prototype = new TWIST.Game();

    p.initGame = function (el, size) {
        this.init(el);
        gameSize = size || gameSize;
        this.activeLines = activeLines;
        this.info = {};
        this.draw();
        this.pushEventListener();
    };

    p.draw = function () {
        var _self = this;
        this.mapData = TWIST.SlotMachineLogic.generateMap();
        var spinArea = new createjs.Container();

        spinArea.set({x: spinAreaConf.x, y: spinAreaConf.y});
        var maskShape = new createjs.Shape(new createjs.Graphics().f("red")
                .drawRect(spinAreaConf.x, spinAreaConf.y, columnSize.width * gameSize.x, columnSize.height));
        spinArea.mask = maskShape;

        for (var i = 0; i < gameSize.x; i++) {
            columns[i] = new createjs.Container();
            columns[i].set({x: i * columnSize.width, y: 0});
            var columnItems = new createjs.Container();
            columns[i].addChild(columnItems);

            for (var j = 0; j < gameSize.y; j++) {
                var item = this.createSlotItem(this.mapData[i][j], j);
                columnItems.addChild(item);
            }
            spinArea.addChild(columns[i]);
        }

        function createColumnBg(img) {
            var columnBg = new createjs.Bitmap(img);
            img.onload = function () {
                columnBg.set({
                    scaleX: columnSize.width / bg1.width,
                    scaleY: columnSize.height / bg1.height
                });
            };
            return columnBg;
        }

        var wrapper = new createjs.Container();
        wrapper.set({x: spinAreaConf.x, y: spinAreaConf.y, width: columnSize.width * gameSize.x, height: columnSize.height});
        this.wrapper = wrapper;
        wrapper.cursor = "poiter";
        this.drawLine();

        var background = new createjs.Container();
        background.set({x: spinAreaConf.x, y: spinAreaConf.y});

        var bg = new createjs.Shape();
        bg.graphics.beginFill("lightcoral").drawRect(-spinAreaConf.x, -spinAreaConf.y, _self.entity.width, _self.entity.height);
        background.addChild(bg);

        for (var i = 0; i < gameSize.x; i++) {
            var bg1 = new Image();
            bg1.src = "images/bg1.png";
            var columnBg = createColumnBg(bg1);
            columnBg.set({x: i * columnSize.width, y: 0});
            background.addChild(columnBg);
        }

        this.effectContainer = new createjs.Container();

        this.entity.addChild(background, wrapper, spinArea, this.effectContainer);
    };

    p.pushEventListener = function () {
        var _self = this;
        this.on("spin", function () {
            _self.startSpin();
        });

        $('#spinButton').click(function () {
            if (_self.status != 'pause' && _self.status != 'effecting')
                return;
            _self.changeStatus("pause");
            _self.emit("spin");
        });

        this.on("endSpin", function (data) {
            _self.endSpin(data);
        });

        this.on("bindLine", function () {
            _self.bindLine(arguments[0], arguments[1]);
        });

        this.on("info", function () {
            _self.renderData(arguments[0]);
        });

        $('.button.plus-lines:not(.disabled)').on("click", function () {
            if (_self.status != 'pause' && _self.status != 'effecting')
                return;
            _self.changeStatus("pause");
            _self.emit("plusLine");
        });

        $('.button.decrease-lines:not(.disabled)').on("click", function () {
            if (_self.status != 'pause' && _self.status != 'effecting')
                return;
            _self.changeStatus("pause");
            _self.emit("decreaseLine");
        });

        $('.button.plus-bet:not(.disabled)').on("click", function () {
            if (_self.status != 'pause' && _self.status != 'effecting')
                return;
            _self.changeStatus("pause");
            _self.emit("plusBet");
        });

        $('.button.info:not(.disabled)').on("click", function () {
            $('.pay-table').toggle();
        });

        $('.pay-table').on("click", function () {
            $('.pay-table').toggle();
        });

        $('.button.decrease-bet:not(.disabled)').on("click", function () {
            if (_self.status != 'pause' && _self.status != 'effecting')
                return;
            _self.changeStatus("pause");
            _self.emit("decreaseBet");
        });

        this.on("plusLine", function () {
            _self.plusLine();
        });

        this.on("decreaseLine", function () {
            _self.decreaseLine();
        });

        this.on("plusBet", function () {
            _self.plusBet();
        });

        this.on("decreaseBet", function () {
            _self.decreaseBet();
        });

        this.on("bindBet", function (newBet) {
            _self.bindBet(newBet);
        });

        this.on("spinCompleted", function () {
            _self.effecting();
        });

        this.on("endEffect", function () {
            _self.endEffect();
        });

        this.on("toggleLines", function () {
            _self.toggleLines(arguments[0]);
        });
    };

    p.plusLine = function () {
        var lineList = isLine9 ? lineList9 : lineList20;
        for (var i = 0; i < lineList.length; i++) {
            var index = activeLines.indexOf(i);
            if (index === -1) {
                this.emit('bindLine', i, true);
                break;
            }
        }
    };

    p.decreaseLine = function () {

        var lineList = isLine9 ? lineList9 : lineList20;
        for (var i = lineList.length; i > 0; i--) {
            var index = activeLines.indexOf(i);
            if (index > -1) {
                this.emit('bindLine', i, false);
                break;
            }
        }
    };

    p.plusBet = function () {
        var index = this.info.bets.indexOf(this.info.betting);
        var newValue = this.info.bets[index + 1];
        if (newValue) {
            this.emit("bindBet", newValue);
        }
    };

    p.decreaseBet = function () {
        var index = this.info.bets.indexOf(this.info.betting);
        var newValue = this.info.bets[index - 1];
        if (newValue) {
            this.emit("bindBet", newValue);
        }
    };

    p.renderData = function (data) {
        $.extend(this.info, data);
        $('#top .jack-pot').text(this.info.potData[0]);
        $('#top .money').text(this.info.money);

        this.info.betting = data.bets[0];
        $('.number.bet').text(data.bets[0]);
        for (var i = 0; i < 9; i++) {
            this.emit("bindLine", i, true);
        }
        this.emit("toggleLines", false);

        $('.number.win').text(0);
        this.status = "pause";
    };

    p.bindLine = function (lineName, active) {
        if (activeLines.length == 1 && !active)
            return;
        var linesContainer = this.wrapper.getChildByName("linesContainer");
        var lineItem = linesContainer.getChildByName("line" + (lineName + 1));
        if (!lineItem)
            return;
        lineItem.visible = active;
        var className = '.line-button.button' + (lineName + 1);
        if (active) {
            $(className).addClass("active");
        } else {
            $(className).removeClass("active");
        }

        var indexLine = activeLines.indexOf(lineName);
        if (active && indexLine == -1) {
            activeLines.push(lineName);
        } else if (!active && indexLine > -1) {
            activeLines.splice(indexLine, 1);
        }
        $('.number.lines').text(activeLines.length);
        this.emit("toggleLines", true);
        this.changeNumberEffect('.number.total-bet', this.info.betting * activeLines.length, {duration: 200}).runEffect();
    };

    p.toggleLines = function (show) {
        var lines = this.wrapper.getChildByName("linesContainer").children;
        lines.forEach(function (item, index) {
            if (activeLines.indexOf(line9Left[index] - 1) > -1 && show) {
                item.visible = true;
            } else {
                item.visible = false;
            }
        });
    };

    p.bindBet = function (newBet) {
        this.info.betting = newBet;
//        $('.number.bet').text(newBet);
//        $('.number.total-bet').text(this.info.betting * activeLines.length);

        this.changeNumberEffect('#top .jack-pot', this.info.potData[bets.indexOf(newBet)], {duration: 200}).runEffect();
        this.changeNumberEffect('.number.bet', newBet, {duration: 200}).runEffect();
        this.changeNumberEffect('.number.total-bet', this.info.betting * activeLines.length, {duration: 200}).runEffect();
    };

    p.changeStatus = function (status) {
        this.status = status;
        timeOutList.forEach(function (item) {
            clearTimeout(item);
        });
        timeOutList = [];
        if (status == 'pause') {
            var effectArray = effectQueue[currentEffectTurn];
            if (!effectArray || !effectArray.length)
                return;
            for (var i = 0; i < effectArray.length; i++) {
                effectArray[i].endEffect();
            };
            effectQueue = [];
            currentEffectTurn = 0;
        }
        if (status == "running") {
            $('.number.win').text(0);
            this.effectContainer.removeAllChildren();
        }
    };

    p.drawLine = function () {
        var _self = this;
        var lines = isLine9 ? [].concat(lineList9) : [].concat(lineList20);
        var leftLine = isLine9 ? [].concat(line9Left) : [].concat(line20Left);
        var rightLine = isLine9 ? [].concat(line9Right) : [].concat(line20Right);

        var totalItemHeight = columnSize.height - (gameSize.y - 1) * 15;
        var itemHeight = totalItemHeight / leftLine.length;


        var wrapper = _self.wrapper;
        var leftColumn = new createjs.Container();
        leftColumn.set({x: -50, y: 0});

        var rightColumn = new createjs.Container();
        rightColumn.set({x: columnSize.width * gameSize.x + 20, y: 0});
        wrapper.addChild(leftColumn, rightColumn);

        drawHtmlNodes();
        drawLinesNote();

        function drawNodes() {

            for (var i = 0; i < leftLine.length; i++) {
                createNewNode(i, "left");
                createNewNode(i, "right");
            }

            function createNewNode(index, isLeft) {
                if (isNaN(index))
                    return;
                var lineColumn = (isLeft == "left") ? leftLine : rightLine;
                var lineIndex = lineColumn[index];
                var column = (isLeft == "left") ? leftColumn : rightColumn;

                var item = new createjs.Container();
                var numberText = new createjs.Text(lineIndex, 'bold 20px Dancing Script', 'white');
                numberText.set({x: 15, y: 15, textAlign: 'center', textBaseline: 'middle'});
                var numberTextBg = new createjs.Text(lineIndex, 'bold 20px Dancing Script', 'black');
                numberTextBg.set({x: 16, y: 16, textAlign: 'center', textBaseline: 'middle'});
                var bg1 = new createjs.Shape();
                bg1.graphics.beginFill("#ccc").drawCircle(14, 14, 15);
                var bg2 = new createjs.Shape();
                bg2.graphics.beginFill(colorList[lineIndex - 1]).drawCircle(15, 15, 15);
                item.addChild(bg1, bg2, numberTextBg, numberText);

                var newY = index * itemHeight + (itemHeight - 30) / 2 + 20 * Math.floor(index / gameSize.y);
                item.set({y: newY});
                column.addChild(item);
            }
        }

        function drawHtmlNodes() {

            $('#wrapper .button-layer').css({position: "absolute", top: spinAreaConf.y + 'px', left: spinAreaConf.x + 'px'});
            $('#left-column').css({position: "absolute", top: 0, left: "-50px"});
            $('#right-column').css({position: "absolute", top: 0, left: (columnSize.width * gameSize.x + 20) + 'px'});
            for (var i = 0; i < leftLine.length; i++) {
                createNewNode(i, "left");
                createNewNode(i, "right");
            }

            function createNewNode(index, isLeft) {
                if (isNaN(index))
                    return;
                var lineColumn = (isLeft == "left") ? leftLine : rightLine;
                var lineIndex = lineColumn[index];
                var column = (isLeft == "left") ? $('#left-column') : $('#right-column');

                var item = $("<div class='line-button button" + lineIndex + "'>" + lineIndex + "</div>");
                var newY = index * itemHeight + (itemHeight - 30) / 2 + 20 * Math.floor(index / gameSize.y);
                item.css({position: "absolute", font: 'bold 20px Dancing Script', top: newY + "px", left: 0, borderRadius: "15px",
                    backgroundColor: colorList[lineIndex - 1], lineHeight: "30px", width: "30px", textAlign: "center",
                    cursor: "pointer"});
                (function (item, lineIndex) {
                    item.on("click", function () {
                        console.log(_self.status);
                        if (_self.status != 'pause' && _self.status != 'effecting')
                            return;
                        _self.changeStatus("pause");
                        var isActive = $(this).hasClass("active")
                        _self.emit("bindLine", lineIndex, !isActive);
                    });
                })(item, lineIndex - 1)

                column.append(item);
            }
        }

        function drawLinesNote() {
//            return;
            if (!isLine9)
                return;
            var linesContainer = new createjs.Container();
            linesContainer.set({name: 'linesContainer', x: -50});
            wrapper.addChild(linesContainer);

            for (var i = 0; i < leftLine.length; i++) {
                createNewLine(i, "left");
            }

            function createNewLine(index, isLeft) {
                if (isNaN(index))
                    return;

                var lineColumn = (isLeft == "left") ? leftLine : rightLine;
                var lineIndex = lineColumn[index];
                var lineItem = lines[lineIndex - 1];
                var item = new createjs.Container();
                item.set({name: "line" + lineIndex, visible: false});
                linesContainer.addChild(item);

                var bg = new createjs.Shape();
                item.addChild(bg);

                var startX = bg.globalToLocal(0, 0).x - wrapper.globalToLocal(0, 0).x;
                var startY = index * itemHeight + (itemHeight - 0) / 2 + 20 * Math.floor(index / gameSize.y);
                var endIndex = rightLine.indexOf(lineIndex);
//                var endX = bg.globalToLocal(0, 0).x - rightColumn.children[index].globalToLocal(0, 0).x + 2;
                var endX = bg.globalToLocal(0, 0).x - wrapper.globalToLocal(0, 0).x + gameSize.x * columnSize.width + 22;
                var endY = endIndex * itemHeight + (itemHeight - 0) / 2 + 20 * Math.floor(endIndex / gameSize.y);

                bg.graphics.setStrokeStyle(6, 'round').beginStroke(colorList[lineIndex - 1]).moveTo(28, startY);

                var coordinates = line9Coordinate[index];
                for (var i = 0; i < coordinates.length; i++) {
                    var coordinate = coordinates[i];
                    var newX = 50 + coordinate.x * columnSize.width;
                    var newY = 0;
                    if (coordinate.y == -1) {
                        newY = endY;
                    } else if (coordinate.y == 0) {
                        newY = startY;
                    } else {
                        newY = coordinate.y * itemSize.height;
                    }
                    bg.graphics.lineTo(newX, newY);
                }
                bg.graphics.lineTo(endX, endY);

            }
        }
    };

    p.startSpin = function () {
        endingPhase = -1;
        var _self = this;
        var firstColumn = columns[0].getChildAt(0);
        this.changeStatus("running");
        this.emit("toggleLines", false);
        createjs.Tween.get(firstColumn)
                .to({y: -50}, 150)
                .call(function () {})
                .to({y: 0}, 150)
                .call(function () {
                    _self.spinAllColumns();
                });

    };

    p.spinAllColumns = function () {
        var _self = this;
        for (var i = 0; i < gameSize.x; i++) {
            _self.spinColumn(i);
        }
    };

    p.spinColumn = function (columnIndex) {
        var isNewEndingPhase = false;
        var beforeLastRow = false;
        if (endingPhase > -1 && (columnIndex == Math.floor(((endingPhase * 10 + 0.9 * 10) / 10) / gameSize.y))) {
            if (endingPhase % 1 == 0) {
                isNewEndingPhase = true;
                beforeLastRow = (endingPhase % gameSize.y) == (gameSize.y - 2);
            }
        }
        var _self = this;
        var newItem;
        var itemsContainer = columns[columnIndex].getChildAt(0);
        if (isNewEndingPhase) {
            newItem = this.createSlotItem(this.mapData[columnIndex][gameSize.y - 1 - endingPhase % gameSize.y], -1);
        } else {
            newItem = this.createSlotItem(Math.floor(Math.random() * numberCard), -1);
        }
        itemsContainer.addChild(newItem);
        var easeType = beforeLastRow ? createjs.Ease.getBackOut(5) : createjs.Ease.linear;
        var timeAnimation = beforeLastRow ? 2 * distance / speed : distance / speed;
        createjs.Tween.get(itemsContainer)
                .to({y: distance}, timeAnimation, easeType)
                .call(function () {
                    var columnIndex = this.parent.parent.getChildIndex(this.parent);

                    this.set({y: 0});
                    var slotItems = this.children;
                    slotItems.forEach(function (item, index) {
                        item.state++;
                        item.goNextStep();
                    });
                    this.removeChild(slotItems.find(function (item) {
                        return item.state == gameSize.y
                    }));

                    if (endingPhase > -1) {

                        var newValue = Math.floor(Math.floor((endingPhase + 0.9) / gameSize.y));
                        if (columnIndex == Math.floor(((endingPhase * 10 + 0.9 * 10) / 10) / gameSize.y)) {
                            var isLastRow = (endingPhase % gameSize.y) == (gameSize.y - 1);
                            if (isLastRow) {
                                stepValue = 1 / 5;
                            } else if ((endingPhase % gameSize.y) == 0) {
                                stepValue = 1;
                            }
                            endingPhase = (endingPhase * 10 + stepValue * 10) / 10;
                            if (!isLastRow) {
                                _self.spinColumn(columnIndex);
                            } else {
                                endingPhase = (endingPhase * 10 + stepValue * 10) / 10;
                            }
                        } else {
                            _self.spinColumn(columnIndex);
                        }
                        if (endingPhase > (gameSize.x * gameSize.y) - 1) {
                            _self.emit("spinCompleted");
                        }
                    } else {
                        _self.spinColumn(columnIndex);
                    }

                });
    };

    p.endSpin = function (data) {
        this.status = "ending";
        this.result = data;
        this.mapData = data.map;
        endingPhase = -0.8;
        stepValue = 0.2;
    };

    p.effecting = function () {
        this.status = "effecting";
        var result = this.result;
        console.log(result);
        effectQueue = [];
        if (result.totalWin > 0) {
            var effectArray = [];
            var changeWinMoneyEffect = this.changeNumberEffect('.number.win', result.totalWin, {duration: moneyFallingEffectTime});
            var changeTotalMoneyEffect = this.changeNumberEffect('#top .money', result.newMoney, {duration: moneyFallingEffectTime});
            var moneyFallingEffect = this.moneyFallingEffect();
            effectArray.push(changeWinMoneyEffect, moneyFallingEffect, changeTotalMoneyEffect);
            if(result.explodePot){
                var explodePotEffect = this.explodePotEffect();
                effectArray.push(explodePotEffect);
            }
            effectArray.oneTime = true;
            effectQueue.push(effectArray);

            for (var i = 0; i < result.pzires.length; i++) {
                var pzire = result.pzires[i]
                var effectArray = [];
                var hightLightItemEffect = this.hightLightEffect(pzire.line, pzire.prize.length);
                effectArray.push(hightLightItemEffect);
                effectQueue.push(effectArray);
            }

        }
        this.runNextEffect();
    };

    p.runNextEffect = function () {
        var effectArray = effectQueue[currentEffectTurn];
        if (!effectArray || !effectArray.length)
            return;
        function _runEffect() {
            numberEffectCompleted = 0;
            for (var i = 0; i < effectArray.length; i++) {
                effectArray[i].runEffect();
            }
        }
        if (effectArray.oneTime) {
            if (effectArray.done) {
                currentEffectTurn++;
                if (currentEffectTurn == effectQueue.length)
                    currentEffectTurn = 0;
                this.runNextEffect();
            } else {
                _runEffect();
            }
        } else {
            var timeOut = setTimeout(_runEffect, 300);
            timeOutList.push(timeOut);
        }
    };

    p.endEffect = function () {
        numberEffectCompleted++;
        if (numberEffectCompleted == (effectQueue[currentEffectTurn] && effectQueue[currentEffectTurn].length)) {
            if (effectQueue[currentEffectTurn].oneTime)
                effectQueue[currentEffectTurn].done = true;
            currentEffectTurn++;
            if (currentEffectTurn == effectQueue.length)
                currentEffectTurn = 0;
            if (this.status == "effecting") {
                this.runNextEffect();
            }
        }
    };

    p.createSlotItem = function (value, state) {
        var _self = this;
        var slotItem = new createjs.Container(value);
        var bg = new createjs.Bitmap("images/" + value + ".png");
        bg.set({x: itemSize.padding, y: itemSize.padding});
        slotItem.addChild(bg);
        slotItem.set({
            x: 0,
            y: itemSize.height * state,
            state: state
        });

        slotItem.goNextStep = function () {
            var newY = itemSize.height * this.state;
            this.set({y: newY});
        };
        return slotItem;
    };

    p.changeNumberEffect = function (el, newValue, options) {

        var jElement = $(el);
        var _self = this;

        jElement.newValue = newValue;
        jElement.options = options;

        jElement.runEffect = function () {
            var oldValue = this.text();
            var _jElement = this;
            var newOptions = {
                duration: 1000,
                step: function (now) {
                    _jElement.text(Math.ceil(now));
                },
                done: function () {
                    _jElement.endEffect();
                }
            };
            $.extend(newOptions, this.options);
            if (isNaN(parseInt(oldValue)))
                oldValue = 0;
            this.prop('Counter', oldValue).animate({
                Counter: this.newValue
            }, newOptions);
        };

        jElement.endEffect = function () {
            this.stop(true, true);
            _self.emit("endEffect");
        };

        return jElement;
    };

    p.hightLightEffect = function (line, length) {
        var _self = this;
        var item = new createjs.Container();
        var linesContainer = this.wrapper.getChildByName("linesContainer");
        var lineItem = linesContainer.getChildByName("line" + (line + 1));
        var lineList = lineList9[line];

        var starBg = new Image();
        starBg.src = "images/star-mini.png";

        item.runEffect = function () {
            clearTimeout(this.timeOut);
            if (this.isInited) {
                this.set({visible: true});
            } else {
                this.init();
            }

            lineItem.set({visible: true});
            this.timeOut = setTimeout(function () {
                item.endEffect();
            }, 3000);
        };

        item.init = function () {
            for (var i = 0; i < length; i++) {
                this.createItemEffect(i, lineList[i]);
            }
            _self.effectContainer.addChild(this);
            this.isInited = true;
        };

        item.createItemEffect = function (x, y) {
            var itemEffect = new createjs.Container();
            var itemWidth = itemSize.width,
                    itemHeight = itemSize.height,
                    oldX = x * itemSize.width + 15 + spinAreaConf.x,
                    oldY = y * itemSize.height + 8 + spinAreaConf.y
            itemEffect.set({x: oldX, y: oldY, name: "itemEffect", counter : 0});
            this.addChild(itemEffect);
            createjs.Tween.get(itemEffect, {loop: true, onChange: this.productStar})
                    .to({x: oldX + itemWidth  - 30}, 300)
                    .to({y: oldY + itemHeight - 16}, 300)
                    .to({x: oldX}, 300)
                    .to({y: oldY}, 300)
                    .call(function () {

                    });
        };

        item.productStar = function (event) {
            var container = event.target.target;
            container.counter++;
            if(container.counter%1 != 0) return;
            var start = new createjs.Bitmap(starBg);
            var startX = container.x, startY = container.y;
            container.parent.addChild(start);
            start.set({x: startX ,y : startY,scaleX: 0.01, scaleY: 0.01, width: 35, height: 35});
            var scale = start.width/18;
            createjs.Tween.get(start)
                    .to({
                        x: startX - scale*9 + (Math.random() - 0.5) * 2,
                        y: startY - scale*9 + (Math.random() - 0.5) * 2,
                        scaleX : scale,
                        scaleY : scale
                    }, 100, createjs.Ease.getElasticOut(5, 5))
                    .to({
                        x : startX - scale*4.5,
                        y : startY - scale*4.5,
                        scaleX : scale/2,
                        scaleY : scale/2
                    }, 100, createjs.Ease.getElasticIn(5, 5))
                    .to({
                        x : startX,
                        y : startY,
                        scaleX : 0.01,
                        scaleY : 0.01
                    }, 700)
                    .call(function () {
                        this.parent.removeChild(this);
                    });
        };

        item.endEffect = function () {
            clearTimeout(this.timeOut);
            _self.emit('toggleLines', false);
            this.set({visible: false});
            _self.emit("endEffect");
        };

        return item;
    };

    p.moneyFallingEffect = function (time) {
        var _self = this;
        var jElement = $('#effect .money-falling');
        var firstTime = new Date();
        jElement.runEffect = function () {
            clearTimeout(this.timeOut);
            this.show();
            this.timeOut = setTimeout(function () {
                jElement.endEffect();
            }, moneyFallingEffectTime);
        };
        jElement.endEffect = function () {
            clearTimeout(this.timeOut);
            this.hide();
            _self.emit("endEffect");
        };

        return jElement;
    };

    p.explodePotEffect = function () {
        var _self = this;
        var jElement = $('#effect .explorer-pot');
        var firstTime = new Date();
        jElement.runEffect = function () {
            this.show();
        };
        jElement.click(function (){
            jElement.endEffect();
        });
        jElement.endEffect = function () {
            this.hide();
            _self.emit("endEffect");
        };

        return jElement;
    };

    window.TWIST = window.TWIST || {};
    window.TWIST.SlotMachine = SlotMachine;
})();


