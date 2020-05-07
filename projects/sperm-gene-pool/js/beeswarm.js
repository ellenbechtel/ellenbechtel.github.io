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
var centerScale = d3.scalePoint().padding(1).range([100, width-100]);
var colorScale = d3.scaleOrdinal();
var forceStrength = .3;
var gravityStrength = -6;
var friction = 0.6;
var yGravity = 0.3;
var collPadding = 3;
var iterations = 1;

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
var eyeColors = ["#000000", "#48CED9", "#91594A", "#A5BF66", "#AAAAAA", "#D8A760"];
var hair = ["Black","Blonde","Brown","Red"];
var hairColors = ["#000000", "#EDAC5F", "#91594A", "#A52117"];
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
    
 
    // initially sort by skintone
    donors.sort(function(a,b) {
        return a.skintoneNum - b.skintoneNum
    });
    
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
        .range([2,8]);

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
        .range([2,5]);    


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
        .attr("class", "spermie")
        .attr("rx", function(d) { return weightScale(d.weight); })
        .attr("ry", function(d) { return heightScale(d.height); })
        
        .attr("cx", function(d,i) { return width*Math.random(); })
        .attr("cy", function(d,i) { return height*Math.random(); })
        .style("fill", "#DBDAD9")
        .style("opacity", ".9")
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
            spermies.transition()
                .duration(transitionTime)
                .style("fill", "white");
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

    // Spermies Filtering

    function filterBubbles(currentGrouping, currentFilter) {
        
        // filter
        if (currentGrouping == "all") {
            splitBubbles(currentGrouping);
        } else {
            donors.filter(function(d) { return d[currentGrouping] == currentFilter});
            splitBubbles(currentGrouping);
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
        
        
        // Filter Buttons
        d3.selectAll('.fbutton')
            .on('click', function () {



            });

        
      };
      
      setupButtons();
      
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

    var tooltip = d3.select("#tooltip");    // the whole tooltip
    var tooltipMain = d3.select("#tooltip-main");
    var tooltipInstructions = d3.select("#tooltip-instructions");
    var tooltipExtras = d3.select("#tooltip-extras");



    spermies.on("mouseover", function(d) {

        // Create HTML Content

        // Tooltip Main
        var html = '<span><p class="ttHeader"> Donor: ' + d.donorNum + '</p></span>'; // header
        if (d.bank) html += '<span class="value">' + d.bank + '</span><br>'     
        if (d.price) html += ttLabel("Price per Vial", d.price) + "<br>";    
        

        // Enable actions on the mouseover
        tooltip 
            .style("display","block")
            .style("position", "absolute");

        // size responsiveness
        if (width > d3.event.pageX + 250) {
            tooltip.style("left", d3.event.pageX + 20 + "px")
        } else { tooltip.style("left", d3.event.pageX - 350 + "px") };

        if (height < d3.event.pageY + 700) {
            tooltip.style("top", d3.event.pageY - 50 + "px")
        } else { tooltip.style("top", d3.event.pageY - 400 + "px")};

        // Insert donor name and bank
        tooltipMain
            .html(html);

        // show the instruction prompt
        tooltipInstructions.style("display","block");


        // hide the extras
        tooltipExtras.style("display","none");

        // opacity hover, not working
        svg.selectAll(".spermies")
            .transition()
            .duration(transitionTime/4)
            .attr("opacity",0.3);

        d3.select(this)
            .transition()
            .duration(transitionTime/4)
            .attr("opacity",1);

    }).on("click", function(d) {
        
        tooltip.style("display","block");

        // Hide Instructions
        tooltipInstructions.style("display","none");

        // Tooltip Extras
        var htmlExtras = ''; // header

        if (d.donationAge) htmlExtras += ttLabel("Age", d.donationAge);
        if (d.height) htmlExtras += ttLabel("Height", convertToFt(d.height));
        if (d.weight) htmlExtras += ttLabel("Weight", d.weight + " lbs");
        if (d.ethnicity) htmlExtras += ttLabel("Ethnic Origin", d.ethnicity);
        if (d.skintone) htmlExtras += ttLabel("Skintone", d.skintone);
        if (d.race) htmlExtras += ttLabel("Race", d.race);        
        if (d.jewish) htmlExtras += ttLabel("Jewish Ancestry", d.jewish);
        if (d.religion) htmlExtras += ttLabel("Religion", d.religion);
        if (d.lookAlikes) htmlExtras += ttLabel("Look Alikes", d.lookAlikes); 
        if (d.hair) htmlExtras += ttLabel("Hair", d.hair + ' ' + d.hairTexture);
        if (d.hairyChest) htmlExtras += ttLabel("Hairy Chest", d.hairyChest);
        if (d.beardColor) htmlExtras += ttLabel("Beard Color", d.beardColor);
        if (d.hairLoss) htmlExtras += ttLabel("Hair Loss", d.hairLoss);
        if (d.faceShape) htmlExtras += ttLabel("Face Shape", d.faceShape);
        if (d.dimples) htmlExtras += ttLabel("Dimples", d.dimples);
        if (d.acne) htmlExtras += ttLabel("Acne", d.acne);
        if (d.noseShape) htmlExtras += ttLabel("Nose Shape", d.noseShape);
        if (d.lips) htmlExtras += ttLabel("Lips Shape", d.lips);
        if (d.eye) htmlExtras += ttLabel("Eye Color", d.eye);
        if (d.eyebrows) htmlExtras += ttLabel("Eyebrows", d.eyebrows);
        if (d.dominantHand) htmlExtras += ttLabel("Dominant Hand", d.dominantHand);
        if (d.shoeSize) htmlExtras += ttLabel("Shoe Size", d.shoeSize);
        if (d.bloodType) htmlExtras += ttLabel("Blood Type", d.bloodType); 
        if (d.degree) htmlExtras += ttLabel("Degree", d.degree); 
        if (d.occupation) htmlExtras += ttLabel("Occupation", d.occupation); 
        if (d.sign) htmlExtras += ttLabel("Astrological Sign", d.sign); 
        if (d.hobbies) htmlExtras += ttLabel("Hobbies", d.hobbies); 
        if (d.faveSubjects) htmlExtras += ttLabel("Favorite Subjects", d.faveSubjects); 
        if (d.description) htmlExtras += ttLabel("Staff Description", d.description); 
        if (d.describesHimself) htmlExtras += ttLabel("Self Description", d.describesHimself); 
        if (d.whyDonate) htmlExtras += ttLabel("Donated because", d.whyDonate);

        tooltipExtras
            .style("display","block")
            .html(htmlExtras);

    }).on("mouseout", function() {
        // tooltip.style("display","none");

        // tooltipExtras.style("display","none");

        svg.selectAll(".spermies")
            .transition()
            .duration(transitionTime/4)
            .attr("opacity",1);

    });

   

});

function xOut() { 
	document.getElementById("tooltip").style.display="none"; 
};