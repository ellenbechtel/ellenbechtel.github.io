
//////////////////////////////////
// STATIC VARIABLES
//////////////////////////////////

var svg = d3.select("#chart");

var data1 = [
    "Hey there you dinguses!",
    "What the heck is going on here?",
];

var data2 = [
"One little string for you"
];



//////////////////////////////////
// DRAW BOXES
//////////////////////////////////

var columnWidth = 200;

function drawBoxes(currentData) {
    

    // Boxes

    // Every enter-update-exit begins with a selection, this time to anything that has the class "box"
    // Remember! This part won't really be needed on the first enter, but WILL be necessary for every call of the function after it
    var boxes = svg.selectAll(".box")
        .data(currentData);
        // currentData is a placeholder. It could be ice cream!  We'll put other arguments in later depending on what data we want the function to use
    

    // Draw boxes
    boxes.enter().append("rect")
        .attr("class","box")
        .attr("x", function(d, i) {
            return i * columnWidth;
        })
        .attr("y",0)
        .attr("width", columnWidth)
        .attr("height", 200);

    // No update
    
    // Exit
    boxes.exit().remove();

    
    // Label time!!!  Group enter-update-exits by what you're working on (labels, boxes, etc) rather than by all enters, all updates, and all exits

    var fontSize = 20;

    // Selection first! And bind the data with whatever placeholder variable you put up in the first time we wrote the function
    var labels = svg.selectAll(".label")
        .data(currentData);

    // Enter
    var enterLabels = labels.enter().append("text")
        .attr("class","label")
        .attr("font-size", fontSize)
        .attr("text-anchor", "middle")
        .attr("x", function(d, i) {
            return i * columnWidth;
        })
        .attr("y",0)
        .attr("width", columnWidth)
        .attr("height", 200);

    // Update

    // start the update with merging with the existing entered selection
    labels.merge(enterLabels)

        // for each, but what is it selecting again?
        .each(function(d, i) {
            var textElement = d3.select(this);

            // clear the selection? Or something
            textElement.text("");

            // Create a variable that makes a new object in the array for each thing split by a space
            var words = d.split(" ");

            // A Tspan is a real thing, like a span or a div
            var tspan = textElement.append("tspan");

            // Start indexing what "line" of text we're on, so we can use this in the math later
            var line = 0;

            // Make a loop for each word, in order
            words.forEach(function(word) {

                // make a locally scoped variable called sentence that collects all the words / tspans which appear on that particular line
                var sentence = tspan.text();

                // Take the tspan we just made, append what already was stored in sentence, add a space, and the next word. 
                tspan.text(sentence + " " + word);

                // select the tspan element in the DOM ((WHAT DOES NODE DO AGAIN???))
                var domElement = tspan.node();

                // make a variable to store the tspan width. Then measure the width of the tspan by getting the DOM element we just made, finding the bounding rectangle, and measuring the width
                var tspanWidth = domElement.getBoundingClientRect().width;

                // Compare to see if tspan width is greater than the column width
                if (tspanWidth > columnWidth) {

                    // If it is, add one to the line count..
                    line++;

                    // ... store whatever text is in sentence (not sentence+word) as a tspan all by itself...
                    tspan.text(sentence);

                    // ... and now make a new tspan element with the first word of the new line!  
                    tspan = textElement.append("tspan")
                        .text(word) // if it's too wide, remove that word from the sentence, create a new tspan, and put the new word in there!
                        .attr("y", fontSize*line) // set the y position as font size times whatever line we're on
                        .attr("x", columnWidth*i); // set the x position as the beginning of the column
                
                }
                

                /*
                var text = tspan.text();
                tspan.text(text + " " + word);
                var lineWidth = tspan.node().getBoundingClientRect().width;
                */

            });

        });

    // Exit
    labels.exit().remove();

};


drawBoxes(data1);
