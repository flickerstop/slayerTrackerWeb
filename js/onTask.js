var slayerTask = {
    numberOfTrips: 0,
    startTime: null,
    endTime: null,
    isClockRunning: false,
    taskCount: null,
    taskMonster: null,
    taskType: null
}




function addTrip(){
    slayerTask.numberOfTrips++;
    var row = d3.select("#tripFields").append("div");
    row.attr("class","tripRow");

    row.append("p").attr("class","tripText").text("trip "+slayerTask.numberOfTrips+":");

    row.append("input")
    .attr("class","tripInput")
    .attr("id","tripInput"+slayerTask.numberOfTrips)
    .attr("min","0")
    .attr("max","2147483647")
    .attr("type","number")
    .attr("value","0");
}

function startSlayerTimer(){
    d3.select("#startTaskTimer").attr("disabled", "disabled");
    d3.select("#stopTaskTimer").attr("disabled", null);
    slayerTask.startTime = new Date();
    slayerTask.isClockRunning = true;
}

function stopSlayerTimer(){
    slayerTask.isClockRunning = false;
    slayerTask.endTime = new Date();
    d3.select("#startTaskTimer").attr("disabled", null);
    d3.select("#stopTaskTimer").attr("disabled", "disabled");
}
    


function switchTaskType(type){
    slayerTask.taskType = type;
    d3.select("#cannonballsLeftRow").style("display","none");
    d3.select("#chargesLeftRow").style("display","none");
    d3.select("#waterRunesLeftRow").style("display","none");
    d3.select("#bloodRunesLeftRow").style("display","none");
    d3.select("#deathRunesLeftRow").style("display","none");
    d3.select("#chaosRunesLeftRow").style("display","none");
    switch(type){
        case 1: // Cannon
            d3.select("#cannonballsLeftRow").style("display",null);
            return;
        case 2: // Trident
            d3.select("#chargesLeftRow").style("display",null);
            return;
        case 3: // Burst
            d3.select("#waterRunesLeftRow").style("display",null);
            d3.select("#deathRunesLeftRow").style("display",null);
            d3.select("#chaosRunesLeftRow").style("display",null);
            return;
        case 4: // Burst Cannon
            d3.select("#cannonballsLeftRow").style("display",null);
            d3.select("#waterRunesLeftRow").style("display",null);
            d3.select("#deathRunesLeftRow").style("display",null);
            d3.select("#chaosRunesLeftRow").style("display",null);
            return;
        case 5: // Barrage
            d3.select("#waterRunesLeftRow").style("display",null);
            d3.select("#bloodRunesLeftRow").style("display",null);
            d3.select("#deathRunesLeftRow").style("display",null);
            return;
        case 6: // Barrage Cannon
            d3.select("#cannonballsLeftRow").style("display",null);
            d3.select("#waterRunesLeftRow").style("display",null);
            d3.select("#bloodRunesLeftRow").style("display",null);
            d3.select("#deathRunesLeftRow").style("display",null);
            return;
    }
}

