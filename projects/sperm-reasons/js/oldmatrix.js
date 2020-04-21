/////////////////////////////////
// MATRIX CODE!
//////////////////////////////////


/////////////////////////////////
// SET STATIC VARIABLES
//////////////////////////////////

console.clear()

var width = d3.min([window.innerWidth, 900]);
var height = d3.min([window.innerHeight, 500]);
var margin = {
    top: 20,
    right: 20,
    bottom: 100,
    left: 20 
};
var chartWidth = width-margin.left-margin.right;
var chartHeight = height - margin.top - margin.bottom;

var svg = d3.select("#matrix")
    .attr("width", chartWidth)
    .attr("height", chartHeight);

// Make an object of the reasons why a donor might donate and its altruism value
var reasons = [
    {code: "9", value: 9, label: "Wants to Help Others", because: "he wants to help others"},
    {code: "8", value: 8, label: "It's a Good Deed", because: "it's a good deed"},
    {code: "7", value: 7, label: "Knows Someone", because: "he knows someone"},
    {code: "6", value: 6, label: "Has, Likes, or Wants Kids", because: "he has, likes, or wants kids"},
    {code: "5", value: 5, label: "Doesn't Have, Like, or Want Kids", because: "he doesn't have, like, or want kids"},
    {code: "4", value: 4, label: "Likes Donating", because: "he likes donating in general"},
    {code: "3", value: 3, label: "Curiosity", because: "he is curious"},
    {code: "2", value: 2, label: "Why Not", because: "why the heck not"},
    {code: "1", value: 1, label: "Money", because: "of the money"},
    {code: "0", value: 0, label: "Genetic Pride", because: "he is proud of his genetics"}
];


// Append a list item for each reason in its current order
var listOfReasons = d3.select("#list");

reasons.forEach(function(r) {
    listOfReasons.append("li")
        .property("className", "draggable")
        .property("id", r.value)
        .property("draggable", "true")
        .text(r.label);    
});


/////////////////////////////////
// Drag and drop ordering of the columns // https://webdevtrick.com/html-drag-and-drop-list/
//////////////////////////////////

// make all five dragging event listeners

// dragStart
function dragStart(e) { // on the first click before the drag moves at all
    this.style.opacity = "0.4"; // make it a little transparent
    dragSrcEl = this; // ???????????
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", this.innerHTML);
};

// dragEnter
function dragEnter(e) { this.classList.add("over"); };

// dragLeave
function dragLeave(e) { this.classList.remove("over")};

// dragOver
function dragOver(e) {
    e.preventDefault(); //what??
    e.dataTransfer.dropEffect = "move";
    return false;
};

//dragDrop
function dragDrop(e) {
    if (dragSrcEl != this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html'); // ???
    }
    return false;
};

// dragEnd
function dragEnd(e) {
    var listItems = document.querySelectorAll(".draggable");
    [].forEach.call(listItems, function(item) { // ????
        item.classList.remove("over");
    });
    this.style.opacity = "1";
};

function addEventsDragAndDrop(el) {
    el.addEventListener("dragstart", dragStart, false);
    el.addEventListener("dragenter", dragEnter, false);
    el.addEventListener("dragover", dragOver, false);
    el.addEventListener("dragleave", dragLeave, false);
    el.addEventListener("drop", dragDrop, false);
    el.addEventListener("dragend", dragEnd, false);
};

var listItems = document.querySelectorAll(".draggable");
    [].forEach.call(listItems, function(item) {
        addEventsDragAndDrop(item);
    });

// Engage the Submit Button!
var list = document.querySelector("#list");
var collLi = list.children;
var orderedValues = [];
for(var i=0; i < collLi.length; ++i) {
    orderedValues.push(collLi[i].textContent);
};
console.log(orderedValues);

d3.selectAll("#submit-button")
    .on("click", function() {
        var orderedValues = [];
        for(var i=0; i < collLi.length; ++i) {
            orderedValues.push(collLi[i].textContent);
        };
        console.log(orderedValues);
    });



