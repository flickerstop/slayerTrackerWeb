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
    currentState = 0;
    changeState();
}

function goOnTask(monsterName){
    var monsterCount = $('#monsterCountSpinner').val();
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
    currentState = 1;
    changeState();
}