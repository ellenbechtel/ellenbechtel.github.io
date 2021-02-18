/////////////////////////////////
// Movie Glyphs!
//////////////////////////////////


/////////////////////////////////
// SET STATIC VARIABLES
//////////////////////////////////

// Mini Egg SVGs
var margin = {top: 30, right: 30, bottom: 30, left: 30};
var width = 200;
var height = 200;

var chartWidth = width;
var chartHeight = height;

/////////////////////////////////
// READ THE DATA
//////////////////////////////////

var promises = [
    // d3.csv("products.csv", parseProducts),
    d3.csv("data/movies.csv")
];

Promise.all(promises).then(function(data) {

    var movies = data[0];
    console.log("movies",movies);


    /////////////////////////////////
    // Create Scales for the Encodings Here
    //////////////////////////////////

    // scale for imdbScore

    // scale for imdbRatings   
    // scale for title
    // scale for year
    // scale for genre
    // scale for criticScoreRT
    // scale for audienceScoreRT
    // scale for runtimeMins
    // scale for budgetMillions
    // scale for revenueMillions

    /////////////////////////////////
    // Drawing individual glyphs
    //////////////////////////////////

    // make individual svgs
    var svg = d3.select("#chart")
        .selectAll("glyph")
        .data(movies)
        .enter()
        .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "glyph")
            .attr("id", function(d,i) {
                return "svg_" + i;
            });
    
    // draw circles in each svg
    d3.selectAll(".glyph").each(function(d) { // d is each movie data point
        console.log("d",d);
        
        // select the svg we're working on
        var this_svg = d3.select(this); 

        // deconstruct the data for each movie
        var deconstructed = [];
        for (var property in d) {
            var val = d[property];
            var o = {property: property, value: val}
            deconstructed.push(o);
        };

        console.log("decon", deconstructed)

        // draw inside each svg
        this_svg.selectAll("circle")
            .data(deconstructed)
            .enter()
            .append("circle")
                .attr("cx", width/2)
                .attr("cy", height/2)
                .attr("r", function(f,i) {
                    return i*5;
                })
                .attr("class", function(d, i) {
                    return ("labelCirc c-" + i + " " + d.property); // the property value of each object in "deconstructed" array
                })
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("stroke-width", 1);

        // // append a title label inside each svg
        // this_svg.selectAll("glyph-label")
        //         .append("text")
        
        // make text labels for each
        svg.append("text")
            .attr("class","movieLabel")
            .attr("y", height-10)
            .attr("x", width/2)
            .text(function(d){ 
                console.log(d, "What");
                return (d.title);
            });
        



    })

    

})
