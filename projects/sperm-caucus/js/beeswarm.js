/////////////////////////////////
// BEEWARM CODE!
//////////////////////////////////


/////////////////////////////////
// SET STATIC VARIABLES
//////////////////////////////////

console.clear()

var width = document.querySelector("#beeswarm").clientWidth;
var height = document.querySelector("#beeswarm").clientHeight;

var transitionTime = .25 * 1000; // 1 second
var color = d3.scaleOrdinal(d3.schemeCategory20);
var centerScale = d3.scalePoint().padding(1).range([100, width-100]);
var colorScale = d3.scaleOrdinal();
var forceStrength = .3;
var gravityStrength = -5;
var friction = 0.5;
var yGravity = 0.2;
var collPadding = 3;
var iterations = 6;

var margin = {
    top: 100,
    right: 20,
    bottom: 100,
    left: 20 
};

var chartWidth = width-margin.left-margin.right;
var chartHeight = height - margin.top - margin.bottom;

// Custom Color Schemes
var eyes = ["Black","Blue","Brown","Green","Grey","Hazel"];
var eyeColors = ["#000000", "#48CED9", "#915841", "#A5BF66", "#AAAAAA", "#D8A760"];
var hair = ["Black","Blonde","Brown","Red"];
var hairColors = ["#000000", "#EDAC5F", "#77412F", "#A3180D"];
var skin = ["Light","Fair","Medium","Olive","Brown","Dark"];
var skinColors = ["#F9E8D7", "#EFD6AC", "#D5AC73", "#BB7452", "#7D4E37", "#2E1D13"];
var noColors = ["#DBDAD9f", "#DBDAD9f", "#DBDAD9f", "#DBDAD9f"];

// SVG
var svg = d3.select("#beeswarm")
    .attr("width", chartWidth)
    .attr("height", chartHeight);


// Simulation Forces
var simulation = d3.forceSimulation()
    .force("collide",d3.forceCollide( function(d){
        return d.r + collPadding }).iterations(iterations))
    .force("gravity", d3.forceManyBody().strength(gravityStrength))
    .force("y", d3.forceY().y(height / 2))
    .force("x", d3.forceX().x(width / 2))
    .velocityDecay(friction);

/////////////////////////////////
// UPLOAD DATA
//////////////////////////////////

