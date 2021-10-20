//var d3 = require("d3");

//test last e on page to make sure everything loaded
function init() {
    //var testE = document.querySelector("#header3").innerHTML;
    console.log("Page load detected - testing last element on page...");
    //console.log("Element text detected: " + testE);
};


var uploadedCsvData = localStorage.getItem("csvData:fileHandler.js");  // Data that was uploaded from a csv into filePicker.html. 
var mainDataset = [];                                                  // String data was stored in local storage in fileHandler.js and then grabbed in this js file to parse.



var yValArrayMaxMin = [];     // X axis data to dynamically scale the x axis
var xValArrayMaxMin = []     // Y axis data to dynamically scale the y axis

var timePoint = 0.0;     // Variable for giving time values to data
var regularTrialRows = [];  // Rows of regular stimulus data
var oddballTrialRows = [];  // Rows of oddball stimulus data
var regularRawGraphData = [];
var oddballRawGraphData = [];
var xRawMinMax = [];
var yRawMinMax = [];

var avg = 0;
var avgSmooth = 0;   // Averaging variables to calculate averages between epochs and SMA(Simple moving average) for the averaged epochs.
var avgTime = 0; // Value for SMA. Time value that is the median for the 5 averaged epochs. Ex.(0, 4, 8, 12, 16) would be 8

var divisor = 0;  // Value to divide the added values of a given time point for all epochs.          Ex.(123423 / 258 or 257 Depends on if its final time point in epochs.)
var divisorSmooth = 5; // SMA value for taking 5 averaged epochs and averaging thoise together.      // Because not all epochs are the same length.

var regularEpochs = [];  // These arrays are for the holding the averaged epochs
var oddballEpochs = [];
var xAvgedMinMax = [];
var yAvgedMinMax = [];



var regularEpochsToSmooth = []; // These arrays are for holding the averaged epochs but they are objects with a time point to access.
var oddballEpochsToSmooth = []; // to find the SMA.

var bcRegular = [];  // Averaged data with baseLine correction
var bcOddball = [];
var xBcAvgMinMax =[];
var yBcAvgMinMax =[];

var bcRegToSmooth = [];
var bcOddToSmooth = [];

var smoothRegularEpochs = []; // These arrays hold the SMA(Simple moving average).
var smoothOddballEpochs = [];




