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
    var stage;
    var initTime = new Date().getTime();

    p.init = function (el) {
        if(!el) return;
        stage = new createjs.Stage(el);
        stage.enableMouseOver(20);
        var context = stage.canvas.getContext("2d");
        context.imageSmoothingEnabled = context.mozImageSmoothingEnabled = true;
        createjs.Touch.enable(stage);
        createjs.Ticker.setFPS(60);
        this.stage = stage;
        createjs.Ticker.addEventListener("tick", this.onUpdateStage);
    };

    p.onUpdateStage = function() {
        stage.update();
    };

    p.destroy = function() {
        createjs.Ticker.removeEventListener("tick", this.onUpdateStage);
    };
    
    p.draw = function() {
        
    };

    window.TWIST = window.TWIST || {};
    window.TWIST.GameCanvas = GameCanvas;
})();


