/* This uses D3 Version 5!!!! Promises work now.  But if we switch back to version 4, we might not have as much luck loading data.

/* LOAD DATA FROM MULTIPLE FILES */
var promises = [
    d3.csv("./data/gages.csv"),
    d3.json("./geojson/gz_2010_us_040_00_20m.json") // CHANGE THIS TO DRB
];

Promise.all(promises).then(function(data) {

    // Specify data
    var gages = data[0];
    var map = data[1];

    // Define the dimensions of the SVG 
    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Make Base Map
    var projection = d3. geoAlbers()
        .translate([width/2, height/2])
        // .rotate([])
        .scale(2500);




});