function averageDataDrawFirstGraph() {
    // Flag for splitting up oddball trial data from regular data
    var oddBallAvgFlag = false;
    
    // for loop to cycle through entire data of csv
    for (let i = 0; i < mainDataset.length; i++) {

        
        // Switch for seperating trial datasets from intertrial datasets, as well as oddball trial datasets
        // If trialStart value is = to 5, means that a trial is underway. If = 0, means interTrial period
        switch (mainDataset[i].trialstart) {
            
            case "5":
                // If mainDataset[i].oddball == 5 then it is oddball trial data
                // So, grab each row of data in the trial that is oddball stimulus
                // TRIAL IS AN ODDBALL STIMULUS TRIAL
                if (mainDataset[i].oddball == 5) {
                    oddBallAvgFlag = true; // Set flag to true for oddball stimulus trial
                    
                    var myData = new Object(); // Create empty object to send row data to an array to average later
                    myData.time = timePoint; // Set time on myData object = to timePoint. Which will keep incrementing until trial is over
                    myData.measure = parseFloat(mainDataset[i].microvolts); // Set mV value from row = to measure on myData object
                    var graphData = [timePoint, parseFloat(mainDataset[i].microvolts)];
                    xRawMinMax.push(timePoint);
                    yRawMinMax.push(parseFloat(mainDataset[i].microvolts));
                    timePoint += 4.0; // Increment timePoint after every row in each trial to keep a constant time window for all trials

                    oddballRawGraphData.push(graphData);
                    oddballTrialRows.push(myData); // Push myData object to oddballTrialRows array to average out later.

                    break;  // break out of case to check if we are still in a trial
                }

                // TRIAL IS NOT AN ODDBALL STIMULUS TRIAL
                // Since mainDataset[i].oddball == 0, this means it is regular trial data
                var myData = new Object();  // Create empty object to send row data to an array to average later
                myData.time = timePoint;    // Set time on myData object = to timePoint. Which will keep incrementing until trial is over
                myData.measure = parseFloat(mainDataset[i].microvolts);  // Set mV value from row = to measure on myData object
                var graphData = [timePoint, parseFloat(mainDataset[i].microvolts)];
                xRawMinMax.push(timePoint);
                yRawMinMax.push(parseFloat(mainDataset[i].microvolts));
                timePoint += 4.0;  // Increment timePoint after every row in each trial to keep a constant time window for all trials
                
                regularRawGraphData.push(graphData);
                regularTrialRows.push(myData);  // Push myData object to regularTrialRows array to average out later.

                break;  // break out of case to check if we are still in a trial
            
            

            // WE ARE NOT IN A TRIAL (INTERTRIAL PERIOD)

            case "0":
                oddBallAvgFlag = false;  // Set flag to false to reset for when we come across another oddball trial
                timePoint = 0;  // Reset timePoint to 0 to keep each trial and their data on the same time window, in order to average accurately
                break;  // Break out of current case to see if we are still not in a trial
            default:
                break;
        }
        
        
    }
    
    
    
    // For loop to cycle through regular trial data and average them out between timepoints.
    for (let i = 0; i < regularTrialRows.length; i++) {
        
        var placeHolderVal = regularTrialRows[i].time; // Placeholder value to make sure we are still averaging a single given time point.
        // We set the value = to the first time point we are going to average out.
        // Then we cycle through the data again only looking for that time point and then average it.
        for (let i = 0; i < regularTrialRows.length; i++) {
            // For example, if regularTrialRows[i].time == 0, then grab that measure and add 1 to divisor to average at the end
            if (regularTrialRows[i].time == placeHolderVal) {
                
                avg += regularTrialRows[i].measure; // Adding measure to average
                
                divisor++; // Add one to accurately average.

                
            }
            
        }
        
        // WE HAVE CYCLED THROUGH ALL DATA AT THE GIVEN TIME POINT

        avg = avg / divisor; // Calculate average
        
        
        
        var testArrayAverage = [regularTrialRows[i].time, avg]; // Create array object of current timepoint and the average
        //yValArrayMaxMin.push(avg); // Push average to yValArrayMaxMin to dynamically scale y axis
        //xValArrayMaxMin.push(regularTrialRows[i].time); // Push time to xValArrayMaxMin to dynamically scale x axis

        // CREATE myData OBJECT TO LATER CALCULATE SMA.
        // We need to do this in order to grab the measure and time points of the averaged epochs. Because you can not grab them
        // from a regular array
        var myData = new Object();
        myData.time = regularTrialRows[i].time;
        myData.measure = avg;
        xAvgedMinMax.push(regularTrialRows[i].time);
        yAvgedMinMax.push(avg);
        regularEpochsToSmooth.push(myData) // Push to regularEpochsToSmooth to calc SMA later

        regularEpochs.push(testArrayAverage); // push our array object with time point and average to regularEpochs
        avg = 0; // Reset average
        divisor = 0; // Reset divisor


        // HARD STOP FOR THE LOOP
        if (i == 257) {
            break;
        }
        
        
        
    }


    // For loop to cycle through oddball trial data and average them out between timepoints.
    for (let i = 0; i < oddballTrialRows.length; i++) {
        
        var placeHolderVal = oddballTrialRows[i].time;  // Placeholder value to make sure we are still averaging a single given time point.

        for (let i = 0; i < oddballTrialRows.length; i++) {
            if (oddballTrialRows[i].time == placeHolderVal) {
                
                avg += oddballTrialRows[i].measure;  // Adding measure to average
                
                
                divisor++;  // Add one to accurately average.
                
                
            }
            
        }


        // WE HAVE CYCLED THROUGH ALL DATA AT THE GIVEN TIME POINT
        avg = avg / divisor;  // Calculate average
        
        
        var testArrayAverage = [oddballTrialRows[i].time, avg]; // Create array object of current timepoint and the average
        //yValArrayMaxMin.push(avg);  // Push average to yValArrayMaxMin to dynamically scale y axis
        //xValArrayMaxMin.push(oddballTrialRows[i].time);  // Push time to xValArrayMaxMin to dynamically scale x axis

        var myData = new Object();
        myData.time = oddballTrialRows[i].time;
        myData.measure = avg;
        xAvgedMinMax.push(oddballTrialRows[i].time);
        yAvgedMinMax.push(avg);
        oddballEpochsToSmooth.push(myData) // Push to oddballEpochsToSmooth to calc SMA later

        oddballEpochs.push(testArrayAverage); // push our array object with time point and average to oddballEpochs
        // RESETS
        avg = 0;
        divisor = 0;
        // HARD STOP
        if (i == 255) {
            break;
        }
        
        
        
    }

    // start by reading in time point 1-50
    // add the values up and divide by 50, result is equal to vertical displacement from zero line
    // note that the sign of the result (positive or negative) tells you which way to move the whole line
    // e.g. If the average voltage of time points 1-50 in the oddball is -6.789 microvolts,
    // this means the whole oddball chart line is 6.789 mv too low
    // ergo, add 6.789 to *every* value in the whole oddball averaged epoch
    

    // console.log(regularEpochsSmooth);
    // console.log(oddballEpochs);
    baselineCorrection(regularEpochsToSmooth, oddballEpochsToSmooth);

    // Data Smoothing to get moving average.
    dataSmoothing(bcRegToSmooth, bcOddToSmooth);
    
    // console.log(regularEpochsToSmooth);
    // console.log(smoothRegularEpochs);
    
    
    

    
    //drawAveragedGraph();
    
    

}

