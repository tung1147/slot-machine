/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {

    var canvas = document.getElementById('gameplayStage');
    var slotMachine = new TWIST.SlotMachine(canvas);

    init();

    function init() {
        
        slotMachine.emit("info",TWIST.SlotMachineLogic.getInfo());
        
        slotMachine.on("spin",function () {
            var activeLines = slotMachine.activeLines;
            var betting = slotMachine.info.betting;
            setTimeout(function () {
                var explodePot = $('#cheater #explode-pot').is(':checked');
                console.log(explodePot);
                var result = TWIST.SlotMachineLogic.getResult(activeLines,betting,{explodePot : explodePot} );
                slotMachine.emit("endSpin", result);
            }, 1000);
        });
        
        window.addEventListener("resize", _autoFit, true);
        _autoFit();
        
        
    }

    function _autoFit() {
        var width = $(canvas).attr('width'), height = $(canvas).attr('height');
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var wRatio = windowWidth / width;
        var hRatio = windowHeight / height;
        var zoom = (wRatio > hRatio) ? hRatio : wRatio;
        zoom = zoom > 1 ? 1 : zoom;
        var left = (windowWidth - width * zoom) / 2;
        $('#wrapper').css({"zoom": zoom});
    }
})();
