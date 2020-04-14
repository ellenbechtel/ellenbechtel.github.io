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
var orders = ["1","2","3","4"];
var opacities = ["1","0.5","0.2","0.1"]
var opacityScale = d3.scaleOrdinal()
    .domain(orders)
    .range(opacities);

var xScale = d3.scaleBand()
    .domain(reasons.map(function (d) { return d["label"]; }))
    .rangeRound([0, chartWidth]);

var yScale = d3.scaleBand()
    .rangeRound([0, chartHeight]); // set the domain afterwards, once all the donors are loaded


/////////////////////////////////
// LOAD THE DATA!
//////////////////////////////////


d3.csv("donorReasons.csv", function (error, donorsR) {

    // sort the donors by their altruisticness code, most altruistic to most selfish
    donorsR = donorsR.sort(function (a,b) {return d3.ascending(b.code, a.code);});
        console.log(donorsR);

    // get an array of all the donor names in the database, set that to the domain of Y scale
    var names = donorsR.map(function (d) { return d["name"]; });
        console.log("names", names); // names is an array of the donor Names, listed in order of selfishnes scale 

    yScale.domain(names);

    // begin making some groupings
    var rows = svg.select("#donorRows").selectAll(".row")
        .data(donorsR)
        .enter()
        .append("g")
            .attr("class","row")
            .attr("transform", function (d) { return "translate(0," + yScale(d["name"]) + ")"; });
            //.attr("transform", function(d) { return "translate(0," + yScale(d.name) +")"; }); // this part is not working

    // add cells to the row
    var cells = rows.seletAll(".cell")
        .data(function(d) { return d.})
});
/*


var transitionTime = 1 * 1000; // 1 second
var radius = 6;
var color = d3.scaleOrdinal(d3.schemeCategory20);
var centerScale = d3.scalePoint().padding(1).range([100, width-100]);
var colorScale = d3.scaleOrdinal();
var forceStrength = .3;
var gravityStrength = -4;
var friction = 0.5;
var yGravity = 0.3;
var collPadding = 3;





var margin = {
    top: 20,
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

// SVG
var svg = d3.select("#beeswarm")
    .attr("width", width)
    .attr("height", height);


// Simulation Forces
var simulation = d3.forceSimulation()
    .force("collide",d3.forceCollide( function(d){
        return d.r + collPadding }).iterations(16))
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
        d.r = radius*Math.random();
    });

    /////////////////////////////////
    // ENTER / UPDATE / EXIT CAUCUS ALIGNMENTS
    //////////////////////////////////

    var spermies = svg.select("#spermSwarm").selectAll("ellipse")
      	.data(donors, function(d){ return d.ID ;});
      
    var spermiesEnter = spermies.enter().append("ellipse")
        .attr("rx", function(d) { return weightScale(d.weight); })
        .attr("ry", function(d) { return heightScale(d.height); })
        .attr("r", function(d) { return (d.r); })
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
        
        d3.selectAll("circle.selected")
          // do other things to the selected circles;
      	
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
        
        // @v4 Reset the 'x' force to draw the bubbles to their centers
        simulation
            .force("y", d3.forceY().strength(yGravity).y(height / 2))
            .force('x', d3.forceX().strength(forceStrength).x(function(d){ 
        	return centerScale(d[currentGrouping]);
        }));

        // @v4 We can reset the alpha value and restart the simulation
        simulation.alpha(2).restart();
    };


    // Color Coding
    function colorBubbles(currentColorScale) {

        if(currentColorScale == "all") {
            spermies.transition()
                .style("fill", "#DBDAD9f");
        } else if (currentColorScale == "eye") {
            colorScale.domain(eyes).range(eyeColors);
            spermies.transition()
                .style("fill", function(d) { return colorScale(d.eye); });
        } else if (currentColorScale == "hair") {
            colorScale.domain(hair).range(hairColors);
            spermies.transition()
                .style("fill", function(d) { return colorScale(d.hair); });
        } else if (currentColorScale == "skintone") {
            colorScale.domain(skin).range(skinColors);
            spermies.transition()
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
            .attr('y', 100)
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

    var tooltip = d3.select("#tooltip");

    spermies.on("mouseover", function(d) {

        var cx = event.clientX + 10;
        var cy = event.clientY + 250;

        tooltip
            .style("visibility","visible")
            .style("left", cx + "px")
            .style("top", cy + "px")
            .html("Donor " + d.donorNum +"<br>" + d.bank);

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




*/