function baselineCorrection(regularEpochsToSmooth, oddballEpochsToSmooth) {
    var sum = 0;
    var time = -200;
    console.log(regularEpochsToSmooth);
    for (let i = 0; i < 49; i++) {
        //console.log(regularEpochsToSmooth[i].measure)
        sum += regularEpochsToSmooth[i].measure;
        
        
    }
    sum = sum / 50;
    for (let i = 0; i < regularEpochsToSmooth.length; i++) {
        var data = [time ,regularEpochsToSmooth[i].measure - sum];
        xBcAvgMinMax.push(time);
        yBcAvgMinMax.push(regularEpochsToSmooth[i].measure - sum);
        var dataObject = new Object;
        dataObject.time = time;
        dataObject.measure = regularEpochsToSmooth[i].measure - sum;
        bcRegToSmooth.push(dataObject);
        yValArrayMaxMin.push(regularEpochsToSmooth[i].measure - sum); // Push average to yValArrayMaxMin to dynamically scale y axis
        xValArrayMaxMin.push(time); // Push time to xValArrayMaxMin to dynamically scale x axis
        bcRegular.push(data);
        time += 4;
        
    }

    var sum = 0;
    var time = -200;
    for (let i = 0; i < 49; i++) {
        sum += oddballEpochsToSmooth[i].measure;
        
    }
    sum = sum / 50;
    for (let i = 0; i < oddballEpochsToSmooth.length; i++) {
        var data = [time ,oddballEpochsToSmooth[i].measure - sum];
        xBcAvgMinMax.push(time);
        yBcAvgMinMax.push(oddballEpochsToSmooth[i].measure - sum);
        var dataObject = new Object;
        dataObject.time = time;
        dataObject.measure = oddballEpochsToSmooth[i].measure - sum;
        bcOddToSmooth.push(dataObject);
        yValArrayMaxMin.push(oddballEpochsToSmooth[i].measure - sum); // Push average to yValArrayMaxMin to dynamically scale y axis
        xValArrayMaxMin.push(time); // Push time to xValArrayMaxMin to dynamically scale x axis
        bcOddball.push(data);
        time += 4;
        
    }
    
    
}



