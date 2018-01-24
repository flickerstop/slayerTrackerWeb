
var corpDrops;
var currentCorpRun = [];
function addCorpDrops(){
    $.getJSON("./js/json/corp.json", function(json) {
        corpDrops = json;

        for(i = 0; i < corpDrops.length; i++){
            d3.select("#corpDropButtons").append('div')
            .attr('id',"monsterCard")
            .attr('class',"tooltip")
            .on("click",onRecievedCorpDrop(i))
            .attr("style","background-image: url(\"https://raw.githubusercontent.com/flickerstop/slayerTrackerWeb/master/images/bossDrops/"+corpDrops[i].imgName+"\")")
            .append('span')
            .attr("class","tooltiptext")
            .html(corpDrops[i].name);
        }
    });
}

function onRecievedCorpDrop(i){
    return function(){
        currentCorpRun.push(corpDrops[i]);
    }
}

function resetCorpPage(){
    corpDrops = null;
    currentCorpRun = [];
    d3.select("#corpDropButtons").html("");
}