var totalCount;
var totalNetProfit;
var totalResourceCost;
var totalProfit;


function initTable(){
    resetTable();
    totalCount = 0;
    totalNetProfit = 0;
    totalResourceCost = 0;
    totalProfit = 0;
    for(taskNum = 0; taskNum < player.tasks.length; taskNum++){
        drawRow(player.tasks[taskNum]);
    }
    // if no tasks

    if(player.tasks.length == 0){
        d3.select("#slayerTableBody").append("tr")
            .append("td")
            .attr("colspan","7")
            .text("No tasks completed yet! Complete a task to view it here.")
            .style("text-align","center")
            .style("color","cyan");
    }


    // Draw footer
    var footerRow = d3.select("#slayerTableFooter").append("tr");
    footerRow.append("td").text("TOTAL");
    footerRow.append("td").text(totalCount).style("text-align","right");
    footerRow.append("td").text(totalNetProfit).style("text-align","right");
    footerRow.append("td").text(totalResourceCost).style("text-align","right");
    footerRow.append("td").text(totalProfit).style("text-align","right");
    footerRow.append("td").text("");
    footerRow.append("td").text("");
}

function drawRow(task){
    var row = d3.select("#slayerTableBody").append("tr");
    row.append("td").text(task.monster);
    row.append("td").text(task.count).style("text-align","right");
    totalCount += parseInt(task.count);
    row.append("td").text(task.netProfit.toLocaleString()).style("text-align","right");
    totalNetProfit += task.netProfit;
    row.append("td").text(task.resourcesPriceTotal.toLocaleString()).style("text-align","right");
    totalResourceCost += task.resourcesPriceTotal;
    row.append("td").text(task.profit.toLocaleString()).style("text-align","right");
    totalProfit += task.profit;
    row.append("td").text(task.timeTaken).style("text-align","right");
    row.append("td").text((Math.round((task.xpMin*60) * 100) / 100).toLocaleString()).style("text-align","right");
    row.style("background-color",findMonster(task.monster).background);
    row.style("color",findMonster(task.monster).foreground);
}

function resetTable(){
    d3.select("#slayerTableBody").html("");
    d3.select("#slayerTableFooter").html("");
}