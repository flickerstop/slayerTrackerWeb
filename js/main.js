////////////////
// set version number
$( document ).ready(function() {
    getGEPrices();
    d3.select("#versionNum").text(versionNum);
    load();
    loadMonsters();
        
    
    setResources();
    changeState(0);

});