// Make Scales
var orders = ["0","1","2","3","4"];
var opacities = ["0","1","0.5","0.2","0.07"]
var opacityScale = d3.scaleOrdinal()
    .domain(orders)
    .range(opacities);

var yScale = d3.scaleBand()
    .domain(reasons.map(function (d) { return d["label"]; }))
    .range([0, chartHeight]);

var xScale = d3.scaleBand()
    .rangeRound([0, chartWidth]); // set the domain afterwards, once all the donors are loaded


// create function to add digits
function sum(code) {
    var sum = 0;
    var split = code.toString();
    for(i=0; i < split.length; i++){
        sum = sum+parseInt(split.substring(i,i+1));
    }
    return sum;
};




/////////////////////////////////
// LOAD THE DATA!
//////////////////////////////////


d3.csv("donorReasons.csv", function (error, donorsR) {

    // sort the donors by their altruisticness code, most altruistic to most selfish
    donorsR = donorsR.sort(function (a,b) {return d3.descending(b.code, a.code);});

    // get an array of all the donor names in the database, set that to the domain of Y scale
    var names = donorsR.map(function (d) { return d["name"]; });
        // console.log("names", names); // names is an array of the donor Names, listed in order of selfishnes scale 

    // set that sorted array of names to the domain of yScale, so that each donor will have a vertical row
    xScale.domain(names);

    // make a function to push the order of each reason for each donor
    function lookup(code) {
        var filtered = donorsR.filter(function(d) {
            return d[code] == code; 
        })
    };

    // Do some data manipulation to each donor, so that they have an object to which to map cells in their row
    donorsR.forEach (function(d) {
        d.codeSum = sum(d.code);
        d.allReasons = reasons.map(function(reason) { return {reason: reason.label, code: reason.code, order: d[reason.code]}; });
    });

    //console.log("mapped donors", donorsR);

    // begin making some groupings
    var columns = svg.select("#donorColumns").selectAll(".column")
        .data(donorsR)
        .enter()
        .append("g")
            .attr("class","column")
            .attr("transform", function (d, i) { return "translate(" + xScale(d.name) + ",0)"; })

    // add cells to the row
    var cells = columns.selectAll(".cell")
        .data(function(d) { return d.allReasons; })
        .enter()
        .append("g")
            .attr("transform", function (d) { return "translate(0," + i * yScale(bandwidth) + ")"; })
            .attr("class", "cell");

    // add squares to cell
    var rects = cells.append("rect")
        .attr("class", "reasonRect")
        .attr("class", function(d) { return d.code ; })
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 2)
        .attr("height", yScale.bandwidth())
        .style("fill", "white")
        .style("opacity", function(d) { return opacityScale(d.order); });



/*

//The old working groupings!


 // begin making some groupings
    var rows = svg.select("#donorRows").selectAll(".row")
        .data(donorsR)
        .enter()
        .append("g")
            .attr("class","row")
            .attr("transform", function (d) { return "translate(0," + yScale(d.name) + ")"; });



/*





    // add cells to the row
    var cells = rows.selectAll(".cell")
        .data(function(d) { return d.allReasons; })
        .enter()
        .append("g")
            .attr("transform", function (d, i) { return "translate(" + i * xScale.bandwidth() + ",0)"; })
            .attr("class", "cell");

    // add squares to cell
    var rects = cells.append("rect")
        .attr("class", "reasonRect")
        .attr("class", function(d) { return d.code ; })
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", xScale.bandwidth()-5)
        .attr("height", 3)
        .style("fill", "white")
        .style("opacity", function(d) { return opacityScale(d.order); })
        ;









*/








    // Tooltip

    var tooltip = d3.select("#tooltip");

    rects.on("mouseover", function(d) {
        tooltip 
            .style("visibility","visible")
            .html("<h3>" + d.reason + "</h3>");
        

    });

});




