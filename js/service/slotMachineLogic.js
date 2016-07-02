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
                    map[x][y] = isNaN(value) ?  Math.floor(Math.random() * 12) : value;
                }
            }
            return map; 
        }
    };
    window.TWIST = window.TWIST || {};
    window.TWIST.SlotMachineLogic = SlotMachineLogic;
})();


