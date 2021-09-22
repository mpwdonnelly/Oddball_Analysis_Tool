//gives access to D3 module
const d3 = require("d3");

//test last e on page to make sure everything loaded
function init() {
    var testE = document.querySelector("#header1").innerHTML;
    console.log("Page load detected - testing last element on page...");
    console.log("Element text detected: " + testE);
};

//wait for page load to trigger init test boot
window.onload = init;

//***D3 LOGIC***
//you'll want to add this functionality into the init() function so those 3 divs can become th