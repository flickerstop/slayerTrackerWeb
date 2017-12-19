//////////////////////
// States
//
// 0 - Slayer monster select 
// 1 - On task
// 2 - settings


function changeState(currentState){
    switch(currentState){
        case 0:
            d3.select("#monsterSelect").style('display', null);
            d3.select("#onTask").style('display', 'none');
            d3.select("#settingsPanel").style('display','none');
            break;
        case 1:
            d3.select("#onTask").style('display', null);
            d3.select("#monsterSelect").style('display', 'none');
            d3.select("#settingsPanel").style('display','none');
            break;
        case 2:
            d3.select("#onTask").style('display', 'none');
            d3.select("#monsterSelect").style('display', 'none');
            d3.select("#settingsPanel").style('display',null);
            break;
    }
}

function returnHome(){
    $('#monsterCountSpinner').val(0);
    changeState(0);
}

function goOnTask(monsterName){
    resetOnTask();
    var monsterCount = $('#monsterCountSpinner').val();
    taskCount = monsterCount;
    taskMonster = monsterName;
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
    changeState(1);
}

function switchToSettings(){
    changeState(2);
}