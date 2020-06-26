/* This uses D3 Version 5!!!! Promises work now.  But if we switch back to version 4, we might not have as much luck loading data.

/* LOAD DATA FROM MULTIPLE FILES */
var promises = [
    d3.csv("./data/gages.csv"),
    d3.json("./geojson/drb_bnd_polygon.json"), // DRB Outline
    d3.json("./geojson/gz_2010_us_040_00_20m.json") // US STATES
];

Promise.all(promises).then(function(data) {

    // Specify data
    var gages = data[0];
    var drb = data[1];
    var states = data[2];
    console.log(states);

    states.features = states.features.filter(function(f) {
        return f.properties.NAME == "New York" ||
        f.properties.NAME == "New Jersey" ||
        f.properties.NAME == "Pennsylvania" ||
        f.properties.NAME == "Connecticut" ||
        f.properties.NAME == "Maryland" ||
        f.properties.NAME == "Delaware";
    });

    //states.features = states.features.filter(function(d) { return d.features.properties.NAME = })

    // Define the dimensions of the SVG 
    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Make Groups
    var drbGroup = svg.append("g")
        .attr("id","drbOutline");
    var statesGroup = svg.append("g")
        .attr("id","states");
    var gagesGroup = svg.append("g")
        .attr("id","gages");

    // Make projection
    var projection = d3.geoMercator()
        .translate([width/2, height/2])
        .rotate([74, -40]) // rotate to centroid
        .scale(5000); // scale this to the DRB

    // Draw States
    var pathState = d3.geoPath().projection(projection);

    svg.selectAll(".pathState")
        .data(states.features)
        .enter()
        .append("path")
            .attr("class","pathState")
            .attr("d", pathState);

    // // Draw DRB Outline
    // var pathDRB = d3.geoPath().projection(projection);

    // console.log(pathDRB);

    // svg.selectAll(".pathDRB")
    //     .data(drb.features)
    //     .enter()
    //     .append("path")
    //         .attr("class","pathDRB")
    //         .attr("d", pathDRB);
    

    // Setup Buttons
    function setupButtons() {
        
        d3.selectAll('.button')
          .on('click', function () {
          	
            // Remove active class from all buttons
            d3.selectAll('.button').classed('active', false);

            // Find the button just clicked
            var button = d3.select(this);

            // Set it as the active button
            button.classed('active', true);

            // Get the id of the button
            var buttonID = button.attr('id');

              console.log(buttonID)
              
            // Update Map based on the currently clicked button.
            update(buttonID);
        });

    };

    // Initialize Buttons
    setupButtons();

    // Make a function to draw map including the enter-update-exit paradigm
    function update(thisButton) { 

        var filteredGages = [];

        filteredGages = gages.filter(function(d) {
            if (thisButton == "all") {
                return gages;
            } else {
                return d[thisButton] == "TRUE";
            };
        });

        console.log(filteredGages);
    
        var c = svg.select("#gages").selectAll(".gages")
            .data(filteredGages, function(d) { return d.site_id; });

        c.enter().append("circle")
            //.attr("class", function(d) { return d[buttonID]; })
            .attr("cx", function(d) { 
                var proj = projection([d.longitude, d.latitude]);
                return proj[0]; })
            .attr("cy", function(d) {
                var proj = projection([d.longitude, d.latitude]);
                return proj[1]; })
            .attr("r",0)
            .attr("opacity", 0)
            .attr("fill","lightblue")
        .merge(c)
            .transition()
            .duration(500)
            .attr("cx", function(d) { 
                var proj = projection([d.longitude, d.latitude]);
                return proj[0]; })
            .attr("cy", function(d) {
                var proj = projection([d.longitude, d.latitude]);
                return proj[1]; })
            .attr("r",5)
            .attr("opacity", 0.3)
            .attr("fill","lightblue")

        c.exit()
            .transition()
            .duration(500)
            .attr("r",0)
            .remove();


    };




update("all");

});