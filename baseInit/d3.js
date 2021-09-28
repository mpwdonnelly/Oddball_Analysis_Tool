//var d3 = require("d3");

//test last e on page to make sure everything loaded
function init() {
    var testE = document.querySelector("#header3").innerHTML;
    console.log("Page load detected - testing last element on page...");
    console.log("Element text detected: " + testE);
};

function makeRectangle() {
    var svg = d3.select("body").append("svg");

    svg.attr("width", 250);
    svg.attr("height", 250);

    var rect = svg.append("rect");

    rect.attr("x", 150);
    rect.attr("y", 150);
    rect.attr("width", 20);
    rect.attr("height", 20);
}

function parseCSV() {
    d3.csv("Dummy.csv",).then(function(data) {
        for (var i = 0; i < data.length; i++){
            console.log(data[i]);
        }
    });
}

//wait for page load to trigger init test boot
window.onload = init;

//***D3 LOGIC***
//you'll want to add this functionality into the init() function