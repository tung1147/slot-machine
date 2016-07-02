/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {

    var canvas = document.getElementById('gameplayStage');
    var slotMachine = new TWIST.SlotMachine(canvas);


    window.addEventListener("resize", _autoFit, true);
    _autoFit();
    $('#spinButton').click(function () {
        slotMachine.emit("spin");
        setTimeout(function () {
            slotMachine.emit("endSpin", TWIST.SlotMachineLogic.generateMap());
        }, 2500);
    });



    function _autoFit() {
        var width = 1000, height = 467;
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var wRatio = windowWidth / width;
        var hRatio = windowHeight / height;
        var zoom = (wRatio > hRatio) ? hRatio : wRatio;
        zoom = zoom > 1 ? 1 : zoom;
        var left = (windowWidth - width * zoom) / 2;
        $(canvas).css({"zoom": zoom});
    }
    ;
})();
