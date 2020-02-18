/////////////////////////////////
// BRAND SIGNATURES!
//////////////////////////////////

// This is the first chart, which is about what words are used in various products


/////////////////////////////////
// MAKE THE TOGGLE BUTTONS
//////////////////////////////////

// Make a sticky sidebar

var toggleContainer = document.getElementById('toggle-container');
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

var isChecked = document.getElementById("radio-appearance").checked;
  console.log(isChecked);






/////////////////////////////////
// SET STATIC VARIABLES
//////////////////////////////////
var margin = {top: 30, right: 30, bottom: 30, left: 30};
var width = 120;
var height = 120;

var chartWidth = width - margin.left - margin.right;
var chartHeight = height - margin.top - margin.bottom;


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

  console.log(products);
  console.log(eggsplainer);


  /////////////////////////////////
  // MANIPULATE THE DATA TO GET SOME THINGS WE WANT
  //////////////////////////////////

    // Get the keywords for the circles and put them in order

  var keywords = [];

  eggsplainer.forEach(function(d) {
    var this_keyword = d.quality;
    if(keywords.indexOf(this_keyword)<0) {
      keywords.push(this_keyword);
    }

  });

  console.log(keywords);  // THEY DONT EXACTLY MATCH THE KEYS IN PRODUCTS.CSV YET


  // Make Lookup Function

  function lookup(phrase) {

      // paste the filtering stuff from down below

  };

  // Keyword Index Scale
  var keywordScale = d3.scaleSqrt()
    .domain([]) // how do I dynamically calculate the length of the keyword array?  .length something?
    .range([]); // how do I get this to be scaled to the size of the svg?

 

  // Make new array of products with values that are replaced by the keywork lookups in eggsplainer



    
  // Make the Bad-Neutral-Good-Misleading Color Scale

  var colorScale = d3.scaleOrdinal()
    .domain(["Bad", "Neutral", "Good","Misleading"]) // change this to "too good to be true"
    .range(["#4c6375", "#b1d4ce", "#fed200", "#fa8c00"]);



  // Make the Regulated-NonRegulated Dash Scale

  var regulationScale = d3.scaleOrdinal()  // use .dasharray in d3 attr
    .domain(["Regulated", "Optional", "Unregulated"])
    .range(["0", "4 1", "1 4"]);



  /////////////////////////////////
  // DRAWING STUFF!
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


  d3.selectAll(".miniEgg").each(function(d) {

     // Make deconstructed data

    var deconstructed = [];

    for(var property in d) {
      var val = d[property];

      var o = {keyword: property, value: val} 

      deconstructed.push(o);
    };

      console.log(deconstructed);



    var this_svg = d3.select(this);
    console.log(this_svg);
    this_svg.selectAll("circle")
      .data(deconstructed) //deconstructed data
      .enter()
      .append("circle")
        .attr("cx", chartWidth/2)
        .attr("cy", chartHeight/2)
        .attr("fill", "none")
        .attr("stroke", function(e) {

          var meaning = lookup(e.value);

          // Make this a lookup function to call here and at the mouseover

          console.log(e);
          
          var filtered = eggsplainer.filter(function(f) {
            return f.phrase === e.value;
          });
          if(filtered.length == 1) {
                    
            //return colorScale(filtered[0].meaning);

          } else {
            return "none";
          }
 
        })
        .attr("stroke-width", 1)
        .attr("r", function(e,i) {
          return i*3;
          //return radiusScale(d.keyword)
        });

  });






  // svg
  //     .append("circle")
  //         .attr("class","productCircle")
  //         .attr("r", function(d) {
  //           return 0.01 * d.img;  // this needs to be an actual number
  //         })
  //         .attr("cx", chartWidth/2)
  //         .attr("cy", chartHeight/2);


  // Make text labels in each SVG
  svg
      .append("text")
          .attr("class", "productLabel")
          .attr("text-anchor","middle")
          .attr("y", chartHeight)
          .attr("x", chartWidth/2)
          .attr("fill", "black") // code this with a colorscale
          .text(function(d){ return(d.Brand)});
  svg
      .append("text")
          .attr("class", "store")
          .attr("text-anchor","middle")
          .attr("y", chartHeight)
          .attr("x", chartWidth/2)
          .attr("fill", "black") // code this with a colorscale
          .text(function(d){ return(d.Store)});

    
  /////////////////////////////////
  // GROUP THE DATA
  //////////////////////////////////
      
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
    var d = {};
    d.img = data.IMG;
    d.store = data.Store;
    d.brand = data.Brand;
    d.ct = data.Count;
    d.price = data.Price;
    d.pricePerEgg = data.perEgg;
    d.containerMat = data.ContainerMaterial;
    d.size = data.Size;
    d.color = data.Color;
    d.grade = data.Grade;
    d.range = data.Range;
    d.rangeQ = data.RangeQuote;
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
    d.feedQ = data.FeedQuote;
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



