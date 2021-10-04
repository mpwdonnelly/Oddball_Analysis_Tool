//var d3 = require("d3");

//test last e on page to make sure everything loaded
function init() {
    var testE = document.querySelector("#header3").innerHTML;
    console.log("Page load detected - testing last element on page...");
    console.log("Element text detected: " + testE);
};

var mainDataset = [];
var cleanDatasetForGraph = [];    // Data to put on graph, not including oddball trials
var intertrialDataset = [];    // Data to not put on graph
var oddballDataset = [];      // Oddball stimulus data to put on graph in different color
var xValArrayMaxMin = [];     // X axis data to dynamically scale the x axis
var yValArrayMaxMin = []     // Y axis data to dynamically scale the y axis
var avgsArray = [];         // All averages per trial
var avgsArrayOB = [];       // All averages per oddball stimulus trial
var avgAddingVal = 0.0     // Variable for calulating averages of trials
var avgCalcDivisor = 0;    // Variable for holding value to divide by for trial/trials
var avgSetCount = 0;       // Amount of trials, not including intertrial periods
var time = 0.0;            // Point in time over the whole test

function makeGraph() {
    // Flag for splitting up oddball trial data from regular data
    oddBallAvgFlag = false;
    
    // for loop to cycle through entire data of csv
    for (let i = 0; i < mainDataset.length; i++) {

        
        // Switch for seperating trial datasets from intertrial datasets, as well as oddball trial datasets
        switch (mainDataset[i].trialstart) {
            
            case "5":
                // TRIAL IS AN ODDBALL STIMULUS TRIAL
                if (mainDataset[i].oddball == 5) {
                    oddBallAvgFlag = true;
                    // Create array object to pass to oddballData array
                    var dataArray = [time, parseFloat(mainDataset[i].microvolts)];
                    // Add the microvolt value for the current data row being iterated over
                    // to avgAddingVal to eventually find average of
                    avgAddingVal += dataArray[1];
                    // Add one to avgCalcDivisor to divide the total of microvolts by in current trial
                    avgCalcDivisor++;
                    // Push dataArray to oddBall dataset
                    oddballDataset.push(dataArray);
                    // Break out of current case to see if we are still in a trial
                    break;
                }

                // TRIAL IS NOT AN ODDBALL STIMULUS TRIAL
                // Create array object to pass to cleanDatasetForGraph array
                var dataArray = [time, parseFloat(mainDataset[i].microvolts)];
                // Add the microvolt value for the current data row being iterated over
                // to avgAddingVal to eventually find average of 
                avgAddingVal += dataArray[1];
                // Add one to avgCalcDivisor to divide the total of microvolts by in current trial
                avgCalcDivisor++;
                // Push dataArray to cleanDatasetForGraph
                cleanDatasetForGraph.push(dataArray);
                // Break out of current case to see if we are still in a trial
                break;
            
            

            // WE ARE NOT IN A TRIAL (INTERTRIAL PERIOD)
            // Here we cut off adding data to the array that will be showed in the graph
            // We also seperate the trials from eachother
            case "0":

                if (avgAddingVal != 0.0) {
                    // If avgAddingVal is not = 0 and oddBallAvgFlag = true (meaning we just came off an oddball trial)
                    // we set avgAddingVal = to the avgAddingVal(total of microvolts in trial) / avgCalcDivisor(amount of microvolts measurements in trial)
                    if (oddBallAvgFlag == true) {
                        avgAddingVal = avgAddingVal / avgCalcDivisor;     //^^^^^

                        // We add 1 to our avgSetCount to keep track of how many trials we have in the data/test
                        avgSetCount++;

                        // Then we push an array of the average of the current trial, along with the current trial count (avgSetCount)
                        avgsArrayOB.push([avgSetCount, avgAddingVal]);

                        // We also push the average of the trial to yValArrayMaxMin to scale the y axis dynamically
                        yValArrayMaxMin.push(avgAddingVal);

                    } else { // JUST GOT DONE WITH REGULAR TRIAL, NOT ODDBALL

                        avgAddingVal = avgAddingVal / avgCalcDivisor;  // Calcultate avg of current trial

                        avgSetCount++;  // We add 1 to our avgSetCount to keep track of how many trials we have in the data/test

                        // Then we push an array of the average of the current trial, along with the current trial count (avgSetCount)
                        avgsArray.push([avgSetCount, avgAddingVal]);

                        // We also push the average of the trial to yValArrayMaxMin to scale the y axis dynamically
                        yValArrayMaxMin.push(avgAddingVal);
                    }
                    
                }
                
                // Set oddBallAvgFlag to false to not duplicate data, along with average of microvolts and divisor
                oddBallAvgFlag = false;
                avgAddingVal = 0.0;
                avgCalcDivisor = 0;

                // Create dataArray and push into intertrial dataset
                var dataArray = [time, parseFloat(mainDataset[i].microvolts)];
                intertrialDataset.push(dataArray);

                // Break out of current case to see if we are still not in a trial
                break;
            default:
                break;
        }
        
        
        
        // Push our trial count to xValArrayMaxMin to scale x axis dynamically
        xValArrayMaxMin.push(avgSetCount);
        
        
        
        // add 3 hundred thousandths of a second to time
        time += 3.33333E-05;
        
        
        
    }
    

    // UNCOMMENT TO SEE AVERAGES OF TRIALS SPLIT BETWEEN ODDBALL AND REGULAR
    // console.log(avgsArrayOB);
    // console.log(avgsArray);

    // UNCOMMENT EACH LINE INDIVIDUALLY TO SEE DATA SPLIT UP WITH A TIMEFRAME
    //console.log(cleanDatasetForGraph)  NO INTERTRIAL OR ODDBALL DATA;
    //console.log(intertrialDataset)  INTERTRIAL DATA ONLY;
    //console.log(oddballDataset)  ODDBALL DATA ONLY;
    
    
    

    // Step 3
    var svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin, //600
        height = svg.attr("height") - margin //500

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
    .text('Trial Number');
    
    // Y label
    svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(60,' + height + ')rotate(-90)')
    .style('font-family', 'Helvetica')
    .style('font-size', 12)
    .text('Average of Microvolts');

    // Step 6
    g.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(xScale));
    
    g.append("g")
     .call(d3.axisLeft(yScale));
    
    // Step 7
    svg.append('g')
    .selectAll("dot")
    .data(avgsArray)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return xScale(d[0]); } )
    .attr("cy", function (d) { return yScale(d[1]); } )
    .attr("r", 3)
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    .style("fill", "#CC0000");
    // Dots for oddball trial data
    svg.append('g')
    .selectAll("dot")
    .data(avgsArrayOB)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return xScale(d[0]); } )
    .attr("cy", function (d) { return yScale(d[1]); } )
    .attr("r", 3)
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    .style("fill", "#0000FF");

    // Step 8        
    var line = d3.line()
    .x(function(d) { return xScale(d[0]); }) 
    .y(function(d) { return yScale(d[1]); }) 
    .curve(d3.curveMonotoneX)
    
    svg.append("path")
    .datum(avgsArray) 
    .attr("class", "line") 
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    .attr("d", line)
    .style("fill", "none")
    .style("stroke", "#CC0000")
    .style("stroke-width", "2");
    // Line for oddball trial data
    svg.append("path")
    .datum(avgsArrayOB) 
    .attr("class", "line") 
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    .attr("d", line)
    .style("fill", "none")
    .style("stroke", "#0000FF")
    .style("stroke-width", "2");

}


function parseCSV() {

    d3.csv("Budd01Oddball.csv",).then(function(data) {
        for (var i = 0; i < data.length; i++){
            mainDataset.push(data[i]);
        }
    });

}

//wait for page load to trigger init test boot
window.onload = init;

//***D3 LOGIC***
//you'll want to add this functionality into the init() function