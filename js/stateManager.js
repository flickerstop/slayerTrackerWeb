//////////////////////
// States
//
// 0 - Slayer monster select 
// 1 - On task
var currentState = 0;


function changeState(){
    switch(currentState){
        case 0:
            d3.select("#monsterSelect").style('display', null);
            d3.select("#onTask").style('display', 'none');
            break;
        case 1:
            d3.select("#onTask").style('display', null);
            d3.select("#monsterSelect").style('display', 'none');
            break;
    }
}

function returnHome(){
    $('#monsterCountSpinner').val(0);
    currentState = 0;
    changeState();
}

function goOnTask(monsterName){
    var monsterCount = $('#monsterCountSpinner').val();
    switchTaskType(0);
    if(monsterCount == 0){
        d3.select("#monsterCountSpinner")
        .transition().duration(0)
        .style("background-color","red")
        .transition().duration(2000)
        .style("background-color",null);
        return;
    }
    d3.select("#monsterCountSpinner").style("background-color",null);
    d3.select("#monsterCountAndName").text(monsterCount + " " + monsterName)
    resetTrips();
    currentState = 1;
    changeState();
}