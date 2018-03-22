var currentFarmData;

/***************************************************
*            Save Farm Run
****************************************************/
function saveFarmRun(){

    if($("#farmRunInputNumOfHerbs").val() == ""){
        d3.select("#farmRunInputNumOfHerbs")
            .style("background-color","#902929")
            .transition().duration(2000)
            .style("background-color","rgb(39, 39, 39)");
        return;
    }

    var numberOfHerbs = getValueFromId("#farmRunInputNumOfHerbs");
    var numberOfDead = getValueFromId("#farmRunInputNumOfDead");
    var numberOfRes = getValueFromId("#farmRunInputNumOfSuccessRes");
    var numberOfFailed = getValueFromId("#farmRunInputNumOfFailRes");
    var numberOfCured = getValueFromId("#farmRunInputNumOfCured");

    var netProfit = findItem(player.farmRun.settings.herbType).overall_average * numberOfHerbs;
    var resCost = (numberOfRes + numberOfFailed) * resurrectPrice();
    var costs = (player.farmRun.settings.numberOfPatches - numberOfCured - numberOfRes) * getSeedprice(player.farmRun.settings.herbType) + resCost;
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
            priceOfSeed:getSeedprice(player.farmRun.settings.herbType),
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

/***************************************************
*            Reset input fields
****************************************************/

function resetFarmRunInputs(){
    $("#farmRunInputNumOfHerbs").val(null);
    $("#farmRunInputNumOfDead").val(0);
    $("#farmRunInputNumOfSuccessRes").val(0);
    $("#farmRunInputNumOfFailRes").val(0);
    $("#farmRunInputNumOfCured").val(0);

}

/***************************************************
*            Set text for farm run data
****************************************************/
function setFarmRunFlavourText(){
    if(player.farmRun.settings.numberOfPatches == 0 || player.farmRun.settings.herbType == ""){
        d3.select("#farmInfo").text("WARNING: FARM RUN SETTINGS NOT SET! PLEASE GO TO SETTINGS!")
            .style("color","red");
        d3.select("#farmRunInputContainer").style('display','none');
    }else{
        d3.select("#farmInfo").text("Currently running "+player.farmRun.settings.herbType+"s with " + player.farmRun.settings.numberOfPatches +" patches")
            .style("color",null);
        d3.select("#farmRunInputContainer").style('display',null);
    }

    if(player.farmRun.runs.length == 0){
        return;
    }
}

function setFarmData(runs){
    // RESET THINGS
    d3.select("#farmRunTableBody").html("");
    d3.select("#farmInfoTable").html("");

    var tableInfo = [
        "Number of Runs",
        "Number of Herbs",
        "Highest Run",
        "Lowest Run",
        "Average Run",
        "Number of Dead Patches",
        "Chance of Death",
        "Number of Successful Resurrections",
        "Number of Failed Resurrections",
        "Number of Cured",
        "Net Profit",
        "Profit",
        "Avg. Profit Per Run",
        "Number of Seeds Used",
        "Net Profit Per Seed",
        "Profit Per Seed",
        "Avg. Herbs Per Seed"
    ];

    var tableValues = [0,0,0,9999,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var totalSuccess = 0; // Total number of successful plants
    for(i = 0; i < runs.length; i++){
        // Number of runs
        tableValues[0]++;
        // Number of Herbs
        tableValues[1] += runs[i].numberOfHerbs;
        // Highest Collected
        if(runs[i].numberOfHerbs > tableValues[2]){
            tableValues[2] = runs[i].numberOfHerbs;
        }
        // Lowest Collected
        if(runs[i].numberOfHerbs < tableValues[3]){
            tableValues[3] = runs[i].numberOfHerbs;
        }
        // average collected

        // Number of dead
        tableValues[5] += runs[i].numberOfDead;
        // chance of death
        
        // Number of successful res
        tableValues[7] += runs[i].numberOfRes;
        // Number of failed Res
        tableValues[8] += runs[i].numberOfFailRes;
        // Number of Cured
        tableValues[9] += runs[i].numberOfCured;
        // Net Profit
        tableValues[10] += runs[i].money.netProfit;
        // Profit
        tableValues[11] += runs[i].money.profit;
        //Avg profit
        tableValues[12] += roundToOneDecimal(runs[i].money.profit/runs.length);
        // Total Success
        totalSuccess += 7 - runs[i].numberOfDead - runs[i].numberOfCured;
        //////////////////////////////////////////////////////////////
        var row = d3.select("#farmRunTableBody").append("tr");
        row.on("click",function(i){return function(){editFarmRun(i)}}(i));
        var time = new Date(runs[i].timeCompleted);
        row.append("td").text(runs[i].herbType).style("text-align","right");
        row.append("td").text(runs[i].numberOfHerbs).style("text-align","right");
        row.append("td").text(runs[i].money.profit.toLocaleString()).style("text-align","right");
        row.append("td").text(time.toLocaleTimeString()).style("text-align","right");
        row.append("td").text(time.toDateString()).style("text-align","right");
    }

    // Average Collected
    tableValues[4] = (tableValues[1]/tableValues[0]);
    tableValues[4] = roundToOneDecimal(tableValues[4]);
    // Chance of Death
    tableValues[6] = (tableValues[5]/(tableValues[0]*player.farmRun.settings.numberOfPatches))*100;
    tableValues[6] = roundToTwoDecimal(tableValues[6]);
    tableValues[6] = tableValues[6] + "%";
    // Total Seeds Used
    tableValues[13] = totalSuccess;
    // Net Avg $ per seed
    tableValues[14] = roundToOneDecimal(tableValues[10]/totalSuccess);
    // $ per seed
    tableValues[15] = roundToOneDecimal((tableValues[10]/totalSuccess) - getSeedprice(runs[0].herbType));
    // Herbs per Seed
    tableValues[16] = roundToOneDecimal(tableValues[1]/totalSuccess);

    var table = d3.select("#farmInfoTable");

    for(i = 0; i < tableValues.length; i++){
        var row = table.append("tr");
        row.append("td").text(tableInfo[i]+":").style("text-align","right");
        row.append("td").text(tableValues[i].toLocaleString()).attr("class","cyanText");
    }
    drawFarmDataGraph(runs);
    currentFarmData = runs;
}

/***************************************************
*            Get price for Resurrect
****************************************************/

function resurrectPrice(){
    var price =
    findItem("Soul rune").overall_average * 8 +
    findItem("Nature rune").overall_average * 12 +
    findItem("Blood rune").overall_average * 8 +
    findItem("Earth rune").overall_average * 25;

    return price;
}

/***************************************************
*            Get Price for seeds
****************************************************/

function getSeedprice(seedType){
    if(seedType == "Torstol"){
        return findItem("torstol seed").overall_average;
    }
    if(seedType == "Snapdragon"){
        return findItem("Snapdragon seed").overall_average;
    }
    if(seedType == "Ranarr Weed"){
        return findItem("Ranarr seed").overall_average;
    }
}

/***************************************************
*            Stop the farm timer
****************************************************/

function stopTimer(){
    try{
        audio.pause();
        audio.currentTime = 0;
    }catch(err){

    }
    player.farmRun.onRun = false;
    save();
}

/***************************************************
*            Draw the graph for data
****************************************************/

function drawFarmDataGraph(runs){
    d3.select("#farmDataGraph").html("");

    /***************************************************
    *            Get data for graph
    ****************************************************/
    var lowestRun = 99999999;
    var highestRun = 0;
    var numOfHerbs = 0;
    var dataset = [];
    var dataset2 = [];
    var i = 0;
    for(var currentRun of runs){
        i++;
        // Highest Collected
        if(currentRun.numberOfHerbs > highestRun){
            highestRun = currentRun.numberOfHerbs;
        }
        // Lowest Collected
        if(currentRun.numberOfHerbs < lowestRun){
            lowestRun = currentRun.numberOfHerbs;
        }
        // add current run
        dataset.push({y:currentRun.numberOfHerbs});

        numOfHerbs += currentRun.numberOfHerbs;

        dataset2.push({y:(numOfHerbs/i)});
    }

    // 2. Use the margin convention practice 
    var margin = {top: 50, right: 50, bottom: 50, left: 50}, 
    width = document.getElementById('mainPanel').offsetWidth - margin.left - margin.right, 
    height = 400 - margin.top - margin.bottom;

    // The number of datapoints
    var n = runs.length;

    /***************************************************
    *            Axies
    ****************************************************/
    var xScale = d3.scaleLinear()
        .domain([0, n-1]) // input
        .range([0, width]); // output

    var yScale = d3.scaleLinear()
        .domain([lowestRun, highestRun]) // input 
        .range([height, 0]); // output 

    /***************************************************
    *            Draw the line
    ****************************************************/
    var line = d3.line()
        .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
        .y(function(d) { return yScale(d.y); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX); // apply smoothing to the line


    /***************************************************
    *            Draw the graph for data
    ****************************************************/
    var svg = d3.select("#farmDataGraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    /***************************************************
    *            Draw the axies
    ****************************************************/
    svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    svg.append("g")
        .attr("class", "yaxis")
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    /***************************************************
    *            Draw the line
    ****************************************************/
    svg.append("path")
        .datum(dataset2) // 10. Binds data to the line 
        .attr("class", "line2") // Assign a class for styling 
        .attr("d", line); // 11. Calls the line generator 

    svg.append("path")
        .datum(dataset) // 10. Binds data to the line 
        .attr("class", "line") // Assign a class for styling 
        .attr("d", line); // 11. Calls the line generator 

    

    /***************************************************
    *            Draw the dots
    ****************************************************/
    svg.selectAll(".dot")
        .data(dataset)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d, i) { return xScale(i) })
        .attr("cy", function(d) { return yScale(d.y) })
        .attr("r", 5);
        
}

function adjustGraphWidth(){
    drawFarmDataGraph(currentFarmData);
}

/***************************************************
*            Check farm runs for errors
****************************************************/
/* Added this because I had errors once due to cors proxy*/
function checkFarmRuns(){
    var anyFixed = false;
    for(var i = 0; i < player.farmRun.runs.length; i++){
        var run = player.farmRun.runs[i];
        if(run.money.profit == null){
            var netProfit = findItem(run.herbType).overall_average * run.numberOfHerbs;
            var resCost = (run.numberOfRes + run.numberOfFailRes) * resurrectPrice();
            var costs = (player.farmRun.settings.numberOfPatches - run.numberOfCured - run.numberOfRes) * getSeedprice(run.herbType) + resCost;
            var profit = netProfit - costs;

            var money = {
                costs: costs,
                netProfit: netProfit,
                priceOfHerb: findItem(run.herbType).overall_average,
                priceOfSeed: getSeedprice(run.herbType),
                profit: profit,
                resCost: resCost
            };

            player.farmRun.runs[i].money = money;
            anyFixed = true;
        }
        // Saving seed prices was broken for a long time and I didn't notice
        if(run.money.priceOfSeed == null){
            run.money.priceOfSeed = (run.money.costs - run.money.resCost)/(run.numberOfPatches-run.numberOfCured-run.numberOfRes);

            anyFixed = true;
        }
    }

    if(anyFixed){
        console.error("Error(s) found in farm run data.\nError fixed.");
        save();
    }
}

/***************************************************
*            Get a list of all herbs ran
****************************************************/

function getListOfHerbsRan(){
    var typesOfHerbs = [];
    for(run of player.farmRun.runs){
        var isAdded = false;
        for(type of typesOfHerbs){
            if(run.herbType == type){
                isAdded = true;
            }
        }
        if(!isAdded){
            typesOfHerbs.push(run.herbType);
        }
    }
    return typesOfHerbs;
}

/***************************************************
*            Get all runs of a type of herb
****************************************************/

function getRunsOfType(type){
    if(type == "all"){
        return player.farmRun.runs;
    }
    var runs = [];

    for(run of player.farmRun.runs){
        if(run.herbType == type){
            runs.push(run);
        }
    }

    return runs;
}

/***************************************************
*            Herb Type Buttons
****************************************************/

function setHerbTypeButtons(){
    var row = d3.select("#herbTypeButtons");
    row.html("");
    var numberOfTypes = getListOfHerbsRan().length+1;

    // If there is more than 1 type of herb ran
    if(numberOfTypes > 2){
        row.append("div").style("width",(100/numberOfTypes)+"%").html("All").on("click",onTypeButton("all"));

        for(type of getListOfHerbsRan()){
            row.append("div")
                .style("width","calc( "+(100/numberOfTypes)+"% - 15px)")
                .html(type)
                .on("click",onTypeButton(type));
        }
    }

    function onTypeButton(type){
        return function(){
            setFarmData(getRunsOfType(type));
        }
    }
}

/***************************************************
*            Get info on each seed to plant
****************************************************/

function getSeedDetails(){
    var seeds = [];

    var avgHerbPerSeed = 0;
    for(var i = 0; i < player.farmRun.runs.length; i++){
        var currentRun = player.farmRun.runs[i];
        avgHerbPerSeed += (currentRun.numberOfHerbs/(
            player.farmRun.settings.numberOfPatches - 
            currentRun.numberOfCured -
            currentRun.numberOfDead));
    }
    avgHerbPerSeed = avgHerbPerSeed/player.farmRun.runs.length;

    if(avgHerbPerSeed < 7.5){
        avgHerbPerSeed = 7.5;
    }

    for(var seed of typesOfSeedsForFarming){
        var temp = seed;
        temp.priceOfSeed = findItem(seed.seedName).sell_average;
        temp.priceOfHerb = findItem(seed.herbName).sell_average;
        temp.netProfit = temp.priceOfHerb * avgHerbPerSeed;
        temp.profit = temp.netProfit - temp.priceOfSeed;
        temp.avgHerbPerSeed = avgHerbPerSeed;
        seeds.push(temp);
    }
    return seeds;
}

function showSeedDetailsPopup(){
    var seeds = getSeedDetails();

    setPopupTitle("Profit Per Seed");
    var body = getPopupBody();
    body.append("div")
        .attr("class","settingsRow")
        .html("Data using YOUR average of " + roundToOneDecimal(seeds[0].avgHerbPerSeed) + " herbs per seed")
        .style("text-align","center")
        .style("line-height","40px");

    var table = body.append("table").style("width","100%");
    for(var seed of seeds){
        var row = table.append("tr").style("padding","10px");
        row.append("td").html(seed.herbName).style("text-align","right").style("width","50%").style("padding-right","10px");
        row.append("td").html(roundToTwoDecimal(seed.profit).toLocaleString());
    }

    openPopup();
}