/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    function Game(el) {}

    var p = Game.prototype = new EventEmitter();

    p.init = function (el) {
        if(!el) return;
        var _self = this;
        this.entity = new TWIST.GameCanvas(el).stage;
        this.on('destroy', function () {
            _self.entity.destroy();
            _self.removeAllListeners();
        });
    };
    
    window.TWIST = window.TWIST || {};
    window.TWIST.Game = Game;
})();


