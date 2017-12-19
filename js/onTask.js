var numberOfTrips = 0;
var startTime;
var endTime;
var isClockRunning = false;
var taskCount;
var taskMonster;
var taskType;

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
    endTime = new Date();
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
    taskType = type;
    switch(type){
        case 0: // Normal
            d3.select("#cannonballsLeftRow").style("display","none");
            d3.select("#chargesLeftRow").style("display","none");
            d3.select("#waterRunesLeftRow").style("display","none");
            d3.select("#bloodRunesLeftRow").style("display","none");
            d3.select("#deathRunesLeftRow").style("display","none");
            d3.select("#chaosRunesLeftRow").style("display","none");
            return;
        case 1: // Cannon
            d3.select("#cannonballsLeftRow").style("display",null);
            d3.select("#chargesLeftRow").style("display","none");
            d3.select("#waterRunesLeftRow").style("display","none");
            d3.select("#bloodRunesLeftRow").style("display","none");
            d3.select("#deathRunesLeftRow").style("display","none");
            d3.select("#chaosRunesLeftRow").style("display","none");
            return;
        case 2: // Trident
            d3.select("#cannonballsLeftRow").style("display","none");
            d3.select("#chargesLeftRow").style("display",null);
            d3.select("#waterRunesLeftRow").style("display","none");
            d3.select("#bloodRunesLeftRow").style("display","none");
            d3.select("#deathRunesLeftRow").style("display","none");
            d3.select("#chaosRunesLeftRow").style("display","none");
            return;
        case 3: // Burst
            d3.select("#cannonballsLeftRow").style("display","none");
            d3.select("#chargesLeftRow").style("display","none");
            d3.select("#waterRunesLeftRow").style("display",null);
            d3.select("#bloodRunesLeftRow").style("display","none");
            d3.select("#deathRunesLeftRow").style("display",null);
            d3.select("#chaosRunesLeftRow").style("display",null);
            return;
        case 4: // Burst Cannon
            d3.select("#cannonballsLeftRow").style("display",null);
            d3.select("#chargesLeftRow").style("display","none");
            d3.select("#waterRunesLeftRow").style("display",null);
            d3.select("#bloodRunesLeftRow").style("display","none");
            d3.select("#deathRunesLeftRow").style("display",null);
            d3.select("#chaosRunesLeftRow").style("display",null);
            return;
        case 5: // Barrage
            d3.select("#cannonballsLeftRow").style("display","none");
            d3.select("#chargesLeftRow").style("display","none");
            d3.select("#waterRunesLeftRow").style("display",null);
            d3.select("#bloodRunesLeftRow").style("display",null);
            d3.select("#deathRunesLeftRow").style("display",null);
            d3.select("#chaosRunesLeftRow").style("display","none");
            return;
        case 6: // Barrage Cannon
            d3.select("#cannonballsLeftRow").style("display",null);
            d3.select("#chargesLeftRow").style("display","none");
            d3.select("#waterRunesLeftRow").style("display",null);
            d3.select("#bloodRunesLeftRow").style("display",null);
            d3.select("#deathRunesLeftRow").style("display",null);
            d3.select("#chaosRunesLeftRow").style("display","none");
            return;
    }
}

function saveTask(){

    /////////////////////
    // Net Profit
    var totalProfit = 0;
    for(i = 1; i <= numberOfTrips; i++){
        totalProfit += parseInt($("#tripInput"+i).val());
    }
    /////////////////////
    // Time Taken
    if(endTime == null){
        endTime = new Date();
    }
    var timeTaken = msToTime(endTime.getTime() - startTime.getTime());
    var timeTakenMS = endTime.getTime() - startTime.getTime();
    var dateCompleted = endTime.getDate() + "/" + (endTime.getMonth()+1) + "/" + endTime.getFullYear();
    ////////////////////
    // Resource Amounts
    var cballsUsed = 0;
    var chargesUsed = 0;
    var waterUsed = 0;
    var bloodUsed = 0;
    var deathUsed = 0;
    var chaosUsed = 0;

    switch(taskType){
        case 1: // Cannon
            cballsUsed = player.cannonballs - parseInt($("#cannonballsLeftInput").val());
            return;
        case 2: // Trident
            chargesUsed = player.tridentCharges - parseInt($("#chargesLeftInput").val());
            return;
        case 3: // Burst
            waterUsed = player.runes.water - parseInt($("#waterRunesLeftInput").val());
            deathUsed = player.runes.death - parseInt($("#deathRunesLeftInput").val());
            chaosUsed = player.runes.chaos - parseInt($("#chaosRunesLeftInput").val());
            return;
        case 4: // Burst Cannon
            cballsUsed = player.cannonballs - parseInt($("#cannonballsLeftInput").val());
            waterUsed = player.runes.water - parseInt($("#waterRunesLeftInput").val());
            deathUsed = player.runes.death - parseInt($("#deathRunesLeftInput").val());
            chaosUsed = player.runes.chaos - parseInt($("#chaosRunesLeftInput").val());
            return;
        case 5: // Barrage
            waterUsed = player.runes.water - parseInt($("#waterRunesLeftInput").val());
            deathUsed = player.runes.death - parseInt($("#deathRunesLeftInput").val());
            bloodUsed = player.runes.blood - parseInt($("#bloodRunesLeftInput").val());
            return;
        case 6: // Barrage Cannon
            waterUsed = player.runes.water - parseInt($("#waterRunesLeftInput").val());
            deathUsed = player.runes.death - parseInt($("#deathRunesLeftInput").val());
            bloodUsed = player.runes.blood - parseInt($("#bloodRunesLeftInput").val());
            cballsUsed = player.cannonballs - parseInt($("#cannonballsLeftInput").val());
            return;
    }
    ///////////////////
    // Resource Cost
    var resourcesPrice = {
        cballs: cballsUsed * prices.cannonball,
        charges : chargesUsed * prices.tridentCharge,
        waterRunes : waterUsed * prices.waterRune,
        bloodRunes : bloodUsed * prices.bloodRune,
        deathRunes : deathUsed * prices.deathRune,
        chaosRunes : chaosUsed * prices.chaosRune
    }
    /////////////////
    // exp
    var exp = findMonster(taskMonster).slayerExp * taskCount;
    /////////////////
    // profit
    var profit = totalProfit - (
        resourcesPrice.cballs +
        resourcesPrice.charges +
        resourcesPrice.waterRunes +
        resourcesPrice.bloodRunes +
        resourcesPrice.deathRunes +
        resourcesPrice.chaosRunes
    );
    ////////////////
    // gp/xp per hr
    var minsTaken = timeTakenMS/1000/60;
    var gpMin = totalProfit/minsTaken;
    var xpMin = exp/minsTaken;

    var task = {
        count : taskCount,
        monster : taskMonster,
        netProfit : totalProfit,
        profit : profit,
        expGained : exp,
        type : taskType,
        resourcesUsed : {
            cballs: cballsUsed,
            charges : chargesUsed,
            waterRunes : waterUsed,
            bloodRunes : bloodUsed,
            deathRunes : deathUsed,
            chaosRunes : chaosUsed
        },
        resourcesPrice: resourcesPrice,
        timeTaken : timeTaken,
        timeTakenMS : timeTakenMS,
        gpMin: gpMin,
        xpMin: xpMin,
        dateCompleted: dateCompleted
    }

    console.log(task);
}