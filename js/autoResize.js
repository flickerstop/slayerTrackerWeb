window.onresize = function(event) {
    updateHomepageGrid();
    checkMainPanelWidth();

    if(currentState == 7){ // farm tracker
        adjustGraphWidth();
    }
};

/***************************************************
*            Home Page Cards
***************************************************/

function updateHomepageGrid(){

    var cards = homePageCards;

    var cardWidth = 400; // average width aiming for
    var width = document.getElementById('mainPanel').offsetWidth;

    var numOfCardsWidth = Math.floor(width/cardWidth);
    var cardInfo = getCellArray(numOfCardsWidth,cards).cells;

    // //Set number of columns
    var temp = "";
    var columnSize = 100 / numOfCardsWidth;
    for(i = 0; i < numOfCardsWidth; i++){
        temp += columnSize+"% ";
    }
    d3.select("#homepageGrid").style("grid-template-columns",temp);
    // // Set number of rows
    temp = "";
    for(i = 0; i < getCellArray(numOfCardsWidth,cards).maxHeight; i++){
        temp += "150px ";
    }
    d3.select("#homepageGrid").style("grid-template-rows",temp);

    for(i = 0; i < cards.length; i++){
        d3.select("#"+cards[i].cardName).style("grid-column",cardInfo[i].startX);
        d3.select("#"+cards[i].cardName).style("grid-row",cardInfo[i].startY + " / "+ (cardInfo[i].endY+1));
        // ^^^ If you don't add 1 to the endY, it fucks up.... NOOO IDEA WHY
    }
}

function getCellArray(tableWidth,cards){
    var tableHeight = 20; // Set this to a high number, wont effect final table
    var maxHeight = 0;
    var cells = []; // array for the data to be sent back
    //////////////////////////
    // Create table (2D array)
    var table = new Array(tableHeight);
    for (var i = 0; i < tableHeight; i++) {
        table[i] = new Array(tableWidth);
        for (var j = 0; j < tableWidth; j++) {
            table[i][j] = "x";
        }
    }
    /////////////////////////
    // Add elements
    // Loop through all cards
    for(var i = 0; i < cards.length; i++){
        fillTable(i,cards[i].cardHeight,cards[i].cardWidth);
    }

    function fillTable(i,height,width){
        // Info to be sent back
        var temp = {
            startX:0,
            startY:0,
            endX:0,
            endY:0
        };
        // Loop through the table cells
        for (var y = 0; y < table.length; y++) {
            for (var x = 0; x < table[0].length; x++) {
                // If the cell is empty
                if(table[y][x] == "x"){
                    // set the card starting position to this
                    temp.startX = x+1;
                    temp.startY = y+1;
                    // Loop through for the table width
                    for(var cx = 0; cx < width; cx++){
                        table[y][x+cx] = i; // fill the cell with this card
                        temp.endX = x+cx+1; // set the endpoint to here 
                        // Loop through for the table height
                        for(var cy = 0; cy < height; cy++){
                            table[y+cy][x+cx] = i; // fill the cell with this card
                            temp.endY = y+cy+1; // set the endpoint to here 
                            if((y+cy) > maxHeight){
                                maxHeight = (y+cy); // Get the highest row
                            }
                        }
                    }
                    cells.push(temp); // push the final card info
                    return; // Finished this card
                }
            }
        }
    }







    /////////////////////////
    // Test Output
    // var output = "";
    // for (var x = 0; x < table.length; x++) {
    //     for (var y = 0; y < table[0].length; y++) {
    //         output += table[x][y] + " ";
    //     }
    //     output += ",\n";
    // }

    //console.log(output);
    //console.log(cells);
    return {cells:cells,maxHeight:maxHeight};
}

/***************************************************
*            Main Panel Width
***************************************************/

function checkMainPanelWidth(){
    var width = document.getElementById('body').offsetWidth;

    if(width < 920){
        d3.select("#mainPanel").style("width","90%");
    }else{
        d3.select("#mainPanel").style("width","75%");
    }
}
