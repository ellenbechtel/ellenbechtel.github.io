/////////////////////////////////
// Set up all the static variables
//////////////////////////////////

var width = d3.min([window.innerWidth, 900]);
var height = d3.min([window.innerHeight, 500]);
var margin = {
    top: 20,
    right: 20,
    bottom: 50,
    left: 100
};
var data = [];
var dataMax = 1;

var chartWidth = width - margin.left - margin.right;
var chartHeight = height - margin.top - margin.bottom;

var svg = d3.select("#chart")
    .attr("width", width)
    .attr("height", height);


// Water Scale

var onWater = d3.scaleBand()
    .domain(["true","false"])
    .range(["Water","Land"]);


// X Scale

var x = d3.scaleBand()
    .domain(["Water","Land"])
    .rangeRound([margin.left, chartWidth-margin.right])
    .padding(0.5);

var xAxis = d3.axisBottom(x);

svg.select("#x")
    .attr("transform","translate(0," + (margin.top + chartHeight) + ")")
    .call(xAxis);

var xAxisLabel = svg.append("text")
    .attr("class","axisLabel")
    .attr("x", chartWidth/2)
    .attr("y", chartHeight+margin.bottom)
    .text("Where You're Landing");

// Y Scale


var recScale = d3.scaleBand()   // how strongly we believe you'll need this vehicle
    .domain("false","true") 
    .range([0,100]);

var y = d3.scaleLinear()
    .domain([0,100]) // Scale the Y axis to be the full height of the chart, where false is on the bottom and true is all the way at the top
    .range([margin.top + chartHeight, margin.top]);

var yAxis = d3.axisLeft(y);

svg.select("#y")
    .attr("transform", "translate(" + margin.left + ",0)") // transform only listens to strings, so we have to jump in and out of javascript
    .call(yAxis);

 var yAxisLabel = svg.append("text")
    .attr("class","axisLabel")
    .attr("transform","rotate(-90)")
    .attr("x",-height/2)
    .attr("y",margin.left/2)
    .text("Recommendation Strength");


// Height Scale

var barHeight = d3.scaleLinear()
    .domain("false","true") // this says that when false, start the heigh all t
    .range(0, chartHeight);




/////////////////////////////////
// Grab inputs and fill in the API
//////////////////////////////////

var emptyAPI = "https://api.onwater.io/api/v1/results/";

// Grab inputs from the form

function getCoordinates () {

    var thisLat = document.getElementById("lat").value;
    var thisLong = document.getElementById("long").value;

    var API = emptyAPI + thisLat + "," + thisLong + "?access_token=F25zaxPib_tMs-9jdF3d"; 
    console.log(API);


        
    /////////////////////////////////
    // Call API and draw a bar chart with it
    //////////////////////////////////

    d3.json(API, function(error, apiData) {

        data.unshift(apiData.water);
        if (data.length > dataMax) {
          data.pop();
        };
        console.log(data);
      


        // Zero State

        function zeroState(selection) {
            selection
                .attr("height", 0)
                .attr("y", y(0));
            };

        

        // Bars, Enter

        var barWidth = x.bandwidth();

        var bars = svg.select("#shapes").selectAll(".bar")
            .data(data/*, function(d) { 
                return d.request_id; // request_id is the key
            }*/);
            

        var enter = bars.enter().append("rect")
            .attr("class", "bar")
            .attr("width", barWidth)
            .call(zeroState)
            .attr("x", function(d) {
                    return x(onWater(data));
                });


        // Bars Update
        
        // bars.merge(enter)
        //     .transition()
        //     .attr("y", function(d) {
        //         return y(recScale(data));
        //     })
        //     .attr("x", function(d) {
        //         return x(onWater(data));
        //     })
        //     .attr("height", function(d) {
        //         return barHeight(data); 
        //     });



        bars.merge(enter)
            .transition()
            .attr("y", margin.top)
            .attr("x", function(d) {
                return x(onWater(data));
            })
            .attr("height", chartHeight);






        // Bars Exit
        bars.exit().transition().call(zeroState).remove();



    });


    
};

