/////////////////////////
// Global variables
var versionNum = "1.0.1";   // Version Number
var isOldVersion = false;
var playerVersion = "0.0.19";
var audio = new Audio("./audio/alarm.wav"); // Variable for playing the farm run timer alarm
var isAbleToSave = true;

/////////////////////////
// Player Object
// Holds everything to save/load
// If anything is added, make sure to change the function below that
// updates the save file!
var defaultPlayer = {
    versionNum: playerVersion,
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
        nextRunAt: 0,
        lastRunAt: 0,
        remind: true,
        onRun:false,
        settings:{
            numberOfPatches:0,
            herbType:"",
            compostType:""
        },
        runs: []
    },
    cookieWarning: false,
    bosses:{
        corpRuns:[],
        raidRuns:[]
    }
};

var player;

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
    }).always(function(d) {
        if(gePrices == null){
            $.getJSON("./js/json/ge.json", function(newJson) {
                gePrices = newJson;
                setPrices();
            });
        }
    });

    
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

        if(player.monsters.length == 0){
            d3.select("#monsterSelectPanel").append("h2")
            .text("Click the Settings button in the top right to add Monsters!")
            .style("text-align","center")
            .style("color","cyan");
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
    // If you can use web storage
    if (typeof(Storage) !== "undefined") {
        // get the save file from webstorage
        var loadFile = JSON.parse(localStorage.getItem("playerData"));
        // if there is a save file
        if(loadFile != null){
            // check the version of the save file
            if(loadFile.versionNum == playerVersion){ // If it's the correct version
                player = loadFile;
                console.log("Loaded save file!")
            }else{ // If it's an old version
                console.error("You are currently running an older save. Attempted to update save file!")
                checkLoadFile(loadFile);
            }
        }else{
            player = defaultPlayer;
            save();
            Console.log("No save file found, adding default");
        }
    } else {
        window.alert("Web Storage is not supported!");
    }
}

function save(){
    if(isAbleToSave){
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("playerData", JSON.stringify(player));
        } else {
            window.alert("Web Storage is not supported!");
        }
    }
}



function wipeSave(num){
    // player = defaultPlayer;
    // save();
    switch(num){
        case 0:
            console.error("Wiping player, not save!")
            isAbleToSave = false;
            player = defaultPlayer;
            returnHome();
            break;
        case 1:
            console.error("Wiping player AND save!")
            player = defaultPlayer;
            returnHome();
            save();
            break;
        default:
            console.log("Use this function to wipe a save/player");
            console.log("with argument \"0\" just player will be wiped.");
            console.log("with argument \"1\" both player and save will be wiped.");
            break;
    }
}

function checkLoadFile(playerLoaded){
    var updatedPlayerSave = playerLoaded;

    // check for cookie warning
    if(updatedPlayerSave.cookieWarning == null){
        console.error("No cookie warning, added default");
        updatedPlayerSave.cookieWarning = false;
    }

    // check for farm run settings
    if(updatedPlayerSave.farmRun.settings == null){
        console.error("No farm run settings, added default");
        updatedPlayerSave.farmRun.settings = {
            numberOfPatches:0,
            herbType:"",
            compostType:""
        };
    }

    // check for onRun
    if(updatedPlayerSave.farmRun.onRun == null){
        console.error("No farm run onRun, added default");
        updatedPlayerSave.farmRun.onRun = false;
    }

    // Check for bosses
    if(updatedPlayerSave.bosses == null){
        console.error("No bosses, added default");
        updatedPlayerSave.bosses = {
            corpRuns:[],
            raidRuns:[]
        };
    }

    // change version number
    updatedPlayerSave.versionNum = playerVersion;
    console.error("Updated version number");

    player = updatedPlayerSave;
    save();
}


function setOldSaveForTest(){
    wipeSave(1);
    player = {
        versionNum: "0.0.13",
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
            nextRunAt: 0,
            lastRunAt: 0,
            remind: true,
            runs: []
        }
    };
    save();
}

function loadTestPlayer(){
    isAbleToSave = false;
    $.getJSON("./js/json/testPlayer.json", function(json) {
        player = json;
        returnHome();
    });
}

function turnOnSaving(){
    console.error("THIS MIGHT DELETE YOUR SAVE!");
    isAbleToSave = true;
}

/***************************************************
*            Useful functions
****************************************************/

function findMonster(monsterName){
    for(i = 0; i < monsters.length; i++){
        if(monsters[i].name == monsterName){
            return monsters[i];
        }
    }
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

function msToTime(duration) {
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}

function roundToTwoDecimal(number){
    return (Math.round(number*100))/100;
}

function roundToOneDecimal(number){
    return (Math.round(number*10))/10;
}