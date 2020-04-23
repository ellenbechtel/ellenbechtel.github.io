/////////////////////////////////
// MATRIX CODE!
//////////////////////////////////


/////////////////////////////////
// SET STATIC VARIABLES
//////////////////////////////////

console.clear()

var width = document.querySelector("#matrix").clientWidth;
var height = document.querySelector("#matrix").clientHeight;
var margin = {
    top: 20,
    right: 20,
    bottom: 100,
    left: 100 
};
var chartWidth = width-margin.left-margin.right;
var chartHeight = height - margin.top - margin.bottom;
var transitionTime = .25 * 1000; // quarter second

var svg = d3.select("#matrix")
    .attr("width", chartWidth)
    .attr("height", chartHeight);


// Make Color Coding
var colorScale = d3.scaleOrdinal();
var eyes = ["Blue","Brown","Green"];
var eyeColors = ["#48CED9", "#91594A", "#A5BF66"];
var hair = ["Black","Blonde","Brown","Red"];
var hairColors = ["#000000", "#EDAC5F", "#91594A", "#A52117"];
var skin = ["Light","Fair","Medium","Olive","Brown","Dark"];
var skinColors = ["#F9E8D7", "#EFD6AC", "#D5AC73", "#BB7452", "#7D4E37", "#56352B"];



// Make an object of the reasons why a donor might donate and its altruism value
var reasons = [
    {code: "0", order: 0, label: "Genetic Pride", because: "he is proud of his genetics"},
    {code: "1", order: 1, label: "Money", because: "of the money"},
    {code: "2", order: 2, label: "Why Not", because: "why the heck not"},
    {code: "3", order: 3, label: "Curiosity", because: "he is curious"},
    {code: "4", order: 4, label: "Likes Donating", because: "he likes donating in general"},
    {code: "5", order: 5, label: "Doesn't Have, Like, or Want Kids", because: "he doesn't have, like, or want kids"},
    {code: "6", order: 6, label: "Has, Likes, or Wants Kids", because: "he has, likes, or wants kids"},
    {code: "7", order: 7, label: "Knows Someone", because: "he knows someone"},
    {code: "8", order: 8, label: "It's a Good Deed", because: "it's a good deed"},
    {code: "9", order: 9, label: "Wants to Help Others", because: "he wants to help others"}
   ];


// Make Scales
var orders = ["0","1","2","3","4"];
var opacities = ["0","1","0.5","0.2","0.1"]
var opacityScale = d3.scaleOrdinal()
    .domain(orders)
    .range(opacities);

var xScale = d3.scaleBand()
    .domain(reasons.map(function (d) { return d["label"]; }))
    .rangeRound([chartWidth, 0]);

var yScale = d3.scaleBand()
    .range([0, chartHeight]); // set the domain afterwards, once all the donors are loaded

var weightScale = d3.scaleSequential(d3.interpolatePlasma)
    .domain([0,5]);

// sum the code
function sum(code) {
    var sum = 0;
    var split = code.toString();
    for(i=0; i < split.length; i++){
        sum = sum+parseInt(split.substring(i,i+1));
    }
    return sum;
};

// weighted sums of the code
function weightedSum(code) {
    var weightedSum = 0;
    var split = code.toString();
    for(i=0; i < split.length; i++){
        weightedSum = weightedSum + (+split.substring(i,i+1) * 1/(i+1));
    }
    return ((5 * weightedSum)/13).toFixed(1);
};

/////////////////////////////////
// LOAD THE DATA!
//////////////////////////////////

