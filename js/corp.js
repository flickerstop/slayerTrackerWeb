

/***************************************************
*            Global Variables                            
****************************************************/
var corpDrops;
var currentCorpRun = [];
var corpClock = {
    startTime : 0,
    endTime : 0,
    isRunning : false,
    dropValue : 0
};
var corpRunData = {};

/***************************************************
*            Add the cards that show drops                            
****************************************************/
function addCorpDrops(){
    $.getJSON("./js/json/corp.json", function(json) {
        corpDrops = json;

        for(i = 0; i < corpDrops.length; i++){
            d3.select("#corpDropButtons").append('div')
            .attr('class',"dropCard dropTooltip")
            .on("click",onRecievedCorpDrop(i))
            .attr("style","background-image: url(\"./images/bossDrops/"+corpDrops[i].imgName+"\")")
            .append('span')
            .attr("class","dropTooltiptext")
            .html(corpDrops[i].name);
        }
    });
}

/***************************************************
*            When a drop card is clicked                            
****************************************************/

function onRecievedCorpDrop(i){
    return function(){
        currentCorpRun.push(corpDrops[i]);
        updateCorpDrops();
    }
}

/***************************************************
*            Update Corp Drops                          
****************************************************/

function updateCorpDrops(){
    d3.select("#corpDrops").html("");
    var newDrops = corpDrops;
    // add drop count to the new array
    for(j = 0; j < newDrops.length; j++){
        newDrops[j].count = 0;
    }
    // add up all the drops
    for(i = 0; i < currentCorpRun.length; i++){
        for(j = 0; j < newDrops.length; j++){
            if(currentCorpRun[i].name == newDrops[j].name){
                newDrops[j].count += newDrops[j].dropCount;
            }
        }
    }
    // add to string
    var dropString = "";
    corpClock.dropValue = 0;
    for(j = 0; j < newDrops.length; j++){
        if(newDrops[j].count > 0){
            dropString += newDrops[j].count + " " + newDrops[j].name + "<br />";
            if(findItem(newDrops[j].name) != null){ // check if item exists (pet doesn't)
                if(newDrops[j].name == "Elysian sigil"){
                    corpClock.dropValue += findItem("Elysian spirit shield").overall_average * newDrops[j].count;
                }else if(newDrops[j].name == "Spectral sigil"){
                    corpClock.dropValue += findItem("Spectral spirit shield").overall_average * newDrops[j].count;
                }else if(newDrops[j].name == "Arcane sigil"){
                    corpClock.dropValue += findItem("Arcane spirit shield").overall_average * newDrops[j].count;
                }else if(newDrops[j].name == "Holy elixir"){
                    corpClock.dropValue += 670000 * newDrops[j].count;
                }else{
                    corpClock.dropValue += findItem(newDrops[j].name).overall_average * newDrops[j].count;
                }
            }
        }
    }

    d3.select("#corpDrops").html(dropString);

}

function updateCorpDropGpInfo(){
    corpRunData = {};
    var numberOfPlayers = parseInt($("#corpNumberOfPlayers").val());
    corpRunData.numberOfPlayers = numberOfPlayers;
    var tableRow = d3.select("#corpRunGpInfoRow");
    tableRow.html("");

    var numOfHours = 0;
    if(corpClock.startTime > 0){
        numOfHours = (new Date().getTime() - corpClock.startTime)/3600000;
    }
    corpRunData.numberOfHours = numOfHours;
    // Total Gp
    tableRow.append("td").text(corpClock.dropValue.toLocaleString());
    corpRunData.totalGp = corpClock.dropValue;
    // Per person Gp
    tableRow.append("td").text(roundToOneDecimal(corpClock.dropValue/numberOfPlayers).toLocaleString());
    corpRunData.perPersonGp = roundToOneDecimal(corpClock.dropValue/numberOfPlayers);
    // total gp/hr
    tableRow.append("td").text(roundToTwoDecimal(corpClock.dropValue/numOfHours).toLocaleString());
    corpRunData.totalGpHr = roundToTwoDecimal(corpClock.dropValue/numOfHours);
    // per person gp/hr
    tableRow.append("td").text(roundToTwoDecimal((corpClock.dropValue/numberOfPlayers)/numOfHours).toLocaleString());
    corpRunData.perPersonGpHr = roundToTwoDecimal((corpClock.dropValue/numberOfPlayers)/numOfHours);
}