function dataSmoothing(regularEpochsToSmooth, oddballEpochsToSmooth) {
    // place holder val for counting up to five to then calculate SMA
    var placeHolderValSmooth = 0;

    // For loop to cycle through regular trial epochs
    for (let i = 0; i < regularEpochsToSmooth.length; i++) {
        placeHolderValSmooth++; // Add one to placeholder val
        avgSmooth += regularEpochsToSmooth[i].measure; // add the average (of the already averaged time point.)
        
        if (placeHolderValSmooth == 3) {
            avgTime = regularEpochsToSmooth[i].time; // If it is the middle of the 5 averages, grab time point and set it to avgTime
        }
        
        
        // Do our calc
        if (placeHolderValSmooth == 5) {
            avgSmooth = avgSmooth / divisorSmooth; // Calc average
            
            var data = [avgTime, avgSmooth]; // Create array and pust to smoothRegularEpochs
            smoothRegularEpochs.push(data);
            
            placeHolderValSmooth = 0; // reset placeholder
            i = i - 4; // Make the loop go back 4 places to restart the SMA process and start at next time point. EX.(0, 4, 8, 12, 16.....4, 8, 12, 16, 20)
            
            avgSmooth = 0; // reset for SMA
            avgTime = 0; // reset for timepoint
        }

    }

    // More resets just incase
    placeHolderValSmooth = 0;
    avgSmooth = 0;
    avgTime = 0;

    for (let i = 0; i < oddballEpochsToSmooth.length; i++) {
        // place holder val for counting up to five to then calculate SMA
        placeHolderValSmooth++;
        avgSmooth += oddballEpochsToSmooth[i].measure; // add the average (of the already averaged time point.)
        
        if (placeHolderValSmooth == 3) {
            avgTime = oddballEpochsToSmooth[i].time;  // If it is the middle of the 5 averages, grab time point and set it to avgTime
        }
        
        // Do our calc
        if (placeHolderValSmooth == 5) {
            avgSmooth = avgSmooth / divisorSmooth;  // Calc average
            
            var data = [avgTime, avgSmooth];  // Create array and pust to smoothOddballEpochs
            smoothOddballEpochs.push(data);
            placeHolderValSmooth = 0;  // reset placeholder
            i = i - 4;   // Make the loop go back 4 places to restart the SMA process and start at next time point. EX.(0, 4, 8, 12, 16.....4, 8, 12, 16, 20)
            
            avgSmooth = 0;  // reset for SMA
            avgTime = 0;  // reset for timepoint
        }

    }
    
}

// function clearGraphRaw() {
//     var svg = d3.select("#graphRaw");
//     svg.selectAll("*").remove();
// }

// function clearGraphAveraged() {
//     var svg = d3.select("#graphRaw");
//     svg.selectAll("*").remove();
// }

