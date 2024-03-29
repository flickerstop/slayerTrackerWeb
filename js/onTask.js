var slayerTask = {
    numberOfTrips: 0,
    startTime: null,
    endTime: null,
    isClockRunning: false,
    taskCount: null,
    taskMonster: null,
    taskType: null,
    pauseTime: 0
}




function addTrip(){
    slayerTask.numberOfTrips++;
    var row = d3.select("#tripFields").append("div");
    row.attr("class","tripRow");

    row.append("p").attr("class","tripText noHighlight").text("Trip #"+slayerTask.numberOfTrips+":");

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
    d3.select("#pauseTaskTimer").attr("disabled", null);
    slayerTask.startTime = new Date();
    slayerTask.isClockRunning = true;
}

function stopSlayerTimer(){
    slayerTask.isClockRunning = false;
    slayerTask.endTime = new Date();
    d3.select("#startTaskTimer").attr("disabled", null);
    d3.select("#stopTaskTimer").attr("disabled", "disabled");
    d3.select("#pauseTaskTimer").attr("disabled", "disabled");
}

function pauseSlayerTimer(){
    stopSlayerTimer();
    slayerTask.pauseTime += slayerTask.endTime.getTime() - slayerTask.startTime.getTime();
    slayerTask.startTime = null;
    slayerTask.endTime = null;
}
    


