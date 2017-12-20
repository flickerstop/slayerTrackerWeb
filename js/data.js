/////////////////////////
// Global variables
var versionNum = "0.0.11";   // Version Number


/////////////////////////
// Player Object
// Holds everything to save/load
var player = {
    versionNum: versionNum,
    playerName: "",
    cannonballs:0,
    runes:{
        water:0,
        chaos:0,
        death:0,
        blood:0
    },
    tridentCharges:0,
    monsters:[],
    tasks:[],
    farmRun:{
        
    }
};


////////////////////////
// Prices
var prices = {
    cannonball:-1,
    waterRune: -1,
    chaosRune: -1,
    deathRune: -1,
    bloodRune: -1,
    tridentCharge: -1,
}

var gePrices;
function getGEPrices(){
    jQuery.ajaxPrefilter(function(options) {
        if (options.crossDomain && jQuery.support.cors) {
            options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
        }
    });
    $.getJSON("https://rsbuddy.com/exchange/summary.json", function(json) {
        gePrices = json;
        setPrices();
    });

    
}

function findItem(name){
    for(i = 0; i < 20000; i++){
        if(gePrices[i] != null){
            if(name.toUpperCase() == gePrices[i].name.toUpperCase()){
                return gePrices[i];
            }
        }
    }
}

function setPrices(){
    prices.cannonball = findItem("cannonball").buy_average;
    prices.waterRune = findItem("water rune").buy_average;
    prices.chaosRune = findItem("chaos rune").buy_average;
    prices.deathRune = findItem("death rune").buy_average;
    prices.bloodRune = findItem("blood rune").buy_average;
    //prices.bloodRune = findItem("blood rune");
}

////////////////////////
// monsters
var monsters;

function loadMonsters(){
    d3.select("#monsterSelectPanel").html("");
    $.getJSON("./js/json/monsters.json", function(json) {
        monsters = json;

        for(i = 0; i<player.monsters.length; i++){
            addMonsterCard(player.monsters[i]);
        }
        populateSettings();
    });
}

////////////////////////
// Set runes left
function setResources(){
    d3.select("#waterRunesLeft").text(player.runes.water);
    d3.select("#bloodRunesLeft").text(player.runes.blood);
    d3.select("#deathRunesLeft").text(player.runes.death);
    d3.select("#chaosRunesLeft").text(player.runes.chaos);
    d3.select("#cannonballsLeft").text(player.cannonballs);
    d3.select("#tridentChargesLeft").text(player.tridentCharges);
}

//////////////////////
// save & load
function load(){
    if (typeof(Storage) !== "undefined") {
        var loadFile = JSON.parse(localStorage.getItem("playerData"));
        if(loadFile != null){
            // TODO
            // add something to check the version number
            // of the loaded player vs the current version number
            // and only load the values that need to be so then
            // the new variables dont get deleted
            if(loadFile.versionNum == versionNum){
                player = loadFile;
                console.log("Loaded save file!")
            }else{
                console.error("Old version number, save dropped!")
                save();
            }
        }
    } else {
        window.alert("Web Storage is not supported!");
    }
}

function save(){
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("playerData", JSON.stringify(player));
    } else {
        window.alert("Web Storage is not supported!");
    }
}

function findMonster(monsterName){
    for(i = 0; i < monsters.length; i++){
        if(monsters[i].name == monsterName){
            return monsters[i];
        }
    }
}
