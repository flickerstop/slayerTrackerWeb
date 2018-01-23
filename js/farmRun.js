

function saveFarmRun(){

    if($("#farmRunInputNumOfHerbs").val() == ""){
        d3.select("#farmRunInputNumOfHerbs")
            .style("background-color","#902929")
            .transition().duration(2000)
            .style("background-color","rgb(39, 39, 39)");
        return;
    }

    var numberOfHerbs = parseInt($("#farmRunInputNumOfHerbs").val());
    var numberOfDead = parseInt($("#farmRunInputNumOfDead").val());
    var numberOfRes = parseInt($("#farmRunInputNumOfSuccessRes").val());
    var numberOfFailed = parseInt($("#farmRunInputNumOfFailRes").val());
    var numberOfCured = parseInt($("#farmRunInputNumOfCured").val());

    var netProfit = findItem(player.farmRun.settings.herbType).overall_average * numberOfHerbs;
    var resCost = (numberOfRes + numberOfFailed) * resurrectPrice();
    var costs = (player.farmRun.settings.numberOfPatches - numberOfCured - numberOfRes) * getSeedprice() + resCost;
    var profit = netProfit - costs;

    var endTime = new Date().getTime();

    // if you forgot to put in number of dead patches, it fills it for you
    if(numberOfDead == 0 && (numberOfRes > 0 || numberOfFailed > 0)){
        numberOfDead = numberOfRes + numberOfFailed;
    }

    var farmRun = {
        herbType: player.farmRun.settings.herbType,
        numberOfPatches:player.farmRun.settings.numberOfPatches,
        numberOfHerbs:numberOfHerbs,
        numberOfDead:numberOfDead,
        numberOfRes:numberOfRes,
        numberOfFailRes:numberOfFailed,
        numberOfCured:numberOfCured,
        money:{
            priceOfHerb:findItem(player.farmRun.settings.herbType).overall_average,
            priceOfSeed:getSeedprice(),
            netProfit:netProfit,
            costs:costs,
            profit:profit,
            resCost:resCost
        },
        timeCompleted: endTime
    };

    player.farmRun.lastRunAt = endTime;
    player.farmRun.runs.push(farmRun);
    resetFarmRunInputs();
    d3.select("#saveFarmRunButton")
        .text("Saved")
        .style("background-color","green")
        .transition().duration(2000)
        .style("background-color","#902929")
        .style("color","#902929")
        .on("end", function() { d3.select("#saveFarmRunButton").text("Save Run").transition().duration(500).style("color","white")}); 

    player.farmRun.onRun = true;
    save();
    setFarmRunFlavourText();
}

function resetFarmRunInputs(){
    $("#farmRunInputNumOfHerbs").val(null);
    $("#farmRunInputNumOfDead").val(0);
    $("#farmRunInputNumOfSuccessRes").val(0);
    $("#farmRunInputNumOfFailRes").val(0);
    $("#farmRunInputNumOfCured").val(0);

}

