// using d3 for convenience
var main = d3.select("#meat");
var scrolly = main.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var step = article.selectAll(".step");

// initialize the scrollama
var scroller = scrollama();

// select existing SVGS even though they are all invisible
var allsvgs = d3.selectAll("#scroll-svgs")
var riversSVG = d3.select("#rivers"); // currently this is the first svg shown
var statesSVG = d3.select("#states");
var hucOutlinesSVG = d3.selectAll(".a-huc");
var hucLabels = d3.select("#huc-names");

// generic window resize listener event
function handleResize() {
  // 1. update height of step elements
  // var stepH = Math.floor(window.innerHeight * 0.25);
  // step.style("height", stepH + "px");

  var figureHeight = window.innerHeight;
  var figureMarginTop = (window.innerHeight - figureHeight) / 2;

  figure
    .style("height", figureHeight + "px")
    .style("top", figureMarginTop + "px");

  // 3. tell scrollama to update new element dimensions
  scroller.resize();
}

// make function for updating the chart
function updateChart(index){
  // allsvgs.style("opacity","0").style("transition","opacity .25s ease-in-out").style("-moz-transition","opacity .25s ease-in-out").style("-webkit-transition","opacity .25s ease-in-out");
  if (index === 0) {
    statesSVG.style("opacity","1").style("transition","opacity .25s ease-in-out").style("-moz-transition","opacity .25s ease-in-out").style("-webkit-transition","opacity .25s ease-in-out")
    riversSVG.style("opacity","0").style("transition","opacity .25s ease-in-out").style("-moz-transition","opacity .25s ease-in-out").style("-webkit-transition","opacity .25s ease-in-out")
    hucOutlinesSVG.style("opacity","0").style("transition","opacity .25s ease-in-out").style("-moz-transition","opacity .25s ease-in-out").style("-webkit-transition","opacity .25s ease-in-out")
    hucLabels.style("opacity","0").style("transition","opacity .25s ease-in-out").style("-moz-transition","opacity .25s ease-in-out").style("-webkit-transition","opacity .25s ease-in-out")
  } else if (index === 1) {
    statesSVG.style("opacity",".7").style("transition","opacity .25s ease-in-out").style("-moz-transition","opacity .25s ease-in-out").style("-webkit-transition","opacity .25s ease-in-out")
    riversSVG.style("opacity",".8").style("transition","opacity .25s ease-in-out").style("-moz-transition","opacity .25s ease-in-out").style("-webkit-transition","opacity .25s ease-in-out")
    hucOutlinesSVG.style("opacity","0").style("transition","opacity .25s ease-in-out").style("-moz-transition","opacity .25s ease-in-out").style("-webkit-transition","opacity .25s ease-in-out")
    hucLabels.style("opacity","0").style("transition","opacity .25s ease-in-out").style("-moz-transition","opacity .25s ease-in-out").style("-webkit-transition","opacity .25s ease-in-out")
  } else if (index === 2) {
    statesSVG.style("opacity","0").style("transition","opacity .25s ease-in-out").style("-moz-transition","opacity .25s ease-in-out").style("-webkit-transition","opacity .25s ease-in-out")
    riversSVG.style("opacity",".8").style("transition","opacity .25s ease-in-out").style("-moz-transition","opacity .25s ease-in-out").style("-webkit-transition","opacity .25s ease-in-out")
    hucOutlinesSVG.style("opacity","0").style("transition","opacity .25s ease-in-out").style("-moz-transition","opacity .25s ease-in-out").style("-webkit-transition","opacity .25s ease-in-out")
    hucLabels.style("opacity","0").style("transition","opacity .25s ease-in-out").style("-moz-transition","opacity .25s ease-in-out").style("-webkit-transition","opacity .25s ease-in-out")
  } else if (index === 3) {
    statesSVG.style("opacity","0").style("transition","opacity .25s ease-in-out").style("-moz-transition","opacity .25s ease-in-out").style("-webkit-transition","opacity .25s ease-in-out")
    riversSVG.style("opacity",".8").style("transition","opacity .25s ease-in-out").style("-moz-transition","opacity .25s ease-in-out").style("-webkit-transition","opacity .25s ease-in-out")
    hucOutlinesSVG.style("opacity",".7").style("transition","opacity .25s ease-in-out").style("-moz-transition","opacity .25s ease-in-out").style("-webkit-transition","opacity .25s ease-in-out")
    hucLabels.style("opacity","0").style("transition","opacity .25s ease-in-out").style("-moz-transition","opacity .25s ease-in-out").style("-webkit-transition","opacity .25s ease-in-out")
  } else if (index === 4) {
    statesSVG.style("opacity",".05").style("transition","opacity .25s ease-in-out").style("-moz-transition","opacity .25s ease-in-out").style("-webkit-transition","opacity .25s ease-in-out")
    riversSVG.style("opacity","0").style("transition","opacity .25s ease-in-out").style("-moz-transition","opacity .25s ease-in-out").style("-webkit-transition","opacity .25s ease-in-out")
    hucOutlinesSVG.style("opacity",".7").style("transition","opacity .25s ease-in-out").style("-moz-transition","opacity .25s ease-in-out").style("-webkit-transition","opacity .25s ease-in-out")
    hucLabels.style("opacity","1").style("transition","opacity .25s ease-in-out").style("-moz-transition","opacity .25s ease-in-out").style("-webkit-transition","opacity .25s ease-in-out")
  }
}

// scrollama event handlers
function handleStepEnter(response) {
  // response = { element, direction, index }

  // add color to current step only
  step.classed("is-active", function(d, i) {
    return i === response.index;
  });

  // update graphic based on step // THIS IS THE UPDATE CHART SECTION
  updateChart(response.index);
}



function setupStickyfill() {
  d3.selectAll(".sticky").each(function() {
    Stickyfill.add(this);
  });
}

function init() {
  setupStickyfill();

  // 1. force a resize on load to ensure proper dimensions are sent to scrollama
  handleResize();

  // 2. setup the scroller passing options
  // 		this will also initialize trigger observations
  updateChart();
  // 3. bind scrollama event handlers (this can be chained like below)
  scroller
    .setup({
      step: "#scrolly article .step",
      offset: 0.01,
      debug: false
    })
    .onStepEnter(handleStepEnter);

  // setup resize event
  window.addEventListener("resize", handleResize);
}

// kick things off
init();