function saveTask(){

    /////////////////////
    // Net Profit
    var totalProfit = 0;
    for(i = 1; i <= slayerTask.numberOfTrips; i++){
        totalProfit += parseInt($("#tripInput"+i).val());
    }
    /////////////////////
    // Time Taken
    if(slayerTask.endTime == null && slayerTask.startTime != null){
        slayerTask.endTime = new Date();
    }else if(slayerTask.endTime == null && slayerTask.startTime == null){
        slayerTask.startTime = new Date();
        slayerTask.endTime = new Date();
    }
    var timeTaken = msToTime(slayerTask.endTime.getTime() - slayerTask.startTime.getTime());
    var timeTakenMS = slayerTask.endTime.getTime() - slayerTask.startTime.getTime();
    var dateCompleted = slayerTask.endTime.getDate() + "/" + (slayerTask.endTime.getMonth()+1) + "/" + slayerTask.endTime.getFullYear();
    ////////////////////
    // Resource Amounts
    var cballsUsed = 0;
    var chargesUsed = 0;
    var waterUsed = 0;
    var bloodUsed = 0;
    var deathUsed = 0;
    var chaosUsed = 0;

    switch(slayerTask.taskType){
        case 1: // Cannon
            cballsUsed = player.cannonballs - parseInt($("#cannonballsLeftInput").val());
            player.cannonballs = parseInt($("#cannonballsLeftInput").val());
            break;
        case 2: // Trident
            chargesUsed = player.tridentCharges - parseInt($("#chargesLeftInput").val());
            player.tridentCharges = parseInt($("#chargesLeftInput").val());
            break;
        case 3: // Burst
            waterUsed = player.runes.water - parseInt($("#waterRunesLeftInput").val());
            deathUsed = player.runes.death - parseInt($("#deathRunesLeftInput").val());
            chaosUsed = player.runes.chaos - parseInt($("#chaosRunesLeftInput").val());
            player.runes.water = parseInt($("#waterRunesLeftInput").val());
            player.runes.death = parseInt($("#deathRunesLeftInput").val());
            player.runes.chaos = parseInt($("#chaosRunesLeftInput").val());
            break;
        case 4: // Burst Cannon
            cballsUsed = player.cannonballs - parseInt($("#cannonballsLeftInput").val());
            waterUsed = player.runes.water - parseInt($("#waterRunesLeftInput").val());
            deathUsed = player.runes.death - parseInt($("#deathRunesLeftInput").val());
            chaosUsed = player.runes.chaos - parseInt($("#chaosRunesLeftInput").val());
            player.cannonballs = parseInt($("#cannonballsLeftInput").val());
            player.runes.water = parseInt($("#waterRunesLeftInput").val());
            player.runes.death = parseInt($("#deathRunesLeftInput").val());
            player.runes.chaos = parseInt($("#chaosRunesLeftInput").val());
            break;
        case 5: // Barrage
            waterUsed = player.runes.water - parseInt($("#waterRunesLeftInput").val());
            deathUsed = player.runes.death - parseInt($("#deathRunesLeftInput").val());
            bloodUsed = player.runes.blood - parseInt($("#bloodRunesLeftInput").val());
            player.runes.water = parseInt($("#waterRunesLeftInput").val());
            player.runes.death = parseInt($("#deathRunesLeftInput").val());
            player.runes.blood = parseInt($("#bloodRunesLeftInput").val());
            break;
        case 6: // Barrage Cannon
            waterUsed = player.runes.water - parseInt($("#waterRunesLeftInput").val());
            deathUsed = player.runes.death - parseInt($("#deathRunesLeftInput").val());
            bloodUsed = player.runes.blood - parseInt($("#bloodRunesLeftInput").val());
            cballsUsed = player.cannonballs - parseInt($("#cannonballsLeftInput").val());
            player.cannonballs = parseInt($("#cannonballsLeftInput").val());
            player.runes.water = parseInt($("#waterRunesLeftInput").val());
            player.runes.death = parseInt($("#deathRunesLeftInput").val());
            player.runes.blood = parseInt($("#bloodRunesLeftInput").val());
            break;
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
    var totalResourcePrice = 
        cballsUsed * prices.cannonball+
        chargesUsed * prices.tridentCharge+
        waterUsed * prices.waterRune+
        bloodUsed * prices.bloodRune+
        deathUsed * prices.deathRune+
        chaosUsed * prices.chaosRune;
    /////////////////
    // exp
    var exp = findMonster(slayerTask.taskMonster).slayerExp * slayerTask.taskCount;
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
        count : slayerTask.taskCount,
        monster : slayerTask.taskMonster,
        netProfit : totalProfit,
        profit : profit,
        expGained : exp,
        type : slayerTask.taskType,
        resourcesUsed : {
            cballs: cballsUsed,
            charges : chargesUsed,
            waterRunes : waterUsed,
            bloodRunes : bloodUsed,
            deathRunes : deathUsed,
            chaosRunes : chaosUsed
        },
        resourcesPrices: resourcesPrice,
        resourcesPriceTotal : totalResourcePrice,
        timeTaken : timeTaken,
        timeTakenMS : timeTakenMS,
        gpMin: gpMin,
        xpMin: xpMin,
        dateCompleted: dateCompleted
    }
    player.tasks.push(task);
    save();
    returnHome();
    //console.log(task);
}

function resetOnTask(){
    d3.select("#tripFields").html("");

    $("#waterRunesLeftInput").val(0);
    $("#deathRunesLeftInput").val(0);
    $("#bloodRunesLeftInput").val(0);
    $("#cannonballsLeftInput").val(0);
    $("#chaosRunesLeftInput").val(0);
    $("#chargesLeftInput").val(0);

    switchTaskType(0);
    document.getElementById('defaultTaskType').checked = true;

    d3.select("#taskTimerTime").text("00:00:00");
    var slayerTask = {
        numberOfTrips: 0,
        startTime: null,
        endTime: null,
        isClockRunning: false,
        taskCount: null,
        taskMonster: null,
        taskType: null
    }
}