function switchTaskType(type){
    slayerTask.taskType = type;
    //////////////////////////////
    // Hide Rows
    d3.select("#cannonballsLeftRow").style("display","none");
    d3.select("#chargesLeftRow").style("display","none");
    d3.select("#waterRunesLeftRow").style("display","none");
    d3.select("#bloodRunesLeftRow").style("display","none");
    d3.select("#deathRunesLeftRow").style("display","none");
    d3.select("#chaosRunesLeftRow").style("display","none");
    /////////////////////////////
    // Draw radio Boxes
    var nameOfDivs = ["defaultTaskType",
                "cannonTaskType",
                "tridentTaskType",
                "burstTaskType",
                "burstCanonTaskType",
                "barrageTaskType",
                "barrageCannonTaskType"];
    
    var textForDivs = [ "Normal",
                        "Cannon",
                        "Trident",
                        "Ice Burst",
                        "Ice Burst and Cannon",
                        "Ice Barrage",
                        "Ice Barrage and Cannon"];

    for(var i = 0; i < nameOfDivs.length; i++){
        d3.select("#"+nameOfDivs[i]).html("");
        if(i == slayerTask.taskType){
            d3.select("#"+nameOfDivs[i]).append("div").attr("class", "radioButtonIcon").style("background-image",'url("./images/icons/global/radio_button_checked.png")');
        }else{
            d3.select("#"+nameOfDivs[i]).append("div").attr("class", "radioButtonIcon").style("background-image",'url("./images/icons/global/radio_button.png")');
        }
        d3.select("#"+nameOfDivs[i]).append("p").text(textForDivs[i]);
    }

    

    /////////////////////////////
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
        totalProfit += getValueFromId("#tripInput"+i);
    }
    /////////////////////
    // Time Taken
    if(slayerTask.endTime == null && slayerTask.startTime != null){
        slayerTask.endTime = new Date();
    }else if(slayerTask.endTime == null && slayerTask.startTime == null){
        slayerTask.startTime = new Date();
        slayerTask.endTime = new Date();
    }
    var timeTakenMS = slayerTask.endTime.getTime() - slayerTask.startTime.getTime() + slayerTask.pauseTime;
    var timeTaken = msToTime(timeTakenMS);
    var dateCompleted = slayerTask.endTime.getDate() + "/" + (slayerTask.endTime.getMonth()+1) + "/" + slayerTask.endTime.getFullYear();
    ////////////////////
    // Resource Amounts
    var task = {
        type : slayerTask.taskType,
        cballsUsed : 0,
        chargesUsed : 0,
        waterUsed : 0,
        bloodUsed : 0,
        deathUsed : 0,
        chaosUsed : 0
    };

    // slayerTask.taskType
    // 1 - cannon
    // 2 - Trident
    // 3 - Burst
    // 4 - Burst Cannon
    // 5 - Barrage
    // 6 - Barrage Cannon

    // Cannons
    if(task.type == 1 || task.type == 4 || task.type == 6){
        task.cballsUsed = player.slayerItems.cannonballs - getValueFromId("#cannonballsLeftInput");
        player.slayerItems.cannonballs = getValueFromId("#cannonballsLeftInput");
    }

    // Trident
    if(task.type == 2){
        task.chargesUsed = player.slayerItems.tridentCharges - getValueFromId("#chargesLeftInput");
        player.slayerItems.tridentCharges = getValueFromId("#chargesLeftInput");
    }

    // Burst
    if(task.type == 3 || task.type == 4){
        task.waterUsed = player.slayerItems.runes.water - getValueFromId("#waterRunesLeftInput");
        task.deathUsed = player.slayerItems.runes.death - getValueFromId("#deathRunesLeftInput");
        task.chaosUsed = player.slayerItems.runes.chaos - getValueFromId("#chaosRunesLeftInput");
        player.slayerItems.runes.water = getValueFromId("#waterRunesLeftInput");
        player.slayerItems.runes.death = getValueFromId("#deathRunesLeftInput");
        player.slayerItems.runes.chaos = getValueFromId("#chaosRunesLeftInput");
    }
    // Barrage
    if(task.type == 5 || task.type == 6){
        task.waterUsed = player.slayerItems.runes.water - getValueFromId("#waterRunesLeftInput");
        task.deathUsed = player.slayerItems.runes.death - getValueFromId("#deathRunesLeftInput");
        task.bloodUsed = player.slayerItems.runes.blood - getValueFromId("#bloodRunesLeftInput");
        player.slayerItems.runes.water = getValueFromId("#waterRunesLeftInput");
        player.slayerItems.runes.death = getValueFromId("#deathRunesLeftInput");
        player.slayerItems.runes.blood = getValueFromId("#bloodRunesLeftInput");
    }
    ///////////////////
    // Resource Cost
    var resourcesPrice = {
        cballs: task.cballsUsed * prices.cannonball,
        charges : task.chargesUsed * prices.tridentCharge,
        waterRunes : task.waterUsed * prices.waterRune,
        bloodRunes : task.bloodUsed * prices.bloodRune,
        deathRunes : task.deathUsed * prices.deathRune,
        chaosRunes : task.chaosUsed * prices.chaosRune
    }
    var totalResourcePrice = 
        task.cballsUsed * prices.cannonball+
        task.chargesUsed * prices.tridentCharge+
        task.waterUsed * prices.waterRune+
        task.bloodUsed * prices.bloodRune+
        task.deathUsed * prices.deathRune+
        task.chaosUsed * prices.chaosRune;
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

    var finishedTask = {
        count : slayerTask.taskCount,
        monster : slayerTask.taskMonster,
        netProfit : totalProfit,
        profit : profit,
        expGained : exp,
        type : slayerTask.taskType,
        resourcesUsed : {
            cballs: task.cballsUsed,
            charges : task.chargesUsed,
            waterRunes : task.waterUsed,
            bloodRunes : task.bloodUsed,
            deathRunes : task.deathUsed,
            chaosRunes : task.chaosUsed
        },
        resourcesPrices: resourcesPrice,
        resourcesPriceTotal : totalResourcePrice,
        timeTaken : timeTaken,
        timeTakenMS : timeTakenMS,
        gpMin: gpMin,
        xpMin: xpMin,
        dateCompleted: dateCompleted
    }
    player.tasks.push(finishedTask);
    save();
    returnHome();
    resetOnTask();
}

function resetOnTask(){
    slayerTask = {
        numberOfTrips: 0,
        startTime: null,
        endTime: null,
        isClockRunning: false,
        taskCount: null,
        taskMonster: null,
        taskType: null,
        pauseTime: 0
    }
    d3.select("#tripFields").html("");

    resetIdValue("#waterRunesLeftInput");
    resetIdValue("#deathRunesLeftInput");
    resetIdValue("#bloodRunesLeftInput");
    resetIdValue("#cannonballsLeftInput");
    resetIdValue("#chaosRunesLeftInput");
    resetIdValue("#chargesLeftInput");

    d3.select("#startTaskTimer").attr("disabled", null);
    d3.select("#stopTaskTimer").attr("disabled", "disabled");
    d3.select("#pauseTaskTimer").attr("disabled", "disabled");

    switchTaskType(0);
    document.getElementById('defaultTaskType').checked = true;

    d3.select("#taskTimerTime").text("00:00:00");
    
}

