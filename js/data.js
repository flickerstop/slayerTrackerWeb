/***************************************************
*            Global Variabes
****************************************************/
var versionNum = "1.6.1";   // Version Number
var isOldVersion = false;
var playerVersion = "1.6.0";
var audio = new Audio("./audio/alarm.wav"); // Variable for playing the farm run timer alarm
var isAbleToSave = true;
var timeGePricesUpdated = 0;
var typesOfSeedsForFarming;

var CMLData = {
    playerData : []
};

var homePageCards;
var GEAttempts = 0;

/***************************************************
*            Player Object
****************************************************/
// Holds everything to save/load
// If anything is added, make sure to change the function below that
// updates the save file!
var defaultPlayer = {
    versionNum: playerVersion,
    slayerItems: {
        cannonballs:0,
        runes:{
            water:0,
            chaos:0,
            death:0,
            blood:0
        },
        tridentCharges:0
    },
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
    bosses:{
        corpRuns:[],
        raidRuns:[]
    },
    dailies:{
        misc: {
            remind: false,
            everyXDays: 0,
            lastRemind: 0
        },
        battleStaffs:{
            remind: false
        },
        tearsOfGuthix:{
            remind: false,
            lastRemind: 0
        }
    },
    settings:{
        showTaskDetails: false,
        playerName: "",
        playersToTrack: [],
        monsters:[],
        cookieWarning: false,
    },
    gePrices: {}
};

var player;

