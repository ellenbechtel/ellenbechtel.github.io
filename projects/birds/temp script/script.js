/* LOAD DATA FROM MULTIPLE FILES */
var promises = [
    d3.csv("./bbsdata/MAcounts.csv", parseCSV1),
    d3.json("./geojson/gz_2010_MA_040_00_20m.json")
];

Promise.all(promises).then(function(data) {

/* USGS and Patuxent Wildlife Research Center Breeding Bird Survey v2017
https://www.pwrc.usgs.gov/BBS/RawData/ */
var counts = data[0];

/* GEOJSON: Massachusetts state outlines */
var ma = data[1];

/* DEFINING THE DIMENSIONS OF THE SVG and CREATE THE SVG CANVAS */
var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


/* MAKE THE BASE MAP */    
var projection = d3.geoAlbers()
    .translate([width/2, height/2])
    .rotate([70.7712211, -3.5])
    .scale(20000); 

var path = d3.geoPath().projection(projection);

svg.selectAll("path")
    .data(ma.features)
    .enter()
    .append("path")
        .attr("class","state")
        .attr("d", path); 





/* SORT THE DATA */
counts = counts.sort(function(a,b) { return a.year - b.year; });

/* UPDATE THE SLIDER */
var slider = d3.select("#selectYear");
slider
    .property("min", counts[0].year)
    .property("max", counts[counts.length-1].year)
    .property("value", counts[counts.length-1].year); // the current value when the page is first initialized. we want it to start at the max, so copy the line above. 
var selectedYear = slider.property("value");

/* MAKE UNIQUE ORDERS & SPECIES LIST AND POPULATE THE BIRD SELECTOR DROPDOWNS */
var dropdownOrder = d3.select("#dropdownOrder");
    dropdownOrder.property("value",counts.orderCommon);
var selectedOrder = dropdownOrder.property("value");

var dropdownCommonName = d3.select("#dropdownCommonName");
    dropdownCommonName.property("value", counts.commonName);
var selectedCommonName = dropdownCommonName.property("value");

var orders = [];
    counts.forEach(function(d) {
        var this_order = d.orderCommon;
        if(orders.indexOf(this_order)<0) {
            orders.push(this_order);
     }
    });


// The following list can probably be turned into a loop, but that's for later
var perchingBirds = [];
    counts.filter(function(d) { return d.orderCommon == "Perching Birds"; })
        .forEach(function(d) {
            var this_name = d.commonName;
            if(perchingBirds.indexOf(this_name)<0) {
                perchingBirds.push(this_name);
            }
    });

var landfowl = [];
    counts.filter(function(d) { return d.orderCommon == "Landfowl"; })
        .forEach(function(d) {
            var this_name = d.commonName;
            if(landfowl.indexOf(this_name)<0) {
                landfowl.push(this_name);
            }
    });

var shoreBirds = [];
    counts.filter(function(d) { return d.orderCommon == "Shore Birds"; })
        .forEach(function(d) {
            var this_name = d.commonName;
            if(shoreBirds.indexOf(this_name)<0) {
                shoreBirds.push(this_name);
            }
    });

var swifts = [];
    counts.filter(function(d) { return d.orderCommon == "Swifts"; })
        .forEach(function(d) {
            var this_name = d.commonName;
            if(swifts.indexOf(this_name)<0) {
                swifts.push(this_name);
            }
    });

var pigeonsAndDoves = [];
    counts.filter(function(d) { return d.orderCommon == "Pigeons and Doves"; })
        .forEach(function(d) {
            var this_name = d.commonName;
            if(pigeonsAndDoves.indexOf(this_name)<0) {
                pigeonsAndDoves.push(this_name);
            }
    });

var woodpeckers = [];
    counts.filter(function(d) { return d.orderCommon == "Woodpeckers"; })
        .forEach(function(d) {
            var this_name = d.commonName;
            if(woodpeckers.indexOf(this_name)<0) {
                woodpeckers.push(this_name);
            }
    });

var kingfishers = [];
    counts.filter(function(d) { return d.orderCommon == "Kingfishers"; })
        .forEach(function(d) {
            var this_name = d.commonName;
            if(kingfishers.indexOf(this_name)<0) {
                kingfishers.push(this_name);
            }
    });

var nightjars = [];
    counts.filter(function(d) { return d.orderCommon == "Nightjars"; })
        .forEach(function(d) {
            var this_name = d.commonName;
            if(nightjars.indexOf(this_name)<0) {
                nightjars.push(this_name);
            }
    });

var hummingbirds = [];
    counts.filter(function(d) { return d.orderCommon == "Hummingbirds"; })
        .forEach(function(d) {
            var this_name = d.commonName;
            if(hummingbirds.indexOf(this_name)<0) {
                hummingbirds.push(this_name);
            }
    });

var raptors = [];
    counts.filter(function(d) { return d.orderCommon == "Raptors"; })
        .forEach(function(d) {
            var this_name = d.commonName;
            if(raptors.indexOf(this_name)<0) {
                raptors.push(this_name);
            }
    });

var waterfowl = [];
    counts.filter(function(d) { return d.orderCommon == "Waterfowl"; })
        .forEach(function(d) {
            var this_name = d.commonName;
            if(waterfowl.indexOf(this_name)<0) {
                waterfowl.push(this_name);
            }
    });

var owls = [];
    counts.filter(function(d) { return d.orderCommon == "Owls"; })
        .forEach(function(d) {
            var this_name = d.commonName;
            if(owls.indexOf(this_name)<0) {
                owls.push(this_name);
            }
    });

var cuckoos = [];
    counts.filter(function(d) { return d.orderCommon == "Cuckoos"; })
        .forEach(function(d) {
            var this_name = d.commonName;
            if(cuckoos.indexOf(this_name)<0) {
                cuckoos.push(this_name);
            }
    });

var seaBirds = [];
    counts.filter(function(d) { return d.orderCommon == "Sea Birds"; })
        .forEach(function(d) {
            var this_name = d.commonName;
            if(seaBirds.indexOf(this_name)<0) {
                seaBirds.push(this_name);
            }
    });

var cranes = [];
    counts.filter(function(d) { return d.orderCommon == "Cranes"; })
        .forEach(function(d) {
            var this_name = d.commonName;
            if(cranes.indexOf(this_name)<0) {
                cranes.push(this_name);
            }
    });


orders.forEach(function(o) {
    dropdownOrder.append("option")
        .property("value", o)
        .text(o);
});

dropdownOrder.on("change", function() {
    var currentSelection = this.value;
    var options2;
    if(currentSelection === "Perching Birds") {
        options2 = perchingBirds;
    } else if(currentSelection === "Landfowl") {
        options2 = landfowl;
    } else if(currentSelection === "Shore Birds") {
        options2 = shoreBirds;
    } else if(currentSelection === "Swifts") {
        options2 = swifts;
    } else if(currentSelection === "Pigeons and Doves") {
        options2 = pigeonsAndDoves;
    } else if(currentSelection === "Woodpeckers") {
        options2 = woodpeckers;
    } else if(currentSelection === "Kingfishers") {
        options2 = kingfishers;
    } else if(currentSelection === "Nightjars") {
        options2 = nightjars;
    } else if(currentSelection === "Hummingbirds") {
        options2 = hummingbirds;
    } else if(currentSelection === "Raptors") {
        options2 = raptors;
    } else if(currentSelection === "Waterfowl") {
        options2 = waterfowl;
    } else if(currentSelection === "Owls") {
        options2 = owls;
    } else if(currentSelection === "Cuckoos") {
        options2 = cuckoos;
    } else if(currentSelection === "Sea Birds") {
        options2 = seaBirds;
    } else if(currentSelection === "Cranes") {
        options2 = cranes;
    }

    dropdownCommonName.selectAll("*").remove();
    options2.forEach(function(o) {
        dropdownCommonName.append("option")
            .property("value", o)
            .text(o);
    });
    
});


/*
MAKE A LABEL FOR THE CURRENTLY SELECTED YEAR
*/

var yearLabel = svg.append("text")
    .attr("class","yearLabel")
    .attr("x", 100)
    .attr("y", height-100)
    .text(selectedYear);


/* 
DRAW THE POINTS
*/

var rScale = d3.scaleSqrt()
    .domain([0,1020])     
    .range([0,25]);


function updateMap(year,species) {  

    var filtered_data = counts.filter(function(d) { return d.year == year; });
    //var filtered_data = filtered_data.filter(function(d) { return d.commonName == species; });

    var c = svg.selectAll("circle")
        .data(filtered_data, function(d) { return d.routeName; }); 
    
    c.enter()
        .append("circle")
            .attr("cx", function(d) {
                var proj = projection([d.longitude, d.latitude]);  
                return proj[0];
            }).attr("cy", function(d) {
                var proj = projection([d.longitude, d.latitude]);
                return proj[1];
            }).attr("r", 0)
            .attr("opacity", 0.7)
            .attr("fill", "#66cafd")
        .merge(c)
            .transition()
            .duration(500)
            .attr("cx", function(d) {
                var proj = projection([d.longitude, d.latitude]);
                return proj[0];
            }).attr("cy", function(d) {
                var proj = projection([d.longitude, d.latitude]);
                return proj[1]; 
            }).attr("r", function(d) { return rScale(d.speciesCount); }) // QUESTION how do I make this dynamically refer to totals?
            .attr("opacity", 0.7)
            .attr("fill", "#66cafd")

        c.exit()
            .transition()
            .duration(500)
            .attr("r", 0)
            .remove();

        yearLabel.text(year);


        svg.selectAll("circle")
            .on("mouseover", function(d) {

                var cx = +d3.select(this).attr("cx") + 15;
                var cy = +d3.select(this).attr("cy") - 15;

                tooltip.style("visibility","visible")
                    .style("left", cx + "px")
                    .style("top", cy + "px")
                    .html(d.commonName + "<br><i>" + d.species + "</i><br>" + d.speciesCount + "<br>" + d.routeName); 

                // This part makes everything else you're not hovering over fade in opacity!
                svg.selectAll("circle")
                    .attr("opacity",0.2);

                d3.select(this)
                    .attr("opacity",0.7);

            }).on("mouseout", function() {
                tooltip.style("visibility","hidden");

                svg.selectAll("circle")
                    .attr("opacity",0.7);
            })
}

// Initialize Map

updateMap(selectedYear);


/* LISTEN FOR SLIDER CHANGES AND UPDATE MAP */

slider.on("input", function() {
    var year = this.value;

    selectedYear = year;
    updateMap(selectedYear);
});


/* LISTEN FOR DROPDOWN CHANGES AND UPDATE MAP */

dropdownOrder.on("change", function() {
    var currentOrder = this.value;
    console.log(currentOrder);
});


dropdownCommonName.on("change", function() {  //////////////// WON'T LET ME SELECT ANYTHING FROM THE SECOND DROPDOWN!!
    var species = this.value;
    console.log(species);
});

/* ADD A TOOLTIP */

var tooltip = d3.select("#chart")
    .append("div")
    .attr("class","tooltip");
});

/* CREATE A PARSE FUNCTION */


function parseCSV1(data) {  
    var d = {};
    d.id = data.RouteDataID 
    d.route = data.Route;
    d.routeName = data.Routename; 
    d.latitude = data.Latitude;
    d.longitude = data.Longitude;
    d.stratum = data.StratumDescr;
    d.year = data.Year;
    d.commonName = data.Common_Name;
    d.order = data.order;
    d.orderCommon = data.order_common;
    d.family = data.family_common;
    d.species = data.Species;
    d.speciesCount = data.SpeciesTotal; 

    return d;

};