function compareRawToAveraged() {
    var svg = d3.select("#graph"), margin = 200, width = svg.attr("width") - margin, //600
        height = svg.attr("height") - margin; //500


    // Step 4 
    var xScale = d3.scaleLinear().domain([d3.min(xRawMinMax), d3.max(xRawMinMax)]).range([0, width]), yScale = d3.scaleLinear().domain([d3.min(yRawMinMax), d3.max(yRawMinMax)]).range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");
    

    // Step 5
    // Title
    // svg.append('text')
    //     .attr('x', width / 2 + 100)
    //     .attr('y', 100)
    //     .attr('text-anchor', 'middle')
    //     .style('font-family', 'Helvetica')
    //     .style('font-size', 20)
    //     .text('Raw Data');

    // // X label
    // svg.append('text')
    //     .attr('x', width / 2 + 100)
    //     .attr('y', height - 15 + 150)
    //     .attr('text-anchor', 'middle')
    //     .style('font-family', 'Helvetica')
    //     .style('font-size', 12)
    //     .text('Time (ms)');

    // // Y label
    // svg.append('text')
    //     .attr('text-anchor', 'middle')
    //     .attr('transform', 'translate(60,' + height + ')rotate(-90)')
    //     .style('font-family', 'Helvetica')
    //     .style('font-size', 12)
    //     .text('Amplitude (Microvolts)');

    // Step 6
    // g.append("g")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(xScale));

    // g.append("g")
    //     .call(d3.axisLeft(yScale));

    

    //Step 7
    // svg.append('g')
    //     .selectAll("dot")
    //     .data(oddballEpochs)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function (d) { return xScale(d[0]); })
    //     .attr("cy", function (d) { return yScale(d[1]); })
    //     .attr("r", 3)
    //     .attr("transform", "translate(" + 100 + "," + 100 + ")")
    //     .style("fill", "#CC0000");
    // // Dots for oddball trial data
    // svg.append('g')
    //     .selectAll("dot")
    //     .data(regularEpochs)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function (d) { return xScale(d[0]); })
    //     .attr("cy", function (d) { return yScale(d[1]); })
    //     .attr("r", 3)
    //     .attr("transform", "translate(" + 100 + "," + 100 + ")")
    //     .style("fill", "#0000FF");

    // Step 8        
    var line = d3.line()
        .x(function (d) { return xScale(d[0]); })
        .y(function (d) { return yScale(d[1]); })
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(regularRawGraphData)
        .attr("class", "line")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#7777AA")
        .style("stroke-width", "1");
    //Line for oddball trial data
    svg.append("path")
        .datum(oddballRawGraphData)
        .attr("class", "line")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#AA7777")
        .style("stroke-width", "1");
}

function compareSmaToBaseline() {
    var svg = d3.select("#graph3"), margin = 200, width = svg.attr("width") - margin, //600
        height = svg.attr("height") - margin; //500


    // Step 4 
    var xScale = d3.scaleLinear().domain([d3.min(xBcAvgMinMax), d3.max(xBcAvgMinMax)]).range([0, width]), yScale = d3.scaleLinear().domain([d3.min(yBcAvgMinMax), d3.max(yBcAvgMinMax)]).range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");
    

    // Step 5
    // Title
    // svg.append('text')
    //     .attr('x', width / 2 + 100)
    //     .attr('y', 100)
    //     .attr('text-anchor', 'middle')
    //     .style('font-family', 'Helvetica')
    //     .style('font-size', 20)
    //     .text('Averaged Data w/Baseline');

    // X label
    // svg.append('text')
    //     .attr('x', width / 2 + 100)
    //     .attr('y', height - 15 + 150)
    //     .attr('text-anchor', 'middle')
    //     .style('font-family', 'Helvetica')
    //     .style('font-size', 12)
    //     .text('Time (ms)');

    // Y label
    // svg.append('text')
    //     .attr('text-anchor', 'middle')
    //     .attr('transform', 'translate(60,' + height + ')rotate(-90)')
    //     .style('font-family', 'Helvetica')
    //     .style('font-size', 12)
    //     .text('Amplitude (Microvolts)');

    // Step 6
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    g.append("g")
        .call(d3.axisLeft(yScale));

    

    //Step 7
    // svg.append('g')
    //     .selectAll("dot")
    //     .data(oddballEpochs)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function (d) { return xScale(d[0]); })
    //     .attr("cy", function (d) { return yScale(d[1]); })
    //     .attr("r", 3)
    //     .attr("transform", "translate(" + 100 + "," + 100 + ")")
    //     .style("fill", "#CC0000");
    // // Dots for oddball trial data
    // svg.append('g')
    //     .selectAll("dot")
    //     .data(regularEpochs)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function (d) { return xScale(d[0]); })
    //     .attr("cy", function (d) { return yScale(d[1]); })
    //     .attr("r", 3)
    //     .attr("transform", "translate(" + 100 + "," + 100 + ")")
    //     .style("fill", "#0000FF");

    // Step 8        
    var line = d3.line()
        .x(function (d) { return xScale(d[0]); })
        .y(function (d) { return yScale(d[1]); })
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(bcRegular)
        .attr("class", "line")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#7777AA")
        .style("stroke-width", "2");
    //Line for oddball trial data
    svg.append("path")
        .datum(bcOddball)
        .attr("class", "line")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#AA7777")
        .style("stroke-width", "2");
}