function setFarmRunFlavourText(){
    if(player.farmRun.settings.numberOfPatches == 0 || player.farmRun.settings.herbType == ""){
        d3.select("#farmInfo").text("WARNING: FARM RUN SETTINGS NOT SET! PLEASE GO TO SETTINGS!");
    }else{
        d3.select("#farmInfo").text("Currently running "+player.farmRun.settings.herbType+"s with " + player.farmRun.settings.numberOfPatches +" patches");
    }

    if(player.farmRun.runs.length == 0){
        return;
    }

    // RESET THINGS
    d3.select("#farmRunTableBody").html("");
    d3.select("#farmInfoTable").html("");

    var tableInfo = [
        "Number of Runs",
        "Number of Herbs",
        "Highest Collected",
        "Lowest Collected",
        "Average Collected",
        "Number of Dead Patches",
        "Chance of Death",
        "Number of Successful Resurrections",
        "Number of Failed Resurrections",
        "Number of Cured",
        "Net Profit",
        "Profit"
    ];

    var tableValues = [0,0,0,9999,0,0,0,0,0,0,0,0];
    for(i = 0; i < player.farmRun.runs.length; i++){
        // Number of runs
        tableValues[0]++;
        // Number of Herbs
        tableValues[1] += player.farmRun.runs[i].numberOfHerbs;
        // Highest Collected
        if(player.farmRun.runs[i].numberOfHerbs > tableValues[2]){
            tableValues[2] = player.farmRun.runs[i].numberOfHerbs;
        }
        // Lowest Collected
        if(player.farmRun.runs[i].numberOfHerbs < tableValues[3]){
            tableValues[3] = player.farmRun.runs[i].numberOfHerbs;
        }
        // average collected

        // Number of dead
        tableValues[5] += player.farmRun.runs[i].numberOfDead;
        // chance of death
        
        // Number of successful res
        tableValues[7] += player.farmRun.runs[i].numberOfRes;
        // Number of failed Res
        tableValues[8] += player.farmRun.runs[i].numberOfFailRes;
        // Number of Cured
        tableValues[9] += player.farmRun.runs[i].numberOfCured;
        // Net Profit
        tableValues[10] += player.farmRun.runs[i].money.netProfit;
        // Profit
        tableValues[11] += player.farmRun.runs[i].money.profit;
        //////////////////////////////////////////////////////////////
        var row = d3.select("#farmRunTableBody").append("tr");
        var time = new Date(player.farmRun.runs[i].timeCompleted);
        row.append("td").text(player.farmRun.runs[i].herbType).style("text-align","right");
        row.append("td").text(player.farmRun.runs[i].numberOfHerbs).style("text-align","right");
        row.append("td").text(player.farmRun.runs[i].money.profit.toLocaleString()).style("text-align","right");
        row.append("td").text(time.toLocaleTimeString()).style("text-align","right");
        row.append("td").text(time.toDateString()).style("text-align","right");
    }

    // Average Collected
    tableValues[4] = (tableValues[1]/tableValues[0]);
    tableValues[4] = (Math.round(tableValues[4]*10))/10;
    // Chance of Death
    tableValues[6] = (tableValues[5]/(tableValues[0]*player.farmRun.settings.numberOfPatches))*100;
    tableValues[6] = (Math.round(tableValues[6]*1000))/1000;
    tableValues[6] = tableValues[6] + "%";

    var table = d3.select("#farmInfoTable");

    for(i = 0; i < tableValues.length; i++){
        var row = table.append("tr");
        row.append("td").text(tableInfo[i]+":").style("text-align","right");
        row.append("td").text(tableValues[i].toLocaleString());
    }
}

function resurrectPrice(){
    var price =
    findItem("Soul rune").overall_average * 8 +
    findItem("Nature rune").overall_average * 12 +
    findItem("Blood rune").overall_average * 8 +
    findItem("Earth rune").overall_average * 25;

    return price;
}

function getSeedprice(){
    if(player.farmRun.settings.herbType == "Torstol"){
        return findItem("torstol seed").overall_average;
    }
    if(player.farmRun.settings.herbType == "Snapdragon"){
        return findItem("Snapdragon seed").overall_average;
    }
    if(player.farmRun.settings.herbType == "Ranarr Weed"){
        return findItem("Ranarr seed").overall_average;
    }
}

function farmRunClock(){
    if(player.farmRun.onRun == true){
        var endTime = player.farmRun.lastRunAt+5400000;
        //var endTime = player.farmRun.lastRunAt+3000;
        var date = new Date().getTime();

        if(endTime < date && audio.duration > 0){
            audio.play();
            d3.select("#farmTimer").text("00:00:00");
            d3.select("#topBarFarmTimer").text("00:00:00");
        }else{
            d3.select("#farmTimer").text(msToTime(endTime-date));
            d3.select("#topBarFarmTimer").text(msToTime(endTime-date));
        }
        
    }else{
        d3.select("#farmTimer").text("00:00:00");
        d3.select("#topBarFarmTimer").text("00:00:00");
    }
}

function stopTimer(){
    try{
        audio.pause();
        audio.currentTime = 0;
    }catch(err){

    }
    player.farmRun.onRun = false;
    save();
}