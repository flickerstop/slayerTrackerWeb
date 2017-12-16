/////////////////////////
// Player Object
// Holds everything to save/load
var player = {
    playerName: "",
    cannonballs:0,
    runes:{
        water:0,
        chaos:0,
        death:0,
        blood:0
    },
    tridentCharges:0,
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

////////////////////////
// monsters
var monsters;
$.getJSON("./js/json/monsters.json", function(json) {
    monsters = json; // this will show the info it in firebug console
});