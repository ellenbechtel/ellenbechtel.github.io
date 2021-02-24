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
    // Manipulate the data to get scores we want
    //////////////////////////////////
    // add a score differential
    movies.forEach(function(movie, index) {
        movie.ratingDiff = +movie.audienceScoreRT - +movie.imdbScore;
        movie.avgAudienceRating = (+movie.audienceScoreRT + +movie.imdbScore)/2;
    })

    // Sort the linst
    movies.sort((a,b) => {
        return b.avgAudienceRating - a.avgAudienceRating; // sort by year, most recent first
    })
    /////////////////////////////////
    // Create Scales for the Encodings Here
    //////////////////////////////////


    // scale for imdbRatingsCount (Triangle Height)
    var counts = movies.map(function(movie) { return +movie.imdbRatingsCount;})
    var triHeighScale = d3.scaleLinear()
        .domain([d3.min(counts), d3.max(counts)])
        .range([10, height-20]);

   

    // scale for average audience score (including IMDB and Rotten Tomatoes)
    var avgs = movies.map(function(movie) { return +movie.avgAudienceRating; });
    var colorRange = ["#b7e4c7","#2d6a4f"];
    console.log(avgs,'avgs');
    var avgRatingScale = d3.scaleSequential()
        .domain([d3.min(avgs),d3.max(avgs)])
        .interpolator(d3.interpolateWarm);

        console.log("test",avgRatingScale(55),avgRatingScale(80));


    // scale for rating tilting

    var imdbRatings = movies.map(function(movie) { return +movie.imdbScore; });
    var rtRatings = movies.map(function(movie) { return +movie.audienceScoreRT; });
    var rtCriticRatings = movies.map(function(movie) { return +movie.criticScoreRT; });
    var ratings = [].concat(imdbRatings, rtRatings, rtCriticRatings);
    var tiltScale = d3.scaleLinear()
        .domain([d3.min(ratings), d3.max(ratings)])
        .range([-45,45]);

    // scale for difference between IMBD and Rotten Tomatoes Audience score
    var diffs = movies.map(function(movie) { return +movie.ratingDiff; });
    var diffScale = d3.scaleLinear()
        .domain([-d3.max(diffs), d3.max(diffs)])
        .range([-45,45]);

    // scale for genre

    // scale for runtimeMins (Triangle base width)
    var runtimes = movies.map(function(movie){ return +movie.runtimeMins});
    var triBaseScale = d3.scaleLinear()
        .domain([d3.min(runtimes), d3.max(runtimes)])
        .range([10, width/2-10]);

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



        	///////////////////////////////////////////////////////////////////////////
            //////////////////////////// Create the filter ////////////////////////////
            ///////////////////////////////////////////////////////////////////////////
            var glowRange = 3;
            //Container for the gradients
            var defs = svg.append("defs");

            //Code taken from http://stackoverflow.com/questions/9630008/how-can-i-create-a-glow-around-a-rectangle-with-svg
            //Filter for the outside glow
            var filter = defs.append("filter")
                .attr("id","glow");

            filter.append("feGaussianBlur")
                .attr("class", "blur")
                .attr("stdDeviation",glowRange)
                .attr("result","coloredBlur");

            var feMerge = filter.append("feMerge");
            feMerge.append("feMergeNode")
                .attr("in","coloredBlur");
            feMerge.append("feMergeNode")
                .attr("in","SourceGraphic");

        // make critic triangle shadow
        this_svg.append('path')
            .attr('d', function(m) { 
                var triWidth = Math.floor(triBaseScale(+m.runtimeMins)), triHeight = Math.floor(triHeighScale(m.imdbRatingsCount)); // sets the triangle dimensions
                var x = width/2, y = height/2 - triHeight/2; // sets position of the point
                return 'M ' + x +' '+ y + ' l ' + triWidth/2 + ' ' + triHeight + ' l ' + -triWidth + ' ' + 0 + ' z';
            })
            .attr("class","critic-triangle exampleGlow")
            .attr("id", function(m) {
                return "critic-triangle-"+m.title; // this is wrong, because there are spaces
            })
            .attr("transform-origin", "50% 50%")
            .attr("transform", function(m) {
                return "rotate(" + diffScale(m.criticScoreRT) +")"; // rotation
            })
            .style("filter","url(#glow)");
    
        // Rotten Tomatoes Audience score
        this_svg.append('path')
            .attr('d', function(m) { 
                var triWidth = Math.floor(triBaseScale(+m.runtimeMins)), triHeight = Math.floor(triHeighScale(m.imdbRatingsCount)); // sets the triangle dimensions
                var x = width/2, y = height/2 - triHeight/2; // sets position of the point
                return 'M ' + x +' '+ y + ' l ' + triWidth/2 + ' ' + triHeight + ' l ' + -triWidth + ' ' + 0 + ' z';
            })
            .attr("class","RT-audience-rating triangle")
            .attr("id", function(m) {
                return "diffIs"+m.ratingDiff; // there are repeats here
            })
            .attr("transform-origin", "50% 50%")
            .attr("transform", function(m) {
                return "rotate(" + tiltScale(m.audienceScoreRT) +")"; // rotation
            })
            .classed("top", function(m) {
                if (!m.ratingDiff < 0) { 
                    return "true"
                }
            })
            .attr("fill", "gray");

        // draw the main Tilted IMDB Audience Score
        //The tricky part will be determining where to draw it. 
        //The 'M' says move to the absolute position you specify with the x and the y (here it is 100 / 100). 
        // Lowercase 'l' says, relative to the previous command, draw a line to this point. So here we are starting at the middle of the svg, then drawing a line 4 to the right and 4 pixels down, then another line 8 pixels to the left. The final z says to close the path, drawing another line to the starting point. Look at the w3.org reference page for more path commands.
        this_svg.append('path')
            .attr('d', function(m) { 
                var triWidth = Math.floor(triBaseScale(+m.runtimeMins)), triHeight = Math.floor(triHeighScale(m.imdbRatingsCount)); // sets the triangle dimensions
                var x = width/2, y = height/2 - triHeight/2; // sets position of the point
                return 'M ' + x +' '+ y + ' l ' + triWidth/2 + ' ' + triHeight + ' l ' + -triWidth + ' ' + 0 + ' z';
            })
            .attr("class","imdb-rating triangle")
            .attr("id", function(m) {
                return "diffIs"+m.ratingDiff; // there are repeats here
            })
            .attr("transform-origin", "50% 50%")
            .attr("transform", function(m) {
                return "rotate(" + tiltScale(m.imdbScore) +")"; // rotation
            })
            .classed("top", function(m) {
                if (m.ratingDiff > 0) { 
                    return "true"
                }
            })
            .attr("fill", function(m){
                return avgRatingScale(m.avgAudienceRating);
            });

        





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
