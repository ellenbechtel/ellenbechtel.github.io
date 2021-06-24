// declare colors
let background = "#dad4c9"
let yellow = "#c7b36c"
let blue = "#175485"
let green = "#7b9d54"
let red = "#c24045"

// declare animation constants
let duration = 1000
let time = 0.7;
let delay = -0.3
let stagger = 0.175;

// declare svg properties
let svg = d3.select("#svg"),
    width = 500,
    height = 500;

let gLine = d3.select("#gLine");

svg.style({
    'width': width,
    'height': height
});

let sine = d3.range(0, 10).map(function(k) {
  let value = [0.5 * k * Math.PI, Math.sin(0.5 * k * Math.PI)];
  return value;
});

// console.log("sine",sine, d3.extent(sine, function(d){ return d[0] }))

let xScale = d3.scaleLinear()
    .range([0, width])
    .domain([d3.extent(sine, function (d) {
        console.log(d[0])
        return d[0];
    }
    )]);

console.log("test scale");
let yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([-1, 1]);

let line = d3.line()
    .x(function (d, i) { console.log(xScale(d)); return xScale(d[0]); }) // set the x values for the line generator
    .y(function(d) { return yScale(d[1]); }) // set the y values for the line generator 
    // .curve(d3.curveMonotoneX) // apply smoothing to the line


 gLine.append("path")
    .datum(sine) // 10. Binds data to the line 
    .attr("class", "line") // Assign a class for styling 
    .attr("d", line); // 11. Calls the line generator 


