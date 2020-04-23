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

// HTML for the list items to append to
{/* <div>
<h2>DRAG AND DROP</h2>
<h3>Most Selfish</h3>
<ol id="list"></ol>
<h3>Most Selfless</h3>
<button id="submit-button">Sort</button>
</div> 


// and the buttons for color coding


<div id="toolbar-container">
        

        <div id="colorToolbar" class="toolbar">
          <span><h3>Color By</h3></span>
          <button id="all" class="cbutton active">Clear</button>
          <button id="eye" class="cbutton">Eye Color</button>
          <button id="hair" class="cbutton">Hair Color</button>
          <button id="skintone" class="cbutton">Skintone</button>
        </div>

      </div>
*/}


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


        // Get initial selfishness list order
        var list = document.querySelector("#list");
        var listOfItems = list.children;
        var orderedReasons = [];
        for(var i=0; i < listOfItems.length; ++i) {
            orderedReasons.push(listOfItems[i].textContent);
        };  

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






//// Unused Testing Code

//examples about Object.values and .indexOf
var obj = { 
    a: '3', 
    b: '2',
    c: '0',
    d: '1'};
console.log("object", Object.values(obj).indexOf("1")); // 3
console.log(Object.values(obj).indexOf("2")); // 1
console.log(Object.values(obj).indexOf("3")); // 0
console.log(Object.values(obj).indexOf("4")); // -1


// examples about indexOf for arrays
var arr = [3,2,0,1];     
console.log("array", arr.indexOf(1)); // 3
console.log(arr.indexOf(2)); // 1
console.log(arr.indexOf(3)); // 0
console.log(arr.indexOf(4)); // -1


var array = ["one", "two", "three"]
array.forEach(function (item, index) {
    console.log(item, index);
});


// make a function to push the order of each reason for each donor
function lookup(code) {
    var filtered = donorsR.filter(function(d) {
        return d[code] == code; 
    })
};


// examples on finding properties in an object by their value

var exampleObject = { 
    key1: 'Geeks', 
    key2: 100, 
    key3: 'Javascript' 
}; 

function getKeyByValue(object, value) { 
    for (var prop in object) { 
        if (object.hasOwnProperty(prop)) { 
            if (object[prop] === value) 
            return prop; 
        } 
    } 
} 
ans = getKeyByValue(exampleObject, 100); 
  
console.log(ans); 



var table = {
    row1: {
    col1: 'A',
    col2: 'B',
    col3: 'C'
    },
    row2: {
    col1: 'D',
    col2: 'A',
    col3: 'F'
    },
    row3: {
    col1: 'E',
    col2: 'G',
    col3: 'L'
    }
};

var findC = Object.keys(table).filter(function(row) {
    return table[row].col3==='C';
});

console.log(findC);


