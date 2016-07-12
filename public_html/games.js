/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    
    function SlotMachine(el) {
        this.initGame(el);
    }

    var p = SlotMachine.prototype = new TWIST.Game();

    p.initGame = function (el) {
        this.init(el);
    };
    window.TWIST = window.TWIST || {};
    window.TWIST.SlotMachine = SlotMachine;
})();