function compareAveragedToBaseline() {
    var svg = d3.select("#graph2"), margin = 200, width = svg.attr("width") - margin, //600
        height = svg.attr("height") - margin; //500


    // Step 4 
    var xScale = d3.scaleLinear().domain([d3.min(xBcAvgMinMax), d3.max(xBcAvgMinMax)]).range([0, width]), yScale = d3.scaleLinear().domain([d3.min(yBcAvgMinMax), d3.max(yBcAvgMinMax)]).range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");
    

    // Step 5
    // Title
    // svg.append('text')
    //     .attr('x', width / 2 + 100)
    //     .attr('y', 100)
    //     .attr('text-anchor', 'middle')
    //     .style('font-family', 'Helvetica')
    //     .style('font-size', 20)
    //     .text('Averaged Data');

    // X label
    // svg.append('text')
    //     .attr('x', width / 2 + 100)
    //     .attr('y', height - 15 + 150)
    //     .attr('text-anchor', 'middle')
    //     .style('font-family', 'Helvetica')
    //     .style('font-size', 12)
    //     .text('Time (ms)');

    // Y label
    // svg.append('text')
    //     .attr('text-anchor', 'middle')
    //     .attr('transform', 'translate(60,' + height + ')rotate(-90)')
    //     .style('font-family', 'Helvetica')
    //     .style('font-size', 12)
    //     .text('Amplitude (Microvolts)');

    //Step 6
    // g.append("g")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(xScale));

    // g.append("g")
    //     .call(d3.axisLeft(yScale));

    

    //Step 7
    // svg.append('g')
    //     .selectAll("dot")
    //     .data(oddballEpochs)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function (d) { return xScale(d[0]); })
    //     .attr("cy", function (d) { return yScale(d[1]); })
    //     .attr("r", 3)
    //     .attr("transform", "translate(" + 100 + "," + 100 + ")")
    //     .style("fill", "#CC0000");
    // // Dots for oddball trial data
    // svg.append('g')
    //     .selectAll("dot")
    //     .data(regularEpochs)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function (d) { return xScale(d[0]); })
    //     .attr("cy", function (d) { return yScale(d[1]); })
    //     .attr("r", 3)
    //     .attr("transform", "translate(" + 100 + "," + 100 + ")")
    //     .style("fill", "#0000FF");

    // Step 8        
    var line = d3.line()
        .x(function (d) { return xScale(d[0]); })
        .y(function (d) { return yScale(d[1]); })
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(regularEpochs)
        .attr("class", "line")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#7777AA")
        .style("stroke-width", "2");
    // Line for oddball trial data
    svg.append("path")
        .datum(oddballEpochs)
        .attr("class", "line")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#AA7777")
        .style("stroke-width", "2");
    
    console.log(regularEpochs);
}

function clearGraphBaseline() {
    var svg = d3.select("#graph2");
    svg.selectAll("*").remove();
}

function clearGraphSMA() {
    var svg = d3.select("#graph3");
    svg.selectAll("*").remove();
}

function clearGraphAveraged() {
    var svg = d3.select("#graph");
    svg.selectAll("*").remove();
}

