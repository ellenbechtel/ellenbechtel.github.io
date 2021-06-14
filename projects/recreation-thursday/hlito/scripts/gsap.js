// declare colors
let background = "#dad4c9"
let yellow = "#c7b36c"
let blue = "#175485"
let green = "#7b9d54"
let red = "#c24045"
let duration = 1000
let time = 0.7;
let delay = -0.3
let stagger = 0.1;

// create d3 function to invert colors
const invertColors = () => {

    d3.select("#background")
        .transition()
        .duration(duration)
        .style("fill", background)
    
    d3.selectAll(".yellow-blue")
        .transition()
        .duration(duration)
        .style("stroke", yellow)
    
    d3.selectAll(".blue-orange")
        .transition()
        .duration(duration)
        .style("stroke", blue)
    
    d3.selectAll(".green-purp")
        .transition()
        .duration(duration)
        .style("stroke", green)
    
    d3.selectAll(".red-teal")
        .transition()
        .duration(duration)
        .style("stroke", red)
    
    d3.selectAll(".black-white")
        .transition()
        .duration(duration)
        .style("stroke", "black")
}


// Activate toggle switch
const toggleInversion = () => {
    var svg = d3.select("#hlito");
    svg.classList.toggle("inverted")
}



// Hide everything
TweenMax.set(".path, .circ", {
    drawSVG: '0% 0%'
})

// Create Timeline
const tl = gsap.timeline();

// Add animations to timeline
tl.to(".path", 0.5, {drawSVG: "100%", ease: Linear.easeNone, stagger: stagger})
tl.to(".circ-2", {
    duration: 3,
    ease: "power1.inOut",
    motionPath: {
        path: "#big-curve",
        align: "#big-curve",
        alignOrigin: [0.5, 0.5],
        start: 0,
        end: 1
    },
    drawSVG: "100%",
    stagger: .2
})
tl.to(".circ-2", { opacity: 0, stagger: 0.2, delay: -1 })
tl.to(".circ-1", {
    duration: 3,
    ease: "power1.inOut",
    motionPath: {
        path: "#blank-path-right",
        align: "#blank-path-right",
        alignOrigin: [0.5, 0.5],
        start: 1,
        end: 0
    },
    drawSVG: "100%",
    stagger: .2,
    delay: -2
})
tl.to(".circ-1", {opacity: 0, stagger: 0.2, delay: -1})
tl.call(invertColors)