/***************************************************
*            GE Prices
****************************************************/
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
    var tempGE;
    console.log("Attempting to update GE Prices.")
    $.getJSON("https://rsbuddy.com/exchange/summary.json", function(json) {
        tempGE = json;
        timeGePricesUpdated = new Date().getTime();
        console.log("GE Prices updated!");
    }).always(function() {
        if(tempGE == null){
            console.error("GE PRICES NOT UPDATED. FALLBACK TO LAST CHECK");
            if(isObjectEmpty(player.gePrices)){
                console.error("NO LAST UPDATE! RETURNING TO DEV BACKUP!");
                $.getJSON("./js/json/ge.json", function(newJson) {
                    gePrices = newJson;
                    player.gePrices = newJson;
                    setPrices();
                    save();
                });
            }
        }else{
            gePrices = tempGE;
            player.gePrices = tempGE;
            setPrices();
            save();
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

/***************************************************
*            Monsters
****************************************************/
var monsters;

function loadMonsters(){
    d3.select("#monsterSelectPanel").html("");
    $.getJSON("./js/json/monsters.json", function(json) {
        monsters = json;

        for(i = 0; i<player.settings.monsters.length; i++){
            addMonsterCard(player.settings.monsters[i]);
        }

        if(player.settings.monsters.length == 0){
            d3.select("#monsterSelectPanel").append("h2")
            .text("Click the Settings button in the top right to add Monsters!")
            .style("text-align","center")
            .style("color","cyan");
        }

        populateSettings();
    });
}

/***************************************************
*            Player Object Resources
****************************************************/
function setResources(){
    d3.select("#waterRunesLeft").text(player.slayerItems.runes.water);
    d3.select("#bloodRunesLeft").text(player.slayerItems.runes.blood);
    d3.select("#deathRunesLeft").text(player.slayerItems.runes.death);
    d3.select("#chaosRunesLeft").text(player.slayerItems.runes.chaos);
    d3.select("#cannonballsLeft").text(player.slayerItems.cannonballs);
    d3.select("#tridentChargesLeft").text(player.slayerItems.tridentCharges);
}

/***************************************************
*            Loading player
****************************************************/
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
                if(player.gePrices != null && player.gePrices != {}){
                    console.log("Loaded previous GE prices.")
                    gePrices = player.gePrices;
                    if(isObjectEmpty(gePrices)){
                        console.error("NO PREVIOUS PRICES! RETURNING TO DEV BACKUP!");
                        $.getJSON("./js/json/ge.json", function(newJson) {
                            gePrices = newJson;
                            player.gePrices = newJson;
                            setPrices();
                            save();
                        });
                    }
                }
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

/***************************************************
*            Saving Player
****************************************************/
function save(){
    if(isAbleToSave){
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("playerData", JSON.stringify(player));
        } else {
            window.alert("Web Storage is not supported!");
        }
    }
}

function downloadPlayer(){
    var textToSave = JSON.stringify(player);

    /* I love Stackoverflow */

    var hiddenElement = document.createElement('a');

    hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'player.json';
    hiddenElement.click();
}

/***************************************************
*            Wipe Save
****************************************************/
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

/***************************************************
*            Validate Load
****************************************************/
function checkLoadFile(playerLoaded){
    var updatedPlayerSave = playerLoaded;

    //check to see if player has been updated to settings version
    if(updatedPlayerSave.settings == null){
        //settings
        updatedPlayerSave.settings = {};

        updatedPlayerSave.settings.showTaskDetails = false;
        updatedPlayerSave.settings.playerName = updatedPlayerSave.playerName;
        updatedPlayerSave.settings.playersToTrack = updatedPlayerSave.playersToTrack;
        updatedPlayerSave.settings.monsters = updatedPlayerSave.monsters;
        updatedPlayerSave.settings.cookieWarning = updatedPlayerSave.cookieWarning;
        // delete old 
        delete updatedPlayerSave.playerName;
        delete updatedPlayerSave.playersToTrack;
        delete updatedPlayerSave.monsters;
        delete updatedPlayerSave.cookieWarning;
    }

    // check for slayer items update
    if(updatedPlayerSave.slayerItems == null){
        updatedPlayerSave.slayerItems = {};

        updatedPlayerSave.slayerItems.cannonballs = updatedPlayerSave.cannonballs;
        updatedPlayerSave.slayerItems.runes = updatedPlayerSave.runes;
        updatedPlayerSave.slayerItems.tridentCharges = updatedPlayerSave.tridentCharges;

        delete updatedPlayerSave.cannonballs;
        delete updatedPlayerSave.runes;
        delete updatedPlayerSave.tridentCharges;
    }

    //check for dailies
    if(updatedPlayerSave.dailies == null){
        console.error("No dailies to track, added default");
        updatedPlayerSave.dailies = {
            misc: {
                remind: false,
                everyXDays: 0,
                lastRemind: 0
            },
            battleStaffs:{
                remind: false
            },
            tearsOfGuthix:{
                remind: false,
                lastRemind: 0
            }
        };
    }

    // Check for g.e. prices
    if(updatedPlayerSave.gePrices == null){
        console.error("No GE Prices, updated to blank");
        updatedPlayerSave.gePrices = {};
    }

    // change version number
    updatedPlayerSave.versionNum = playerVersion;
    console.error("Updated version number");

    player = updatedPlayerSave;
    save();
}

/***************************************************
*            Set Old Save for testing
****************************************************/
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

/***************************************************
*            Load Test Player
****************************************************/
function loadTestPlayer(){
    isAbleToSave = false;
    $.getJSON("./js/json/testPlayer.json", function(json) {
        player = json;
        returnHome();
    });
}

/***************************************************
*            Load Cards for Home Page
****************************************************/

function loadHomePageCards(){
    $.getJSON("./js/json/homePageCards.json", function(json) {
        homePageCards = json;
        returnHome();
    });
}

/***************************************************
*            Load Seeds for prices
****************************************************/

function loadTypesOfSeeds(){
    $.getJSON("./js/json/seeds.json", function(json) {
        typesOfSeedsForFarming = json;
    });
}

/***************************************************
*            Turn on Saving
****************************************************/
function turnOnSaving(){
    console.error("THIS MIGHT DELETE YOUR SAVE!");
    isAbleToSave = true;
    save();
}

/***************************************************
*            Useful functions
****************************************************/

// Find a monster in the monster.json with the given name
function findMonster(monsterName){
    for(i = 0; i < monsters.length; i++){
        if(monsters[i].name == monsterName){
            return monsters[i];
        }
    }
}

// find an item in the downloaded g.e. prices with the given name
function findItem(name){
    for(i = 0; i < 20000; i++){
        if(gePrices[i] != null){
            if(name.toUpperCase() == gePrices[i].name.toUpperCase()){
                return gePrices[i];
            }
        }
    }
}

// Convert milliseconds to readable time
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

// Round to two decimal places
function roundToTwoDecimal(number){
    return (Math.round(number*100))/100;
}

// Round to one decimal places
function roundToOneDecimal(number){
    return (Math.round(number*10))/10;
}

// Returns the value from an id
function getValueFromId(id){
    return parseInt($(id).val());
}

function resetIdValue(id){
    $(id).val(0);
}

function setIdValue(id, value){
    $(id).val(value);
}

function reduce(numerator,denominator){
    var gcd = function gcd(a,b){
        return b ? gcd(b, a%b) : a;
    };
    gcd = gcd(numerator,denominator);
    return [numerator/gcd, denominator/gcd];
}

function isObjectEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

/////////////////////////////
// Get GE data from different proxies
/////////////////////////////

// function GEFromYQL(){
    
//     $.getJSON("http://query.yahooapis.com/v1/public/yql",
//         {
//             q:      "select * from json where url=\"https://rsbuddy.com/exchange/summary.json\"",
//             format: "json"
//         },
//         function (data) {
//             if (data.query.results) {
//             console.log(data.query.results.json);
//             } else {
//                 alert('no such code: ' + code);
//             }
//         }
//     );
// }

function getGEPrices(){
    /*
        Attempts to grab the Osbuddy GE prices from a CORS proxy
        if that proxy fails, it attempts to grab from another one.
    */

    var proxies = [
        "https://cors-anywhere.herokuapp.com/",
        "https://cors.io/?",
        "https://cors.now.sh/",
        "http://www.corsify.me/",
        "http://cors.hyoo.ru/"
    ];
    // Number of times it's attempted to update the GE
    if(GEAttempts >= proxies.length){
        return;
    }

    var tempGE;
    console.log("Attempting to update GE Prices.");


    $.getJSON(proxies[GEAttempts]+"https://rsbuddy.com/exchange/summary.json", function(json) {
        tempGE = json;
        timeGePricesUpdated = new Date().getTime();
    }).always(function() {
        if(tempGE == null){
            console.error(proxies[GEAttempts] + " Failed to grab GE Prices. Trying new website.");
            GEAttempts++;
            getGEPrices();
        }else{
            console.log("GE Prices updated from "+proxies[GEAttempts]);
            gePrices = tempGE;
            player.gePrices = tempGE;
            setPrices();
            save();
        }
    });
}