

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
    var costs = player.farmRun.settings.numberOfPatches * getSeedprice() + resCost;
    var profit = netProfit - costs;

    var endTime = new Date().getTime();
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
        var date = new Date().getTime();

        d3.select("#farmTimer").text(msToTime(endTime-date));

        if(endTime < date){
            audio = new Audio("./audio/alarm.wav");
            audio.play();
            player.farmRun.onRun = false;
            save();
        }
    }else{
        d3.select("#farmTimer").text("00:00:00");
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