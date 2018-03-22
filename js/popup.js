
/***************************************************
*            Close The popup
***************************************************/
function closePopup(){
    d3.select("#popup").transition().duration(300).style('opacity', "0.0").on("end", close);

    function close(){ 
        d3.select("#popup").style('display', "none").style('opacity', "0.0");
    }
}

/***************************************************
*            Open the popup
***************************************************/
function openPopup(){
    d3.select("#popup").style('display', null).transition().duration(150).style('opacity', "1.0");

}

/***************************************************
*            Set the popup title
***************************************************/
function setPopupTitle(newTitle){
    d3.select("#popupTitle").html(newTitle);
}

/***************************************************
*            Get the popup body
***************************************************/
function getPopupBody(){
    d3.select("#popupBody").html("");
    return d3.select("#popupBody");
}