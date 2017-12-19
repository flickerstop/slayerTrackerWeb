function addBlankMonsterCard(){
    d3.select("#monsterSelectPanel").append('div')
        .attr('id',"monsterCard");
}

function addMonsterCard(monster){
    d3.select("#monsterSelectPanel").append('div')
        .attr('id',"monsterCard")
        .attr('class',"tooltip")
        .on("click",onMonsterClick(monster.name))
        .attr("style","background-image: url(\"https://github.com/flickerstop/slayerTrackerWeb/blob/master/images/monsters/"+monster.imgUrl+"\")")
        .append('span')
        .attr("class","tooltiptext")
        .html(monster.name);
}

function onMonsterClick(monsterName){
    return function(){
        //console.log(monsterName);
        goOnTask(monsterName);
    }
}