/***************************************************
*            Corp Clock                            
****************************************************/

function startCorpClock(){
    if(corpClock.endTime == 0){
        corpClock.startTime = new Date().getTime();
        corpClock.isRunning = true;
    }
}

function endCorpClock(){
    if(corpClock.isRunning){
        corpClock.endTime = new Date().getTime();
        corpClock.isRunning = false;
    }
}

/***************************************************
*            Reset Corp Page                            
****************************************************/

function resetCorpPage(){
    corpDrops = null;
    currentCorpRun = [];
    corpClock = {
        startTime : 0,
        endTime : 0,
        isRunning : false,
        dropValue : 0
    };
    d3.select("#corpClock").text("00:00:00");
    d3.select("#corpDropButtons").html("");
    d3.select("#corpDrops").html("");
    $("#corpNumberOfPlayers").val(1);
    d3.select("#corpRunGpInfoRow").html("");
}

/***************************************************
*            Save Run
****************************************************/

function saveCorpRun(){
    if(corpClock.isRunning){
        endCorpClock();
    }
    var corpRun = {
        data : corpRunData,
        time: {
            startTime: corpClock.startTime,
            endTime : corpClock.endTime
        },
        drops : currentCorpRun
    }
    player.bosses.corpRuns.push(corpRun);
    save();
    returnHome();
}

/***************************************************
*            Generate table for corp data
****************************************************/

function generateCorpDropTable(){
    // Get all the drops from the corp json file
    $.getJSON("./js/json/corp.json", function(json) {
        corpDrops = json;
    }).done(function(d){
        d3.select("#corpDataTableBody").html(null);
        d3.select("#corpDataTableFooter").html(null);

        var currentDrops = corpDrops;
        // add dropCounts to corp drops
        for(var drop of currentDrops){
            drop.totalDropCount = 0;

        }


        // Loop through all runs
        for(var run of player.bosses.corpRuns){
            // Loop through all drops in that run
            for(var runDrops of run.drops){
                // Loop through all corp drops till a match
                for(var drop of currentDrops){
                    if(runDrops.name == drop.name){
                        drop.totalDropCount += drop.dropCount;
                    }
                }
            }
        }   

        // calculate number of times it's dropped
        var totalDrops = 0;
        for(var drop of currentDrops){
            drop.numberOfDrops = drop.totalDropCount/drop.dropCount;
            totalDrops += drop.numberOfDrops;
        }


        // populate the table
        var table = d3.select("#corpDataTableBody");
        for(var drop of currentDrops){
            //<div class="CMLIcon" style='background-image:url("./images/skills/overall.gif")'>
            var row = table.append("tr");
            row.append("th").html(drop.name);
            row.append("th").append("div").attr("class","corpDropIcon").style("background-image",'url("./images/bossDrops/'+drop.imgName+'")');
            row.append("th").html(drop.numberOfDrops);
            row.append("th").html(roundToTwoDecimal((drop.numberOfDrops/totalDrops)*100)+"%");
            if(drop.numberOfDrops == 0){
                row.append("th").html("N/A");
            }else{
                row.append("th").html(reduce(drop.numberOfDrops, totalDrops)[0]+"/"+reduce(drop.numberOfDrops, totalDrops)[1]);
            }
            row.append("th").html(drop.dropChance);
            
        }

        var footer = d3.select("#corpDataTableFooter").append("tr");
        footer.append("td").html("Total Kills");
        footer.append("td");
        footer.append("td").html(totalDrops);
        footer.append("td");
        footer.append("td");
        footer.append("td");

    });
    
}