// Would love to write a code to make a new multi-digit reason code for each donor based on how the user orders the values
function encode(thisGuys_allReasons, reorderedReasons) {
};




 /////////////////////////////////
    // COLOR CODING
    //////////////////////////////////

    function colorBars(currentColorScale) {

        if(currentColorScale == "all") {
            rects.transition()
                .duration(transitionTime)
                .style("fill", "white");
        } else if (currentColorScale == "eye") {
            colorScale.domain(eyes).range(eyeColors);
            d3.selectAll(".row")
                .transition()
                .duration(transitionTime)
                .style("fill", function(d) { 
                    console.log(d);
                    return colorScale(d.eye); 
                });
        } else if (currentColorScale == "hair") {
            colorScale.domain(hair).range(hairColors);
            rects.transition()
                .duration(transitionTime)
                .style("fill", function(d) { return colorScale(d.hair); });
        } else if (currentColorScale == "skintone") {
            colorScale.domain(skin).range(skinColors);
            rects.transition()
                .duration(transitionTime)
                .style("fill", function(d) { return colorScale(d.skintone); });
         };
        
    
    };

    function setupButtons() {

        // Color Buttons
        d3.selectAll('.cbutton')
          .on('click', function () {
          	
            // Remove active class from all buttons
            d3.selectAll('.cbutton').classed('active', false);

            // Find the button just clicked
            var button = d3.select(this);

            // Set it as the active button
            button.classed('active', true);

            // Get the id of the button
            var buttonColor = button.attr('id');

              console.log(buttonColor)
              
            // Toggle the bubble chart based on the currently clicked button.
            colorBars(buttonColor);
          });        
      };
      
      setupButtons();


    //Labels for each donor
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + margin.left + ",0)")  
            .call(d3.axisLeft(yScale));


    // add labels to each row another way
        var labels = rows.selectAll(".donorLabel")
            .append("text")
            .attr("class", "rowText")
            .attr("id", function(d) { return d.name; })
            .style("fill", "#ffffff")
            .style("opacity", 1)
            .attr("text-anchor", "end")
            .attr("dx", xScale.bandwidth() / 2)
            .attr("dy", yScale.bandwidth() / 2 + 4)
            .text(function(d) { return d.name; });


    // Engaging a submit button to rewrite and reorder data
        // Engage the Submit Button!
        d3.selectAll("#submit-button")
        .on("click", function() {
            var orderedReasons = [];
            for(var i=0; i < listOfItems.length; ++i) {
                orderedReasons.push(listOfItems[i].textContent);
            };           
            reorderReasons(reasons,orderedReasons);
            console.log("donorsR",donorsR);
    });







    // create function to recode the reasons based on where the user dragged and dropped their values
    console.log("og reasons", reasons);

    function reorderReasons(obj, newArray) {
        console.log("reasons", obj);
        console.log("new array", newArray);
        console.log("index of Money", newArray.indexOf("Money"));
        for(i=0; i<newArray.length; i++) {
            if (obj[i].label == "Genetic Pride") { 
                obj[i].order = +(newArray.indexOf("Genetic Pride"))
            } else if (obj[i].label == "Money") { 
                obj[i].order = +(newArray.indexOf("Money"))
            } else if (obj[i].label == "Why Not") {
                obj[i].order = +(newArray.indexOf("Why Not"))
            } else if (obj[i].label == "Curiosity") {
                obj[i].order = +(newArray.indexOf("Curiosity"))
            } else if (obj[i].label == "Likes Donating") {
                obj[i].order = +(newArray.indexOf("Likes Donating"))
            } else if (obj[i].label == "Doesn't Have, Like, or Want Kids") {
                obj[i].order = +(newArray.indexOf("Doesn't Have, Like, or Want Kids"))
            } else if (obj[i].label == "Has, Likes, or Wants Kids") {
                obj[i].order = +(newArray.indexOf("Has, Likes, or Wants Kids"))
            } else if (obj[i].label == "Knows Someone") {
                obj[i].order = +(newArray.indexOf("Knows Someone"))
            } else if (obj[i].label == "It's a Good Deed") {
                obj[i].order = +(newArray.indexOf("It's a Good Deed"))
            } else if (obj[i].label == "Wants to Help Others") {
                obj[i].order = +(newArray.indexOf("Wants to Help Others"))
            };
        };

        console.log("reordered reasons", obj)
        
    };

