/* This uses D3 Version 5!!!! Promises work now.  But if we switch back to version 4, we might not have as much luck loading data.

// This version has gages all enter, then a button filters which ones change style.


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
        .scale(6000); // scale this to the DRB

    // Draw States
    var pathState = d3.geoPath().projection(projection);
    svg.select("#states").selectAll(".pathState")
        .data(states.features)
        .enter()
        .append("path")
            .attr("class","pathState")
            .attr("d", pathState);

    // // Draw DRB Outline
    // var pathDRB = d3.geoPath().projection(projection);
    // console.log(pathDRB);
    // svg.select("#drbOutline").selectAll(".pathDRB")
    //     .data(drb.features)
    //     .enter()
    //     .append("path")
    //         .attr("class","pathDRB")
    //         .attr("d", pathDRB);
    

    // Setup Buttons
    function setupButtons() {
        
        d3.selectAll('.button')
          .on('click', function () {
            d3.selectAll('.button').classed('active', false);
            var button = d3.select(this).classed('active', true);
            var buttonID = button.attr('id');
              console.log(buttonID)
            drawMap(buttonID);
        });

    };


    // Draw all dots
    function drawMap(thisButton) {

        // Bind Data
        var c = svg.select("#gages").selectAll(".gages")
            .data(gages, function(d) { return d.site_id; });

        // Just Enter
        c.enter().append("circle")
            .attr("id", function(d) { return d.site_id; })
            .attr("class", function(d) { 
                return "gages " + thisButton;
                // if (thisButton == "all") { return "gages active"; } 
                // else { return "gages " + d[thisButton]; };
            })
            .attr("cx", function(d) { 
                var proj = projection([d.longitude, d.latitude]);
                return proj[0]; })
            .attr("cy", function(d) {
                var proj = projection([d.longitude, d.latitude]);
                return proj[1]; })
            .attr("r",5)
            .attr("opacity", 0.7);

        // //Highlight whatever is selected by the active button
        // var highlightedC = c.filter(function(d) {
        //     
        //  });
        //  console.log(c);


        // Make Tooltip
        // NOTA BENE : MAKE SURE MAKE THIS A HOVER FUNCTION FOR DESKTOP AND A CLICK FUNCTION FOR MOBILE!
        svg.selectAll(".gages")
            .on("mouseover", function(d) {  // could make this a separate function to call
                var cx = +d3.select(this).attr("cx") + 90;
                var cy = +d3.select(this).attr("cy") - 40;

                tooltip.style("visibility","visible")
                    .style("left", cx + "px")
                    .style("top", cy + "px")
                    .html(d.site_id + "<br>City, State"); 
            
                svg.selectAll(".gages")
                    .transition()
                    .duration(100)
                    .attr("opacity",0.2);

                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr("opacity",0.7);

            }).on("mouseout", function() {
                tooltip.style("visibility","hidden");

                svg.selectAll("circle")
                    .transition()
                    .duration(100)
                    .attr("opacity",0.7);
            })

    };

    // Make a function to draw map including the enter-update-exit paradigm
    function highlight(thisButton) { 



        
 
    };

    // Initialize Buttons, Draw Map, and Highlight everything first
    setupButtons();
    drawMap("all");

});

// End of Data Scope



/* ADD A TOOLTIP */

var tooltip = d3.select("#chart")
    .append("div")
    .attr("class","tooltip");

