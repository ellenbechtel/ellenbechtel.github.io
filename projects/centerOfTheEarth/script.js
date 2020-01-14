/////////////////////////////////
// MAKE A STICKY NAV BAR AND DASHBOARD
//////////////////////////////////

var navbar = document.getElementById("navbar");
var dashboard= document.getElementById("dashboard");
    dashboard.style.opacity = 0;
var sticky = navbar.offsetTop;

function makeSticky() {

    if (window.pageYOffset >= sticky ) {
    navbar.classList.add("sticky");
    dashboard.style.opacity = 1;

    } else {
    navbar.classList.remove("sticky")
    dashboard.style.opacity = 0;
    //dashboard.style.display = "none";
    }
};

//////////////////////////////////
// LOAD DATA
//////////////////////////////////

var promises = [
    d3.csv("./data/layers.csv"),
    d3.csv("./data/geothermalGradient.csv")
];


Promise.all(promises).then(function(data) { 
    
    var layerData = data[0];
    var landmarkData = data[1];
    //////////////////////////////////
    // MAKE SVG CANVAS
    //////////////////////////////////

    var margin = {top: 200, left: 100, right: 100, bottom: 200};
    var width = document.querySelector("#layers").clientWidth;
    var viewHeight = document.querySelector("#layers").clientHeight;
    var height = document.querySelector("#layers").scrollHeight;

    var svg = d3.select("#layers")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
   

    //////////////////////////////////
    // CREATE AND POPULATE BOUNDARY TYPE DROPDOWN AND FILTER
    //////////////////////////////////

    var selectBoundary = d3.select("#selectBoundary");
    var boundaryTypes = [];
    var selectedBoundaryType = [];

    landmarkData.forEach(function(d) {
        var this_boundary = d.boundaryType;
        if(boundaryTypes.indexOf(this_boundary)<0) {
            boundaryTypes.push(this_boundary);
        }
    });

        boundaryTypes.push("all");
        boundaryTypes.sort();

    selectedBoundaryType = boundaryTypes[0];

    boundaryTypes.forEach(function(b) {
        selectBoundary.append("option")
            .property("value", b)
            .text(b);
    });

    selectBoundary.on("change", function() {
        selectedBoundaryType = this.value;
        updateScreen(selectedBoundaryType);        
    });



    //////////////////////////////////
    // LISTEN FOR SCROLL POSITION AND MAKE CHANGES
    //////////////////////////////////

    var scrollTop = [0];
    var currentDepth = [];
    var currentPressure = [];
    var currentTemperature = [];

    window.addEventListener("scroll", function() { 
        
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        updateScreen(selectedBoundaryType);
        makeSticky();
        //moveDashboard();

        // CHANGE COLOR OF NAVBAR
        var backgroundColor = document.getElementById("navbar");
        backgroundColor.style.backgroundColor = colorScale(scrollTop); 

        var selectColor = document.getElementById("selectBoundary");
        selectColor.style.backgroundColor = colorScale(scrollTop); 
        selectColor.style.color = textColorScale(scrollTop); 

        var textColor = document.getElementById("navbar");
        textColor.style.color = textColorScale(scrollTop); 
        
 

        // MAKE DEPTH CALCULATIONS
        var currentDepth = Math.round(scrollToDepthScale(scrollTop)); 
        document.getElementById("currentDepth").innerHTML = currentDepth;

        // MAKE PRESSURE CALCULATIONS
        var currentPressure = Math.round(depthToPressureScale(currentDepth)); 
        document.getElementById("currentPressure").innerHTML = currentPressure;

        // MAKE TEMPERATURE CALCULATIONS
        var currentTemperature = Math.round(depthToTemperatureScale(currentDepth)); 
        document.getElementById("currentTemperature").innerHTML = currentTemperature;

    });


    //////////////////////////////////
    // MAKE SCALES THAT MAP SCROLLING POSITION TO OTHER THINGS
    //////////////////////////////////

    // SCALE TO CONVERT SCROLL TOP POSITION TO DEPTH
    var scrollToDepthScale = d3.scaleLinear() 
    .domain([sticky+10, height-margin.bottom]) 
    .range([0, 6371])
    .clamp(true);


    // SCALE TO CONVERT DEPTH TO POSITION ON THE SVG
    var depthToPositionScale = d3.scaleLinear()
        .domain([0, 6371])
        .range([margin.top, height-margin.bottom]);
    
    
    // SCALE LINEAR ARRAY TO CONVERT DEPTH TO PRESSURE  /// have to make a bunch of them
    var depthToPressureScale = d3.scaleLinear()
        .domain([0, 6371]) // or load this dynamically from the dataset
        .range([0, 364]);


    // SCALE LINEAR ARRAY TO CONVERT DEPTH TO TEMPERATURE  /// have to make a bunch of them     
    var depthToTemperatureScale = d3.scaleLinear()
        .domain([0, 6371]) // or load this dynamically from the dataset
        .range([0, 6000]);


    // SCALE TO CONVERT TEMPERATURE TO COLOR
    var colorScale = d3.scaleLinear()
        .domain([0, height/2, height])
        .range(['#1E181B', '#C61A27', '#FECF69'])
        .interpolate(d3.interpolateRgb); 


    var textColorScale = d3.scaleLinear()
        .domain([0, height/2, height])
        .range(['#FEF7E4', '#FEF7E4', '#1E181B'])
        .interpolate(d3.interpolateRgb); 













    //////////////////////////////////
    // TOOLTIP
    //////////////////////////////////

    var tooltip = d3.select("#layers")
        .append("div")
        .attr("class","tooltip");
    

    var layerLabel = d3.select("#layers")
        .append("div")
        .attr("class","layerLabel");


    //////////////////////////////////
    // DRAW LANDMARKS AND LAYERS
    //////////////////////////////////
        
    var bars = svg.selectAll("rect")
    .data(layerData, function(d) { return d.layerName; })
    .enter()
    .append("rect")
        .attr("x", 0)
        .attr("y", function(d) { return depthToPositionScale(d.startDepth); })
        .attr("width", width/3 - 10)
        .attr("height", function(d) { return depthToPositionScale(d.endDepth); })
        .attr("class","layerBar");


    var landmarksText = svg.append("g")
    .selectAll("text")
    .data(landmarkData, function(d) { return d.landmark; })
    .enter()
    .append("text")
        .attr("class","landmark")
        .text(function(d) { return d.landmark; } )
        .attr("x", width/3 + 40)
        .attr("y", function(d) { return depthToPositionScale(d.depth); })


    var precursorText = svg.append("g")
        .selectAll("text")
        .data(landmarkData, function(d) { return d.precursor; })
        .enter()
        .append("text")
            .attr("class","precursor")
            .text(function(d) { return d.precursor; } )
            .attr("x", width/3 + 40)
            .attr("y", function(d) { return depthToPositionScale(d.depth) - 27; });


    
    /////////////////////////////////
    // MAKE AXIS
    //////////////////////////////////
 
    var yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${width/3},0)`) 
        .call(d3.axisLeft().scale(depthToPositionScale));


    //////////////////////////////////
    // UPDATE SCREEN, DRAW LAYERS
    //////////////////////////////////

    function updateScreen(selectedBoundaryType) { 

        if(selectedBoundaryType === "all") {
            landmarksText.attr("opacity",1);             
            precursorText.attr("opacity",1); 
            bars.attr("opacity",.2);

        } else if(selectedBoundaryType === "physical" || "chemical") {
            landmarksText.attr("opacity",0);
            precursorText.attr("opacity",0);
            bars.attr("opacity",0);

            landmarksText.filter(function(d) { 
                return d.boundaryType === selectedBoundaryType;
                })
                .attr("opacity",1);  
            precursorText.filter(function(d) { 
                return d.boundaryType === selectedBoundaryType;
                })
                .attr("opacity",1);
            bars.filter(function(d) { 
                return d.typeOfLayer === selectedBoundaryType;
                })
                .attr("opacity",.2);

        } else if(selectedBoundaryType === "physical and chemical") {
        
            landmarksText.filter(function(d) { 
                return d.boundaryType === selectedBoundaryType;
                })
                .attr("opacity",1);  
            precursorText.filter(function(d) { 
                return d.boundaryType === selectedBoundaryType;
                })
                .attr("opacity",1);
            bars.filter(function(d) { 
                    return d.typeOfLayer === "physical" || "chemical";
                    })
                    .attr("opacity",.2);

        }; 
               
    };

    updateScreen(selectedBoundaryType);

    // DRAW TOOLTIP

    landmarksText.on("mouseover", function(d) {
        var tipX = +d3.select(this).attr("x") + 350;
        var tipY = +d3.select(this).attr("y") + 975;
        tooltip.style("visibility", "visible")
            .style("left", tipX + "px")
            .style("top", tipY + "px")
            .html(d.change + "<br><br> Depth is about " + d.depth + "km.<br><br>Here, the layer is <b>" + d.strength + ".</b>");
    }).on("mouseout", function() {
        tooltip.style("visibility","hidden");
    });


    bars.on("mousemove", function(d) {
        var mouse = d3.mouse(this);
        var tipX = mouse[0] + 20;
        var tipY = mouse[1] + 1100;

        console.log(mouse);

        tooltip.style("visibility", "visible")
            .style("left", tipX + "px")
            .style("top", tipY + "px")
            .html(d.layerName);
    }).on("mouseout", function() {
        tooltip.style("visibility","hidden");
    });


});