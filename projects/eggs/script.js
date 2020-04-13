/////////////////////////////////
// BRAND SIGNATURES!
//////////////////////////////////

// This is the first chart, which is about what words are used in various products

/////////////////////////////////
// SET STATIC VARIABLES
//////////////////////////////////


// Mini Egg SVGs
var margin = {top: 30, right: 30, bottom: 30, left: 30};
var width = 230;
var height = 230;

var chartWidth = width;
var chartHeight = height;



/////////////////////////////////
// MAKE AN APPEARING SIDEBAR LEGEND
//////////////////////////////////

// Make a sticky sidebar

var toggleContainer = document.getElementById('legend-container');
    toggleContainer.style.opacity = 0;
var chartPos = document.getElementById('chart');
var sticky = chartPos.offsetTop - 300;

function makeSticky() {
  if (window.pageYOffset >= sticky ) {
  toggleContainer.style.opacity = 1;
  } else {
  toggleContainer.style.opacity = 0;
  }
};

window.addEventListener('scroll', function () {
  makeSticky();
});

  
// Get values of the toggle switches // Tutorial at https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_radio_checked2


// The Legend

var legendMargin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20
};

var legendSVGWidth = document.getElementById("legend-container").offsetWidth - legendMargin.left - legendMargin.right; 
var legendSVGHeight = document.getElementById("legend-container").innerHeight - legendMargin.top - legendMargin.bottom;
var legendSVG = d3.select("#legend-svg")
  .attr("width", legendSVGWidth)
  .attr("height", legendSVGHeight);

var legendSize = 20;
var legendPadding = 10;
var legend = legendSVG.select("#legend")
  .attr("transform", "translate(" + legendMargin.left + "," + legendMargin.top + ")");
  
var domainValues = d3.range(1, 5);

/////////////////////////////////
// READ THE DATA
//////////////////////////////////

var promises = [
    d3.csv("products.csv", parseProducts),
    d3.csv("eggsplainer.csv", parseEggsplainer)
];


