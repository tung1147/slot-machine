/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    var gameSize, columnSize, itemSize, distance, columns, speed, effectArray, statusList, endingPhase, numberCard, time, stepValue, numberSpins, numberSpinsFinish;

    statusList = ["pause", "running", "ending", "effecting"];

    endingPhase = -1;

    stepValue = 1;

    gameSize = {x: 5, y: 3};

    columnSize = {width: 200, height: 467, padding: 5};

    itemSize = {width: 190, height: 150, marginTop: 5};

    distance = itemSize.height + itemSize.marginTop;

    columns = [];

    speed = 2;//default 2

    numberCard = 12;

    numberSpins = [];

    numberSpinsFinish = [];

    function SlotMachine(el, size) {
        this.initGame(el, size);
    }

    var p = SlotMachine.prototype = new TWIST.Game();

    p.initGame = function (el, size) {
        this.init(el);
        gameSize = size || gameSize;
        this.draw();
        this.pushEventListener();
    };

    p.draw = function () {
        this.data = TWIST.SlotMachineLogic.generateMap();
        var spinArea = new createjs.Container();

        for (var i = 0; i < gameSize.x; i++) {
            columns[i] = new createjs.Container();
            columns[i].set({x: i * columnSize.width, y: 0});

            var columnBg = new createjs.Bitmap("images/bg1.png");
            var columnItems = new createjs.Container();
            columns[i].addChild(columnBg, columnItems);

            for (var j = 0; j < gameSize.y; j++) {
                var item = this.createSlotItem(this.data[i][j], j);
                columnItems.addChild(item);
            }
            spinArea.addChild(columns[i]);
        }
        this.entity.addChild(spinArea);
    };

    p.pushEventListener = function () {
        var _self = this;
        this.on("spin", function () {
            _self.startSpin();
        });

        this.on("endSpin", function () {
            _self.endSpin(arguments[0]);
        });
    };

    p.startSpin = function () {
        var _self = this;
        var firstColumn = columns[0].getChildAt(1);
        this.status = statusList[1]
        speed = 2;
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
            numberSpins[i] = 0;
            numberSpinsFinish[i] = 0;
            _self.spinColumn(i);
        }
    };

    p.spinColumn = function (columnIndex) {
        var flat = false;
        if (endingPhase > -1 && (columnIndex == Math.floor(((endingPhase * 10 + 0.9 * 10) / 10) / gameSize.y))) {
            if (endingPhase % 1 == 0) {
                flat = true;
            }
        }
        var _self = this;
        var newItem;
        var itemsContainer = columns[columnIndex].getChildAt(1);
        if (flat) {
            newItem = this.createSlotItem(this.data[columnIndex][gameSize.y - 1 - endingPhase%gameSize.y], -1);
        } else {
            newItem = this.createSlotItem(Math.floor(Math.random() * numberCard), -1);
        }
        itemsContainer.addChild(newItem);

        createjs.Tween.get(itemsContainer)
                .to({y: distance}, distance / speed)
                .call(function () {
                    var columnIndex = this.parent.parent.getChildIndex(this.parent);
                    numberSpinsFinish[columnIndex]++;

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
                    } else {
                        _self.spinColumn(columnIndex);
                    }

                });



    };

    p.endSpin = function (data) {
        this.state = statusList[2];
        this.data = data;
        endingPhase = -0.8;
        stepValue = 0.2;
    };

    p.createSlotItem = function (value, state) {
        var _self = this;
        var slotItem = new createjs.Container(value);
        var bg = new createjs.Bitmap("images/" + value + ".png");
        slotItem.addChild(bg);
        slotItem.set({
            x: 0,
            y: itemSize.height * state + itemSize.marginTop * (state + 1),
            state: state
        });

        slotItem.goNextStep = function () {
            var distance = itemSize.height + itemSize.marginTop;
            var newY = itemSize.height * this.state + itemSize.marginTop * (this.state + 1);
            this.set({y: newY});
//            if (this.state == gameSize.y) {
//                this.parent.removeChild(this);
//            }
        };
        return slotItem;
    };

    window.TWIST = window.TWIST || {};
    window.TWIST.SlotMachine = SlotMachine;
})();


