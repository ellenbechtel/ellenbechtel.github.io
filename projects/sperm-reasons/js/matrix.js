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

var svg = d3.select("#matrix")
    .attr("width", chartWidth)
    .attr("height", chartHeight);

// Make an object of the reasons why a donor might donate and its altruism value
var reasons = [
    {code: "0", value: 0, label: "Genetic Pride", because: "he is proud of his genetics"},
    {code: "1", value: 1, label: "Money", because: "of the money"},
    {code: "2", value: 2, label: "Why Not", because: "why the heck not"},
    {code: "3", value: 3, label: "Curiosity", because: "he is curious"},
    {code: "4", value: 4, label: "Likes Donating", because: "he likes donating in general"},
    {code: "5", value: 5, label: "Doesn't Have, Like, or Want Kids", because: "he doesn't have, like, or want kids"},
    {code: "6", value: 6, label: "Has, Likes, or Wants Kids", because: "he has, likes, or wants kids"},
    {code: "7", value: 7, label: "Knows Someone", because: "he knows someone"},
    {code: "8", value: 8, label: "It's a Good Deed", because: "it's a good deed"},
    {code: "9", value: 9, label: "Wants to Help Others", because: "he wants to help others"}
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
function dragEnter(e) {
    this.classList.add("over");
};

// dragLeave
function dragLeave(e) {
    this.classList.remove("over")
};

// dragOver
function dragOver(e) {
    e.preventDefault(); //what??
    e.dataTransfer.dropEffect = "move";
    return false;
}

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
}

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
var listOfItems = list.children;
var orderedValues = [];
for(var i=0; i < listOfItems.length; ++i) {
    orderedValues.push(listOfItems[i].textContent);
};
console.log(orderedValues);

d3.selectAll("#submit-button")
    .on("click", function() {
        var orderedValues = [];
        for(var i=0; i < listOfItems.length; ++i) {
            orderedValues.push(listOfItems[i].textContent);
        };
        console.log(orderedValues);


});








// Make Scales
var orders = ["0","1","2","3","4"];
var opacities = ["0","1","0.5","0.2","0.07"]
var opacityScale = d3.scaleOrdinal()
    .domain(orders)
    .range(opacities);

var xScale = d3.scaleBand()
    .domain(reasons.map(function (d) { return d["label"]; }))
    .rangeRound([chartWidth, 0]);

var yScale = d3.scaleBand()
    .range([0, chartHeight]); // set the domain afterwards, once all the donors are loaded


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
        // console.log(donorsR);

    // get an array of all the donor names in the database, set that to the domain of Y scale
    var names = donorsR.map(function (d) { return d["name"]; });
        // console.log("names", names); // names is an array of the donor Names, listed in order of selfishnes scale 

    // set that sorted array of names to the domain of yScale, so that each donor will have a vertical row
    yScale.domain(names);

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

    console.log("mapped donors", donorsR);

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
        .attr("height", yScale.bandwidth());

    // add labels to each row
    // var labels = rows.selectAll(".donorLabel")
    //     .append("text")
    //     .attr("class", "rowText")
    //     .attr("id", function(d) { return d.name; })
    //     .style("fill", "#ffffff")
    //     .style("opacity", 1)
    //     .attr("text-anchor", "end")
    //     .attr("dx", xScale.bandwidth() / 2)
    //     .attr("dy", yScale.bandwidth() / 2 + 4)
    //     .text(function(d) { return d.name; });


    // add cells to the row
    var cells = rows.selectAll(".cell")
        .data(function(d) { return d.allReasons; })
        .enter()
        .append("g")
            .attr("transform", function (d, i) { return "translate(" + i * xScale.bandwidth() + ",0)"; })
            .attr("class", "cell");

    // add squares to cell
    var rects = cells.append("rect")
        .attr("class", function(d) { return "reasonRect " + d.code ; })
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", xScale.bandwidth()-5)
        .attr("height", yScale.bandwidth()-1)
        .style("fill", "white")
        .style("opacity", function(d) { return opacityScale(d.order); })
        ;

    // add text over each rect

    var text = cells.append("text")
        .attr("class", function(d) { return "reasonText " + d.code; })
        .attr("text-anchor", "middle")
        .style("fill", "#ffffff")
        .style("opacity", 0) // they're there, just invisible
        .attr("dx", xScale.bandwidth() / 2)
        .attr("dy", yScale.bandwidth() / 2 + 8)
        .text(function(d) { return d.reason; });
  

    // Labels for each donor
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")  
        .call(d3.axisLeft(yScale));


    // Tooltip

    var tooltip = d3.select("#tooltip");
    var tooltipText = d3.select("#tooltip-text")

    // Tooltip Content Function
     function ttReason(name, why) {
        return '<p id="ttReason"><span>' + name + ' says </span><span class="ttReason">"' + why + '."</span></p>';    
    };

    function ttLabel(title, value) {
        return '<p class="ttText"><span class="info">' + title + '</span><span class="value">' + value + '</span></p>';
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
   
    rows.on("mouseover", function(d) {

        d3.selectAll(".row").classed("active", false); // clear all active rows

        var this_row = d3.select(this);
        this_row.classed("active",true);

        // d3.selectAll(".row")
        //     .attr("opacity", 0.5);
        
        // d3.select(".active")
        //     .attr("opacity",1);

        // create html content
        var html = '<div id="ttHeader"><span>' + d.name +' donated mostly because</span><br><span id="ttHeaderR">' + findMainReasons(d.code) + '</span></div>'; // header

        if (d.why) html += ttReason(d.name, d.why);
        if (d.ethnicity) html += '<div id="ttContent">' + ttLabel("Ethnicity: ", d.ethnicity);
        if (d.height) html += ttLabel("Height: ", convertToFt(Math.floor(d.height)));
        if (d.weight) html += ttLabel("Weight: ", d.weight + " lbs");
        if (d.eye) html += ttLabel("Eye Color: ", d.eye);
        if (d.hair) html += ttLabel("Hair Color: ", d.hair);
        if (d.skintone) html += ttLabel("Skin Tone: ", d.skintone);
        if (d.hand) html += ttLabel("Dominant Hand: ", d.hand);
        if (d.bloodType) html += ttLabel("Blood Type: ", d.bloodType);
        if (d.education) html += ttLabel("Education: ", d.education);
        if (d.occupation) html += ttLabel("Occupation: ", d.occupation);
        if (d.hobbies) html += ttLabel("Hobbies: ", d.hobbies);
        if (d.descr) html += ttLabel("", d.descr + ".") + '</div>';
        

        tooltip 
            .style("visibility","visible");

        tooltipText
            .html(html);
        
    }).on("mouseout", function() {

        // d3.selectAll(".row")
        //     .style("opacity", function(d) { return opacityScale(d.order); });
        

    }).on("click", function() {
        tooltip.style("visibility","visible");
    });

});
