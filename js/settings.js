var numberOfMonsterCards = 0;
var numberOfPlayersToTrack = 0;

/***************************************************
*            Fill in settings with info
***************************************************/
function populateSettings(){
    resetSettings();
    for(i = 0; i < player.monsters.length; i++){
        addMonsterCardOption(player.monsters[i].name);
    }
    for(var account of player.playersToTrack){
        addPlayerSettingsInput(account);
    }

    numberOfMonsterCards = player.monsters.length;

    $("#settingsInputWaterRunes").val(player.runes.water);
    $("#settingsInputBloodRunes").val(player.runes.blood);
    $("#settingsInputDeathRunes").val(player.runes.death);
    $("#settingsInputChaosRunes").val(player.runes.chaos);
    $("#settingsInputTridentCharges").val(player.tridentCharges);
    $("#settingsInputCannonballs").val(player.cannonballs);
    $("#settingsInputNumberOfPatches").val(player.farmRun.settings.numberOfPatches);
    $("#settingsInputHerbType").val(player.farmRun.settings.herbType);
}

/***************************************************
*            Add a card for changing monster
***************************************************/
function addMonsterCardOption(monsterName){
    var container = d3.select("#monsterSelectOptions").append("div")
        .attr("class","settingsRow")
        .style("width","50%")
        .style("float", "left");
    container.append("div")
        .attr("class","settingsText")
        .style("width","calc(30% - 5px)")
        .text("Monster #"+(numberOfMonsterCards+1));
    var select = container.append("div")
        .attr("class","settingsInput")
        .style("width","70%")
        .append("select")
        .attr("id","monsterOption"+numberOfMonsterCards);
        
    
    for(m = 0; m < monsters.length; m++){
        if(monsterName == monsters[m].name){
            select.append("option")
            .attr("value",monsters[m].name)
            .attr("selected", "selected")
            .text(monsters[m].name);          
        }else{
            select.append("option").attr("value",monsters[m].name).text(monsters[m].name);
        }
    }
    numberOfMonsterCards++;
}

/***************************************************
*            Add a blank monster card
***************************************************/
function addBlankMonsterCard(){
    addMonsterCardOption(null);
}

/***************************************************
*            Save all settings
***************************************************/
function saveSettings(){
    /////////////////////
    // Get monsters
    var newMonsters = [];
    for(t = 0; t < numberOfMonsterCards;t++){
        newMonsters.push(findMonster($("#monsterOption"+t).val()));
    }
    player.monsters = newMonsters;
    /////////////////////
    // Get Players
    var newPlayers = [];
    for(t = 0; t < numberOfPlayersToTrack; t++){
        newPlayers.push($("#playerToTrack"+t).val());
    }
    player.playersToTrack = newPlayers;

    player.runes.water = $("#settingsInputWaterRunes").val();
    player.runes.blood = $("#settingsInputBloodRunes").val();
    player.runes.death = $("#settingsInputDeathRunes").val();
    player.runes.chaos = $("#settingsInputChaosRunes").val();
    player.tridentCharges = $("#settingsInputTridentCharges").val();
    player.cannonballs = $("#settingsInputCannonballs").val();

    player.farmRun.settings.numberOfPatches = $("#settingsInputNumberOfPatches").val();
    player.farmRun.settings.herbType = $("#settingsInputHerbType").val();

    save();
    returnHome();
    resetOnTask();
}

/***************************************************
*            Reset all settings
***************************************************/
function resetSettings(){
    d3.select("#monsterSelectOptions").html("");
    d3.select("#playerTrackOptions").html("");
    numberOfMonsterCards = 0;
    numberOfPlayersToTrack = 0;
}

/***************************************************
*            Add player inputs
***************************************************/
function addPlayerSettingsInput(playerName){
    var input = d3.select("#playerTrackOptions")
        .append("div")
        .attr("class","settingsRow")
        .style("width","50%")
        .style("float", "left")
        .append("input")
        .attr("type","text")
        .attr("placeholder","Player Name")
        .attr("class","playerNameSettingsInput")
        .attr("id","playerToTrack"+numberOfPlayersToTrack);
    if(playerName != null){
        input.property('value', playerName);
    }
    numberOfPlayersToTrack++;
}