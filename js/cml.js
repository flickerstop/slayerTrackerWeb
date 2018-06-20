/***************************************************
*            CML data
****************************************************

var CMLData = {
    playerData : [],
    players: [
        "Jr2254",
        "fblthp792",
        "Metalspike0",
        "Flowerpower9"
    ]
};*/
var cmlGetLine = "";

function getCMLData(){
    d3.select("#playerTrackerButton").html("Loading Data...");
    d3.select("#playerTrackerButton").attr("class","homePageButtonDisabled");
    try{
        var sendString = [];
        for(var account of player.settings.playersToTrack){
            sendString.push({type:"update",player:account});
        }
        for(var account of player.settings.playersToTrack){
            sendString.push({type:"track",player:account});
        }
        sendString = JSON.stringify(sendString);
        cmlGetLine = 'https://crystalmathlabs.com/tracker/api.php?multiquery='+sendString;
        $.get('https://crystalmathlabs.com/tracker/api.php?multiquery='+sendString, function(data) {
            parseCMLText(data);
        }).done(function(d) { 
            console.log("CML data grabbed!");
            fillCMLTable();
            d3.select("#playerTrackerButton").html("Player Tracker");
            d3.select("#playerTrackerButton").attr("class","homePageButton");
        }).fail(function(d){
            console.error("CML CONNECTION ERROR");
            d3.select("#playerTrackerButton").html("API is down!");
        }); 
    }catch(exception){
        
    }
}

/***************************************************
*            Parse the data recieved
***************************************************/
function parseCMLText(data){
    var requests = data.split("~~"); // split the return string by requests

    for(var request of requests){
        if(request.length <= 3){ // check if and update or error
            continue;
        }
        var outputData = [];
        var lines = request.split("\n");
        for(var line of lines){
            outputData.push(parseInt(line.split(",")[0]));
        }
        outputData.shift(); //knock off the "time since last update"
        outputData.shift();
        outputData.pop(); // knock off the blank line at the end
        outputData.pop();
        CMLData.playerData.push(outputData);
    }
}

/***************************************************
*            Fill in the table with data
***************************************************/
function fillCMLTable(){
    d3.select("#CMLTableBody").html("");
    var table = d3.select("#CMLTableBody");

    var i = 0;
    for(var account of CMLData.playerData){
        var tableRow = table.append("tr");
        tableRow.append("td").text(player.settings.playersToTrack[i]);
        var p = 0;
        for(var skill of account){
            var text = tableRow.append("td").text(skill.toLocaleString());
            if(isHighestXpForSkill(p,skill)){
                text.style("color","red");
            }
            p++;
        }
        i++;
    }
}

// Check if the given player exp is the highest for that skill 
// by looking at all other players exp
function isHighestXpForSkill(skillNumber,currentExp){
    for(var player of CMLData.playerData){
        if(player[skillNumber] > currentExp){
            return false;
        }
    }
    return true;
}