
/////////////////////////////////
// BEEWARM CODE!
//////////////////////////////////


/////////////////////////////////
// SET STATIC VARIABLES
//////////////////////////////////

console.clear()

var width = document.querySelector("#beeswarm").clientWidth;
var height = document.querySelector("#beeswarm").clientHeight;

var transitionTime = 1 * 1000; // 1 second
var radius = 3;
var color = d3.scaleOrdinal(d3.schemeCategory20);
var centerScale = d3.scalePoint().padding(1).range([100, width-100]);
var forceStrength = .5;

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


// Simulation Forces

var simulation = d3.forceSimulation()
    .force("collide",d3.forceCollide( function(d){
        return d.r + 1 }).iterations(16))
    .force("gravity", d3.forceManyBody().strength(-3))
    .force("y", d3.forceY().y(height / 2))
    .force("x", d3.forceX().x(width / 2))
    .velocityDecay(0.2);

/////////////////////////////////
// UPLOAD DATA
//////////////////////////////////

d3.csv("./donors.csv", function(donors) {
    

    /////////////////////////////////
    // Scales and New Properties
    //////////////////////////////////

    donors.forEach(function(d){
        d.r = radius*Math.random();

        // set the enter coordinates here??????????????????????????
        d.x = width / 2;
        d.y = height / 2;
    });

    // // Height
    // var maxheight = d3.max(donors.height);
    // var minheight = d3.min(donors.height);
    // var heightScale = d3.scaleLinear()
    //     .domain([minWeight, maxWeight])
    //     .range([2,10]);

    // // Weight
    // var maxWeight = d3.max(donors.weight);
    // var minWeight = d3.min(donors.weight);
    // var weightScale = d3.scaleLinear()
    //     .domain([minWeight, maxWeight])
    //     .range([2,10]);     
      

    /////////////////////////////////
    // ENTER / UPDATE / EXIT CAUCUS ALIGNMENTS
    //////////////////////////////////

    var spermies = svg.selectAll("circle")
      	.data(donors, function(d){ return d.ID ;});
      
    var spermiesEnter = spermies.enter().append("circle")
        // .attr("rx", function(d) { return weightScale(d.weight); })
        // .attr("ry", function(d) { return heightScale(d.height); })
        .attr("r", function(d) { return (d.r); })
        .attr("cx", function(d,i) { return width*Math.random(); })
            .attr("cy", function(d,i) { return height*Math.random(); })
        .style("fill", function(d, i){ return color(d.ID); })
        .style("stroke", function(d, i){ return color(d.ID); })
        .style("stroke-width", 2)
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
        
        d3.selectAll("circle")
          .style("fill", function(d, i){ return color(d.ID); });
      	
        d3.selectAll("circle.selected")
          .style("fill", "none");
      	
    };

    /////////////////////////////////
    // GROUPING BEHAVIOR
    //////////////////////////////////


    // Spermies
    function groupBubbles() {
        hideTitles();

        // @v4 Reset the 'x' force to draw the bubbles to the center.
        simulation.force('x', d3.forceX().strength(forceStrength).x(width / 2));

        // @v4 We can reset the alpha value and restart the simulation
        simulation.alpha(1).restart();
    };
      
    function splitBubbles(currentGrouping) {
        
        centerScale.domain(donors.map(function(d){ return d[currentGrouping]; }));
        
        if(currentGrouping == "all"){
          hideTitles()
        } else {
	        showTitles(currentGrouping, centerScale);
        };
        
        // @v4 Reset the 'x' force to draw the bubbles to their centers
        simulation.force('x', d3.forceX().strength(forceStrength).x(function(d){ 
        	return centerScale(d[currentGrouping]);
        }));

        // @v4 We can reset the alpha value and restart the simulation
        simulation.alpha(2).restart();
    };


    // Titles
    function hideTitles() {
        svg.selectAll('.title').remove();
      };

    function showTitles(currentGrouping, scale) {
        // Another way to do this would be to create
        // the year texts once and then just hide them.
       	var titles = svg.selectAll('.title')
          .data(scale.domain());
        
        titles.enter().append('text')
          	.attr('class', 'title')
        	.merge(titles)
            .attr('x', function (d) { return scale(d); })
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .text(function (d) { return d; });
        
        titles.exit().remove();
    };



    /////////////////////////////////
    // ENABLE BUTTONS
    //////////////////////////////////

    function setupButtons() {
        d3.selectAll('.gbutton')
          .on('click', function () {
          	
            // Remove active class from all buttons
            d3.selectAll('.button').classed('active', false);

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
      };
      
      setupButtons()
      
});





/*



    function updateBeeswarm(currentGrouping, currentColorScale) {

        /////////////////////////////////
        // MAKE INITIAL SIMULATION
        //////////////////////////////////

        console.log(domainsObj[currentGrouping], chartWidth);

        var xScale = d3.scalePoint()
            .padding(1)
            .rangeRound([0, chartWidth]);
        

        
            
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





*/