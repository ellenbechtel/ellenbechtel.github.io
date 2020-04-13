/////////////////////////////////
// BEEWARM CODE!
//////////////////////////////////


/////////////////////////////////
// SET STATIC VARIABLES
//////////////////////////////////

console.clear()

var width = document.querySelector("#beeswarm").clientWidth;
var height = 450;

var transitionTime = .25 * 1000; // 1 second
var color = d3.scaleOrdinal(d3.schemeCategory20);
var centerScale = d3.scalePoint().padding(1).range([100, width-100]);
var colorScale = d3.scaleOrdinal();
var forceStrength = .3;
var gravityStrength = -2;
var friction = 0.5;
var yGravity = 0.2;
var collPadding = 2;
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
var skinColors = ["#F9E8D7", "#EFD6AC", "#D5AC73", "#BB7452", "#7D4E37", "#56352B"];
var noColors = ["#DBDAD9f", "#DBDAD9f", "#DBDAD9f", "#DBDAD9f"];

// SVG
var svg = d3.select("#beeswarm")
    .attr("width", width)
    .attr("height", height);


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
        .range([1,6]);

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
        .range([1,4]);    


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
            .attr('y', 50)
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

    // Tooltip Content Functions

    
    function convertToFt(inches) {
        var feet = Math.round(inches/12);
        var rInches = Math.round(inches % 12);

        return feet + "ft " + rInches + "in";

    };


    // Tooltip

    var tooltip = d3.select("#tooltip");

    spermies.on("mouseover", function(d) {
        tooltip 
            .style("visibility","visible")
            .html(
                '<span class="info">Donor: </span><span class="value">' + d.donorNum + '</span><br/>' +
                '<span class="info">Bank: </span><span class="value">' + d.bank + '</span><br/>' +
                '<span class="info">Age: </span><span class="value">' + d.donationAge + '</span><br/>' +
                '<span class="info">Price per Vial: </span><span class="value">' + d.price + '</span><br/>' +
                '<span class="info">Blood Type: </span><span class="value">' + d.bloodType + '</span><br/>' +

                '<br>' +                
                '<span class="info">Body: </span><span class="value">' + convertToFt(d.height) + ', ' + d.weight + 'lbs</span><br/>' +
                '<span class="info">Eye Color: </span><span class="value">' + d.eye + '</span><br/>' +
                '<span class="info">Hair: </span><span class="value">' + d.hairTexture + ' ' + d.hair + '</span><br/>' +
                '<span class="info">Skintone: </span><span class="value">' + d.skintone + '</span><br/>' +
                '<span class="info">Race: </span><span class="value">' + d.race + '</span><br/>' +
                '<span class="info">Ethnic Origin: </span><span class="value">' + d.ethnicity + '</span><br/>' +
                '<span class="info">Religion: </span><span class="value">' + d.religion + '</span><br/>' +
                '<span class="info">Jewish Ancestry: </span><span class="value">' + d.jewish + '</span><br/>' +
                '<span class="info">Look-Alikes: </span><span class="value">' + d.lookAlikes + '</span><br/>' +

                '<br>' +
                '<span class="info">Dominant Hand: </span><span class="value">' + d.dominantHand + '</span><br/>' +
                '<span class="info">Shoe Size: </span><span class="value">' + d.shoeSize + '</span><br/>' +
                '<span class="info">Face Shape: </span><span class="value">' + d.faceShape + '</span><br/>' +
                '<span class="info">Lips: </span><span class="value">' + d.lips + '</span><br/>' +
                '<span class="info">Nose: </span><span class="value">' + d.noseShape + '</span><br/>' +
                '<span class="info">Hairy Chest: </span><span class="value">' + d.hairyChest + '</span><br/>' +
                '<span class="info">Beard Color: </span><span class="value">' + d.beardColor + '</span><br/>' +
                '<span class="info">Eyebrows: </span><span class="value">' + d.eyebrows + '</span><br/>' +
                '<span class="info">Dimples: </span><span class="value">' + d.dimples + '</span><br/>' +
                '<span class="info">Acne: </span><span class="value">' + d.acne + '</span><br/>' +
                '<span class="info">Hair Loss: </span><span class="value">' + d.hairLoss + '</span><br/>' +

                '<br>' +
                '<span class="info">Degree: </span><span class="value">' + d.degree + '</span><br/>' +
                '<span class="info">Occupation: </span><span class="value">' + d.occupation + '</span><br/>' +
                '<span class="info">Astrological Sign: </span><span class="value">' + d.sign + '</span><br/>' +
                '<span class="info">Hobbies: </span><span class="value">' + d.hobbies + '</span><br/>' +
                '<span class="info">Favorite Subject: </span><span class="value">' + d.faveSubjects + '</span><br/>' +
                '<span class="info">Donated because: </span><span class="value">' + d.whyDonate + '</span><br/>' +
                '<span class="info">Staff Description: </span><span class="value">' + d.description + '</span><br/>' +
                '<span class="info">Describes Himself: </span><span class="value">' + d.describesHimself + '</span><br/>'
                
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
        //tooltip.style("visibility","hidden");
        svg.selectAll(".spermies")
            .transition()
            .duration(transitionTime/4)
            .attr("opacity",1);

    }).on("click", function() {
        //tooltip.style("visibility","visible");
    });



});
