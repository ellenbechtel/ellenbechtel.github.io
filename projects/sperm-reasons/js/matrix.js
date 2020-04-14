/////////////////////////////////
// MATRIX CODE!
//////////////////////////////////


/////////////////////////////////
// SET STATIC VARIABLES
//////////////////////////////////

console.clear()

var width = document.querySelector("#matrix").clientWidth;
var height = document.querySelector("#matrix").clientHeight;
var margin = {
    top: 20,
    right: 20,
    bottom: 100,
    left: 20 
};
var chartWidth = width-margin.left-margin.right;
var chartHeight = height - margin.top - margin.bottom;

var svg = d3.select("#matrix")
    .attr("width", chartWidth)
    .attr("height", chartHeight);

// Make an object of the reasons why a donor might donate and its altruism value
var reasons = [
    {code: "0", value: 0, label: "Genetic Pride", because: "he is proud of his genetics"},
    {code: "1", value: 1, label: "Money", because: "of the money"},
    {code: "2", value: 2, label: "Why Not", because: "why the heck not"},
    {code: "3", value: 3, label: "Curiosity", because: "he is curious"},
    {code: "4", value: 4, label: "Likes Donating", because: "he likes donating in general"},
    {code: "5", value: 5, label: "Don't Have, Like, or Want Kids", because: "he doesn't have, like, or want kids"},
    {code: "6", value: 6, label: "Has, Likes, or Wants Kids", because: "he has, likes, or wants kids"},
    {code: "7", value: 7, label: "Knows Someone", because: "he knows someone"},
    {code: "8", value: 8, label: "It's a Good Deed", because: "it's a good deed"},
    {code: "9", value: 9, label: "Wants to Help Others", because: "he wants to help others"}
   ];

// Make Scales
var orders = ["0","1","2","3","4"];
var opacities = ["0","1","0.5","0.2","0.07"]
var opacityScale = d3.scaleOrdinal()
    .domain(orders)
    .range(opacities);

var xScale = d3.scaleBand()
    .domain(reasons.map(function (d) { return d["label"]; }))
    .rangeRound([chartWidth, 0]);

var yScale = d3.scaleBand()
    .range([0, chartHeight]); // set the domain afterwards, once all the donors are loaded


// create function to add digits
function sum(code) {
    var sum = 0;
    var split = code.toString();
    for(i=0; i < split.length; i++){
        sum = sum+parseInt(split.substring(i,i+1));
    }
    return sum;
};

/////////////////////////////////
// LOAD THE DATA!
//////////////////////////////////


d3.csv("donorReasons.csv", function (error, donorsR) {



    // sort the donors by their altruisticness code, most altruistic to most selfish
    donorsR = donorsR.sort(function (a,b) {return d3.descending(b.code, a.code);});
        // console.log(donorsR);

    // get an array of all the donor names in the database, set that to the domain of Y scale
    var names = donorsR.map(function (d) { return d["name"]; });
        // console.log("names", names); // names is an array of the donor Names, listed in order of selfishnes scale 

    // set that sorted array of names to the domain of yScale, so that each donor will have a vertical row
    yScale.domain(names);




    // make a function to push the order of each reason for each donor
    function lookup(code) {
        var filtered = donorsR.filter(function(d) {
            return d[code] == code; 
        })
    };





    // Do some data manipulation to each donor, so that they have an object to which to map cells in their row
    donorsR.forEach (function(d) {
        d.codeSum = sum(d.code);
        d.allReasons = reasons.map(function(reason) { return {reason: reason.label, code: reason.code, order: d[reason.code]}; });
    });

    console.log("mapped donors", donorsR);

    // begin making some groupings
    var rows = svg.select("#donorRows").selectAll(".row")
        .data(donorsR)
        .enter()
        .append("g")
            .attr("class","row")
            .attr("transform", function (d) { return "translate(0," + yScale(d.name) + ")"; });

    // add cells to the row
    var cells = rows.selectAll(".cell")
        .data(function(d) { return d.allReasons; })
        .enter()
        .append("g")
            .attr("transform", function (d, i) { return "translate(" + i * xScale.bandwidth() + ",0)"; })
            .attr("class", "cell");

    // add squares to cell
    var rects = cells.append("rect")
        .attr("class", "reasonRect")
        .attr("class", function(d) { return d.code ; })
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", xScale.bandwidth()-5)
        .attr("height", 2)
        .style("fill", "white")
        .style("opacity", function(d) { return opacityScale(d.order); })
        ;



    // Tooltip

    var tooltip = d3.select("#tooltip");

    rects.on("mouseover", function(d) {
        tooltip 
            .style("visibility","visible")
            .html("<h3>" + d.reason + "</h3>");
        

    });

});
