/* 
QUESTION 1:

See the function parseCSV() at the very end of the document
to find the first question

*/
d3.csv("./data/one-year-of-recipes.csv", parseCSV).then(function(data) {

    /*
    ONE YEAR OF RECIPES FROM FOOD.COM
    Adapted from:
    https://www.kaggle.com/shuyangli94/food-com-recipes-and-user-interactions
    */
    console.log(data)


    /*
    BEGIN BY DEFINING THE DIMENSIONS OF THE SVG and CREATING THE SVG CANVAS
    */
    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    /* 
    CREATE AN ARRAY OF NODES 
    
    Here, each node is a unique recipe.

    QUESTION 2: What is happening in this block of code?

    */
    var nodes = [];
    data.forEach(function(d) {
        var datum = {};
        datum.id = d.id;
        datum.minutes = d.minutes;
        datum.name = d.name;
        datum.tag = d.tag;
        nodes.push(datum);
    });


    /*
    CREATE AN ARRAY OF LINKS

    In this example, we are creating links between nodes based
    on ingredients: two recipes will be connected if
    they have at least one shared ingredient between them

    QUESTION 3: How is this block of code working? How are these links being calculated?
    */

    var links = [];
    for(var i = 0; i < data.length-1; i++) {
        var recipeA = data[i];
        var ingredientsA = recipeA.ingredients;
        for(var j = i + 1; j < data.length; j++) {
            var recipeB = data[j];
            var ingredientsB = recipeB.ingredients;
            var sharedIngredients = ingredientsA.filter(function(d) {
                return ingredientsB.includes(d);
            });
            if(sharedIngredients.length > 0) {
                links.push({source: recipeA.id, target: recipeB.id, ingredients: sharedIngredients});
            }

        }
    }

    
    /*
    FILTER THE LINKS

    If we show all the links between recipes, the resulting network diagram
    is a hairball and hard to interpret;
    here, we will selectively filter out only those links where
    two recipes have more than 3 shared ingredients between them

    */
    links = links.filter(function(d) {
        return d.ingredients.length > 3;
    });


    /*
    DEFINE SCALES

    We will use these scales to control various visual features of the links and nodes:
    thickness of link, radius of circle, and color of each circle
    */

    var weightScale = d3.scaleLinear()
        .domain([4, d3.max(links, function(d) { return d.ingredients.length; })])
        .range([1, 10]);

    var rScale = d3.scaleSqrt()
        .domain([1, d3.max(nodes, function(d) { return d.minutes; })])
        .range([5, 15]);

    var colorScale = d3.scaleOrdinal(d3.schemeDark2)
        .domain(["15-minutes","30-minutes","60-minutes","over60"]);
        
    /* INITIALIZE THE FORCE SIMULATION */
    var simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody().strength(-32))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(function(d) { return rScale(d.minutes); }));

    /* DRAW THE LINKS */
    var link = svg.append("g")
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
            .attr("stroke", "#CECECE")
            .attr("stroke-width", function(d) { return weightScale(d.ingredients.length); });

    /* DRAW THE NODES */
    var node = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .attr("r", function(d) { return rScale(d.minutes); })
            .attr("fill", function(d) { return colorScale(d.tag); });

    /* TICK THE SIMULATION */
    simulation.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

    });


    /* ADD A TOOLTIP TO THE NODES */
    var tooltip = d3.select("#chart")
        .append("div")
        .attr("class","tooltip");

    node.on("mouseover", function(d) {
        var cx = d.x + 20;
        var cy = d.y - 10;

        tooltip.style("visibility", "visible")
            .style("left", cx + "px")
            .style("top", cy + "px")
            .html(d.name + "<br>" + d.minutes + " minutes");

        /* 
        QUESTION 4:
        When we hover over a circle, that circle and all the circles
        connected to it get highlighted while all other circles
        become translucent. How is this achieved?
        */

        node.attr("opacity",0.2);
        link.attr("opacity",0.2);

        d3.select(this).attr("opacity",1);

        var connected = link.filter(function(e) {
            return e.source.id === d.id || e.target.id === d.id;
        });
        connected.attr("opacity",1);
        connected.each(function(e) {
            node.filter(function(f) {
                return f.id === e.source.id || f.id === e.target.id;
            }).attr("opacity",1);
        });

    }).on("mouseout", function() {
        tooltip.style("visibility","hidden");
        node.attr("opacity",1);
        link.attr("opacity",1);
    });

});

/* 
CREATE A PARSE FUNCTION

Here, the parse function will only select specific columns of interest
from the CSV file (we don't need all of them!) and also extract the ingredients
list into a friendlier format
*/
function parseCSV(data) {
    var d = {};
    d.name = data.name;
    d.id = data.id;
    d.name = data.name;
    d.minutes = +data.minutes;

    /* 
    QUESTION 1:
    What do the .split() and .indexOf() methods do
    in the code below? (Use web resources to find the answer!)
    */

    d.ingredients = data.ingredients.split(",");

    var tags = data.tags.split(",");
    if(tags.indexOf("15-minutes-or-less") >= 0) {
        d.tag = "15-minutes";
    } else if(tags.indexOf("30-minutes-or-less") >= 0) {
        d.tag = "30-minutes";
    } else if(tags.indexOf("60-minutes-or-less") >= 0) {
        d.tag = "60-minutes";
    } else {
        d.tag = "over60";
    }
    
    return d;
}
