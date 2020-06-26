d3.csv("data/2018-boston-crimes.csv").then(function(data) {
    /*
    BOSTON CRIME DATA from the BOSTON POLICE DEPARTMENT, 2018
    Adapted from:
    https://www.kaggle.com/ankkur13/boston-crime-data/
    */
    console.log(data);

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
    TRANSFORM THE DATA
    We want to eventually create a circle packing visualization that shows the relative proportion of each offense code group
    for the top 10 (by frequency) offense code groups in 2018.
    We can use the function d3.nest() to count the number of incidents of each unique offense code group:
    */

    var nested = d3.nest()
        .key(function(d) { return d.OFFENSE_CODE_GROUP; })
        .rollup(function(d) { return d.length; })
        .entries(data)
        .sort(function(a,b) { return b.value - a.value; });

    console.log(nested);



    /*
    After sorting the data above from largest to smallest, use array.slice() to grab only the first 10 entries
    */

    nested = nested.slice(0,10);
    console.log(nested);


    /*
    CREATE THE PACK LAYOUT GENERATOR
    */

    var pack = d3.pack()
        .size([width, height])
        .padding(15);




    /*
    CREATE THE HIERARCHY
    We need to use d3.hierarchy() to turn our data set into a 'hierarchical' data structure;
    d3.pack() REQUIRES a hierarchical structure to generate the packing layout
    */
    console.log({values: nested});
    
    var hierarchy = d3.hierarchy({values: nested}, function(d) { return d.values; })
        .sum(function(d) { return d.value; });

    console.log(hierarchy);



    /*
    GENERATE THE ROOT HIERARCHY
    By passing in our hierarchical data structure into our pack() function,
    we generate the geometries required to create the circle packing layout in the SVG canvas
    */

    var root = pack(hierarchy);
    console.log(root);


    /*
    DRAW THE CIRCLES FOR THE TREEMAP
    We will use our `root` structure, from above, to draw the circles for the treemap;
    we will do this by performing a data join with the array of nodes returned by root.descendants()
    (What does this return? Inspect the structure in the JS console)
    Notice how we're actually creating 'g' elements through our data join, to position the circles
    that we afterwards append to the 'g' elements
    */
    console.log(root.descendants());

    var circle = svg.selectAll("g")
        .data(root.descendants())
        .enter()
        .append("g")
            .attr("transform", function(d) {
                return `translate(${d.x},${d.y})`;
            });
    
    circle.append("circle")
        .attr("r", function(d) { return d.r; })
        .attr("fill", "#4682b4")
        .attr("fill-opacity", 0.5)
        .attr("stroke","#FFFFFF")
        .attr("stroke-width",3);




    /*
    ADD LABELS
    We can append an SVG 'text' element to each of the 'g' elements created above,
    to create labels for each circle
    */

    circle.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("fill","#FFFFFF")
        .text(function(d) { return d.data.key; })



});
