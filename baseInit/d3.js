//var d3 = require("d3");

//test last e on page to make sure everything loaded
function init() {
    var testE = document.querySelector("#header3").innerHTML;
    console.log("Page load detected - testing last element on page...");
    console.log("Element text detected: " + testE);
};

var test01 = [];

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

function makeGraph() {
    
    var dataset2 = [];
    var xValArrayMaxMin = [];
    var yValArrayMaxMin = []

    for (let i = 0; i < test01.length; i++) {
        //console.log(test01[i].microvolts);
        var dataArray = [parseFloat(test01[i].ms), parseFloat(test01[i].microvolts)];
        xValArrayMaxMin.push(parseFloat(test01[i].ms));
        yValArrayMaxMin.push(parseFloat(test01[i].microvolts));
        dataset2.push(dataArray);
    }
    
    

    // Step 3
    var svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin, //300
        height = svg.attr("height") - margin //200

    // Step 4 
    var xScale = d3.scaleLinear().domain([d3.min(xValArrayMaxMin), d3.max(xValArrayMaxMin)]).range([0, width]),
        yScale = d3.scaleLinear().domain([d3.min(yValArrayMaxMin), d3.max(yValArrayMaxMin)]).range([height, 0]);
        
    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    // Step 5
    // Title
    svg.append('text')
    .attr('x', width/2 + 100)
    .attr('y', 100)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', 20)
    .text('Oddball');
    
    // X label
    svg.append('text')
    .attr('x', width/2 + 100)
    .attr('y', height - 15 + 150)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', 12)
    .text('Milliseconds');
    
    // Y label
    svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(60,' + height + ')rotate(-90)')
    .style('font-family', 'Helvetica')
    .style('font-size', 12)
    .text('Microvolts');

    // Step 6
    g.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(xScale));
    
    g.append("g")
     .call(d3.axisLeft(yScale));
    
    // Step 7
    svg.append('g')
    .selectAll("dot")
    .data(dataset2)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return xScale(d[0]); } )
    .attr("cy", function (d) { return yScale(d[1]); } )
    .attr("r", 3)
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    .style("fill", "#CC0000");

    // Step 8        
    var line = d3.line()
    .x(function(d) { return xScale(d[0]); }) 
    .y(function(d) { return yScale(d[1]); }) 
    .curve(d3.curveMonotoneX)
    
    svg.append("path")
    .datum(dataset2) 
    .attr("class", "line") 
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    .attr("d", line)
    .style("fill", "none")
    .style("stroke", "#CC0000")
    .style("stroke-width", "2");

}


function parseCSV() {
    d3.csv("Dummy.csv",).then(function(data) {
        for (var i = 0; i < data.length; i++){
            //console.log(data[i]);
            test01.push(data[i]);
        }
    });
}

//wait for page load to trigger init test boot
window.onload = init;

//***D3 LOGIC***
//you'll want to add this functionality into the init() function