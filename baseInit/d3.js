//var d3 = require("d3");

//test last e on page to make sure everything loaded
function init() {
    var testE = document.querySelector("#header3").innerHTML;
    console.log("Page load detected - testing last element on page...");
    console.log("Element text detected: " + testE);
};


var uploadedCsvData = localStorage.getItem("csvData:fileHandler.js");  // Data that was uploaded from a csv into filePicker.html. 
var mainDataset = [];                                                  // String data was stored in local storage in fileHandler.js and then grabbed in this js file to parse.



var xValArrayMaxMin = [];     // X axis data to dynamically scale the x axis
var yValArrayMaxMin = []     // Y axis data to dynamically scale the y axis

var timePoint = 0.0;
var regularTrialRows = [];
var oddballTrialRows = [];




function makeGraph() {
    // Flag for splitting up oddball trial data from regular data
    var oddBallAvgFlag = false;
    
    // for loop to cycle through entire data of csv
    for (let i = 0; i < mainDataset.length; i++) {

        
        // Switch for seperating trial datasets from intertrial datasets, as well as oddball trial datasets
        switch (mainDataset[i].trialstart) {
            
            case "5":
                // TRIAL IS AN ODDBALL STIMULUS TRIAL
                if (mainDataset[i].oddball == 5) {
                    oddBallAvgFlag = true;
                    

                    var myData = new Object();
                    myData.time = timePoint;
                    myData.measure = parseFloat(mainDataset[i].microvolts);
                    timePoint += 3.33;

                    oddballTrialRows.push(myData);

                    break;
                }

                // TRIAL IS NOT AN ODDBALL STIMULUS TRIAL
                
                
                

                
                var myData = new Object();
                myData.time = timePoint;
                myData.measure = parseFloat(mainDataset[i].microvolts);
                timePoint += 3.33;
                
                regularTrialRows.push(myData);

                break;
            
            

            // WE ARE NOT IN A TRIAL (INTERTRIAL PERIOD)

            case "0":

                
                
                // Set oddBallAvgFlag to false to not duplicate data, along with average of microvolts and divisor
                
                oddBallAvgFlag = false;
                

                timePoint = 0;

               
                

                // Break out of current case to see if we are still not in a trial
                break;
            default:
                break;
        }
        
        
    }
    

    
    
    var avgN = 0;
    
    var divisorNew = 0;
    var regularEpochs = [];
    var oddballEpochs = [];
    
    
    for (let i = 0; i < regularTrialRows.length; i++) {
        
        
        var placeHolderVal = regularTrialRows[i].time;

        for (let i = 0; i < regularTrialRows.length; i++) {
            if (regularTrialRows[i].time == placeHolderVal) {
                
                avgN += regularTrialRows[i].measure;
                
                divisorNew++;
                //console.log("Current Time frame is: " + placeHolderVal + " Current epoch is: " + divisorNew + " Current measure being added is: " + regularTrialRows[i].measure + " Current total is: " + avgN);
                
            }
            
        }
        //console.log("Time frame is: " + regularTrialRows[i].time + " Current average total is: " + avgN + " Divisor to divide avgN by: " + divisorNew);
        
        avgN = avgN / divisorNew;
        //console.log("Average for time Frame: " + regularTrialRows[i].time + " Average: " + avgN);
        
        var testArrayAveregae = [regularTrialRows[i].time, avgN];
        xValArrayMaxMin.push(avgN);
        yValArrayMaxMin.push(regularTrialRows[i].time);

        regularEpochs.push(testArrayAveregae);
        avgN = 0;
        divisorNew = 0;
        if (i == 257) {
            break;
        }
        
        
        
    }


    for (let i = 0; i < oddballTrialRows.length; i++) {
        
        
        var placeHolderVal = oddballTrialRows[i].time;
        for (let i = 0; i < oddballTrialRows.length; i++) {
            if (oddballTrialRows[i].time == placeHolderVal) {
                
                avgN += oddballTrialRows[i].measure;
                
                
                divisorNew++;
                console.log("Current Time frame is: " + placeHolderVal + " Current epoch is: " + divisorNew + " Current measure being added is: " + oddballTrialRows[i].measure + " Current total is: " + avgN);
                
            }
            
        }
        console.log("Time frame is: " + oddballTrialRows[i].time + " Current average total is: " + avgN + " Divisor to divide avgN by: " + divisorNew);
        avgN = avgN / divisorNew;
        console.log("Average for time Frame: " + oddballTrialRows[i].time + " Average: " + avgN);
        
        var testArrayAveregae = [oddballTrialRows[i].time, avgN];
        xValArrayMaxMin.push(avgN);
        yValArrayMaxMin.push(oddballTrialRows[i].time);

        oddballEpochs.push(testArrayAveregae);
        avgN = 0;
        divisorNew = 0;
        if (i == 255) {
            break;
        }
        
        
        
    }
    

    console.log(regularTrialRows.length);
    console.log(oddballTrialRows.length);
    
    
    
    
    
    

    // Step 3
    var svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin, //600
        height = svg.attr("height") - margin //500

    // Step 4 
    var xScale = d3.scaleLinear().domain([d3.min(yValArrayMaxMin) - 200, d3.max(yValArrayMaxMin)]).range([0, width]),
        yScale = d3.scaleLinear().domain([d3.min(xValArrayMaxMin) - 1.5, d3.max(xValArrayMaxMin) + 1.5]).range([height, 0]);
        
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
    .text('Time (ms)');
    
    // Y label
    svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(60,' + height + ')rotate(-90)')
    .style('font-family', 'Helvetica')
    .style('font-size', 12)
    .text('Amplitude (Microvolts)');

    // Step 6
    g.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(xScale));
    
    g.append("g")
     .call(d3.axisLeft(yScale));
    
    // Step 7
    // svg.append('g')
    // .selectAll("dot")
    // .data(avgsArray)
    // .enter()
    // .append("circle")
    // .attr("cx", function (d) { return xScale(d[0]); } )
    // .attr("cy", function (d) { return yScale(d[1]); } )
    // .attr("r", 3)
    // .attr("transform", "translate(" + 100 + "," + 100 + ")")
    // .style("fill", "#CC0000");
    // // Dots for oddball trial data
    // svg.append('g')
    // .selectAll("dot")
    // .data(avgsArrayOB)
    // .enter()
    // .append("circle")
    // .attr("cx", function (d) { return xScale(d[0]); } )
    // .attr("cy", function (d) { return yScale(d[1]); } )
    // .attr("r", 3)
    // .attr("transform", "translate(" + 100 + "," + 100 + ")")
    // .style("fill", "#0000FF");

    // Step 8        
    var line = d3.line()
    .x(function(d) { return xScale(d[0]); }) 
    .y(function(d) { return yScale(d[1]); }) 
    .curve(d3.curveMonotoneX)
    
    svg.append("path")
    .datum(regularEpochs) 
    .attr("class", "line") 
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    .attr("d", line)
    .style("fill", "none")
    .style("stroke", "#0000FF")
    .style("stroke-width", "2");
    // Line for oddball trial data
    svg.append("path")
    .datum(oddballEpochs) 
    .attr("class", "line") 
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    .attr("d", line)
    .style("fill", "none")
    .style("stroke", "#CC0000")
    .style("stroke-width", "2");

}


function parseCSV() {

    // Use d3.csvParse to parse the uploadedCsvData String to put into arrays for maindataset
    mainDataset = d3.csvParse(uploadedCsvData);
    

}

//wait for page load to trigger init test boot
window.onload = init;

//***D3 LOGIC***
//you'll want to add this functionality into the init() function