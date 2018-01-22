var numberOfMonsterCards = 0;

////////////////////////////////
// Populate settings with the current values
function populateSettings(){
    resetSettings();
    for(i = 0; i < player.monsters.length; i++){
        addMonsterCardOption(player.monsters[i].name);
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

///////////////////////////////
// Add a card for changing a monster
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

////////////////////////
// Add a new monster card
function addBlankMonsterCard(){
    addMonsterCardOption(null);
}

//////////////////////////
// Save all the settings
function saveSettings(){
    /////////////////////
    // Get monsters
    var newMonsters = [];
    for(t = 0; t < numberOfMonsterCards;t++){
        newMonsters.push(findMonster($("#monsterOption"+t).val()));
    }
    player.monsters = newMonsters;

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

/////////////////////////////
// reset the settings
function resetSettings(){
    d3.select("#monsterSelectOptions").html("");
    numberOfMonsterCards = 0;
}