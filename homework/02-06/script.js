/////////////////////////////////
// Set up all the static variables
//////////////////////////////////

var width = window.innerWidth;
var height = window.innerHeight;
var margin = {
    top: 20,
    right: 20,
    bottom: 50,
    left: 100
};

var chartWidth = width - margin.left - margin.right;
var chartHeight = height - margin.top - margin.bottom;

var svg = d3.select("#chart")
    .attr("width", width)
    .attr("height", height);

// X Scale
var x = d3.scaleBand()
    .domain("true", "false") // the two options in d.water. This means boat is on the left, bike is on the right
    .range([margin.left, margin.left + chartWidth])
    .paddingInner(0.2)
    .paddingOuter(0.1);


var xAxis = d3.axisBottom(x);

svg.select("#x")
    .attr("transform","translate(0," + (margin.top + chartHeight) + ")")
    .call(xAxis);



// Y Scale

var y = d3.scaleBand()
    .domain("false","true") // this says that when false, start the heigh all t
    .range([margin.top + chartHeight, margin.top]);

var yAxis = d3.axisLeft(y);

svg.select("#y")
    .attr("transform", "translate(" + margin.left + ",0)") // transform only listens to strings, so we have to jump in and out of javascript
    .call(yAxis);

var barHeight = d3.scaleBand()
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

    d3.json(API, function(error, data) {

        console.log(data.water);
      
        function zeroState(selection) {
            selection
                .attr("height", 0)
                .attr("y", margin.top);
            };

        
        // Bars, Enter

        var barWidth = x.bandwidth();

        var bars = svg.select("#shapes").selectAll(".bar")
            .data(data, function(d) { 
                return d.request_id; 
            });
            

        var enter = bars.enter().append("rect")
            .attr("class", "bar")
            .attr("width", barWidth)
            .call(zeroState)
            .attr("x", function(d) {
                    return x(d.water);
                });

        // Bars Update
        
        bars.merge(enter)
            .transition()
            .attr("height", function(d) {
                return barHeight(d.water); // MAKE THIS AN IF LOOP
            })
            .attr("y", function(d) {
                return y(d.water);
            })
            .attr("x", function(d) {
                return x(d.water);
            });


        // Bars Exit
        bars.exit().transition().call(zeroState).remove();



    });


    
};