Promise.all(promises).then(function(data) {
  
  var products = data[0];
  var eggsplainer = data[1];


  // Make Lookup Functions
  function lookupMeaning(phrase) {
          var filtered = eggsplainer.filter(function(d) {
            return d.phrase === phrase; // for the deconstructed data, which only has one value (like "Large"), go through eggsplainer (f.phrase) and see if there's anything that matches that value.  There should ony be one thing. 
          });
          if(filtered.length == 1) { // this is a filter to say "if there's ANYTHING in the array called filtered, do something with it".  There should only be one thing, or none. Not more.   
            return filtered[0].meaning; // Whatever the meaning is, color code it
          } else {
            return "none"; // if there was no value, then there's no corresponding meaning, so don't color code it.
          };
  };

  function lookupReg(phrase) {   
    var filtered = eggsplainer.filter(function(d) {
        return d.reg === phrase; // for the deconstructed data, which only has one value (like "Large"), go through eggsplainer (f.phrase) and see if there's anything that matches that value.  There should ony be one thing. 
      });
    if(filtered.length == 1) { // this is a filter to say "if there's ANYTHING in the array called filtered, do something with it".  There should only be one thing, or none. Not more.   
    console.log(filtered);
      return filtered[0].reg; // Whatever the meaning is, color code it
    } else {
      return "0 0"; // if there was no value, then there's no corresponding meaning, so don't dash code it.
    };
  };

   
  // Make the Bad-Neutral-Good-Misleading Color Scale
  var colorScale = d3.scaleOrdinal()
    .domain(["Bad", "Neutral", "Good", "Misleading", "none"]) // change this to "too good to be true"
    .range(["#4C6375", "#B1D4CE", "#FED200", "#FA8C00", "none"]);

  // Make the Radius Scale, to say what order the circles should go in
  var radRatio = 4;
  var radiusScale = d3.scaleOrdinal() 
    .domain(["size", "color", "grade", "chol", "fat", "vit", "omega3", "feed", "pest", "gmoFeed", "gmo", "org", "range", "fertile", "humane", "antibio", "hormones", "kosh", "containerMat", "pic", "otherCert", "saysFresh", "taglines"])
    .range([1*radRatio, 2*radRatio, 3*radRatio, 4*radRatio, 5*radRatio, 6*radRatio, 7*radRatio, 8*radRatio, 9*radRatio, 10*radRatio, 11*radRatio, 12*radRatio, 13*radRatio, 14*radRatio, 15*radRatio, 16*radRatio, 17*radRatio, 18*radRatio, 19*radRatio, 20*radRatio, 21*radRatio, 22*radRatio, 23*radRatio]);

  // Make the Regulated-NonRegulated Dash Scale
  var regulationScale = d3.scaleOrdinal()  // use .dasharray in d3 attr
    .domain(["yes", "no"])
    .range(["0", "2 2"]);




  /////////////////////////////////
  // DRAWING THE BRAND CIRCLES
  //////////////////////////////////

  
  // THE REAL THING!!!

  console.log(products);
  // Make individual SVGs for each data point, bind the data to the svgs
  var svg = d3.select("#chart")
      .selectAll("uniqueChart")
      .data(products)
      .enter()
      .append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("class", "miniEgg")
          .attr("id", function(d,i) {
            return "svg_" + i;
          });


  // Draw Circles in each SVG
  d3.selectAll(".miniEgg").each(function(d) { // for each SVG, which is bound to the data "products"

     // Make deconstructed data
    var deconstructed = []; 
    for(var property in d) { // for every column header for every object in "products"...
      var val = d[property]; // this is kinda the same as d.property, but is notated differently. also we're making a thing called property here? 
      var o = {keyword: property, value: val} // making an object pair and saving it in var o
      deconstructed.push(o); // push the object with the pairs into the empty var deconstructed
    };
   
  
    var this_svg = d3.select(this); // select the SVG we're working on at this moment in the loop

    // Draw on each SVG with the deconstructed data
    this_svg.selectAll("circle")
      .data(deconstructed) //bind the deconstructed data
      .enter()
      .append("circle")
        .attr("cx", chartWidth/2)
        .attr("cy", chartHeight/2)
        .attr("class", function(d, i) {
          return ("labelCirc c-" + i + " " + d.value);
        })
        .attr("fill", "none")
        .attr("stroke", function(e) { // eventually Make this a lookup function to call here and at the mouseover
          var meaning = lookupMeaning(e.value);
          return colorScale(meaning);
         })
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", function(e) {
          var reg = lookupReg(e.value);
          /// reg IS RETURNING 0 0 !!!!!!!!!!!!!!!!!!!!!!!!
          return regulationScale(reg);
        })
        .attr("r", function(d) {
          return radiusScale(d.keyword);
        })
        .on("mouseover", function(d,i) {
          mouseoverHighlight(i)
        })
        .on("mouseout" , function(d) {
          mouseoutReset(d)
        });

  });

  // Make text labels in each SVG
  svg
      .append("text")
          .attr("class", "productLabel")
          .attr("text-anchor","middle")
          .attr("y", chartHeight)
          .attr("x", chartWidth/2)
          .attr("fill", "black") // code this with a colorscale
          .text(function(d){ return(d.name)});
  svg
      .append("text")
          .attr("class", "store")
          .attr("text-anchor","middle")
          .attr("y", chartHeight)
          .attr("x", chartWidth/2)
          .attr("fill", "black") // code this with a colorscale
          .text(function(d){ return(d.store)});


    
  /////////////////////////////////
  // DRAW THE LEGEND
  //////////////////////////////////
      
  var legendData = [];

  eggsplainer.forEach(function(d) {
    var this_meaning = d.meaning;
    if(legendData.indexOf(this_meaning)<0) {
      legendData.push(this_meaning);
    }
  });

  // THIS SORTING DOESN'T PUT THEM IN THE ORDER I WANT THEM! How do i do thattttt
  legendData.sort(function(a,b) {
    return b-a;
  });

  var legendRects = legend.selectAll("rect")
    .data(legendData);
  var legendRectEnter = legendRects.enter().append("rect");

  legendRects.merge(legendRectEnter)
    .attr("x", 0)
    .attr("y", function(d, i) {
      return i * legendSize + i * legendPadding;
    })
    .attr("width", legendSize)
    .attr("height", legendSize)
    .attr("fill", colorScale); // don't need to use an accessory function here because barColor has it's own numbers!

  // Legend Labels
  var legendTexts = legend.selectAll("text")
    .data(legendData);
  var legendTextsEnter = legendTexts.enter().append("text")
    .attr("baseline-shift", "-100%");
  legendTexts.merge(legendTextsEnter)
    .attr("x", legendPadding + legendSize + legendPadding/2)
    .attr("y", function(d,i) {
      return i* legendSize + i* legendPadding;
    })
    .attr("class", function (d,i) {
      return ("legendText leg-" + d);
    })
    .text(function(d) {
      return d;
    });


  /////////////////////////////////
  // TOOLTIP / MOUSEOVER FUNCTIONS
  //////////////////////////////////


  // Mouseover Highlight
  function mouseoverHighlight(index) { 
    d3.selectAll('.miniEgg')
      .transition()
      .style("opacity", 0.1);
    d3.selectAll(".c-" + index) // THIS SELECTOR ISN'T WORKING!!!!!!!!!!!!!!!!!!!
      .transition()
      .style("opacity", 1)
  };

  // Mouseover Reset
  function mouseoutReset(d) {
    d3.selectAll(".miniEgg")
      .transition()
      .style("opacity", 1);
  };

  // Tooltip explainer window




});



/////////////////////////////////
// PARSE FUNCTIONS
//////////////////////////////////


function parseProducts(data) {


///////// FILTER DOWN THE PRODUCTS PARSE FUNCTION SO IT'S ONLY THE KEYWORDS WE WANT


    var d = {};
    
    
    


    d.size = data.Size;
    d.color = data.Color;
    d.grade = data.Grade;
    d.chol = data.Cholesterol;
    d.fat = data.Fat;
    d.vit = data.Vitamins;
    d.omega3 = data.Omega3;
    d.feed = data.Feed;
    d.pest = data.Pesticides;
    d.gmoFeed = data.GMOinFeed;
    d.gmo = data.NonGMOCertified;
    d.org = data.USDAOrganic;
    d.range = data.Range;
    d.fertile = data.Fertile;
    d.humane = data.Humane;
    d.antibio = data.Antibiotics;
    d.hormones = data.Hormones;
    d.kosh = data.Kosher;
    d.containerMat = data.ContainerMaterial;
    d.pic = data.Picture;
    d.otherCert = data.OtherCertifications;
    d.saysFresh = data.Fresh;
    d.taglines = data.TagLines;
    d.hormQ = data.HormoneQuote;
    d.name = data.Name;
    d.ct = data.Count;
    d.price = data.Price;
    d.pricePerEgg = data.perEgg;
    d.store = data.Store;
    d.brand = data.Brand;

    return d;

};

function parseEggsplainer(data) {
  var d = {};
  
  d.order = data.Order;
  d.EGP = data.conceptualGroup;  // Egg, Chicken, or Packaging
  d.about = data.specificGroup; 
  d.quality = data.category;
  d.phrase = data.phrase;
  d.meaning = data.meaning;
  d.why = data.why;
  d.source = data.source;
  d.reg = data.regulated;

  return d;

};