function rawDataGraph() {
    
    var svg = d3.select("#graphRaw"), margin = 200, width = svg.attr("width") - margin, //600
        height = svg.attr("height") - margin; //500


    // Step 4 
    var xScale = d3.scaleLinear().domain([d3.min(xRawMinMax), d3.max(xRawMinMax)]).range([0, width]), yScale = d3.scaleLinear().domain([d3.min(yRawMinMax), d3.max(yRawMinMax)]).range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");
    

    // Step 5
    // Title
    svg.append('text')
        .attr('x', width / 2 + 100)
        .attr('y', 100)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .text('Raw Data');

    // X label
    svg.append('text')
        .attr('x', width / 2 + 100)
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

    

    //Step 7
    // svg.append('g')
    //     .selectAll("dot")
    //     .data(oddballEpochs)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function (d) { return xScale(d[0]); })
    //     .attr("cy", function (d) { return yScale(d[1]); })
    //     .attr("r", 3)
    //     .attr("transform", "translate(" + 100 + "," + 100 + ")")
    //     .style("fill", "#CC0000");
    // // Dots for oddball trial data
    // svg.append('g')
    //     .selectAll("dot")
    //     .data(regularEpochs)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function (d) { return xScale(d[0]); })
    //     .attr("cy", function (d) { return yScale(d[1]); })
    //     .attr("r", 3)
    //     .attr("transform", "translate(" + 100 + "," + 100 + ")")
    //     .style("fill", "#0000FF");

    // Step 8        
    var line = d3.line()
        .x(function (d) { return xScale(d[0]); })
        .y(function (d) { return yScale(d[1]); })
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(regularRawGraphData)
        .attr("class", "line")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#7777AA")
        .style("stroke-width", "1");
    //Line for oddball trial data
    svg.append("path")
        .datum(oddballRawGraphData)
        .attr("class", "line")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#AA7777")
        .style("stroke-width", "1");
    
    
}


function drawGraphMovingAverage() {
    var svg = d3.select("#graph3"), margin = 200, width = svg.attr("width") - margin, //600
        height = svg.attr("height") - margin; //500


    // Step 4 
    var xScale = d3.scaleLinear().domain([d3.min(xValArrayMaxMin), d3.max(xValArrayMaxMin)]).range([0, width]), yScale = d3.scaleLinear().domain([d3.min(yValArrayMaxMin), d3.max(yValArrayMaxMin)]).range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");
    

    // Step 5
    // Title
    svg.append('text')
        .attr('x', width / 2 + 100)
        .attr('y', 100)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .text('Moving Average w/Baseline');

    // X label
    svg.append('text')
        .attr('x', width / 2 + 100)
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

    

    //Step 7
    // svg.append('g')
    //     .selectAll("dot")
    //     .data(oddballEpochs)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function (d) { return xScale(d[0]); })
    //     .attr("cy", function (d) { return yScale(d[1]); })
    //     .attr("r", 3)
    //     .attr("transform", "translate(" + 100 + "," + 100 + ")")
    //     .style("fill", "#CC0000");
    // // Dots for oddball trial data
    // svg.append('g')
    //     .selectAll("dot")
    //     .data(regularEpochs)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function (d) { return xScale(d[0]); })
    //     .attr("cy", function (d) { return yScale(d[1]); })
    //     .attr("r", 3)
    //     .attr("transform", "translate(" + 100 + "," + 100 + ")")
    //     .style("fill", "#0000FF");

    // Step 8        
    var line = d3.line()
        .x(function (d) { return xScale(d[0]); })
        .y(function (d) { return yScale(d[1]); })
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(smoothRegularEpochs)
        .attr("class", "line")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#0000FF")
        .style("stroke-width", "2");
    //Line for oddball trial data
    svg.append("path")
        .datum(smoothOddballEpochs)
        .attr("class", "line")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#CC0000")
        .style("stroke-width", "2");
}

