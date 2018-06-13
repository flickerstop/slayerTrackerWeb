//////////////////////
// States
//
// 0 - Slayer monster select 
// 1 - On task
// 2 - settings
// 3 - slayer tables
// 4 - Farm Run
// 5 - corp tracker 
// 6 - home Page
// 7 - farm data
// 8 - CML
// 9 - edit farm run
// 10 - corp data page
var currentState = -1;

function changeState(currentState){
    this.currentState = currentState;
    d3.select("#onTask").style('display', 'none');
    d3.select("#monsterSelect").style('display', 'none');
    d3.select("#settingsPanel").style('display','none');
    d3.select("#slayerTables").style('display','none');
    d3.select("#farmRun").style('display','none');
    d3.select("#corpTracker").style('display','none');
    d3.select("#homePage").style('display','none');
    d3.select("#farmData").style('display','none');
    d3.select("#CML").style('display','none');
    d3.select("#editFarmRun").style('display','none');
    d3.select("#corpData").style('display','none');
    switch(currentState){
        case 0:
            d3.select("#monsterSelect").style('display', null);
            break;
        case 1:
            d3.select("#onTask").style('display', null);
            break;
        case 2:
            d3.select("#settingsPanel").style('display',null);
            break;
        case 3:
            d3.select("#slayerTables").style('display',null);
            break;
        case 4:
            d3.select("#farmRun").style('display',null);
            break;
        case 5:
            d3.select("#corpTracker").style('display',null);
            break;
        case 6:
            d3.select("#homePage").style('display',null);
            break;
        case 7:
            d3.select("#farmData").style('display',null);
            break;
        case 8:
            d3.select("#CML").style('display',null);
            break;
        case 9:
            d3.select("#editFarmRun").style('display',null);
            break;
        case 10:
            d3.select("#corpData").style('display',null);
            break;
    }
}

function returnHome(){
    if(player.farmRun.runs.length == 0){
        d3.select("#farmDataHomeButton").style('display','none');
        homePageCards[1].cardHeight = 1;
    }else{
        d3.select("#farmDataHomeButton").style('display',null);
        homePageCards[1].cardHeight = 2;
    }
    if(player.tasks.length == 0){
        d3.select("#slayerLogHomeButton").style('display','none');
        homePageCards[0].cardHeight = 1;
    }else{
        d3.select("#slayerLogHomeButton").style('display',null);
        homePageCards[0].cardHeight = 2;
    }
    updateHomepageGrid();
    changeState(6);
}

function goToMonsterPage(){
    setResources();
    loadMonsters();
    $('#monsterCountSpinner').val(0);
    changeState(0);
}

function goOnTask(monsterName){
    resetOnTask();
    var monsterCount = $('#monsterCountSpinner').val();
    ///////////////////////////////////////
    // If Jad Task
    if(monsterName == "Jad (Fight Caves)"){
        monsterCount = 1;
    }
    ///////////////////////////////////////
    slayerTask.taskCount = monsterCount;
    slayerTask.taskMonster = monsterName;
    if(monsterCount == 0){
        d3.select("#monsterCountSpinner")
        .transition().duration(0)
        .style("background-color","red")
        .transition().duration(2000)
        .style("background-color",null);
        return;
    }
    d3.select("#monsterCountSpinner").style("background-color",null);
    d3.select("#monsterCountAndName").text(monsterCount + " " + monsterName);
    ///////////////////////////////////////
    // Setup monster info
    var monster = findMonster(monsterName);
    if(player.settings.showTaskDetails){
        if(monster.bonecrusher){
            d3.select("#bonecrusherIcon").style("background-image",'url("./images/icons/onTask/bonecrusher.png")');
            d3.select("#bonecrusherIcon").style("opacity",'1.0');
        }else{
            d3.select("#bonecrusherIcon").style("background-image",'url("./images/icons/onTask/no_bonecrusher.png")');
            d3.select("#bonecrusherIcon").style("opacity",'0.5');
        }
        if(monster.herbSack){
            d3.select("#herbSackIcon").style("background-image",'url("./images/icons/onTask/herbSack.png")');
            d3.select("#herbSackIcon").style("opacity",'1.0');
        }else{
            d3.select("#herbSackIcon").style("background-image",'url("./images/icons/onTask/no_herbSack.png")');
            d3.select("#herbSackIcon").style("opacity",'0.5');
        }
    }else{
        d3.select("#herbSackIcon").style("background-image",null);
        d3.select("#bonecrusherIcon").style("background-image",null);
    }

    changeState(1);
}

/***************************************************
*            Change States            
****************************************************/

function switchToSettings(){
    populateSettings();
    changeState(2);
}

function showSlayerLogs(){
    initTable();
    changeState(3);
}

function showFarmRun(){
    changeState(4);
    setFarmRunFlavourText();
}

function showCorpTracker(){
    resetCorpPage();
    addCorpDrops()
    changeState(5);
}

function showCorpData(){
    changeState(10);
    generateCorpDropTable();
}

function showFarmData(){
    checkFarmRuns(); // Used because of errors found once
    setFarmData(player.farmRun.runs);
    setHerbTypeButtons();
    changeState(7);
}

function showCML(){
    changeState(8);
}

function editFarmRun(run){
    changeState(9);
    loadFarmRunToEdit(run);
}