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

function getCMLData(){

    var sendString = [];
    for(var player of CMLData.players){
        sendString.push({type:"update",player:player});
    }
    for(var player of CMLData.players){
        sendString.push({type:"track",player:player});
    }
    sendString = JSON.stringify(sendString);
    $.get('https://crystalmathlabs.com/tracker/api.php?multiquery='+sendString, function(data) {
        parseCMLText(data);
    }).always(function(d) { 
        console.log("CML data grabbed!");
        fillCMLTable();
    }); 
}

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

function fillCMLTable(){
    var table = d3.select("#CMLTableBody");

    var i = 0;
    for(var player of CMLData.playerData){
        var tableRow = table.append("tr");
        tableRow.append("td").text(CMLData.players[i]);
        for(var skill of player){
            tableRow.append("td").text(skill.toLocaleString());
        }
        i++;
    }
}