/////////////////////////////////
// BRAND SIGNATURES!
//////////////////////////////////

// This is the first chart, which is about what words are used in various products


/////////////////////////////////
// MAKE THE QUIZ
//////////////////////////////////

// from code at https://www.w3schools.com/howto/howto_js_rangeslider.asp


var slider1 = d3.select("#slider1")
    .property("min", -10)
    .property("max", 10)
    .property("value", 0);
var slider2 = d3.select("#slider2")
    .property("min", -10)
    .property("max", 10)
    .property("value", 0);
var slider3 = d3.select("#slider3")
    .property("min", -10)
    .property("max", 10)
    .property("value", 0);
var slider4 = d3.select("#slider4")
    .property("min", -10)
    .property("max", 10)
    .property("value", 0);

//var tester = slider1.property("value");
tester.innerHTML = slider1.value;

console.log(slider1.value);
/*


slider1.oninput = function() {
    tester.innerHTML = this.value;
};

slider2.oninput = function() {
    tester.innerHTML = this.value;
};

slider3.oninput = function() {
    tester.innerHTML = this.value;
};

slider4.oninput = function() {
    tester.innerHTML = this.value;
};
*/

/////////////////////////////////
// SET STATIC VARIABLES
//////////////////////////////////
var margin = {top: 30, right: 30, bottom: 30, left: 30};
var width = 150 - margin.left - margin.right;
var height = 150 - margin.top - margin.bottom;


/////////////////////////////////
// READ THE DATA
//////////////////////////////////

var promises = [
    d3.csv("products.csv", parseCSV),
    d3.csv("eggsplainer.csv")
];


Promise.all(promises).then(function(data) {
    var products = data[0];
    var eggsplainer = data[1];

    
    

});

var dummyData = [{"name":"lol","amount":34,"date":"11/12/2015","store":"Whole Foods"},
  {"name":"The Country Hen","amount":120.11,"date":"11/12/2015","store":"Whole Foods"},
  {"name":"365 Organic","amount":45,"date":"12/01/2015","store":"Whole Foods"},
  {"name":"Organic Valley","amount":12.00,"date":"01/04/2016","store":"Market Basket"},
  {"name":"Eggland's Best","amount":34.10,"date":"01/04/2016","store":"Market Basket"},
  {"name":"Taggart's Eggs","amount":34.10,"date":"01/04/2016","store":"Market Basket"},
  {"name":"Vital Farms","amount":34.10,"date":"01/04/2016","store":"Trader Joe's"},
  {"name":"Happy Hens","amount":34.10,"date":"01/04/2016","store":"Trader Joe's"},
  {"name":"Ari Bari","amount":44.80,"date":"01/05/2016","store":"Trader Joe's"}
];

/* // Use this to group data if necessary
var expensesByName = d3.nest()
    .key(function(d) { return d.name; })
    .entries(dummyData);
*/

var svg = d3.select("#chart")
    .selectAll("uniqueChart")
    .data(dummyData)
    .enter()
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

svg
    .append("circle")
        .attr("class","productCircle")
        .attr("r", 10)
        .attr("cx", width/2)
        .attr("cy", height/2);
svg
    .append("text")
        .attr("class", "productLabel")
        .attr("text-anchor","middle")
        .attr("y", height)
        .attr("x", width/2)
        .attr("fill", "black") // code this with a colorscale
        .text(function(d){ return(d.name)});
svg
    .append("text")
        .attr("class", "store")
        .attr("text-anchor","middle")
        .attr("y", height)
        .attr("x", width/2)
        .attr("fill", "black") // code this with a colorscale
        .text(function(d){ return(d.store)});

    
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
// MAKE THE CHART UPDATE WITH A BUTTON CLICK THAT UPDATES SOMETHING
//////////////////////////////////


/////////////////////////////////
// TOOLTIP
//////////////////////////////////


/////////////////////////////////
// PARSE FUNCTION
//////////////////////////////////




function parseCSV(data) {
    var d = {};
    d.id = data.ID;
    d.store = data.Store;
    d.brand = data.Brand;
    d.ct = data.Count;
    d.price = data.Price;

    return d;
    
}

