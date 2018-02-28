
function loadFarmRunToEdit(run){
    var farmRun = player.farmRun.runs[run];

    // Set values with current ones
    setIdValue("#farmRunEditInputNumOfHerbs",farmRun.numberOfHerbs);
    setIdValue("#farmRunEditInputNumOfDead",farmRun.numberOfDead);
    setIdValue("#farmRunEditInputNumOfSuccessRes",farmRun.numberOfRes);
    setIdValue("#farmRunEditInputNumOfFailRes",farmRun.numberOfFailRes);
    setIdValue("#farmRunEditInputNumOfCured",farmRun.numberOfCured);

    // Set onclick
    d3.select("#saveFarmRunEditButton").on("click",saveEditedFarmRun(run));

    // Save farm run
    function saveEditedFarmRun(run){
        return function() {
            var editedFarmRun = player.farmRun.runs[run];

            // Get Values
            editedFarmRun.numberOfHerbs = getValueFromId("#farmRunEditInputNumOfHerbs");
            editedFarmRun.numberOfDead = getValueFromId("#farmRunEditInputNumOfDead");
            editedFarmRun.numberOfRes = getValueFromId("#farmRunEditInputNumOfSuccessRes");
            editedFarmRun.numberOfFailRes = getValueFromId("#farmRunEditInputNumOfFailRes");
            editedFarmRun.numberOfCured = getValueFromId("#farmRunEditInputNumOfCured");

            // Calculate Profits getSeedprice(run.herbType)
            editedFarmRun.money.costs = 
            (
                (editedFarmRun.numberOfPatches - editedFarmRun.numberOfCured- editedFarmRun.numberOfRes)
                * editedFarmRun.money.priceOfSeed
            ) +
            ((editedFarmRun.numberOfFailRes+editedFarmRun.numberOfRes)*resurrectPrice());
            
            editedFarmRun.money.netProfit = editedFarmRun.numberOfHerbs * editedFarmRun.money.priceOfHerb;
            editedFarmRun.money.profit = editedFarmRun.money.netProfit - editedFarmRun.money.costs;

            player.farmRun.runs[run] = editedFarmRun;
            showFarmData();
        };
    }
}