function drawGraphBaseLine() {
    var svg = d3.select("#graph2"), margin = 200, width = svg.attr("width") - margin, //600
        height = svg.attr("height") - margin; //500


    // Step 4 
    var xScale = d3.scaleLinear().domain([d3.min(xBcAvgMinMax), d3.max(xBcAvgMinMax)]).range([0, width]), yScale = d3.scaleLinear().domain([d3.min(yBcAvgMinMax), d3.max(yBcAvgMinMax)]).range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");
    

    // Step 5
    // Title
    svg.append('text')
        .attr('x', width / 2 + 100)
        .attr('y', 100)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .text('Averaged Data w/Baseline');

    // X label
    svg.append('text')
        .attr('x', width / 2 + 100)
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

    

    //Step 7
    // svg.append('g')
    //     .selectAll("dot")
    //     .data(oddballEpochs)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function (d) { return xScale(d[0]); })
    //     .attr("cy", function (d) { return yScale(d[1]); })
    //     .attr("r", 3)
    //     .attr("transform", "translate(" + 100 + "," + 100 + ")")
    //     .style("fill", "#CC0000");
    // // Dots for oddball trial data
    // svg.append('g')
    //     .selectAll("dot")
    //     .data(regularEpochs)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function (d) { return xScale(d[0]); })
    //     .attr("cy", function (d) { return yScale(d[1]); })
    //     .attr("r", 3)
    //     .attr("transform", "translate(" + 100 + "," + 100 + ")")
    //     .style("fill", "#0000FF");

    // Step 8        
    var line = d3.line()
        .x(function (d) { return xScale(d[0]); })
        .y(function (d) { return yScale(d[1]); })
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(bcRegular)
        .attr("class", "line")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#0000FF")
        .style("stroke-width", "2");
    //Line for oddball trial data
    svg.append("path")
        .datum(bcOddball)
        .attr("class", "line")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#CC0000")
        .style("stroke-width", "2");
}

function drawAveragedGraph() {
    var svg = d3.select("#graph"), margin = 200, width = svg.attr("width") - margin, //600
        height = svg.attr("height") - margin; //500


    // Step 4 
    var xScale = d3.scaleLinear().domain([d3.min(xAvgedMinMax), d3.max(xAvgedMinMax)]).range([0, width]), yScale = d3.scaleLinear().domain([d3.min(yAvgedMinMax), d3.max(yAvgedMinMax)]).range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");
    

    // Step 5
    // Title
    svg.append('text')
        .attr('x', width / 2 + 100)
        .attr('y', 100)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .text('Averaged Data');

    // X label
    svg.append('text')
        .attr('x', width / 2 + 100)
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

    

    //Step 7
    // svg.append('g')
    //     .selectAll("dot")
    //     .data(oddballEpochs)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function (d) { return xScale(d[0]); })
    //     .attr("cy", function (d) { return yScale(d[1]); })
    //     .attr("r", 3)
    //     .attr("transform", "translate(" + 100 + "," + 100 + ")")
    //     .style("fill", "#CC0000");
    // // Dots for oddball trial data
    // svg.append('g')
    //     .selectAll("dot")
    //     .data(regularEpochs)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function (d) { return xScale(d[0]); })
    //     .attr("cy", function (d) { return yScale(d[1]); })
    //     .attr("r", 3)
    //     .attr("transform", "translate(" + 100 + "," + 100 + ")")
    //     .style("fill", "#0000FF");

    // Step 8        
    var line = d3.line()
        .x(function (d) { return xScale(d[0]); })
        .y(function (d) { return yScale(d[1]); })
        .curve(d3.curveMonotoneX);

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

    // d3.csv("Budd01Oddball.csv",).then(function(data) {
    //     for (var i = 0; i < data.length; i++){
    //         mainDataset.push(data[i]);
    //     }
    // });

    // Use d3.csvParse to parse the uploadedCsvData String to put into arrays for maindataset
    mainDataset = d3.csvParse(uploadedCsvData);
    averageDataDrawFirstGraph();
    

}

//wait for page load to trigger init test boot
window.onload = init;

