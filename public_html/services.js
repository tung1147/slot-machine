/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    function GameCanvas(el) {
        this.init(el);
    }

    var p = GameCanvas.prototype;

    p.init = function (el) {
//        return;
        console.log(el);
        if(!el) return;
        var stage = new createjs.Stage(el);
        stage.enableMouseOver(20);
        var context = stage.canvas.getContext("2d");
        context.imageSmoothingEnabled = context.mozImageSmoothingEnabled = true;
        createjs.Touch.enable(stage);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", this.onUpdateStage);
        this.state = stage;
    };

    p.onUpdateStage = function() {
        this.stage.update();
    };

    p.destroy = function() {
        createjs.Ticker.removeEventListener("tick", this.onUpdateStage);
    };

    window.TWIST = window.TWIST || {};
    window.TWIST.GameCanvas = GameCanvas;
})();



/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    var SlotMachineLogic = {
        generateMap: function (value) {
            var map = [];
            for (var x = 0; x < 5; x++) {
                map[x] = [];
                for (var y = 0; y < 3; y++) {
                    map[x][y] = isNaN(value) ?  Math.floor(Math.random() * 10) : value;
                }
            }
            return map; 
        }
    };
    window.TWIST = window.TWIST || {};
    window.TWIST.SlotMachineLogic = SlotMachineLogic;
})();


