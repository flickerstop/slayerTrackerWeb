var numberOfMonsterCards = 0;
var numberOfPlayersToTrack = 0;

/***************************************************
*            Fill in settings with info
***************************************************/
function populateSettings(){
    resetSettings();
    for(i = 0; i < player.settings.monsters.length; i++){
        addMonsterCardOption(player.settings.monsters[i].name);
    }
    for(var account of player.settings.playersToTrack){
        addPlayerSettingsInput(account);
    }

    numberOfMonsterCards = player.settings.monsters.length;

    $("#settingsInputWaterRunes").val(player.slayerItems.runes.water);
    $("#settingsInputBloodRunes").val(player.slayerItems.runes.blood);
    $("#settingsInputDeathRunes").val(player.slayerItems.runes.death);
    $("#settingsInputChaosRunes").val(player.slayerItems.runes.chaos);
    $("#settingsInputTridentCharges").val(player.slayerItems.tridentCharges);
    $("#settingsInputCannonballs").val(player.slayerItems.cannonballs);
    $("#settingsInputNumberOfPatches").val(player.farmRun.settings.numberOfPatches);
    $("#settingsInputHerbType").val(player.farmRun.settings.herbType);

    // Toggles
    if(player.farmRun.remind){
        d3.select("#toggleFarmSoundOn").attr("class","twoToggle on");
    }else{
        d3.select("#toggleFarmSoundOff").attr("class","twoToggle on");
    }
    if(player.dailies.misc.remind){
        d3.select("#toggleMiscOn").attr("class","twoToggle on");
    }else{
        d3.select("#toggleMiscOff").attr("class","twoToggle on");
    }
    if(player.dailies.battleStaffs.remind){
        d3.select("#toggleBattlestaffsOn").attr("class","twoToggle on");
    }else{
        d3.select("#toggleBattlestaffsOff").attr("class","twoToggle on");
    }
    if(player.dailies.tearsOfGuthix.remind){
        d3.select("#toggleTearsOn").attr("class","twoToggle on");
    }else{
        d3.select("#toggleTearsOff").attr("class","twoToggle on");
    }
    if(player.settings.showTaskDetails){
        d3.select("#toggleDetailsOn").attr("class","twoToggle on");
    }else{
        d3.select("#toggleDetailsOff").attr("class","twoToggle on");
    }
    if(player.farmRun.attas){
        d3.select("#toggleAttasOn").attr("class","twoToggle on");
    }else{
        d3.select("#toggleAttasOff").attr("class","twoToggle on");
    }

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
    player.settings.monsters = newMonsters;
    /////////////////////
    // Get Players
    var newPlayers = [];
    for(t = 0; t < numberOfPlayersToTrack; t++){
        newPlayers.push($("#playerToTrack"+t).val());
    }
    player.settings.playersToTrack = newPlayers;

    player.slayerItems.runes.water = $("#settingsInputWaterRunes").val();
    player.slayerItems.runes.blood = $("#settingsInputBloodRunes").val();
    player.slayerItems.runes.death = $("#settingsInputDeathRunes").val();
    player.slayerItems.runes.chaos = $("#settingsInputChaosRunes").val();
    player.slayerItems.tridentCharges = $("#settingsInputTridentCharges").val();
    player.slayerItems.cannonballs = $("#settingsInputCannonballs").val();

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

/***************************************************
*            toggles
***************************************************/

function toggleSettings(toggleName, value){
    switch(toggleName){
        case "farmSound":
            if(value){
                player.farmRun.remind = true;
                d3.select("#toggleFarmSoundOn").attr("class","twoToggle on");
                d3.select("#toggleFarmSoundOff").attr("class","twoToggle");
            }else{
                player.farmRun.remind = false;
                d3.select("#toggleFarmSoundOn").attr("class","twoToggle");
                d3.select("#toggleFarmSoundOff").attr("class","twoToggle on");
            }
            break;
        case "misc":
            if(value){
                player.dailies.misc.remind = true;
                d3.select("#toggleMiscOn").attr("class","twoToggle on");
                d3.select("#toggleMiscOff").attr("class","twoToggle");
            }else{
                player.dailies.misc.remind = false;
                d3.select("#toggleMiscOn").attr("class","twoToggle");
                d3.select("#toggleMiscOff").attr("class","twoToggle on");
            }
            break;
        case "battlestaffs":
            if(value){
                player.dailies.battleStaffs.remind = true;
                d3.select("#toggleBattlestaffsOn").attr("class","twoToggle on");
                d3.select("#toggleBattlestaffsOff").attr("class","twoToggle");
            }else{
                player.dailies.battleStaffs.remind = false;
                d3.select("#toggleBattlestaffsOn").attr("class","twoToggle");
                d3.select("#toggleBattlestaffsOff").attr("class","twoToggle on");
            }
            break;
        case "tears":
            if(value){
                player.dailies.tearsOfGuthix.remind = true;
                d3.select("#toggleTearsOn").attr("class","twoToggle on");
                d3.select("#toggleTearsOff").attr("class","twoToggle");
            }else{
                player.dailies.tearsOfGuthix.remind = false;
                d3.select("#toggleTearsOn").attr("class","twoToggle");
                d3.select("#toggleTearsOff").attr("class","twoToggle on");
            }
            break;
        case "details":
            if(value){
                player.settings.showTaskDetails = true;
                d3.select("#toggleDetailsOn").attr("class","twoToggle on");
                d3.select("#toggleDetailsOff").attr("class","twoToggle");
            }else{
                player.settings.showTaskDetails = false;
                d3.select("#toggleDetailsOn").attr("class","twoToggle");
                d3.select("#toggleDetailsOff").attr("class","twoToggle on");
            }
            break;
        case "attas":
            if(value){
                player.farmRun.attas = true;
                d3.select("#toggleAttasOn").attr("class","twoToggle on");
                d3.select("#toggleAttasOff").attr("class","twoToggle");
            }else{
                player.farmRun.attas = false;
                d3.select("#toggleAttasOn").attr("class","twoToggle");
                d3.select("#toggleAttasOff").attr("class","twoToggle on");
            }
            break;
    }
}