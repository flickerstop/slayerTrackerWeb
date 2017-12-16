function addBlankMonsterCard(){
    d3.select("#monsterSelectPanel").append('div')
        .attr('id',"monsterCard");
}

function addMonsterCard(monster){
    d3.select("#monsterSelectPanel").append('div')
        .attr('id',"monsterCard")
        .attr('class',"tooltip")
        .attr("style","background-image: url(\"../images/monsters/"+monster.imgUrl+"\")")
        .append('span')
        .attr("class","tooltiptext")
        .html(monster.name);
}