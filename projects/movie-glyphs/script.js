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

    movies.sort((a,b) => {
        return a.year - b.year; // sort by year
    })

    /////////////////////////////////   
    // Manipulate the data to get scores we want
    //////////////////////////////////
    
    movies.forEach(function(movie, index) {
        console.log("for each", movie, index);
        movie.ratingDiff = movie.audienceScoreRT - movie.imdbScore;
    })

    console.log("new scores", movies);

    /////////////////////////////////
    // Create Scales for the Encodings Here
    //////////////////////////////////

    // scale for imdbScore
    // scale for imdbRatingsCount (Triangle Height)
    var counts = movies.map(function(movie) { return movie.imdbRatingsCount;})
    var triHeighScale = d3.scaleLinear()
    .domain([d3.min(counts), d3.max(counts)])
    .range([0, height/2]);
    // scale for title
    // scale for year
    // scale for genre
    // scale for criticScoreRT
    // scale for audienceScoreRT
    // scale for runtimeMins (Triangle base width)
    var runtimes = movies.map(function(movie){ return movie.runtimeMins});
    var triBaseScale = d3.scaleLinear()
        .domain([d3.min(runtimes), d3.max(runtimes)])
        .range([0, width]);

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
    
    // deconstruct the data for each movie svg
    d3.selectAll(".glyph").each(function(d,i) { // d is each movie data point
        // console.log("d",d);
        
        // select the svg we're working on
        var this_svg = d3.select(this); 

        // deconstruct the data for each movie
        var deconstructed = [];
        for (var property in d) {
            var val = d[property];
            var o = {property: property, value: val}
            deconstructed.push(o);
        };

        // console.log(deconstructed, "deconstructed")

        // draw VARIABLE 1
        // this_svg.selectAll("circle")
        //     .data(deconstructed)
        //     .enter()
        //     .append("circle")
        //         .attr("cx", width/2)
        //         .attr("cy", height/2)
        //         .attr("r", function(m,i) {
        //             return i*5;
        //         })
        //         .attr("class", function(d, i) {
        //             return ("labelCirc c-" + i + " " + d.property); // the property value of each object in "deconstructed" array
        //         })
        //         .attr("fill", "none")
        //         .attr("stroke", "white")
        //         .attr("stroke-width", 1);

        // draw VARIABLE 2
        // this_svg.append("rect")
        //     .attr("width", function(m,i) {
        //         // console.log(m,"m?")
        //         return width*(m.audienceScoreRT/100);
        //     })
        //     .attr("height", height/2)
        //     .attr("class", function(d) {
        //         return ("labelRect audienceScoreRT"); // the property value of each object in "deconstructed" array
        //     })
        //     .attr("fill", "none")
        //     .attr("stroke", "black")
        //     .attr("stroke-width", 1);

        // draw triangle
        //The tricky part will be determining where to draw it. 
        //The 'M' says move to the absolute position you specify with the x and the y (here it is 100 / 100). 
        // Lowercase 'l' says, relative to the previous command, draw a line to this point. So here we are starting at the middle of the svg, then drawing a line 4 to the right and 4 pixels down, then another line 8 pixels to the left. The final z says to close the path, drawing another line to the starting point. Look at the w3.org reference page for more path commands.
        this_svg.append('path')
            .attr('d', function(m) { 
                var x = width/2, y = 10; // sets position of the point
                var triWidth = triBaseScale(m.runtimeMins), triHeight = triHeighScale(m.imdbRatingsCount);
                return 'M ' + x +' '+ y + ' l ' + triWidth/2 + ' ' + triHeight + ' l ' + triWidth + ' ' + 0 + ' z';
            })
            // .attr("transform", function(m) {
            //     return "rotate(" + m.ratingDiff +")"; // rotation
            // })
            .attr("fill", "none")
            .attr("stroke", "aqua")
            .attr("stroke-width",1);

     
        // make text labels for each
        this_svg.append("text")
            .attr("class","movieLabel")
            .attr("y", height-10)
            .attr("x", width/2)
            .text(function(d){ 
                return (`${d.title} (${d.year})`);
            });
        



    })

    

})
