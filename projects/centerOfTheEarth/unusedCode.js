// Extra bits of code


// For generating random links, so that link strength could change

function randomInt() { 
    return Math.floor(Math.random() * (numNodes))
};
var links = d3.range(numNodes).map(function(d) { return {source: randomInt(), target: randomInt()}; }); // This part also isn't quite working



    // SCALE TO CONVERT SCROLL POSITION TO CHARGE FORCE
    var forceScale = d3.scaleLinear()
        .domain([0, height])
        .range([-0.01,-300]); // or whatever I decide
        

/// unused html for nav bar

/*
<div id="intro">
<!-- Not sure what's going in here, but probably a quick descriptor to orient people -->
</div>
<div id="navbar">        
    <h2 class="mini-title">Let's dig a hole</h2>    
            <!-- Jump to sections? Link to papers? Inside joke? Idk -->
    <div id="the-science">        
            <!-- talk about seismology and geophysics -->
        </div>
    <div id="about">        
        <!-- Make this appear and disappear on button click. Credits and list sources -->
        </div>
</div>

*/



// unused javascript for sticky navbar

/* Make a sticky navigation bar, tied to the scrolling */

window.onscroll = function() {makeSticky()};

var navbar = document.getElementById("navbar")  // grab the navbar element in the DOM
var sticky = navbar.offsetTop; // set the position from scrolling offset where the stickiness takes hold

function makeSticky() {
    if (window.pageYoffset >= sticky ) {
        navbar.classList.add("sticky")
    } else { 
        navbar.classList.remove("sticky");
    }
}


///// UNUSED SLIDER CODE
// I decided I don't want a slider, because I want people to experience how freaking long it takes to get from one section to another. No skipping or cheating!


/* html
<div class="slider">
<input id="selectDepth" type="range"/>
</div>
*/

var slider = d3.select("#selectDepth");


slider
.property("min", 0)
.property("max", sliderHeight) // or have this automatically read from data loaded into the script
.property("value", 0);

var selectedDepth = []; //slider.property("value");

slider.on("input", function() {
var depth = this.value;
selectedDepth = depth;
// tell it to update somthing here
});

console.log(selectedDepth);


var sliderScale = d3.scaleLinear()
.domain([0, sliderHeight]) 
.range([0, height]); // full height of the SVG canvas

        // Make Slider label
        var depthLabel = svg.append("text")
            .attr("class","depthLabel")
            .attr("x", 500)
            .attr("y", 100) // set these to follow the thumb on the slider
            .text(selectedDepth);



        // The height of the axis that shows depth position

        var sliderHeight = height; // does this have to be dynamic somehow?

// UNUSED HTML SECTIONS FOR CODE

/*
<section class="surface">Surface</section>
<section class="crust">Crust</section>
<section class="asthenosphere">Asthenosphere</section>
<section class="upper-mantle">Upper Mantle</section>
<section class="transition-zone">Transition Zone</section>
<section class="lower-mantle">Lower Mantle</section>
<section class="d-layer">D Layer</section>
<section class="outer-core">Outer Core</section>
<section class="inner-core">Inner Core</section>
<section class="end">End</section>
*/




