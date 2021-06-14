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

// Hide everything
TweenMax.set(".path", {
    drawSVG: '0% 0%'
})

// Create Timeline
const tl = gsap.timeline();



// Add animations to timeline
tl.to(".path", {drawSVG: "100%", ease: Linear.easeNone, stagger: stagger})
tl.from("#big-curve", { x: -100, y: 400, rotation: 90, duration: time, delay: delay })
tl.from("#small-curve", { x: 500, y: 90, rotation: 400, duration: time, delay: 0})
tl.from("#straight-line", { x: 500, y: 180, rotation: 27, duration: time, delay: 0,})
// tl.from(".black-white", { x: 100, rotation: 450, duration: 2 })
tl.call(invertColors)
// tl.to(".line, .circ", {x: 600, delay: 1, duration: 2}) // disappear offscreen

