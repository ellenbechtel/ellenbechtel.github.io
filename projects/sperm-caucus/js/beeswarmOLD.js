
/////////////////////////////////
// BEEWARM CODE!
//////////////////////////////////


/////////////////////////////////
// SET STATIC VARIABLES
//////////////////////////////////


var width = document.querySelector("#beeswarm").clientWidth;
var height = document.querySelector("#beeswarm").clientHeight;

var transitionTime = 1 * 1000; // 1 second

var margin = {
    top: 20,
    right: 20,
    bottom: 100,
    left: 20 
};

var chartWidth = width-margin.left-margin.right;
var chartHeight = height - margin.top - margin.bottom;

// Use chartWidth and chartHeight as dimensions of the beeswarm chart, because it takes into account the margins.  Maybe we don't need the margins?

var svg = d3.select("#beeswarm")
    .attr("width", width)
    .attr("height", height);


/////////////////////////////////
// UPLOAD DATA
//////////////////////////////////

d3.csv("./donors.csv", function(donors) {
    
    /////////////////////////////////
    // MAKE HEIGHT AND WEIGHT SCALES
    //////////////////////////////////

    // Weight-to-Radius scale
    var weights = [];
    donors.forEach(function(d) {
        var thisOne = d.weight;
        if(weights.indexOf(thisOne)<0) {
            weights.push(thisOne);
        }
    });
    var maxWeight = d3.max(weights);
    var minWeight = d3.min(weights);
    var weightScale = d3.scaleSqrt()
        .domain([minWeight, maxWeight])
        .range([2,10]);


    // Height-to-Height scale
    var heights = [];
    donors.forEach(function(d) {
        var thisOne = d.height;
        if(heights.indexOf(thisOne)<0) {
            heights.push(thisOne);
        }
    });
    var maxHeight = d3.max(heights);
    var minHeight = d3.min(heights);
    var heightScale = d3.scaleLinear()
        .domain([minHeight, maxHeight])
        .range([4,12]);


    /////////////////////////////////
    // MAKE GROUPINGS AND DROPDOWNS
    //////////////////////////////////
    
    // No Alignment
    var all = [];

    // Sperm Bank of Origin
    var banks = [];
    donors.forEach(function(d) {
        var thisOne = d.bank;
        if(banks.indexOf(thisOne)<0) {
            banks.push(thisOne);
        }
    });
    banks = banks.sort();  

    // Blood Types
    var bloodTypes = [];
    donors.forEach(function(d) {
        var thisOne = d.bloodType;
        if(bloodTypes.indexOf(thisOne)<0) {
            bloodTypes.push(thisOne);
        }
    });
    bloodTypes = bloodTypes.sort();  

    // Race
    var races = [];
    donors.forEach(function(d) {
        var thisOne = d.race;
        if(races.indexOf(thisOne)<0) {
            races.push(thisOne);
        }
    });
    races = races.sort();

    // Religion
    var religions = [];
    donors.forEach(function(d) {
        var thisOne = d.religion;
        if(religions.indexOf(thisOne)<0) {
            religions.push(thisOne);
        }
    });
    religions = religions.sort();

    // Jewish Ancestry
    var jews = [];
    donors.forEach(function(d) {
        var thisOne = d.jewish;
        if(jews.indexOf(thisOne)<0) {
            jews.push(thisOne);
        }
    });
    jews = jews.sort();

    // No Alignment
    var all = [];
   
    // GROUP DROPDOWNS
    var dropdownGroup = d3.select("#dropdownGroup");
    var dropdownObj = [
        {label: "All", value: "all"},
        {label: "Sperm Bank", value: "banks"},
        {label: "Blood Type", value: "bloodTypes"},
        {label: "Race", value: "races"},
        {label: "Religion", value: "religions"},
        {label: "Jewish Ancestry", value: "jews"}
    ];

    var currentGrouping = dropdownObj[0].value;

    dropdownObj.forEach(function(o) {
        dropdownGroup.append("option")
            .property("value", o.value)
            .text(o.label);
    });

    var domainsObj = {
        all: all,
        banks: banks,
        bloodTypes: bloodTypes,
        races: races,
        religions: religions,
        jews: jews
    };

    // Update the beeswarm with each change of the dropdown
    dropdownGroup.on("change", function() {

        currentGrouping = this.value;
        
        //splitSpermies(currentGrouping);
        updateBeeswarm(currentGrouping, currentColorScale);
        console.log(currentGrouping);
    
    });



    /////////////////////////////////
    // MAKE COLOR SCALES AND DROPDOWNS
    //////////////////////////////////

    // COLOR SCALES

    var strokeColor = d3.scaleOrdinal(d3.interpolateRainbow);
    // None
    var none = ["none"];

    // Eye Color
    var eyeColors = [];
    donors.forEach(function(d) {
        var thisOne = d.eye;
        if(eyeColors.indexOf(thisOne)<0) {
            eyeColors.push(thisOne);
        }
    });
    eyeColors = eyeColors.sort();

    // Hair Color
    var hairColors = [];    
    donors.forEach(function(d) {
        var thisOne = d.hair;
        if(hairColors.indexOf(thisOne)<0) {
            hairColors.push(thisOne);
        }
    });
    hairColors = hairColors.sort();
   
    // Skin Color
    var skinColors = [];
    donors.forEach(function(d) {
        var thisOne = d.skintone;
        if(skinColors.indexOf(thisOne)<0) {
            skinColors.push(thisOne);
        }
    });
    skinColors = skinColors.sort();


    // DROPDOWNS

    // Color Dropdown Options
    var dropdownColor = d3.select("#dropdownColor");

    var dropdownColorObj = [
        //{label: "Nothing", value: "none", colors: "white"},
        {label: "Eye Color", value: "eyeColors", colors: "green"},  // how do I make these arrays of the color options???
        {label: "Hair Color", value: "hairColors", colors: "gray"},
        {label: "Skin Tone", value: "skinColors", colors: "blue"},
    ];

    var currentColorScale = dropdownColorObj[0].values;
    var currentColorOptions = dropdownColorObj[0].colors;
    
    dropdownColorObj.forEach(function(o) {
        dropdownColor.append("option")
            .property("value", o.value)
            .text(o.label);
    });

    var domainsColorObj = {
        none: none,
        eyeColors: eyeColors,
        hairColors: hairColors,
        skinColors: skinColors
    }

    dropdownColor.on("change", function() {
        currentColorScale = this.value;
        // ADD IN COLOR OPTIONS HERE!
        updateBeeswarm(currentGrouping, currentColorScale);
    });
    
    /*
    var colorScale = d3.scaleOrdinal()
        .domain(domainsColorObj[currentColorScale])
        .range(currentColors);
    */

    /////////////////////////////////
    // WRITE FUNCTION TO ENTER / UPDATE / EXIT CAUCUS ALIGNMENTS
    //////////////////////////////////

    function updateBeeswarm(currentGrouping, currentColorScale) {

        /////////////////////////////////
        // MAKE INITIAL SIMULATION
        //////////////////////////////////

        console.log(domainsObj[currentGrouping], chartWidth);

        var xScale = d3.scalePoint()
            .padding(1)
            .rangeRound([0, chartWidth]);
        

        var simulation = d3.forceSimulation(donors)
            .nodes(donors)
            .velocityDecay(0.2)
            .force("gravity", d3.forceManyBody().strength(.15))
            .force("collide", d3.forceCollide().radius(function(d) { return heightScale(d.height) + 2 ; })) 
            //.force("center", d3.forceCenter(chartWidth/2, chartHeight/2)) // I want height to be calculated by height, and width to be centered along the axes for the ordinal scales
            .force("y", d3.forceY().y(height / 2))
            .force("x", d3.forceX().x(width / 2))
            .on("tick", tick);

           
        function tick() {
            spermies
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
         };
        
            
        // Put all the spermies in a group on the svg canvas
        var spermies = svg.select("#spermSwarm").selectAll(".spermies")
            .data(donors); // do I add a key in here?

        // Enter
        var enter = spermies.enter()
            .append("ellipse")
            .attr("class","spermies")
            .attr("fill", "white")
            .attr("rx", function(d) { return weightScale(d.weight); })
            .attr("ry", function(d) { return heightScale(d.height); })
            .attr("cx", function(d,i) { return width*Math.random(); })  
            .attr("cy", function(d,i) { return height*Math.random(); }) 
            //.attr("transform", function(d,i) {return "rotate(" + 180*Math.random() + ")";})
            // .call(d3.drag()
            //     .on("start", dragstarted)
            //     .on("drag", dragged)
            //     .on("end", dragended)
            // )
            ;
        
        // Update
        spermies.merge(enter)
            .transition()
            .duration(transitionTime/4);


        /////////////////////////////////
        // MAKE GROUPINGS
        //////////////////////////////////

        // Make Titles

        function hideTitles() {
            svg.select("#titles").selectAll('.title').exit().transition().remove();
        };

        function showTitles(currentGrouping, scale) {
            var titles = svg.selectAll('.title')
                .data(scale.domain());

            titles.enter().append("text")
                .attr("class", "title")
                .merge(titles)
                    .attr('x', function(d) { return scale(d); })
                    .attr('y', 40)
                    .attr('text-anchor', 'middle')
                    .text(function (d) { return currentGrouping + ' ' + d; });

            titles.exit().remove();
        };

        // Split Spermies

        function splitSpermies(currentGrouping) {
            xScale.domain(data.map(function(d) { return d[currentGrouping]; }));

            //if(currentGrouping=="all")
        };

        /////////////////////////////////
        // Tooltip
        //////////////////////////////////

        var tooltip = d3.select("#tooltip");

        spermies.on("mouseover", function(d) {
    
            var cx = event.clientX + 10;
            var cy = event.clientY + 130;
    
            tooltip
                .style("visibility","visible")
                .style("left", cx + "px")
                .style("top", cy + "px")
                .html("Donor " + d.donorNum +"<br>" + d.bank);

            svg.selectAll(".spermies")
                .transition()
                .duration(transitionTime/4)
                .attr("opacity",0.2);

            d3.select(this)
                .transition()
                .duration(transitionTime/4)
                .attr("opacity",0.8);
    
        }).on("mouseout", function() {
            tooltip.style("visibility","hidden");
            svg.selectAll(".spermies")
                .transition()
                .duration(transitionTime/4)
                .attr("opacity",0.8);
    
        }).on("click", function() {
            d3.select(this)
                .style("stroke", "#D5B63B") // make this change in order of clickage
                .style("stroke-width", "3")
        })
        

        // add a click out reset??

    };
    /////////////////////////////////
    // DRAW THE SPERMIES
    //////////////////////////////////

    updateBeeswarm(currentGrouping, currentColorScale);

    /////////////////////////////////
    // Dragging
    //////////////////////////////////
    
    // function dragstarted(d,i) {
    //     //console.log("dragstarted " + i)
    //     if (!d3.event.active) simulation.alpha(1).restart();
    //     d.fx = d.x;
    //     d.fy = d.y;
    //   }

    //   function dragged(d,i) {
    //     //console.log("dragged " + i)
    //     d.fx = d3.event.x;
    //     d.fy = d3.event.y;
    //   }
  
    //   function dragended(d,i) {
    //     //console.log("dragended " + i)
    //     if (!d3.event.active) simulation.alphaTarget(0);
    //     d.fx = null;
    //     d.fy = null;
    //     var me = d3.select(this)
    //     console.log(me.classed("selected"))
    //     me.classed("selected", !me.classed("selected"))
        
    //     // d3.selectAll("circle")
    //     //   .style("fill", function(d, i){ return color(d.ID); })
      	
    //     // d3.selectAll("circle.selected")
    //     //   .style("fill", "none")
      	
    //   } 



});