// Depth indicator
        /*
        UPDATE DEPTH SLIDER POSITION: QUESTION what the heck is this????
        sliderCircleMarker
            .attr("cy", sliderScale(scrollTop)); 
        */
       
       var circleMarker = svg.append("c")
       .attr("r", 30)
       .attr("cx", width/3) // or something????
       .attr("cy", function(d) { return depthScale(scrollPosition); })
       .style("stroke-dasharray", ("3, 3"));








    //////////////////////////////////
    // DRAWING A RECTANGLE IN THE BACKGROUND TO CHANGE SVG BACKGROUND COLOR
    //////////////////////////////////


           
        svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", colorScale(scrollTop));


        svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", colorScale(scrollTop));

        // turns out, I don't need a separate svg element, I can just change the CSS itself with javascript! Woohoo!!


    //////////////////////////////////
    // MAKE NODE NETWORK FOR PRESSURE VIZ
    //////////////////////////////////
    /* Node stuff for density situation!!!!!!!  Read more about forces at https://github.com/d3/d3-force/tree/v1.2.0.01#many-body */
    // If I wanted to get fancy, I could code some nodes as molecules and talk about chemical compostion and geochemistry. OH well. 

    var numNodes = 500;
    var nodes = d3.range(numNodes).map(function(d) { return {id: d}; }); // make an array, then for each give it an id of just its index position

    var pressureForce = -100;

    var simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(function(d) { return pressureForce }))  // This part isn't quite working, it's not updating as I scroll.  And, I can't have it act as both a charge AND as gravity, can I?
        .force("center", d3.forceCenter(width/2,height/2))
        .force('x', d3.forceX(width/2).strength(.1))
        .force('y', d3.forceY(height).strength(0.05))  // change this to match heigh of svg canvas or something
        .force("collide", d3.forceCollide().radius(20))


    // Draw circles for nodes
    var node = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
            .attr("stroke", "#ffffff")
            .attr("stroke-width",2)
            .attr("r",15)
            .attr("fill", "black")
            .attr("opacity",0.05);


    // Tick the simulation

    simulation.on("tick", function() {
        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    });





    //////////////////////////////////
    // DRAW LANDMARKS AND UPDATE USING ENTER-UPDATE-EXIT PATTERN
    //////////////////////////////////

    /* Testing to see if rectangles appear at correct depth, before text does
    var landmarks = svg.append("g")
      
    landmarks.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
            .attr("x", width-width/4)
            .attr("y", function(d) { return depthToPositionScale(d.depth); })
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", "teal")
            .attr("stroke", "white");
    */


    // Turns out, Landmarks didn't need a enter-update-exit function
                .merge(landmarksText)
                .transition()
                .duration(300)
                .attr("class","landmark")
                .text(function(d) { return d.landmark; } )
                .attr("x", width-width/4)
                .attr("y", function(d) { return depthToPositionScale(d.depth); })

            landmarksText.exit()            
                .transition()
                .duration(300)
                .attr("opacity", 0)
                .remove();




    // text for landmark divs - this works for rectangles

    var landmarks = svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
        .attr("x", width-width/4)
        .attr("y", function(d) { return depthScale(d.depth); })
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", "teal");
        //.html(data.precursor +"<br>" + data.landmark);

    /// Text for landmark divs - this doesn't work

       var landmarks = svg.selectAll("text")
       .data(data)
       .enter()
       .append("text")
           .attr("x", width-width/4)
           .attr("y", function(d) { return depthScale(d.depth); })
           .text(function(d) { return d.landmark; })
           .attr("class", "landmark-text");





            var tempScale = d3.scaleLinear()
            .domain([0, 4800])
            .range(margin.left, width-margin.right);











    //////////////////////////////////
    // DRAW DEPTH INDICATOR
    //////////////////////////////////

    var depthIndicator = svg.append("circle")
        .attr("cx", width/3)
        .attr("cy", 200)
        .attr("class","indicator")
        .style("position", "fixed")
        .attr("r", 30);



    //////////////////////////////////
    // MOVE THE DASHBOARD with javascript, not CSS 
    //////////////////////////////////

    function moveDashboard() {
        document.getElementById("dashboard").style.top = depthToPercentDoneScale(scrollTop);
    };
    
    var depthToPercentDoneScale = d3.scaleLinear()
        .domain([0, 6371]) 
        .range([sticky, viewHeight]);




    
       
        // IF STATEMENT FOR if scroll has hit a certain threshold, and update domain and range between each temp point

             // if currentDepth is between some threshold, temp is such.
        // make another if statement for layer name, and based on layer name, use such and such scale

        

    
        
        if(currentDepth = 0) {
            currentLayer === "surface";
        } else if(currentDepth > 0 && currentDepth < 10) {
            currentLayer === "crust";
        }  else if(currentDepth >= 10 && currentDepth < 35) {
            currentLayer === "lithosphere";
        } else if(currentDepth >= 35 && currentDepth < 100) {
            currentLayer === "mantle";
        } else if(currentDepth >= 100 && currentDepth < 670) {
            currentLayer === "asthenosphere";
        } else if(currentDepth >= 670 && currentDepth < 2890) {
            currentLayer === "lowermantle";
        } else if(currentDepth >= 2890 && currentDepth < 5160) {
            currentLayer === "outercore";
        } else if(currentDepth >= 5160 && currentDepth <= 6371) {
            currentLayer === "innercore";
        };






        

    //////////////////////////////////
    // MAKE BACKGROUND COLOR CHANGE WITH TEMPERATURE 
    //////////////////////////////////

    //document.getElementById("layers").style.color = colorScale(scrollTop);



    //////////////////////////////////
    // MAKE AXES FOR TEMPERATURE AND PRESSURE, WHICH WILL DRAW AS LINES AS YOU SCROLL
    //////////////////////////////////

    var pressureScale = d3.scaleLinear()
    .domain([0, 364])
    .range([width/3, width-margin.right]);

    var tempScale = d3.scaleLinear()
    .domain([0, 4800])
    .range([width/3, width-margin.right]);
        
    
    var tempAxis = svg.append("g")
        .attr("class","axis")
        .attr("stroke-width", 5)
        .attr("transform", `translate(0,${margin.top/3})`)
        .call(d3.axisBottom().scale(tempScale).tickFormat(d3.format("Y")));

    var tempAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("x", width/3 - 150)
        .attr("y", margin.top/3 + 3)
        .text("Temperature");

    var pressureAxis = svg.append("g")
        .attr("class","axis")
        .attr("stroke-width", 5)
        .attr("transform", `translate(0,${2*margin.top/3})`)
        .call(d3.axisBottom().scale(pressureScale).tickFormat(d3.format("Y")));

    var pressureAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("x", width/3 - 150)
        .attr("y", 2 * margin.top/3 + 3)
        .text("Pressure");


        
    //////////////////////////////////
    // DRAW LINES 
    //////////////////////////////////


    // var line = d3.line()
    //     .x(function(d) { return tempScale(data.temperature); })
    //     .y(function(d) { return depthToPositionScale(data.depth); })
    //     .curve();

    // var tempPath = svg.append("path")
    //     .datum(data)
    //     .attr("d", line)
    //     .attr("stroke","yellow")
    //     .attr("stroke-width",3)
    //     .attr("fill","none");


   