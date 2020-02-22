/////////////////////////////////
// BRAND SIGNATURES!
//////////////////////////////////

// This is the first chart, which is about what words are used in various products


/////////////////////////////////
// MAKE THE TOGGLE BUTTONS
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

// var isChecked = document.getElementById("radio-appearance").checked;




/////////////////////////////////
// SET STATIC VARIABLES
//////////////////////////////////


// Mini Egg SVGs
var margin = {top: 30, right: 30, bottom: 30, left: 30};
var width = 230;
var height = 230;

var chartWidth = width;
var chartHeight = height;


// The Legend

var legendMargin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20
};
  // HOW CAN I GET THESE TO BE RESPONSIVE WHEN I RESIZE THE WINDOW??

var legendSVGWidth = document.getElementById("legend-container").offsetWidth - legendMargin.left - legendMargin.right; 
var legendSVGHeight = window.innerHeight - legendMargin.top - legendMargin.bottom;
var legendSVG = d3.select("#legend-svg")
  .attr("width", legendSVGWidth)
  .attr("height", legendSVGHeight);

var legendSize = 20;
var legendPadding = 10;
var legend = legendSVG.select("#legend")
  .attr("transform", "translate(" + legendMargin.left + "," + legendMargin.top + ")");
  
var domainValues = d3.range(1, 5);

console.log(domainValues);




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





  
  // Keyword Index Scale
  var keywordScale = d3.scaleOrdinal()
    .domain([]) // how do I dynamically calculate the length of the keyword array?  .length something?
    .range([]); // how do I get this to be scaled to the size of the svg?

   
  // Make the Bad-Neutral-Good-Misleading Color Scale

  var colorScale = d3.scaleOrdinal()
    .domain(["Bad", "Neutral", "Good", "Misleading", "none"]) // change this to "too good to be true"
    .range(["#4C6375", "#B1D4CE", "#FED200", "#FA8C00", "none"]);


  // Make the Radius Scale, to say what order the circles should go in

  var radRatio = 4;
  var radiusScale = d3.scaleOrdinal() 
    .domain(["Size", "Color", "Grade", "Cholesterol", "Fat Description", "Vitamins", "Omega 3 ", "Feed", "Pesticides", "GMO in Feed", "Non-GMO Certified", "USDA Organic", "Range", "Fertile", "Certified Humane", "Antibiotics", "Hormones", "Kosher", "Container Material", "Pictures ", "Other Certifications", "Says 'Fresh' Anywhere", "Tag Lines"])
    .range([1*radRatio, 2*radRatio, 3*radRatio, 4*radRatio, 5*radRatio, 6*radRatio, 7*radRatio, 8*radRatio, 9*radRatio, 10*radRatio, 11*radRatio, 12*radRatio, 13*radRatio, 14*radRatio, 15*radRatio, 16*radRatio, 17*radRatio, 18*radRatio, 19*radRatio, 20*radRatio, 21*radRatio, 22*radRatio, 23*radRatio]);


  // Make the Regulated-NonRegulated Dash Scale

  var regulationScale = d3.scaleOrdinal()  // use .dasharray in d3 attr
    .domain(["yes", "no"])
    .range(["0", "2 2"]);


  /////////////////////////////////
  // DRAWING THE BRAND CIRCLES
  //////////////////////////////////

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
    //console.log(deconstructed); // deconstructed should be an object like {keyword: "Size"; value: "Large"} for each svg

    var this_svg = d3.select(this); // select the SVG we're working on at this moment in the loop

    this_svg.selectAll("circle")
      .data(deconstructed) //bind the deconstructed data
      .enter()
      .append("circle")
        .attr("cx", chartWidth/2)
        .attr("cy", chartHeight/2)
        .attr("fill", "none")
        .attr("stroke", function(e) { // eventually Make this a lookup function to call here and at the mouseover
          var meaning = lookupMeaning(e.value);
          return colorScale(meaning);
         })
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", function(e) {
          var reg = lookupReg(e.value);
          return regulationScale(reg);
        })
        .attr("r", function(d) {
          return radiusScale(d.keyword);
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
      

  console.log(eggsplainer);

  var legendData = [];

  eggsplainer.forEach(function(d) {
    var this_meaning = d.meaning;
    if(legendData.indexOf(this_meaning)<0) {
      legendData.push(this_meaning);
    }
  });

  // THIS SORTING DOESN'T PUT THEM IN THE ORDER I WANT THEM
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
    .attr("baseline-shift", "-150%");

  legendTexts.merge(legendTextsEnter)
    .attr("x", legendPadding + legendSize + legendPadding/2)
    .attr("y", function(d,i) {
      return i* legendSize + i* legendPadding;
    })
    .text(function(d) {
      return d;
    });


  
  


  /////////////////////////////////
  // SAMPLE SCRIPT ON SMALL MULTIPLES
  //////////////////////////////////
      
  /////////////////////////////////
  // INITIALIZE THE CHART BY CALLING THE FUNCTION ONCE
  //////////////////////////////////


  /////////////////////////////////
  // TOOLTIP / MOUSEOVER
  //////////////////////////////////




});



/////////////////////////////////
// PARSE FUNCTIONS
//////////////////////////////////


function parseProducts(data) {


///////// FILTER DOWN THE PRODUCTS PARSE FUNCTION SO IT'S ONLY THE KEYWORDS WE WANT


    var d = {};
    d.img = data.IMG;
    d.store = data.Store;
    d.brand = data.Brand;
    d.name = data.Name;
    d.ct = data.Count;
    d.price = data.Price;
    d.pricePerEgg = data.perEgg;
    d.containerMat = data.ContainerMaterial;
    d.size = data.Size;
    d.color = data.Color;
    d.grade = data.Grade;
    d.range = data.Range;
    d.humane = data.Humane;
    d.org = data.USDAOrganic;
    d.gmo = data.NonGMOCertified;
    d.otherCert = data.OtherCertifications;
    d.hormones = data.Hormones;
    d.hormQ = data.HormoneQuote;
    d.antibio = data.Antibiotics;
    d.omega3 = data.Omega3;
    d.chol = data.Cholesterol;
    d.vit = data.Vitamins;
    d.fat = data.Fat;
    d.feed = data.Feed;
    d.kosh = data.Kosher;
    d.gmoFeed = data.GMOinFeed;
    d.pest = data.Pesticides;
    d.taglines = data.TagLines;
    d.pic = data.Picture;
    d.saysFresh = data.Fresh;

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