// Star HMTL in SVG
//  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2200 300">
//             <g id="stars">
//             <path class="star" d="M1424.75,4.87l31.83,64.5a8.75,8.75,0,0,0,6.58,4.78l71.18,10.34a8.74,8.74,0,0,1,4.84,14.91l-51.5,50.2a8.77,8.77,0,0,0-2.52,7.74l12.16,70.89a8.73,8.73,0,0,1-12.67,9.21L1421,204a8.72,8.72,0,0,0-8.13,0l-63.66,33.47a8.74,8.74,0,0,1-12.68-9.21l12.16-70.89a8.77,8.77,0,0,0-2.52-7.74l-51.5-50.2a8.74,8.74,0,0,1,4.84-14.91l71.18-10.34a8.72,8.72,0,0,0,6.58-4.78l31.83-64.5A8.74,8.74,0,0,1,1424.75,4.87Z"/>
//             <path class="star" d="M1101.75,4.87l31.83,64.5a8.75,8.75,0,0,0,6.58,4.78l71.18,10.34a8.74,8.74,0,0,1,4.84,14.91l-51.5,50.2a8.77,8.77,0,0,0-2.52,7.74l12.16,70.89a8.73,8.73,0,0,1-12.67,9.21L1098,204a8.72,8.72,0,0,0-8.13,0l-63.66,33.47a8.74,8.74,0,0,1-12.68-9.21l12.16-70.89a8.77,8.77,0,0,0-2.52-7.74l-51.5-50.2a8.74,8.74,0,0,1,4.84-14.91l71.18-10.34a8.72,8.72,0,0,0,6.58-4.78l31.83-64.5A8.74,8.74,0,0,1,1101.75,4.87Z"/>
//             <path class="star" d="M778.75,4.87l31.83,64.5a8.75,8.75,0,0,0,6.58,4.78l71.18,10.34a8.74,8.74,0,0,1,4.84,14.91l-51.5,50.2a8.77,8.77,0,0,0-2.52,7.74l12.16,70.89a8.73,8.73,0,0,1-12.67,9.21L775,204a8.72,8.72,0,0,0-8.13,0l-63.66,33.47a8.74,8.74,0,0,1-12.68-9.21l12.16-70.89a8.77,8.77,0,0,0-2.52-7.74l-51.5-50.2a8.74,8.74,0,0,1,4.84-14.91l71.18-10.34a8.72,8.72,0,0,0,6.58-4.78l31.83-64.5A8.74,8.74,0,0,1,778.75,4.87Z"/>
//             <path class="star" d="M455.75,4.87l31.83,64.5a8.75,8.75,0,0,0,6.58,4.78l71.18,10.34a8.74,8.74,0,0,1,4.84,14.91l-51.5,50.2a8.77,8.77,0,0,0-2.52,7.74l12.16,70.89a8.73,8.73,0,0,1-12.67,9.21L452,204a8.72,8.72,0,0,0-8.13,0l-63.66,33.47a8.74,8.74,0,0,1-12.68-9.21l12.16-70.89a8.77,8.77,0,0,0-2.52-7.74l-51.5-50.2a8.74,8.74,0,0,1,4.84-14.91l71.18-10.34a8.72,8.72,0,0,0,6.58-4.78l31.83-64.5A8.74,8.74,0,0,1,455.75,4.87Z"/>
//             <path class="star" d="M132.75,4.87l31.83,64.5a8.75,8.75,0,0,0,6.58,4.78l71.18,10.34a8.74,8.74,0,0,1,4.84,14.91l-51.5,50.2a8.77,8.77,0,0,0-2.52,7.74l12.16,70.89a8.73,8.73,0,0,1-12.67,9.21L129,204a8.72,8.72,0,0,0-8.13,0L57.19,237.44a8.74,8.74,0,0,1-12.68-9.21l12.16-70.89a8.77,8.77,0,0,0-2.52-7.74L2.65,99.4A8.74,8.74,0,0,1,7.49,84.49L78.67,74.15a8.72,8.72,0,0,0,6.58-4.78l31.83-64.5A8.74,8.74,0,0,1,132.75,4.87Z"/>
//             </g>
//         </svg> 




// Unused draggable CSS

/* Draggable List */

// li.draggable {
//     /* list-style-type: none; */
//     display: inline-block;
//     background-color: transparent;
//     color: #DBDAD9;
//     padding: 7px;
//     margin:0 0.2em 0.2em 0;
//     border: 0.1em solid #DBDAD9;
//     border-radius:0.12em;
//     box-sizing: border-box;
//     text-decoration:none;
//     text-align: center;
//     transition: all 0.2s;
//     min-width: 110px;
//     cursor: pointer;
//     font-size: .8em;
    
  
//   }
  
//   li.draggable:hover {
//     color:#000000;
//     background-color:#DBDAD9;
//   }
  