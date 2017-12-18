var numberOfTrips = 0;
var startTime;
var isClockRunning = false;

function addTrip(){
    numberOfTrips++;
    var row = d3.select("#tripFields").append("div");
    row.attr("class","tripRow");

    row.append("p").attr("class","tripText").text("trip "+numberOfTrips+":");

    row.append("input")
    .attr("class","tripInput")
    .attr("id","tripInput"+numberOfTrips)
    .attr("min","0")
    .attr("max","2147483647")
    .attr("type","number")
    .attr("value","0");
}

function resetTrips(){
    numberOfTrips = 0;
    d3.select("#tripFields").html("");
}

function startTimer(){
    d3.select("#startTaskTimer").attr("disabled", "disabled");
    d3.select("#stopTaskTimer").attr("disabled", null);
    startTime = new Date();
    isClockRunning = true;
    runClock();
}

function stopTimer(){
    isClockRunning = false;
    d3.select("#startTaskTimer").attr("disabled", null);
    d3.select("#stopTaskTimer").attr("disabled", "disabled");
}
    
function runClock() {
    var today = new Date();

    d3.select("#taskTimerTime").text(
        msToTime(
            today.getTime() - startTime.getTime()
        )
    );
    if(isClockRunning){
        var t = setTimeout(runClock, 500);
    }
}

function msToTime(duration) {
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}

function switchTaskType(type){
    switch(type){
        case 0:
            d3.select("#cannonballsLeftRow").style("display","none");
            d3.select("#chargesLeftRow").style("display","none");
            d3.select("#waterRunesLeftRow").style("display","none");
            d3.select("#bloodRunesLeftRow").style("display","none");
            d3.select("#deathRunesLeftRow").style("display","none");
            d3.select("#chaosRunesLeftRow").style("display","none");
            return;
        case 1:
            d3.select("#cannonballsLeftRow").style("display",null);
            d3.select("#chargesLeftRow").style("display","none");
            d3.select("#waterRunesLeftRow").style("display","none");
            d3.select("#bloodRunesLeftRow").style("display","none");
            d3.select("#deathRunesLeftRow").style("display","none");
            d3.select("#chaosRunesLeftRow").style("display","none");
            return;
        case 2:
            d3.select("#cannonballsLeftRow").style("display","none");
            d3.select("#chargesLeftRow").style("display",null);
            d3.select("#waterRunesLeftRow").style("display","none");
            d3.select("#bloodRunesLeftRow").style("display","none");
            d3.select("#deathRunesLeftRow").style("display","none");
            d3.select("#chaosRunesLeftRow").style("display","none");
            return;
        case 3:
            d3.select("#cannonballsLeftRow").style("display","none");
            d3.select("#chargesLeftRow").style("display","none");
            d3.select("#waterRunesLeftRow").style("display",null);
            d3.select("#bloodRunesLeftRow").style("display","none");
            d3.select("#deathRunesLeftRow").style("display",null);
            d3.select("#chaosRunesLeftRow").style("display",null);
            return;
        case 4:
            d3.select("#cannonballsLeftRow").style("display",null);
            d3.select("#chargesLeftRow").style("display","none");
            d3.select("#waterRunesLeftRow").style("display",null);
            d3.select("#bloodRunesLeftRow").style("display","none");
            d3.select("#deathRunesLeftRow").style("display",null);
            d3.select("#chaosRunesLeftRow").style("display",null);
            return;
        case 5:
            d3.select("#cannonballsLeftRow").style("display","none");
            d3.select("#chargesLeftRow").style("display","none");
            d3.select("#waterRunesLeftRow").style("display",null);
            d3.select("#bloodRunesLeftRow").style("display",null);
            d3.select("#deathRunesLeftRow").style("display",null);
            d3.select("#chaosRunesLeftRow").style("display","none");
            return;
        case 6:
            d3.select("#cannonballsLeftRow").style("display",null);
            d3.select("#chargesLeftRow").style("display","none");
            d3.select("#waterRunesLeftRow").style("display",null);
            d3.select("#bloodRunesLeftRow").style("display",null);
            d3.select("#deathRunesLeftRow").style("display",null);
            d3.select("#chaosRunesLeftRow").style("display","none");
            return;
    }
}
