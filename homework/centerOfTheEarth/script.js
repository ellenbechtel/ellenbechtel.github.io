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











        
    // CREATE THE SVG CANVAS
        var width = document.querySelector("#layers").clientWidth;
        var height = document.querySelector("#layers").clientHeight;
        var svg = d3.select("#layers")
            .append("svg")
            .attr("width", width)
            .attr("height", height);


    // Update Slider   QUESTION WHY ISN'T SELECTED DEPTH READING THE SLIDER?????
    
    var slider = d3.select("#selectDepth");

    slider
        .property("min", 0)
        .property("max", 6378) // or have this automatically read from data loaded into the script
        .property("value", 0);

    var selectedDepth = []; //slider.property("value");

    slider.on("input", function() {
        var depth = this.value;
        selectedDepth = depth;
        // tell it to update somthing here
    });

    console.log(selectedDepth);


    // Make Slider label
    var depthLabel = svg.append("text")
        .attr("class","depthLabel")
        .attr("x", 500)
        .attr("y", 100) // set these to follow the thumb on the slider
        .text(selectedDepth);









        /*
        NOT SURE I UNDERSTAND THIS PART
        */
        // The height of the slider that shows depth position
        var sliderHeight = height*0.9; // or something that gives it a little padding????

        /*
        SCALE TO CONVERT SCROLL POSITION TO SLIDER POSITION
        */
        var sliderScale = d3.scaleLinear()
            .domain([0, height])
            .range([0, sliderHeight]);


var scrollPosition = [];

        window.addEventListener("scroll", function() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            scrollPosition = scrollTop;
            console.log(scrollPosition);


        /*
        UPDATE DEPTH SLIDER POSITION: QUESTION what the heck is this????
        

        sliderCircleMarker
            .attr("cy", sliderScale(scrollTop)); 
        */




       /*
       
       MAKE LAYERS APPEAR BASED ON SLIDER POSITION:
        if(scrollTop >= 0 && scrollTop < layer1Depth) {
            ...
        } else if(scrollTop >= layer1Depth && scrollTop < layer2Depth) {
            ...
        } else if(scrollTop >= layer2Depth && scrollTop < layer3Depth) {
            ...
        } ...
    
        */

    });





/* Node stuff for density situation!!!!!!!  Read more about forces at https://github.com/d3/d3-force/tree/v1.2.1#many-body */
// If I wanted to get fancy, I could code some nodes as molecules and talk about chemical compostion and geochemistry. OH well. 

var numNodes = 1000;
var nodes = d3.range(numNodes).map(function(d) { return {id: d}; }); // make an array, then for each give it an id of just its index position
    console.log(nodes);
function randomInt() { 
    return Math.floor(Math.random() * (numNodes))
};
var links = d3.range(numNodes).map(function(d) { return {source: randomInt(), target: randomInt()}; }); // This part also isn't quite working

var pressureForce = -300;

var simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(function(d) { return pressureForce }))  // This part isn't quite working, it's not updating as I scroll.  And, I can't have it act as both a charge AND as gravity, can I?
    .force("center", d3.forceCenter(width/2,height/2))
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