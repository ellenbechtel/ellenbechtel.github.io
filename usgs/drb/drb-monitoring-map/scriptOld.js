/* new scripts!!!! */



/* LOAD DATA FROM MULTIPLE FILES */
var promises = [
    d3.csv("./data/MAcounts.csv"),
    d3.json("./geojson/gz_2010_us_040_00_20m.json")
];

Promise.all(promises).then(function(data) {

/* USGS and Patuxent Wildlife Research Center Breeding Bird Survey v2017 https://www.pwrc.usgs.gov/BBS/RawData/ */
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
    .rotate([70.7712211, -3.3])
    .scale(25000); 

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
    .property("value", counts[counts.length-1].year); 
var selectedYear = slider.property("value");


// /* MAKE UNIQUE ORDERS & SPECIES LIST AND POPULATE THE BIRD SELECTOR DROPDOWNS */
// var dropdownOrder = d3.select("#dropdownOrder");
// var orders = [];
// var currentOrder = [];
// counts.forEach(function(d) {
//     var this_order = d.orderCommon;
//     if(orders.indexOf(this_order)<0) {
//         orders.push(this_order);
//     }
// });
// currentOrder = orders[0];

    

// var dropdownCommonName = d3.select("#dropdownCommonName");
// var perchingBirds = [];
//     counts.filter(function(d) { return d.orderCommon == "Perching Birds"; })
//         .forEach(function(d) {
//             var this_name = d.commonName;
//             if(perchingBirds.indexOf(this_name)<0) {
//                 perchingBirds.push(this_name);
//             }
//     });

// var landfowl = [];
//     counts.filter(function(d) { return d.orderCommon == "Landfowl"; })
//         .forEach(function(d) {
//             var this_name = d.commonName;
//             if(landfowl.indexOf(this_name)<0) {
//                 landfowl.push(this_name);
//             }
//     });

// var shoreBirds = [];
//     counts.filter(function(d) { return d.orderCommon == "Shore Birds"; })
//         .forEach(function(d) {
//             var this_name = d.commonName;
//             if(shoreBirds.indexOf(this_name)<0) {
//                 shoreBirds.push(this_name);
//             }
//     });

// var swifts = [];
//     counts.filter(function(d) { return d.orderCommon == "Swifts"; })
//         .forEach(function(d) {
//             var this_name = d.commonName;
//             if(swifts.indexOf(this_name)<0) {
//                 swifts.push(this_name);
//             }
//     });

// var pigeonsAndDoves = [];
//     counts.filter(function(d) { return d.orderCommon == "Pigeons and Doves"; })
//         .forEach(function(d) {
//             var this_name = d.commonName;
//             if(pigeonsAndDoves.indexOf(this_name)<0) {
//                 pigeonsAndDoves.push(this_name);
//             }
//     });

// var woodpeckers = [];
//     counts.filter(function(d) { return d.orderCommon == "Woodpeckers"; })
//         .forEach(function(d) {
//             var this_name = d.commonName;
//             if(woodpeckers.indexOf(this_name)<0) {
//                 woodpeckers.push(this_name);
//             }
//     });

// var kingfishers = [];
//     counts.filter(function(d) { return d.orderCommon == "Kingfishers"; })
//         .forEach(function(d) {
//             var this_name = d.commonName;
//             if(kingfishers.indexOf(this_name)<0) {
//                 kingfishers.push(this_name);
//             }
//     });

// var nightjars = [];
//     counts.filter(function(d) { return d.orderCommon == "Nightjars"; })
//         .forEach(function(d) {
//             var this_name = d.commonName;
//             if(nightjars.indexOf(this_name)<0) {
//                 nightjars.push(this_name);
//             }
//     });

// var hummingbirds = [];
//     counts.filter(function(d) { return d.orderCommon == "Hummingbirds"; })
//         .forEach(function(d) {
//             var this_name = d.commonName;
//             if(hummingbirds.indexOf(this_name)<0) {
//                 hummingbirds.push(this_name);
//             }
//     });

// var raptors = [];
//     counts.filter(function(d) { return d.orderCommon == "Raptors"; })
//         .forEach(function(d) {
//             var this_name = d.commonName;
//             if(raptors.indexOf(this_name)<0) {
//                 raptors.push(this_name);
//             }
//     });

// var waterfowl = [];
//     counts.filter(function(d) { return d.orderCommon == "Waterfowl"; })
//         .forEach(function(d) {
//             var this_name = d.commonName;
//             if(waterfowl.indexOf(this_name)<0) {
//                 waterfowl.push(this_name);
//             }
//     });

// var owls = [];
//     counts.filter(function(d) { return d.orderCommon == "Owls"; })
//         .forEach(function(d) {
//             var this_name = d.commonName;
//             if(owls.indexOf(this_name)<0) {
//                 owls.push(this_name);
//             }
//     });

// var cuckoos = [];
//     counts.filter(function(d) { return d.orderCommon == "Cuckoos"; })
//         .forEach(function(d) {
//             var this_name = d.commonName;
//             if(cuckoos.indexOf(this_name)<0) {
//                 cuckoos.push(this_name);
//             }
//     });

// var seaBirds = [];
//     counts.filter(function(d) { return d.orderCommon == "Sea Birds"; })
//         .forEach(function(d) {
//             var this_name = d.commonName;
//             if(seaBirds.indexOf(this_name)<0) {
//                 seaBirds.push(this_name);
//             }
//     });

// var cranes = [];
//     counts.filter(function(d) { return d.orderCommon == "Cranes"; })
//         .forEach(function(d) {
//             var this_name = d.commonName;
//             if(cranes.indexOf(this_name)<0) {
//                 cranes.push(this_name);
//             }
//     });


// var species = [];  // I want this to initialize at Common Grackle
// var currentSpecies = [];
// counts.forEach(function(d) {
//     var this_species = d.commonName;
//     if(species.indexOf(this_species)<0) {
//         species.push(this_species);
// }
// });
// currentSpecies = species[0];
   

// orders.forEach(function(o) {
//     dropdownOrder.append("option")
//         .property("value", o)
//         .text(o);
// });


// dropdownOrder.on("change", function() {
//     currentOrder = this.value;
//     var options2;
//     if(currentOrder === "Perching Birds") {
//         options2 = perchingBirds;
//     } else if(currentOrder === "Landfowl") {
//         options2 = landfowl;
//     } else if(currentOrder === "Shore Birds") {
//         options2 = shoreBirds;
//     } else if(currentOrder === "Swifts") {
//         options2 = swifts;
//     } else if(currentOrder === "Pigeons and Doves") {
//         options2 = pigeonsAndDoves;
//     } else if(currentOrder === "Woodpeckers") {
//         options2 = woodpeckers;
//     } else if(currentOrder === "Kingfishers") {
//         options2 = kingfishers;
//     } else if(currentOrder === "Nightjars") {
//         options2 = nightjars;
//     } else if(currentOrder === "Hummingbirds") {
//         options2 = hummingbirds;
//     } else if(currentOrder === "Raptors") {
//         options2 = raptors;
//     } else if(currentOrder === "Waterfowl") {
//         options2 = waterfowl;
//     } else if(currentOrder === "Owls") {
//         options2 = owls;
//     } else if(currentOrder === "Cuckoos") {
//         options2 = cuckoos;
//     } else if(currentOrder === "Sea Birds") {
//         options2 = seaBirds;
//     } else if(currentOrder === "Cranes") {
//         options2 = cranes;
//     }
 
//     dropdownCommonName.selectAll("*").remove();
//     options2.forEach(function(o) {
//         dropdownCommonName.append("option")
//             .property("value", o)
//             .text(o);
//         orderLabel.text(currentOrder);
//     }); 
//     currentSpecies = options2[0];
//     updateMap(selectedYear,currentSpecies);
// });

// dropdownCommonName.on("change", function() {  
//     currentSpecies = this.value;
//     console.log(currentSpecies);
    
//     /*  MAKE A SUM COUNTER IN HERE */

//     updateMap(selectedYear,currentSpecies);
//     speciesLabel.text(currentSpecies);
// });



/* MAKE A LABEL FOR THE CURRENTLY SELECTED YEAR, ORDER, AND SPECIES*/

var yearLabel = svg.append("text")
    .attr("class","yearLabel")
    .attr("x", 500)
    .attr("y", height-80)
    .text(selectedYear);

var orderLabel = svg.append("text")
    .attr("class","orderLabel")
    .attr("x", 500)
    .attr("y", height-210)
    .text(currentOrder);

var speciesLabel = svg.append("text")
    .attr("class","speciesLabel")
    .attr("x", 500)
    .attr("y", height-240)
    .text(currentSpecies);



/* DRAW THE POINTS */

var rScale = d3.scaleSqrt()
    .domain([0,1020])     
    .range([0,150]);


function updateMap(year, currentSpecies) {  

    var filtered_data = counts.filter(function(d) { return d.year == year && d.commonName == currentSpecies; });

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
            .duration(100)
            .attr("cx", function(d) {
                var proj = projection([d.longitude, d.latitude]);
                return proj[0];
            }).attr("cy", function(d) {
                var proj = projection([d.longitude, d.latitude]);
                return proj[1]; 
            }).attr("r", function(d) { return rScale(d.speciesCount); })
            .attr("opacity", 0.7)
            .attr("fill", "#66cafd")

        c.exit()
            .transition()
            .duration(100)
            .attr("r", 0)
            .remove();

        yearLabel.text(year);
        orderLabel.text(currentOrder);
        speciesLabel.text(currentSpecies);


        svg.selectAll("circle")
            .on("mouseover", function(d) {
                var cx = +d3.select(this).attr("cx") + 90;
                var cy = +d3.select(this).attr("cy") - 40;

                tooltip.style("visibility","visible")
                    .style("left", cx + "px")
                    .style("top", cy + "px")
                    .html(d.speciesCount + " individuals spotted<br>" + d.routeName + "<br>" + d.commonName + "<br><i>" + d.species + "</i><br>"); 
            
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

updateMap(selectedYear, currentSpecies);


/* LISTEN FOR SLIDER CHANGES AND UPDATE MAP */

slider.on("input", function() {
    var year = this.value;

    selectedYear = year;
    updateMap(selectedYear,currentSpecies);
});



/* ADD A TOOLTIP */

var tooltip = d3.select("#chart")
    .append("div")
    .attr("class","tooltip");
});


/* CREATE A PARSE FUNCTION */

// function parseCSV1(data) {  
//     var d = {};
//     d.type = data.type 
//     d.site_id = data.Route;
//     d.routeName = data.Routename; 
//     d.latitude = data.Latitude;
//     d.longitude = data.Longitude;
//     d.stratum = data.StratumDescr;
//     d.year = data.Year;
//     d.commonName = data.Common_Name;
//     d.order = data.order;
//     d.orderCommon = data.order_common;
//     d.family = data.family_common;
//     d.species = data.Species;
//     d.speciesCount = data.SpeciesTotal; 

//     return d;

// };
