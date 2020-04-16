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
var gravityStrength = -5;
var friction = 0.5;
var yGravity = 0.2;
var collPadding = 4;
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

// Custom Domains
var heightsDomain = ["5ft","5ft 6in","6ft","6ft 6in","7ft","7ft 6in"];
var weightsDomain = ["100lb","150lbs","200lbs","250lbs","300lbs"];

// SVG
var svg = d3.select("#beeswarm")
    .attr("width", width)
    .attr("height", height);


// Simulation Forces
var simulation = d3.forceSimulation()
    .force("collide",d3.forceCollide( function(d){
        return d.r + collPadding }).iterations(iterations))
    .force("gravity", d3.forceManyBody().strength(gravityStrength))
    .force("y", d3.forceY().y(3*height / 4))
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
        .range([3,10]);

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
        .range([2,7]);    


    donors.forEach(function(d){
        d.r = (heightScale(d.height))*Math.random();
    });

    /////////////////////////////////
    // ENTER / UPDATE / EXIT CAUCUS ALIGNMENTS
    //////////////////////////////////

    //  Adding in a filter of the dataset by sperm bank would happen here

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

    // Spermies Grouping      
    function splitBubbles(currentGrouping) {

        centerScale.domain(donors.map(function(d){ return d[currentGrouping]; }));
        donors.sort(function(a,b) { return a[currentGrouping] - b[currentGrouping] });

        if(currentGrouping == "all"){
            hideTitles()
            simulation
                .force("y", d3.forceY().strength(0.01).y(3*height / 4))
        } else if (currentGrouping == "skintone"){
            showTitles(currentGrouping, centerScale);
        } else if (currentGrouping == "height"){
            showTitles(currentGrouping, centerScale);
        } else if (currentGrouping == "weight"){
            showTitles(currentGrouping, centerScale);
        } else {

            
	        showTitles(currentGrouping, centerScale);
        };
        
        // Reset the 'x' force to draw the bubbles to their centers
        simulation
            .force("y", d3.forceY().strength(yGravity).y(3*height / 4))
            .force('x', d3.forceX().strength(forceStrength).x(function(d){ 
        	    return centerScale(d[currentGrouping]);
        }));

        // Reset the alpha value and restart the simulation
        simulation.alpha(2).restart();
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
            .text(function (d) { 
                
                if (currentGrouping === "height") {
                    if (d % 6 == 0) { return convertToFt(d); }
                } else if (currentGrouping === "weight") {
                    if (d % 25 == 0) { return d + " lbs"; }
                } else {
                    return d; 
                };
            });
        
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

              console.log(buttonId);

            if(buttonId == "skintone") {
                donors.sort(function(a,b) { return a.skintoneNum - b.skintoneNum });
            } else if (buttonId == "height") {
                donors.sort(function(a,b) { return a.height - b.height });
            } else if (buttonId == "weight") {
                donors.sort(function(a,b) { return a.weight - b.weight });
            } else {
                donors.sort(function(a,b) { return a[buttonId] - b[buttonId] });
    
            };

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
        var feet = Math.floor(inches/12);
        var rInches = Math.floor(inches % 12);

        return feet + " ft  " + rInches + " in";
    };


    // Tooltip Label Function
    function ttLabel(title, value) {
        return '<span class="info">' + title + ': </span><span class="value">' + value + '</span><br>';
    }


    // Tooltip

    var tooltip = d3.select("#tooltip");

    spermies.on("mouseover", function(d) {

        // create html content
        var html = '<span><h3>Available Donor Information</h3></span>'; // header

        if (d.donorNum) html+= ttLabel("Donor", d.donorNum);
        if (d.bank) html += ttLabel("Bank", d.bank);        
        if (d.price) html += ttLabel("Price per Vial", d.price) + "<br>";

        if (d.donationAge) html += ttLabel("Age", d.donationAge);
        if (d.height) html += ttLabel("Height", convertToFt(d.height));
        if (d.weight) html += ttLabel("Weight", d.weight + " lbs");
        if (d.ethnicity) html += ttLabel("Ethnic Origin", d.ethnicity);
        if (d.skintone) html += ttLabel("Skintone", d.skintone);
        if (d.race) html += ttLabel("Race", d.race);        
        if (d.jewish) html += ttLabel("Jewish Ancestry", d.jewish);
        if (d.religion) html += ttLabel("Religion", d.religion) + "<br>";

        if (d.lookAlikes) html += ttLabel("Look Alikes", d.lookAlikes) + "<br>"; 
        if (d.hair) html += ttLabel("Hair", d.hair + ' ' + d.hairTexture);
        if (d.hairyChest) html += ttLabel("Hairy Chest", d.hairyChest);
        if (d.beardColor) html += ttLabel("Beard Color", d.beardColor);
        if (d.hairLoss) html += ttLabel("Hair Loss", d.hairLoss);
        if (d.faceShape) html += ttLabel("Face Shape", d.faceShape);
        if (d.dimples) html += ttLabel("Dimples", d.dimples);
        if (d.acne) html += ttLabel("Acne", d.acne);
        if (d.noseShape) html += ttLabel("Nose Shape", d.noseShape);
        if (d.lips) html += ttLabel("Lips Shape", d.lips);
        if (d.eye) html += ttLabel("Eye Color", d.eye);
        if (d.eyebrows) html += ttLabel("Eyebrows", d.eyebrows);
        if (d.dominantHand) html += ttLabel("Dominant Hand", d.dominantHand);
        if (d.shoeSize) html += ttLabel("Shoe Size", d.shoeSize);
        if (d.bloodType) html += ttLabel("Blood Type", d.bloodType) + "<br>"; 


        if (d.degree) html += ttLabel("Degree", d.degree); 
        if (d.occupation) html += ttLabel("Occupation", d.occupation); 
        if (d.sign) html += ttLabel("Astrological Sign", d.sign); 
        if (d.hobbies) html += ttLabel("Hobbies", d.hobbies); 
        if (d.faveSubjects) html += ttLabel("Favorite Subjects", d.faveSubjects); 
        if (d.description) html += ttLabel("Staff Description", d.description); 
        if (d.describesHimself) html += ttLabel("Self Description", d.describesHimself); 
        if (d.whyDonate) html += ttLabel("Donated because", d.whyDonate); 
        
        tooltip 
            .style("visibility","visible")
            .html(html);

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
