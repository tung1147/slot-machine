/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    function Game(el) {
        this.init(el);
    }

    var p = Game.prototype;

    p.init = function (el) {
        console.log(el);
        var _self = this;
        this.event = new EventEmitter();
        this.state = new TWIST.GameCanvas(el);
        
        this.event.on('destroy', function () {
            _self.state.destroy();
            _self.event.removeAllListeners();
        });
    };
    
    window.TWIST = window.TWIST || {};
    window.TWIST.Game = Game;
})();


