////////////////
// set version number
$( document ).ready(function() {

    // set the CORS proxy
    // jQuery.ajaxPrefilter(function(options) {
    //     if (options.crossDomain && jQuery.support.cors) {
    //         options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    //     }
    // });

    loadHomePageCards();
    getGEPrices();
    loadTypesOfSeeds();
    d3.select("#versionNum").text("v"+versionNum);
    load();
    
    
    // Check if running on my computer to show testing buttons
    if(window.location.href == "http://localhost:8080/"){
        d3.select("#testingCard").style('display', null);
        console.error("Local host, not grabbing CML data");
    }else{
        //getCMLData();
    }
    // check if url is for temp data
    if(window.location.href == "http://localhost:8080/?tempData" || window.location.href == "https://flickerstop.github.io/slayerTrackerWeb/?tempData"){
        loadTestPlayer();
    }

    

    if(player.cookieWarning == true){
        d3.select("#fullScreenWarning").style('display', 'none');
    }

    var globalClock = setInterval(clock, 500);

    loadMonsters();
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
        var endTime = player.farmRun.lastRunAt+4800000;
        //var endTime = player.farmRun.lastRunAt+3000;

        if(endTime < rightNow && audio.duration > 0){
            if(player.farmRun.remind){
                if(player.farmRun.remind){
                    audio.play();
                }
            }
            d3.select("#farmTimer").text("00:00:00");
            d3.select("#topBarFarmTimer").text("00:00:00");
            d3.select("#windowTitle").html("Jr2254's Slayer Tracker");
        }else{
            d3.select("#farmTimer").text(msToTime(endTime-rightNow));
            d3.select("#topBarFarmTimer").text(msToTime(endTime-rightNow));
            d3.select("#windowTitle").html(msToTime(endTime-rightNow));
        }
        
    }else{
        d3.select("#farmTimer").text("00:00:00");
        d3.select("#topBarFarmTimer").text("00:00:00");
        d3.select("#windowTitle").html("Jr2254's Slayer Tracker");
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
                rightNow - slayerTask.startTime.getTime() + slayerTask.pauseTime
            )
        );
    }

    /****************************************************/
    /*            Update GE Prices                      */
    /****************************************************/
    if(rightNow > timeGePricesUpdated+18000000 && timeGePricesUpdated != 0){
        console.log("5 hour timer: Updating GE Prices and CML!");
        timeGePricesUpdated = 0;
        getGEPrices();
        getCMLData();
    }
    /****************************************************/
    /*            Home page dailies card                */
    /****************************************************/
    var msToMidnightGMT = 8.64e7 - (rightNow % 8.64e7);
    d3.select("#dailiesCardTimers").html(msToTime(rightNow) + "<br />" + msToTime(msToMidnightGMT));
    
}