d3.csv("donorReasons.csv", function (error, donorsR) {
    

        
    // Do some data manipulation to each donor, so that they have an object to which to map cells in their row
    function writeData(data) {
        data.forEach (function(d) {
            d.allReasons = reasons.map(function(reason) { return {reason: reason.label, code: reason.code, order: d[reason.code]}; });
            d.codeSum = sum(d.code);
            d.weightedSum = weightedSum(d.code);
        });

        // sort the donors by their altruisticness code, most altruistic to most selfish
        data = data.sort(function (a,b) {return d3.ascending(b.code, a.code);});

        // get an array of all the donor names in the database, set that to the domain of Y scale
        var names = data.map(function (d) { return d["name"]; });
     
        // set that sorted array of names to the domain of yScale, so that each donor will have a vertical row
        yScale.domain(names);

        console.log(data);
    };

    writeData(donorsR);
    

    /////////////////////////////////
    // Draw Everything!
    //////////////////////////////////

    // begin making some groupings
    var rows = svg.select("#donorRows").selectAll(".row")
        .data(donorsR)
        .enter()
        .append("g")
            .attr("class","row")
            .attr("id", function (d) { return "row-" + d.name; })
            .attr("transform", function (d) { return "translate(" + margin.left + "," + yScale(d.name) + ")"; });

    var rowRect = rows.append("rect")
        .attr("class", "rowRect")
        .attr("id", function(d) { return "rowRect-" + d.name;  })
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", chartWidth)
        .attr("height", yScale.bandwidth())
        .style("fill", function(d) { return weightScale(d.weightedSum)} );

    // add cells to the row
    var cells = rows.selectAll(".cell")
        .data(function(d) { return d.allReasons; })
        .enter()
        .append("g")
            .attr("transform", function (d, i) { return "translate(" + i * xScale.bandwidth() + ",0)"; })
            .attr("class", "cell");

    // add squares to cell
    var rects = cells.append("rect")
        .attr("class", function(d) {return "reasonRect " + d.order; })
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", xScale.bandwidth()-5)
        .attr("height", yScale.bandwidth()-1)
        .style("fill", "white")
        .style("opacity", function(d) { return opacityScale(d.order); })
        ;

    // add text over each rect
    var text = cells.append("text")
        .attr("class", function(d) { return "reasonText " + d.order; })
        .attr("text-anchor", "middle")
        .style("fill", "#ffffff")
        .style("opacity", 0) // they're there, just invisible
        .attr("dx", xScale.bandwidth() / 2)
        .attr("dy", yScale.bandwidth() / 2 + 8)
        .text(function(d) { return d.reason; });
  



    // add in color coding here

    /////////////////////////////////
    // TOOLTIP
    //////////////////////////////////

    var tooltip = d3.select("#tooltip");
    var tooltipMain = d3.select("#tooltip-main")
    var tooltipExtras = d3.select("#tooltip-extras")
    var tooltipStars = d3.select("#tooltip-stars-blocker")

    // Tooltip Content Function
     function ttReason(name, why) {
        return '<p id="ttReason"><span>' + name + ' says </span><span class="ttReason">"' + why + '."</span></p>';    
    };

    function ttLabel(title, value) {
        return '<p class="ttExtras"><span class="info">' + title + '</span><span class="value">' + value + '</span></p>';
    };

    function ttRating(title, value) {
        return '<p class="ttRating"><span class="info">' + title + '</span><span class="value">' + value + '</span></p>';
    };

    function convertToFt(inches) {
        var feet = Math.floor(inches/12);
        var rInches = Math.floor(inches % 12);

        return feet + " ft  " + rInches + " in";
    };
    
    function findMainReasons(this_code) {
        var first = [];
        var split = this_code.toString();
        if (split.substring(0)) { first = split.substring(0,1); };

        var filtered = reasons.filter(function(c) { return c.code === first; });
        first = filtered[0].because;
        return first;
    };

    function starRating(this_weightedSum) {
        return ((5-this_weightedSum)*100)/5;
    };
   
    rows.on("mouseover", function(d) {

        d3.selectAll(".row").classed("active", false); // clear all active rows

        var this_row = d3.select(this);
        this_row.classed("active",true);

        // create html content
        var htmlMain = '<div id="ttHeader"><span>"' + d.name +'" says he donated because </span><span id="ttHeaderR">' + findMainReasons(d.code) + '.</span></div>'; // header
        if (d.why) htmlMain += ttReason(d.name, d.why);
        if (d.weightedSum) htmlMain += ttRating("Good Guy Rating: ", d.weightedSum);

        var htmlExtras = "";        
        if (d.ethnicity) htmlExtras += ttLabel("Ethnicity: ", d.ethnicity);
        if (d.height) htmlExtras += ttLabel("Height: ", convertToFt(Math.floor(d.height)));
        if (d.weight) htmlExtras += ttLabel("Weight: ", d.weight + " lbs");
        if (d.eye) htmlExtras += ttLabel("Eye Color: ", d.eye);
        if (d.hair) htmlExtras += ttLabel("Hair Color: ", d.hair);
        if (d.skintone) htmlExtras += ttLabel("Skin Tone: ", d.skintone);
        if (d.hand) htmlExtras += ttLabel("Dominant Hand: ", d.hand);
        if (d.bloodType) htmlExtras += ttLabel("Blood Type: ", d.bloodType);
        if (d.education) htmlExtras += ttLabel("Education: ", d.education);
        if (d.occupation) htmlExtras += ttLabel("Occupation: ", d.occupation);
        if (d.hobbies) htmlExtras += ttLabel("Hobbies: ", d.hobbies);
        if (d.descr) htmlExtras += ttLabel("", d.descr + ".") + '</div>';
        
        tooltip 
            .style("visibility","visible");
        tooltipMain
            .style("visibility","visible")
            .html(htmlMain);
        tooltipStars
            .style("width", starRating(d.weightedSum) + '%');
        tooltipExtras
            .html(htmlExtras);
    
    }).on("click", function() {
        tooltipExtras.style("display","block");

    }).on("mouseout", function() {
        tooltip 
        .style("visibility","visible");
    
        tooltipExtras.style("display","none");
      
    });
});
