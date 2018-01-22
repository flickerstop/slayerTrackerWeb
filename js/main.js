////////////////
// set version number
$( document ).ready(function() {
    getGEPrices();
    d3.select("#versionNum").text("v"+versionNum);
    load();
    loadMonsters();
    
    
    setResources();
    changeState(4);

    if(player.cookieWarning == true){
        d3.select("#fullScreenWarning").style('display', 'none');
    }

    var farmRunTimer = setInterval(farmRunClock, 500);
});





function closeWarning(){
    d3.select("#fullScreenWarning").style('display', 'none');
    player.cookieWarning = true;
    save();
}
