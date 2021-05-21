/////////////////////////////////
// Movie Glyphs!
//////////////////////////////////


/////////////////////////////////
// SET STATIC VARIABLES
//////////////////////////////////

// Mini SVGS
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

    // Sort the list
    movies.sort((a,b) => {
        return b.criticScoreRT - a.criticScoreRT; // sort by year, most recent first
    });

    /////////////////////////////////
    // Create Scales for the Encodings Here
    //////////////////////////////////


    // scale for imdbRatingsCount (Triangle Height)
    var counts = movies.map(function(movie) { return +movie.imdbRatingsCount;})
    var axisLengthScale = d3.scaleLinear()
        .domain([d3.min(counts), d3.max(counts)])
        .range([40, width/2]);


    // scale for budgetMillions (Triangle Height)
    var budgets = movies.map(function(movie) { return +movie.budgetMillions;})
    console.log("budgets", budgets)
    var triHeightScale = d3.scaleLinear()
        .domain([d3.min(budgets), d3.max(budgets)])
        .range([10, height-20]);
    console.log("min", triHeightScale(d3.min(budgets)), "max", triHeightScale(d3.max(budgets)))

    // scale for average audience score (including IMDB and Rotten Tomatoes)
    // var avgs = movies.map(function(movie) { return +movie.avgAudienceRating; });
    // var avgRatingScale = d3.scaleSequential()
    //     .domain([d3.min(avgs),d3.max(avgs)])
    //     .interpolator(d3.interpolateWarm);

    // new color scale for critic scoring
    var criticScores = movies.map(function(movie) { return +movie.criticScoreRT; });
    var criticScale = d3.scaleSequential()
        .domain([d3.min(criticScores),d3.max(criticScores)])
        .interpolator(d3.interpolatePlasma);

    // recreate the color scale for the angles of the linear gradient on the background dial
    var dialGradientScale = d3.scaleSequential()
        .domain([0,100])
        .interpolator(d3.interpolatePlasma);

    // scale for rating tilting
    var imdbRatings = movies.map(function(movie) { return +movie.imdbScore; });
    var rtRatings = movies.map(function(movie) { return +movie.audienceScoreRT; });
    var rtCriticRatings = movies.map(function(movie) { return +movie.criticScoreRT; });
    var ratings = [].concat(imdbRatings, rtRatings, rtCriticRatings);
    var tiltScale = d3.scaleLinear()
        .domain([d3.min(ratings), d3.max(ratings)])
        .range([-90,90]);

        // avg rating is 82, median is 87. imbd median is 84.5.  rotten tomatoes audience rating median is 91. RT Critic median is 87.


        // find median of rating array
        const findMedian = (arr = []) => {
            const sorted = arr.slice().sort((a, b) => {
               return a - b;
            });
            if(sorted.length % 2 === 0){
               const first = sorted[sorted.length / 2 - 1];
               const second = sorted[sorted.length / 2];
               return (first + second) / 2;
            }
            else{
               const mid = Math.floor(sorted.length / 2);
               return sorted[mid];
            };
         };
        //  console.log("median",findMedian(rtCriticRatings));


    


    // scale for difference between IMBD and Rotten Tomatoes Audience score
    // var diffs = movies.map(function(movie) { return +movie.ratingDiff; });
    // var diffScale = d3.scaleLinear()
    //     .domain([-d3.max(diffs), d3.max(diffs)])
    //     .range([-45,45]);

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
        // .append("div")
        //     .attr("width", width)
        //     .attr("height", height)
        //     // .style("position","relative")
        //     .attr("class", "particle-div")
        .append("svg")
            .attr("width", width)
            .attr("height", height)
            // .style("position","absolute")
            .attr("class", "glyph")
            .attr("id", function(d,i) {
                return "svg_" + i;
            });

    // deconstruct the data for each movie svg
    d3.selectAll(".glyph").each(function(d,i) { // d is each movie data point
          
        // select the svg we're working on
        var this_svg = d3.select(this); 

        // deconstruct the data for each movie
        var deconstructed = [];
        for (var property in d) {
            var val = d[property];
            var o = {property: property, value: val}
            deconstructed.push(o);
        };


        /////////////////////////////////
        // Create Groups
        //////////////////////////////////
        var gBackground = this_svg.append('g').attr("id", "gBackground");
        var gIMDB= this_svg.append('g').attr("id","gIMDB");
        var gRT = this_svg.append('g').attr("id","gRT");
        var gWiggle = this_svg.append('g').attr("id","gWiggle").attr("class","wiggle");
        var gCritic = gWiggle.append('g').attr("id","gCritic");


        /////////////////////////////////
        // Critic Elements
        //////////////////////////////////

        /////////////////////////////////
        // Create Blur Filter
       
        var glowRange = 7;

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

        /////////////////////////////////
        // Create Pattern for Dial Arc Gradients

        var gradient = defs.append("linearGradient")
            .attr("id", "svgGradient")
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "0%");

        gradient.append("stop")
            .attr('class', 'start')
            .attr("offset", "0%")
            .attr("stop-color", dialGradientScale(0))
            .attr("stop-opacity", 1);
         
        gradient.append("stop")
            .attr("offset", "10%")
            .attr("stop-color", dialGradientScale(20));
        
        gradient.append("stop")
            .attr("offset", "30%")
            .attr("stop-color", dialGradientScale(40));

        gradient.append("stop")
            .attr("offset", "70%")
            .attr("stop-color", dialGradientScale(60));

        gradient.append("stop")
            .attr("offset", "90%")
            .attr("stop-color", dialGradientScale(80));

        gradient.append("stop")
            .attr('class', 'end')
            .attr("offset", "100%")
            .attr("stop-color", dialGradientScale(100));




        /////////////////////////////////
        // make center line in the background
        // gBackground.append('path')
        //     .attr('d', function(m) {
        //         return `M ${width/2} ${height/2} l 0 -${axisLengthScale(m.imdbRatingsCount)}` // axisLengthScale(m.imdbRatingsCount)
        //     }).attr("class","axis-line");

        var arc = d3.arc()
            .startAngle(-(Math.PI/2))
            .endAngle(Math.PI/2);
            // .innerRadius(0);
            // .outerRadius(width/3);

        gBackground.attr("transform", `translate(${width/2},${height/2})`)
            .append("path")
                .attr("class","backgroundArc")
                .attr("fill", "url(#svgGradient)")
                // .attr("stroke", "url(#svgGradient)")
                .attr("d", function(m){
                    return arc({innerRadius: axisLengthScale(m.imdbRatingsCount)-1, outerRadius: axisLengthScale(m.imdbRatingsCount)});
                });

        /////////////////////////////////
        // make shooting stars for the $$$

        var noise = {
            noisinessX: 1,
            noisinessY: 1,
            upperLimit: 100,
            lowerLimit: 100,
            end: 1,
            padding: 40,
            radMin: .5,
            radMax: 1
        }
        d.sparkles = []; // declare an array as a property

        // function to see if a number is even
        function isEven(num) {
            if (num % 2 == 0) {
                return -1;
            } else { return 1; };
        }
        
        // function to make random number
        function getRandom(min, max) {
            return Math.floor(min + Math.random()*(max + 1 - min))
        }

        for (i = 0; i < +d.revenueMillions; i++) {
            d.sparkles.push({
                i: i,
                x: Math.round(getRandom(-width-noise.padding,width-noise.padding)),
                y: Math.round(getRandom(0,(height/2)-noise.padding)),
                r: Math.round(getRandom(noise.radMin, noise.radMax))
            });
        }
    
        // console.log(d, "Sparkles")

        var sparkles = gBackground.selectAll("circle")
            .data(d.sparkles)
            .enter()
            .append("circle")
                .attr("class","sparkle")
                .attr('cx', function(m) {
                    return m.x;
                }).attr('cy', function(m) {
                    return m.y;
                }).attr('r', function(m){
                    return m.r;
                }).style("fill","white")
                .style("opacity", function(m){
                    return Math.random()/m.r;
                });




        /////////////////////////////////
        // make critic triangle shadow
        gCritic.append('path')
            .attr('d', function(m) { 
                var triWidth = Math.floor(triBaseScale(+m.runtimeMins)), triHeight = Math.floor(triHeightScale(m.budgetMillions)); // sets the triangle dimensions
                var x = width/2, y = height/2 - triHeight/2; // sets position of the point
                return 'M ' + x +' '+ y + ' l ' + triWidth/2 + ' ' + triHeight + ' l ' + -triWidth + ' ' + 0 + ' z';
            })
            .attr("class","critic-triangle")
            .attr("id", function(m) {
                return "critic-triangle-"+m.title; // this is wrong, because there are spaces
            })
            .attr("fill", function(m){
                return criticScale(m.criticScoreRT);
            });

        // gCritic.append('path')
        //     .attr('d', function(m) {
        //         var x = width/2, y = height/2 - 2; // adjust by two pixels to keep it inside the triangle
        //         return `M ${x} ${y} l 0 -${axisLengthScale(m.imdbRatingsCount)}` // axisLengthScale(m.imdbRatingsCount)
        //     }).attr("class","axis-line");

   






        /////////////////////////////////
        // Rotate the whole group!
        gCritic
            .attr("transform-origin", "50% 50%")
            .attr("transform", function(m) {
            return "rotate(" + tiltScale(m.criticScoreRT) +")"; // rotation
        });

        /////////////////////////////////
        // Rotten Tomatoes Elements
        //////////////////////////////////
        gRT.append('path')
            .attr('d', function(m) { 
                var triWidth = Math.floor(triBaseScale(+m.runtimeMins)), triHeight = Math.floor(triHeightScale(m.budgetMillions)); // sets the triangle dimensions
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
            }).attr("fill", function(m){
                return criticScale(m.audienceScoreRT);
            })
            .style("filter","url(#glow)");

        /////////////////////////////////
        // IMDB Elements
        //////////////////////////////////

        //The 'M' says move to the absolute position you specify with the x and the y (here it is 100 / 100). 
        // Lowercase 'l' says, relative to the previous command, draw a line to this point. So here we are starting at the middle of the svg, then drawing a line 4 to the right and 4 pixels down, then another line 8 pixels to the left. The final z says to close the path, drawing another line to the starting point. Look at the w3.org reference page for more path commands.
       
        gIMDB.append('path')
            .attr('d', function(m) { 
                var triWidth = Math.floor(triBaseScale(+m.runtimeMins)), triHeight = Math.floor(triHeightScale(m.budgetMillions)); // sets the triangle dimensions
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
            }).attr("fill", function(m){
                return criticScale(m.imdbScore);
            })
            .style("filter","url(#glow)");

        /////////////////////////////////
        // Add Hover interactivity
        //////////////////////////////////

        


        /////////////////////////////////
        // General SVG Elements
        //////////////////////////////////

        /////////////////////////////////
        // make text labels for each
        this_svg.append("text")
            .attr("class","movieLabel")
            .attr("y", height-10)
            .attr("x", width/2)
            .text(function(d){ 
                return (`${d.title} (${d.year})`);
            });    



    })
    d3.selectAll(".particle-div").on('mouseover', function(d){ // this part adds interactivity
 
        // select the svg we're working on
        var this_particleDiv = d3.select(this); 
        return this_particleDiv.attr("id","particle-js")

    }).on("mouseout", function(d) { // this removes interactivity
         // select the svg we're working on
         var this_particleDiv = d3.select(this); 
         return this_particleDiv.attr("id","")
    });

})