d3.csv("./donors.csv", function(donors) {
    
    console.log(donors);

    donors.sort(function(a,b) {
        return a.skintoneNum - b.skintoneNum
    });

    console.log(donors);
    
    /////////////////////////////////
    // Scales and New Properties
    //////////////////////////////////


    // Heights
    var heights = [];
    donors.forEach(function(d) {
        var thisOne = d.height;
        if(heights.indexOf(thisOne)<0) {
            heights.push(thisOne);
        }
    });
    var heightScale = d3.scaleLinear()
        .domain([d3.min(heights), d3.max(heights)])
        .range([2,7]);

    // Weights
    var weights = [];
    donors.forEach(function(d) {
        var thisOne = d.weight;
        if(weights.indexOf(thisOne)<0) {
            weights.push(thisOne);
        }
    });
    var weightScale = d3.scaleLinear()
        .domain([d3.min(weights), d3.max(weights)])
        .range([1,6]);    


    donors.forEach(function(d){
        d.r = (heightScale(d.height))*Math.random();
    });

    /////////////////////////////////
    // ENTER / UPDATE / EXIT CAUCUS ALIGNMENTS
    //////////////////////////////////

    var spermies = svg.select("#spermSwarm").selectAll("ellipse")
      	.data(donors, function(d){ return d.ID ;});
      
    var spermiesEnter = spermies.enter().append("ellipse")
        .attr("rx", function(d) { return weightScale(d.weight); })
        .attr("ry", function(d) { return heightScale(d.height); })
        
        .attr("cx", function(d,i) { return width*Math.random(); })
            .attr("cy", function(d,i) { return height*Math.random(); })
        .style("fill", "#DBDAD9")
        .style("pointer-events", "all")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    spermies = spermies.merge(spermiesEnter);


    /////////////////////////////////
    // BEGIN SIMULATION
    //////////////////////////////////

    function ticked() {
        spermies
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; });
      };

    simulation
        .nodes(donors)
        .on("tick", ticked);


    /////////////////////////////////
    // DRAGGING BEHAVIOR
    //////////////////////////////////

    function dragstarted(d,i) {
        //console.log("dragstarted " + i)
        if (!d3.event.active) simulation.alpha(1).restart();
        d.fx = d.x;
        d.fy = d.y;
    };

    function dragged(d,i) {
        //console.log("dragged " + i)
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    };

    function dragended(d,i) {
        //console.log("dragended " + i)
        if (!d3.event.active) simulation.alphaTarget(0);

        d.fx = null;
        d.fy = null;

        var me = d3.select(this)

        console.log(me.classed("selected"));
        me.classed("selected", !me.classed("selected"));
        
        d3.selectAll("circle.selected");



          
      	
    };

    /////////////////////////////////
    // GROUPING BEHAVIOR
    //////////////////////////////////


    // Spermies Grouping

    // function groupBubbles() {
    //     hideTitles();

    //     // Reset the 'x' force to draw the bubbles to the center.
    //     simulation.force('x', d3.forceX().strength(forceStrength).x(width / 2));

    //     // We can reset the alpha value and restart the simulation
    //     simulation.alpha(1).restart();
    // };
      
    function splitBubbles(currentGrouping) {
        
        centerScale.domain(donors.map(function(d){ return d[currentGrouping]; }));
        
        if(currentGrouping == "all"){
          hideTitles()
          simulation
            .force("y", d3.forceY().strength(0.01).y(height / 2))
        } else {
	        showTitles(currentGrouping, centerScale);
        };
        
        // Reset the 'x' force to draw the bubbles to their centers
        simulation
            .force("y", d3.forceY().strength(yGravity).y(height / 2))
            .force('x', d3.forceX().strength(forceStrength).x(function(d){ 
        	return centerScale(d[currentGrouping]);
        }));

        // Reset the alpha value and restart the simulation
        simulation.alpha(2).restart();
    };


    // Color Coding
    function colorBubbles(currentColorScale) {

        if(currentColorScale == "all") {
            colorScale.domain(hair).range(noColors);  // WHY IS THIS NOT WORKING??!
            spermies.transition()
                .duration(transitionTime)
                .style("fill", function(d) { return colorScale(d.hair); });
        } else if (currentColorScale == "eye") {
            colorScale.domain(eyes).range(eyeColors);
            spermies.transition()
                .duration(transitionTime)
                .style("fill", function(d) { return colorScale(d.eye); });
        } else if (currentColorScale == "hair") {
            colorScale.domain(hair).range(hairColors);
            spermies.transition()
                .duration(transitionTime)
                .style("fill", function(d) { return colorScale(d.hair); });
        } else if (currentColorScale == "skintone") {
            colorScale.domain(skin).range(skinColors);
            spermies.transition()
                .duration(transitionTime)
                .style("fill", function(d) { return colorScale(d.skintone); });
         };
        
    
    };


    // Titles
    function hideTitles() {
        svg.selectAll('.title').remove();
      };

    function showTitles(currentGrouping, scale) {
       	var titles = svg.select("#titles").selectAll('.title')
          .data(scale.domain());
        
        titles.enter().append('text')
          	.attr('class', 'title')
        	.merge(titles)
            .attr('x', function (d) { return scale(d); })
            .attr('y', height-10)
            .attr('text-anchor', 'middle')
            .text(function (d) { return d; });
        
        titles.exit().remove();
    };



    /////////////////////////////////
    // ENABLE BUTTONS
    //////////////////////////////////

    function setupButtons() {

        // Grouping Buttons
        d3.selectAll('.gbutton')
          .on('click', function () {
          	
            // Remove active class from all buttons
            d3.selectAll('.gbutton').classed('active', false);

            // Find the button just clicked
            var button = d3.select(this);

            // Set it as the active button
            button.classed('active', true);

            // Get the id of the button
            var buttonId = button.attr('id');

	          console.log(buttonId)
            // Toggle the bubble chart based on the currently clicked button.
            splitBubbles(buttonId);

          });

        // Color Buttons
        d3.selectAll('.cbutton')
          .on('click', function () {
          	
            // Remove active class from all buttons
            d3.selectAll('.cbutton').classed('active', false);

            // Find the button just clicked
            var button = d3.select(this);

            // Set it as the active button
            button.classed('active', true);

            // Get the id of the button
            var buttonColor = button.attr('id');

              console.log(buttonColor)
              
            // Toggle the bubble chart based on the currently clicked button.
            colorBubbles(buttonColor);
          });

        
      };
      
      setupButtons()
      
    /////////////////////////////////
    // Tooltip and Selection of Spermies
    //////////////////////////////////  

    // Tooltip Content 

    // Tooltip

    var tooltip = d3.select("#tooltip");

    spermies.on("mouseover", function(d) {

        var cx = event.clientX + 10;
        var cy = event.clientY + 250;

        tooltip
            .style("visibility","visible")
            .style("left", cx + "px")
            .style("top", cy + "px")
            .html(
                '<span class="info">Donor: </span><span class="value">' + d.donorNum + '</span><br/>' +
                '<span class="info">Bank: </span><span class="value">' + d.bank + '</span><br/>' +
                '<span class="info link">Click to read more and track this donor</span>'
            );

        svg.selectAll(".spermies")
            .transition()
            .duration(transitionTime/4)
            .attr("opacity",0.3);

        d3.select(this)
            .transition()
            .duration(transitionTime/4)
            .attr("opacity",1);

    }).on("mouseout", function() {
        tooltip.style("visibility","hidden");
        svg.selectAll(".spermies")
            .transition()
            .duration(transitionTime/4)
            .attr("opacity",1);

    }).on("click", function() {
        d3.select(this)
            //.style("stroke", "#D5B63B") // make this change in order of clickage
            //.style("stroke-width", "3")
    });



});
