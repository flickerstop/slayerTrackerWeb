////////////////
// set version number
$( document ).ready(function() {
    d3.select("#versionNum").text(versionNum);

    for(i = 0; i<monsters.length; i++){
        addMonsterCard(monsters[i]);
    }
    
});

