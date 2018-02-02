////////////////
// set version number
$( document ).ready(function() {
    getGEPrices();
    d3.select("#versionNum").text("v"+versionNum);
    load();
    
    
    // Check if running on my computer to show testing buttons
    if(window.location.href == "http://192.168.2.168:8080/"){
        d3.select("#tableRowForTesting").style('display', null);
    }
    // check if url is for temp data
    if(window.location.href == "http://192.168.2.168:8080/?tempData" || window.location.href == "https://flickerstop.github.io/slayerTrackerWeb/?tempData"){
        loadTestPlayer();
    }

    

    if(player.cookieWarning == true){
        d3.select("#fullScreenWarning").style('display', 'none');
    }

    var globalClock = setInterval(clock, 500);

    loadMonsters();
    returnHome();
});

function closeWarning(){
    d3.select("#fullScreenWarning").style('display', 'none');
    player.cookieWarning = true;
    save();
}
/***************************************************
*            GLOBAL Clock                            
****************************************************/
function clock(){
    var rightNow = new Date().getTime();
    /****************************************************/
    /*            Farm Run Clock                        */
    /****************************************************/
    if(player.farmRun.onRun == true){
        var endTime = player.farmRun.lastRunAt+5400000;
        //var endTime = player.farmRun.lastRunAt+3000;

        if(endTime < rightNow && audio.duration > 0){
            audio.play();
            d3.select("#farmTimer").text("00:00:00");
            d3.select("#topBarFarmTimer").text("00:00:00");
        }else{
            d3.select("#farmTimer").text(msToTime(endTime-rightNow));
            d3.select("#topBarFarmTimer").text(msToTime(endTime-rightNow));
        }
        
    }else{
        d3.select("#farmTimer").text("00:00:00");
        d3.select("#topBarFarmTimer").text("00:00:00");
    }
    /****************************************************/
    /*            Corp Clock                            */
    /****************************************************/
    if(corpClock.isRunning){
        d3.select("#corpClock").text(msToTime(rightNow - corpClock.startTime));
        updateCorpDropGpInfo();
    }

    /****************************************************/
    /*            Slayer Clock                          */
    /****************************************************/
    if(slayerTask.isClockRunning){
        d3.select("#taskTimerTime").text(
            msToTime(
                rightNow - slayerTask.startTime.getTime()
            )
        );
    }

    /****************************************************/
    /*            Update GE Prices                      */
    /****************************************************/
    if(rightNow > timeGePricesUpdated+18000000 && timeGePricesUpdated != 0){
        console.log("5 hour timer: Updating GE Prices!");
        timeGePricesUpdated = 0;
        getGEPrices();
    }
    
}
